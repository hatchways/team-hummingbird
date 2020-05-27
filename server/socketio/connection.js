const moment = require("moment");
const {
  createPersonalChatRoom,
  getPersonalChatRoom,
  addMessageToChatRoom,
} = require("./rooms");

let currentRoom = {};
const connection = (io, socket) => {
  socket.on("join", ({ chatWithUser, currentUser, chatRoomId }, callback) => {
    getPersonalChatRoom(chatRoomId)
      .then((room) => {
        if (room.length === 0) {
          //create room
          createPersonalChatRoom(chatWithUser, currentUser);
        } else {
          currentRoom = room[0];
          const messageHistory = room[0].roomMessages;
          socket.emit("pass-message-hist", messageHistory);
        }
        socket.join(chatRoomId);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on(
    "send-message",
    ({ chatRoomId, chatMessage, currentUser }, callback) => {
      //save chatmessage to message list
      addMessageToChatRoom(
        {
          text: chatMessage,
          sender: currentUser.username,
          time: moment().format("h:mm:ss a"),
        },
        currentRoom
      );
      io.to(chatRoomId).emit("receive-message", {
        text: chatMessage,
        //get user details
        sender: currentUser.username,
        time: moment().format("h:mm:ss a"),
      });

      callback();
    }
  );
};

module.exports = connection;
