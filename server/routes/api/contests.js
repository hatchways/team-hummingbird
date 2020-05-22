const express = require("express");
const contestsRouter = express.Router();

const auth = require("../../middleware/auth");
const ContestModel = require("../../models/Contest");

// Route: GET api/contests/
// Desc: get all active contests
// access:  private

contestsRouter.get("/", auth, (req, res) => {
  ContestModel.find({ deadline_date: { $gte: Date.now() } })
    .then((contests) => res.json({ contests }))
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
});

module.exports = contestsRouter;
