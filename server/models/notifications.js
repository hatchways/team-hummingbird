const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  notifications: {
    type: Array,
    default: [],
  },
  new_notification: {
    type: Boolean,
    default: false,
  },
});

module.exports = Notifications = mongoose.model(
  "Notifications",
  NotificationSchema
);
