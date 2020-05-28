const moment = require("moment");
const {
  createPersonalChatRoom,
  getPersonalChatRoom,
  addMessageToChatRoom,
} = require("./rooms");

let currentRoom = {};
const connection = (io, socket) => {
  socket.on("join", ({ chatWithUser, currentUser, usersChatId }, callback) => {
    getPersonalChatRoom(usersChatId)
      .then((room) => {
        if (room.length === 0) {
          //create room

          createPersonalChatRoom(chatWithUser, currentUser)
            .then((newRoom) => {
              currentRoom = newRoom;
              socket.emit("pass-message-hist", []);
              socket.join(newRoom.id);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          currentRoom = room[0];
          const messageHistory = room[0].roomMessages;
          socket.emit("pass-message-hist", messageHistory);
          socket.join(currentRoom.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("send-message", ({ chatMessage, currentUser }, callback) => {
    //save chatmessage to message list
    addMessageToChatRoom(
      {
        text: chatMessage,
        sender: currentUser.name,
        time: moment().format("h:mm:ss a"),
      },
      currentRoom
    );
    io.to(currentRoom.id).emit("receive-message", {
      text: chatMessage,
      //get user details
      sender: currentUser.name,
      time: moment().format("h:mm:ss a"),
    });

    callback();
  });
};

module.exports = connection;
