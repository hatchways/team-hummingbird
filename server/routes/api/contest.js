const express = require("express");
const contestRouter = express.Router();

const auth = require("../../middleware/auth");
const Contest = require("../../models/Contest");
const Submission = require("../../models/submission");
// Route: GET api/contest/:id
// Desc: get contest with the id
// access: private

contestRouter.get("/:id", auth, (req, res) => {
  let submissionQuery, result = {};
  Contest.findById(req.params.id)
    .then((contest) => {
      if (contest) {
        result.contest = contest;
        
        if (contest.user_id === req.user.id) {
          submissionQuery = {
            contest_id: contest._id
          }
        }
        else {
          submissionQuery = {
            contest_id: contest._id,
            user_id: req.user.id
          }
        }
        Submission.find({ contest_id: contest._id })
          .then(submissions => {
            result.submissions = submissions;
            res.status(200).json(result);
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
  const { title, description, prize_amount, deadline_date } = req.body;
  if (!(title && description && prize_amount && deadline_date)) {
    res.json({
      message: "Enter all the required fields",
    });
  } else {
    const user_id = req.user.id;
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
        res.status(400).json({
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
          res.status(400).json({
            message: err.message,
          });
        }
        res.json({
          message: "Contest updated successfully",
        });
      }
    );
  } else {
    res.status(403).json({
      message: "User not authorized to update this contest",
    });
  }
});

// Route: POST api/contest/:id/submission
// Desc: Add a submission
// access: private

contestRouter.post("/:id/submission", auth, (req, res) => {
  //add to /submission
  const { contest_id, user_id, upload_files } = req.body;

  const newSubmission = new Submission({
    contest_id,
    user_id,
    upload_files,
  });

  newSubmission
    .save()
    .then(() => {
      res.json("Submission added successfully");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err.message);
    });
});

// Route: GET api/contest/:id/submission
// Desc: Find all submissions associated with a contest
// access: private
contestRouter.get("/:id/submissions", auth, (req, res) => {
  const { contest_id } = req.body;

  Submission.find({ contest_id: contest_id }, (err, submissionsFound) => {
    if (err) {
      console.log(err);
    } else {
      res.json(submissionsFound);
    }
  });
});

module.exports = contestRouter;
