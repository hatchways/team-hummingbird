const express = require("express");
const moment = require("moment");

const auth = require("../../middleware/auth");
const Notifications = require("../../models/notifications");
const Contest = require("../../models/Contest");

const router = express.Router();

// Route: GET api/notifications/
// Desc: get all notifications of userid
// access:  private
router.get("/", auth, (req, res) => {
  const user_id = req.user.id;
  Notifications.find({ user_id })
    .then((notifications) => {
      res.json({ notifications: notifications[0] });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Route: PUT api/notifications/contest/submit/:id
// Desc: Send notification to contest creator on design submission
//     : i.e Insert/update notification in contest creator notification list
// access:  private
router.put("/contest/submit/:id", auth, async (req, res) => {
  const contest_id = req.params.id;
  const fromUser = req.user;
  try {
    let contest = await Contest.findById(contest_id);
    let updateNotification = await Notifications.find({
      user_id: contest.user_id,
    });
    let updatedNotification = await Notifications.findByIdAndUpdate(
      updateNotification[0].id,
      {
        $set: {
          new_notification: true,
          notifications: [
            ...updateNotification[0].notifications,
            {
              user: fromUser,
              text: `submitted design to your contest ${contest.title}`,
              read_status: false,
              time: moment().format("YYYY-MM-DDTHH:mm:ss"),
            },
          ],
        },
      }
    );
    res.json({ message: "Contest creator notified of the submission" });
  } catch (err) {
    console.log(err);
  }
});

// Route: PUT api/notifications/read
// Desc: Update  new_notification once read by client
// access:  private
router.put("/read", auth, (req, res) => {
  const user_id = req.user.id;
  Notifications.updateOne(
    { user_id },
    {
      $set: { new_notification: false },
    }
  )
    .then((updated) => {
      res.json({ message: "Notifications cleared" });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
