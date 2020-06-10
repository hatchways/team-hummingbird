const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  user_id_sender: {
    type: String,
    required: true,
  },
  user_id_receiver: {
    type: String,
    required: true,
  },
  contest_id: {
    type: String,
    required: true,
  },
  submission_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Transaction = mongoose.model(
  "transactions",
  TransactionSchema
);
