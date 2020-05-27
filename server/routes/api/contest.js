const express = require("express");
const contestRouter = express.Router();

const auth = require("../../middleware/auth");
const ContestModel = require("../../models/Contest");
const SubmissionModel = require("../../models/submission");
// Route: GET api/contest/:id
// Desc: get contest with the id
// access: private

contestRouter.get("/:id", auth, (req, res) => {
  ContestModel.findById(req.params.id)
    .then((contest) => {
      if (contest) {
        res.json({ contest });
      } else {
        res.json({ message: "No Contest Found" });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
});

// Route: POST api/contest/
// Desc: Create new contest
// access: private

contestRouter.post("/", auth, (req, res) => {
  console.log(req.body)
  const { title, description, prize_amount, deadline_date } = req.body;
  if (!(title && description && prize_amount && deadline_date)) {
    res.json({
      message: "Enter all the required fields",
    });
  } else {
    const user_id = req.body.user_id;
    const newContest = new ContestModel({
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
    ContestModel.findByIdAndUpdate(
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

  const { contest_id, user_id, upload_files } = req.body.submission;

  const newSubmission = new SubmissionModel({
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
      console.log(err.message)
      res.status(400).json("Error: " + err.message);
    });
});

// Route: GET api/contest/:id/submissions
// Desc: Find all submissions associated with a contest
// access: private
contestRouter.get("/:id/submissions", auth, (req, res) => {
  const contest_id = req.params.id;

  SubmissionModel.find({ contest_id }, (err, submissionsFound) => {
    if (err) {
      console.log(err);
    } else {
      console.log(submissionsFound)
      res.json(submissionsFound);
    }
  });
});

module.exports = contestRouter;
