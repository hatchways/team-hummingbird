const ChatRooms = require("../models/chatrooms");
const personalChatRooms = [];

const createPersonalChatRoom = async (user1, user2) => {
  const userChatId = user1.id + user2.id;
  const userChatId2 = user2.id + user1.id;
  const roomMessages = [];
  const roomUser1 = user1;
  const roomUser2 = user2;

  const newChatRoom = new ChatRooms({
    userChatId,
    userChatId2,
    roomMessages,
    roomUser1,
    roomUser2,
  });
  return await newChatRoom.save();
};

const getPersonalChatRoom = async (usersChatId) => {
  const room = await ChatRooms.find({
    $or: [{ userChatId: usersChatId }, { userChatId2: usersChatId }],
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

module.exports = {
  createPersonalChatRoom,
  getPersonalChatRoom,
  addMessageToChatRoom,
};
