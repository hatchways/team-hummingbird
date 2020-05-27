const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  roomId2: {
    type: String,
    required: true,
  },
  roomMessages: {
    type: Array,
    default: [],
  },
  roomUser1: {
    type: Object,
    required: true,
  },
  roomUser2: {
    type: Object,
    required: true,
  },
});

module.exports = ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
