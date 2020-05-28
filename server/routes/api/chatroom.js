const express = require("express");
const chatRoomRouter = express.Router();
const ChatRoomModel = require("../../models/chatrooms");
const auth = require("../../middleware/auth");

// Route: GET api/chatroom
// Desc: Get existing chat rooms of user
// access: private
chatRoomRouter.get("/", auth, (req, res) => {
  const { user_id } = req.query;

  let chatrooms = [];

  ChatRoomModel.find({
    $or: [{ "roomUser1.id": user_id }, { "roomUser2.id": user_id }],
  })
    .then((chatrooms) => {
      res.json({ chatrooms });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Route: GET api/chatroom/:id
// Desc: Get roomMessages for room of given id
// access: private
chatRoomRouter.get("/:id", auth, (req, res) => {
  const roomId = req.params.id;
  ChatRoomModel.findById(roomId)
    .select("roomMessages")
    .then((result) => {
      res.json({ roomMessages: result.roomMessages });
    });
});

module.exports = chatRoomRouter;
