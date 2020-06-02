const express = require("express");
const auth = require("../../middleware/auth");
const Notifications = require("../../models/notifications");

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

// Route: PUT api/notifications/
// Desc: insert/update notification
// access:  private
router.put("/", auth, (req, res) => {
  const user_id = req.user.id;
  const { notification } = req.body;

  Notifications.find({ user_id })
    .then((list) => {
      if (list.length > 0) {
        Notifications.findByIdAndUpdate(
          list[0].id,
          {
            $set: {
              new_notification: true,
              notifications: [...list[0].notifications, ...notification],
            },
          },

          (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              res.json({ message: "Notification sent" });
            }
          }
        );
      } else {
        const newNotification = new Notifications({
          user_id,
          notifications: [...notification],
          new_notification: true,
        });

        newNotification.save().then((result) => {
          res.json({ message: "Notification sent" });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
