const moment = require("moment");
const {
  createPersonalChatRoom,
  getPersonalChatRoom,
  getAllPersonalChatRooms,
  addMessageToChatRoom,
  getMessageHistory,
} = require("./rooms");
const connection = (io, socket) => {
  // console.log("client connected");
  socket.on("join", ({ chatWithUser, currentUser }, callback) => {
    console.log(
      `${chatWithUser.username} chatting with ${currentUser.username}`
    );
    const roomId = chatWithUser.id + currentUser.id;

    if (getPersonalChatRoom(roomId) === -1) {
      createPersonalChatRoom(chatWithUser, currentUser);
    } else {
      const messageHistory = getMessageHistory(roomId);
      console.log(messageHistory);
      socket.emit("pass-message-hist", messageHistory);
    }

    //  console.log(getAllPersonalChatRooms());
    socket.join(roomId);
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
        chatRoomId
      );
      io.to(chatRoomId).emit("receive-message", {
        text: chatMessage,
        //get user details
        sender: currentUser.username,
        time: moment().format("h:mm:ss a"),
      });
      //console.log(chatMessage);

      callback();
    }
  );
};

module.exports = connection;
