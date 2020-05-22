const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  contest_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  creation_date: {
    type: Date,
    default: Date.now(),
  },
  upload_files: {
    type: Array,
  },
});

module.exports = Submission = mongoose.model("Submission", SubmissionSchema);
