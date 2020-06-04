const moment = require("moment");
const {
  createPersonalChatRoom,
  getPersonalChatRoom,
  addMessageToChatRoom,
} = require("./rooms");

let currentRoom = {};
const connection = (io, socket) => {
  socket.on("join", (chatRoom, callback) => {
    getPersonalChatRoom(chatRoom)
      .then((room) => {
        if (room.length === 0) {
          //create room
          createPersonalChatRoom(chatRoom)
            .then((newRoom) => {
              currentRoom = newRoom;
              socket.join(newRoom.id);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          currentRoom = room;
          socket.join(currentRoom._id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("send-message", (chatMessage, currentUser, callback) => {
    //save chatmessage to message list
    addMessageToChatRoom(
      {
        text: chatMessage,
        sender: currentUser.name,
        time: moment().format("h:mm:ss a"),
      },
      currentRoom,
      currentUser
    );
    io.to(currentRoom._id).emit("receive-message", {
      text: chatMessage,
      //get user details
      sender: currentUser.name,
      time: moment().format("h:mm:ss a"),
    });

    callback();
  });
};

module.exports = connection;
