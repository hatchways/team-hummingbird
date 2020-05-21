const express = require("express");
const contestRouter = express.Router();

const auth = require("../../middleware/auth");
const ContestModel = require("../../models/contest");

// Route: GET api/contests/
// Desc: get all active contests
// access:  private

contestRouter.get("/contests", auth, (req, res) => {
  ContestModel.find({ deadline_date: { $gte: Date.now() } })
    .then((contests) => res.json({ contests }))
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
});

// Route: GET api/contest/:id
// Desc: get contest with the id
// access: private

contestRouter.get("/contest/:id", auth, (req, res) => {
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

contestRouter.post("/contest", auth, (req, res) => {
  const { title, description, prize_amount, deadline_date } = req.body;
  const user_id = req.user.id;
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
});

// Route: PUT api/contest/:id
// Desc: Update contest
// access: private

contestRouter.put("/contest/:id", auth, (req, res) => {
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

module.exports = contestRouter;
