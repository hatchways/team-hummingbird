const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  new_notifications: {
    type: Array,
    required: true,
    default: [],
  },
  old_notifications: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = Notifications = mongoose.model(
  "Notifications",
  NotificationSchema
);
