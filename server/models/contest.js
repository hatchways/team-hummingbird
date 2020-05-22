const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  prize_amount: {
    type: Number,
    required: true,
  },
  deadline_date: {
    type: Date,
    required: true,
  },
  creation_date: {
    type: Date,
    default: Date.now(),
  },
  user_id: {
    type: String,
    required: true,
  },
});

module.exports = Contest = mongoose.model("Contest", ContestSchema);
