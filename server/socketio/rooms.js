const ChatRooms = require("../models/chatrooms");
const personalChatRooms = [];

const createPersonalChatRoom = (user1, user2) => {
  const roomId = user1.id + user2.id;
  const roomId2 = user2.id + user1.id;
  const roomMessages = [];
  const roomUser1 = user1;
  const roomUser2 = user2;

  const newChatRoom = new ChatRooms({
    roomId,
    roomId2,
    roomMessages,
    roomUser1,
    roomUser2,
  });
  newChatRoom
    .save()
    .then((result) => {
      console.log("Chat Room Created");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getPersonalChatRoom = async (roomId) => {
  const room = await ChatRooms.find({
    $or: [{ roomId: roomId }, { roomId2: roomId }],
  }).exec();

  return room;
};

const addMessageToChatRoom = (msg, currentRoom) => {
  ChatRooms.findByIdAndUpdate(
    currentRoom.id,
    {
      roomMessages: [...currentRoom.roomMessages, msg],
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

const getMessageHistory = (roomId) => {
  const roomIndex = getPersonalChatRoom(roomId);
  return personalChatRooms[roomIndex].roomMessages;
};

const getAllPersonalChatRooms = () => {
  return personalChatRooms;
};

module.exports = {
  createPersonalChatRoom,
  getPersonalChatRoom,
  getAllPersonalChatRooms,
  addMessageToChatRoom,
  getMessageHistory,
};
