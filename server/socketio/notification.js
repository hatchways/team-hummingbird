const Notification = require("../models/notifications");

const fetchNotifications = async (user) => {
  let userNotifications = await Notification.find({ user_id: user.id })
    .then((result) => {
      if (result.length > 0) {
        return result[0];
      } else {
        let createNotification = new Notification({
          user_id: user.id,
          new_notifications: [],
          old_notifications: [],
        });

        createNotification.save().then((result) => {
          return result;
        });
      }
    })
    .catch((err) => console.log(err));
  return userNotifications;
};
const notification = (io, socket) => {
  socket.on("login", async (user) => {
    let userNotifications = await fetchNotifications(user);
    userNotifications.new_notifications.sort((a, b) => {
      if (a.time > b.time) return 1;
      else if (a.time < b.time) return -1;
      else return 0;
    });
    socket.emit("send-user-notifications", userNotifications);
  });

  socket.on("mark_notifications_read", async (user) => {
    let userNotifications = await fetchNotifications(user);
    userNotifications.new_notifications.sort((a, b) => {
      if (a.time > b.time) return 1;
      else if (a.time < b.time) return -1;
      else return 0;
    });
    //either this or we can re-emit send-user-notifications from above at regular
    //intervals(not sure about its efficiency though)
    //In the end, I think we might have to do both
    socket.emit("send-user-notifications", userNotifications);
  });
};

module.exports = notification;
