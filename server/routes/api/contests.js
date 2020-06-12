const express = require("express");
const contestsRouter = express.Router();

const auth = require("../../middleware/auth");
const ContestModel = require("../../models/Contest");
const UserModel = require("../../models/User");
const Submission = require("../../models/submission");

// Route: GET api/contests/
// Desc: get all active contests
// access:  private
contestsRouter.get("/", auth, (req, res) => {
  ContestModel.find({ deadline_date: { $gte: Date.now() } })
    .then((contests) => res.json({ contests }))
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

// Route: GET api/contests/
// Desc: get active contests with user name & avatar for discovery page
// access:  private
contestsRouter.get("/discover", (req, res) => {
  ContestModel.find({ deadline_date: { $gte: Date.now() } })
    .sort({ deadline_date: 1 })
    .then((_contests) => {
      //find contest holder's name, contest holder's avatar,
      //and the first image from the first submission
      let userRequests = _contests.map((contest) => {
        return new Promise((res, rej) => {
          const submissionQuery = Submission.find({
            contest_id: contest._id,
          }).then((submissions) => {
            const placeholderImage =
              "https://hatchways-hummingbird.s3.amazonaws.com/Assets/fb61d9c7dd33978f7274b8c47c42562a3d759e58.png";
            if (submissions[0]) {
              //console.log(submissions[0]);
              return {
                submission:
                  submissions[0]["upload_files"][0]["url"] ||
                  submissions[0]["upload_files"],
                tags: submissions[0]["upload_files"][0]["tags"],
              };
            } else {
              return { submission: placeholderImage, tags: [] };
            }
          });
          const userQuery = UserModel.findById(contest.user_id).then((v) => v);
          Promise.all([userQuery, submissionQuery]).then((combinedQuery) => {
            //removes extra data before sending
            console.log(combinedQuery);
            res({
              ...combinedQuery[0]["_doc"],
              firstImage: combinedQuery[1]["submission"],
              tags: combinedQuery[1]["tags"],
            });
          });
        });
      });

      Promise.all(userRequests).then((userArray) => {
        let contests = userArray.map((user, index) => {
          const { name, profile_image_url, firstImage, tags } = user;
          console.log(user);
          return {
            ..._contests[index]["_doc"],
            name,
            profile_image_url,
            firstImage,
            tags: tags || [""],
          };
        });
        res.status(200).json({ contests });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});
module.exports = contestsRouter;
