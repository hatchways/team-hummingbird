const personalChatRooms = [];

const createPersonalChatRoom = (user1, user2) => {
  const roomId = user1.id + user2.id;
  const roomId2 = user2.id + user1.id;
  const roomMessages = [];
  const roomUser1 = user1;
  const roomUser2 = user2;

  const personalChatRoomInstance = {
    roomId,
    roomId2,
    roomMessages,
    roomUser1,
    roomUser2,
  };
  personalChatRooms.push(personalChatRoomInstance);
};

const getPersonalChatRoom = (roomId) => {
  return personalChatRooms.findIndex(
    (room) => room.roomId === roomId || room.roomId2 === roomId
  );
};

const addMessageToChatRoom = (msg, roomId) => {
  personalChatRooms.map((room) => {
    if (room.roomId === roomId || room.roomId2 === roomId) {
      room.roomMessages.push(msg);
    }
  });
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
// const addUser = ({ chatWithUser, currentUser }) => {

//   const existingUser = users.find(
//     (user) => user.room === room && user.name === name
//   );

//   //if (!name || !room) return { error: "Username and room are required." };
//   if (!existingUser) {
//     const user = { id, name, room };
//     users.push(user);
//   }

//   return { user };
// };

// const removeUser = (id) => {
//   const index = users.findIndex((user) => user.id === id);

//   if (index !== -1) return users.splice(index, 1)[0];
// };

// const getUser = (id) => users.find((user) => user.id === id);

// const getUsersInRoom = (room) => users.filter((user) => user.room === room);

// module.exports = { addUser, removeUser, getUser, getUsersInRoom };
