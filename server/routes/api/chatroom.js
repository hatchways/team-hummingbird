const express = require("express");
const chatRoomRouter = express.Router();
const ChatRoomModel = require("../../models/chatRooms");
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

// Route: POST api/chatroom/
// Desc: Create new chatroom
// access: private
chatRoomRouter.post("/", auth, (req, res) => {
  const { roomUser1, roomUser2 } = req.body;
  const newRoom = new ChatRoomModel({
    roomMessages: [],
    roomUser1,
    roomUser2,
  });

  ChatRoomModel.find({
    $or: [
      {
        $and: [
          { "roomUser1.id": roomUser1.id },
          { "roomUser2.id": roomUser2.id },
        ],
      },
      {
        $and: [
          { "roomUser1.id": roomUser2.id },
          { "roomUser2.id": roomUser1.id },
        ],
      },
    ],
  })
    .then((roomExists) => {
      if (roomExists.length > 0) {
        res.json({ roomExists: true, roomCreated: false, room: roomExists });
      } else {
        newRoom.save().then((roomCreated) => {
          console.log(roomCreated);
          res.json({ roomExists: false, roomCreated: true, room: roomCreated });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = chatRoomRouter;
