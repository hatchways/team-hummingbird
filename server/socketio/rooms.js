const moment = require("moment");

const ChatRooms = require("../models/chatRooms");
const Notifications = require("../models/notifications");

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

const addMessageToChatRoom = async (msg, currentRoom, currentUser) => {
  let sendToUser =
    currentRoom.roomUser1.id === currentUser.id
      ? currentRoom.roomUser2.id
      : currentRoom.roomUser1.id;

  if (currentRoom.roomMessages.length === 0) {
    //sendToUser receiving message from current User for the first time,
    //notify sendToUser
    try {
      let updateNotification = await Notifications.find({
        user_id: sendToUser,
      });
      let updatedNotification = await Notifications.findByIdAndUpdate(
        updateNotification[0].id,
        {
          $set: {
            new_notification: true,
            notifications: [
              ...updateNotification[0].notifications,
              {
                user: currentUser,
                text: `${currentUser.name} sent you a message`,
                read_status: false,
                time: moment().format("YYYY-MM-DDTHH:mm:ss"),
              },
            ],
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
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
