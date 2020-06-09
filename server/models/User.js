const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  email_normalized: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  stripe_customer_id: {
    type: String,
  },
  stripe_client_secret: {
    type: String,
  },
  profile_image_url: {
    type: String,
  },
  hasPayment: {
    type: Boolean,
  },
  payment: {
    type: Object,
  },
  earnings_total: {
    type: Number,
    default: 0,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
