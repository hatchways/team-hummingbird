const express = require("express");
const contestRouter = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Contest = require("../../models/Contest");
const Submission = require("../../models/submission");
const Transaction = require("../../models/Transaction");

const STRIPE_KEY = require("../../config/default.json").stripeKey;
const STRIPE_SECRET = require("../../config/default.json").stripe_secret;
const stripe = require("stripe")(STRIPE_SECRET);

const chargeCreditCard = async (customerId, paymentMethod, amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethod,
      //capture_method: "manual",
      off_session: true,
      confirm: true,
    });
    return paymentIntent;
  } catch (err) {
    console.log("ERROR:", err.message);
  }
};

// Route: GET api/contest/:id
// Desc: get contest with the id
// access: private

contestRouter.get("/:id", auth, (req, res) => {
  let submissionQuery,
    result = {};
  Contest.findById(req.params.id)
    .then((contest) => {
      if (contest) {
        result.contest = contest;
        User.findById(contest.user_id)
          .then((user) => {
            result.owner = user;
            console.log(result);
            if (contest.user_id === req.user.id) {
              submissionQuery = {
                contest_id: contest._id,
              };
            } else {
              submissionQuery = {
                contest_id: contest._id,
                user_id: req.user.id,
              };
            }
            Submission.find({ contest_id: contest._id })
              .then((submissions) => {
                if (submissionQuery.user_id) {
                  let filteredResults = submissions.filter((submission) => {
                    return submission.user_id === submissionQuery.user_id;
                  });
                  result.submissions = filteredResults;
                  res.status(200).json(result);
                } else {
                  result.submissions = submissions;
                  res.status(200).json(result);
                }
              })
              .catch((err) => {
                res.status(500).json({
                  message: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(500).json({
              message: err.message,
            });
          });
      } else {
        res.json({ message: "No Contest Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

// Route: POST api/contest/
// Desc: Create new contest
// access: private

contestRouter.post("/", auth, (req, res) => {
  console.log(req.body);
  const { title, description, prize_amount, deadline_date } = req.body;
  if (!(title && description && prize_amount && deadline_date)) {
    res.json({
      message: "Enter all the required fields",
    });
  } else {
    const user_id = req.body.user_id;
    const newContest = new Contest({
      title,
      description,
      prize_amount,
      deadline_date,
      user_id,
    });

    newContest
      .save()
      .then((result) => {
        res.json({
          message: "Contest created successfully",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  }
});

// Route: PUT api/contest/:id
// Desc: Update contest
// access: private

contestRouter.put("/:id", auth, (req, res) => {
  const { title, description, prize_amount, deadline_date, user_id } = req.body;
  console.log(req.body);
  if (user_id === req.user.id) {
    Contest.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        deadline_date,
        prize_amount,
      },
      (err, result) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        }
        res.json({
          message: "Contest updated successfully",
        });
      }
    );
  } else {
    res.status(401).json({
      message: "User not authorized to update this contest",
    });
  }
});

// Route: POST api/contest/:id/submission
// Desc: Add a submission
// access: private

contestRouter.post("/:id/submission", auth, (req, res) => {
  //add to /submission

  const { contest_id, user_id, upload_files, user_name } = req.body.submission;

  const newSubmission = new Submission({
    contest_id,
    user_id,
    upload_files,
    user_name,
  });

  newSubmission
    .save()
    .then(() => {
      res.status(201).json("Submission added successfully");
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json("Error: " + err.message);
    });
});

// Route: PUT api/contest/:id/submission
// Desc: Update a submission
// access: private

contestRouter.put("/:id/submission/:submission_id", auth, (req, res) => {
  const { winner } = req.body;
  Contest.findById(req.params.id)
    .then((contest) => {
      if (contest) {
        Submission.findById(req.params.submission_id)
          .then((submission) => {
            if (submission && contest.user_id === req.user.id) {
              Submission.findByIdAndUpdate(req.params.submission_id, {
                winner,
              })
                .then((r) => {
                  User.findById(submission.user_id)
                    .then((user) => {
                      User.findByIdAndUpdate(submission.user_id, {
                        earnings_total:
                          user.earnings_total + contest.prize_amount,
                      })
                        .then((r) => {
                          User.findById(req.user.id)
                            .then((contestOwner) => {
                              chargeCreditCard(
                                contestOwner.stripe_customer_id,
                                contestOwner.payment.id,
                                contest.prize_amount
                              )
                                .then((r) => {
                                  const transaction = new Transaction({
                                    user_id_sender: req.user.id,
                                    user_id_receiver: submission.user_id,
                                    contest_id: contest.id,
                                    submission_id: submission.id,
                                    name: "Contest Winner Payment",
                                    amount: contest.prize_amount,
                                  });
                                  transaction
                                    .save()
                                    .then((transaction) => {
                                      Submission.updateMany(
                                        { contest_id: contest.id },
                                        {
                                          $set: {
                                            active: false,
                                          },
                                        }
                                      )
                                        .then((r) => {
                                          res.status(200).json({
                                            message:
                                              "Submission updated successfully",
                                            transaction,
                                          });
                                        })
                                        .catch((err) => {
                                          console.log(err.message);
                                          res.status(500).json({
                                            message: "Error: " + err.message,
                                          });
                                        });
                                    })
                                    .catch((err) => {
                                      console.log(err.message);
                                      res.status(500).json({
                                        message: "Error: " + err.message,
                                      });
                                    });
                                })
                                .catch((err) => {
                                  console.log(err.message);
                                  res.status(500).json({
                                    message: "Error: " + err.message,
                                  });
                                });
                            })
                            .catch((err) => {
                              console.log(err.message);
                              res.status(500).json({
                                message: "Error: " + err.message,
                              });
                            });
                        })
                        .catch((err) => {
                          console.log(err.message);
                          res.status(500).json({
                            message: "Error: " + err.message,
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err.message);
                      res.status(500).json({
                        message: "Error: " + err.message,
                      });
                    });
                })
                .catch((err) => {
                  console.log(err.message);
                  res.status(500).json({
                    message: "Error: " + err.message,
                  });
                });
            } else {
              res.status(401).json({
                message: "User not authorized to update this submission",
              });
            }
          })
          .catch((err) =>
            res.status(500).json({ message: "Error: " + err.message })
          );
      } else {
        res.status(400).json({
          message: "Contest not found",
        });
      }
    })
    .catch((err) => res.status(500).json({ message: "Error: " + err.message }));
});

// Route: GET api/contest/:id/submissions
// Desc: Find all submissions associated with a contest
// access: private
contestRouter.get("/:id/submissions", auth, (req, res) => {
  const contest_id = req.params.id;

  Submission.find({ contest_id: contest_id }, (err, submissionsFound) => {
    if (err) {
      console.log(err);
    } else {
      console.log(submissionsFound);
      res.json(submissionsFound);
    }
  });
});

module.exports = contestRouter;
