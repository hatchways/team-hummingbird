const Notification = require("../models/notifications");

const fetchNotificationsOnLogin = async (user) => {
  let userNotifications = await Notification.find({ user_id: user.id })
    .then((result) => {
      if (result.length > 0) {
        return result[0];
      } else {
        let createNotification = new Notification({
          user_id: user.id,
        });

        createNotification.save().then((result) => {
          console.log(result);
          return result;
        });
      }
    })
    .catch((err) => console.log(err));

  return userNotifications;
};
const notification = (io, socket) => {
  socket.on("login", async (user) => {
    let userNotifications = await fetchNotificationsOnLogin(user);
    //sort notifications in desc order of received time
    userNotifications.notifications.sort((a, b) => {
      if (a.time > b.time) return 1;
      else if (a.time < b.time) return -1;
      else return 0;
    });
    socket.emit("send-user-notifications", userNotifications);
  });

  socket.on("mark-new-notifications-read", (user) => {
    Notification.findOneAndUpdate(
      { user_id: user.id },
      {
        $set: {
          new_notification: false,
        },
      }
    );
  });
};

module.exports = notification;
