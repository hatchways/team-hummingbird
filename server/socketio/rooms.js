const ChatRooms = require("../models/chatRooms");
const personalChatRooms = [];

const createPersonalChatRoom = async (chatRoom) => {
  //const userChatId = user1.id + user2.id;
  //const userChatId2 = user2.id + user1.id;
  const roomMessages = [];
  const roomUser1 = chatRoom.roomUser1;
  const roomUser2 = chatRoom.roomUser2;

  const newChatRoom = new ChatRooms({
    roomMessages,
    roomUser1,
    roomUser2,
  });
  return await newChatRoom.save();
};

const getPersonalChatRoom = async (chatRoom) => {
  const room = await ChatRooms.findById(chatRoom._id).exec();

  return room;
};

const addMessageToChatRoom = (msg, currentRoom) => {
  ChatRooms.findByIdAndUpdate(
    currentRoom._id,
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
