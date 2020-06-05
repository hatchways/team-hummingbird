import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  makeStyles,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import socketIoClient from "socket.io-client";

import Chat from "./Chat";
import Notifications from "../components/Notifications";
import { useAuth, useNotification } from "../components/UserContext";

let socket;

const Messages = (props) => {
  const classes = useStyles();
  const { authTokens, setAuthTokens } = useAuth();
  const { userNotifications } = useNotification();
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState(authTokens ? authTokens.user : null);
  const [userChatRooms, setUserChatRooms] = useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [matchedUser, setMatchedUser] = React.useState([]);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [currentChatRoom, setCurrentChatRoom] = useState();

  const userPanelRef = React.useRef();
  const ENDPOINT = "/chatrooms";

  const handleClickOpen = () => {
    setResponseMessage("");
    setSearchUser("");
    setMatchedUser([]);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    console.log(authTokens.user);
    fetch("/api/chatroom?user_id=" + user.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserChatRooms([...userChatRooms, ...result.chatrooms]);
      });
  }, []);

  const changeChatRoom = (changeRoom) => {
    fetch("api/chatroom/" + changeRoom._id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const updRoom = { ...changeRoom, roomMessages: result.roomMessages };
        if (socket) {
          socket.emit("disconnect");
          socket.off();
          socket.close();
        }
        socket = socketIoClient(ENDPOINT);
        socket.emit("join", updRoom, () => {});
        setCurrentChatRoom(updRoom);
      });
  };

  const srchUser = (e) => {
    if (searchUser !== "") {
      fetch("/api/users?username=" + searchUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authTokens.token,
        },
      }).then((res) =>
        res.json().then((result) => {
          setMatchedUser(result.users);
        })
      );
    }
  };

  const openNewChat = (matchedUser) => {
    fetch("api/chatroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
      body: JSON.stringify({
        roomUser1: matchedUser,
        roomUser2: {
          id: user.id,
          name: user.name,
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.roomExists) {
          setResponseMessage(
            "User already present in existing chats, please search!"
          );
        } else if (result.roomCreated) {
          setUserChatRooms([...userChatRooms, result.room]);
          setOpenDialog(false);
        }
      });
  };

  const toggleChatList = (e) => {
    if (userPanelRef.current.classList.contains(classes.userPanelMobile)) {
      userPanelRef.current.classList.remove(classes.userPanelMobile);
    } else {
      userPanelRef.current.classList.add(classes.userPanelMobile);
    }
  };
  return { user } ? (
    <Box className={classes.messagesComp}>
      <Grid direction='row' container spacing={0}>
        <Grid item md={4} xs={12}>
          <Paper elevation={2} className={classes.userPanel} ref={userPanelRef}>
            <Box className={classes.chatList}>
              <Typography variant='h4' className={classes.header}>
                Inbox Messages
              </Typography>
            </Box>
            {userChatRooms.length > 0 ? (
              <List className={classes.list}>
                {userChatRooms.map((chatRoom) => (
                  <ListItem
                    onClick={() => changeChatRoom(chatRoom)}
                    className={classes.listItem}
                    key={chatRoom._id}
                  >
                    {chatRoom.roomUser1.id === user.id
                      ? chatRoom.roomUser2.name
                      : chatRoom.roomUser1.name}
                  </ListItem>
                ))}
              </List>
            ) : (
              <ListItem>Search for a user to Chat with</ListItem>
            )}

            <div>
              <Button
                variant='outlined'
                onClick={handleClickOpen}
                className={classes.button}
              >
                New Chat
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby='form-dialog-title'
              >
                <DialogTitle id='form-dialog-title'>Search User</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin='dense'
                    id='name'
                    label='Name'
                    type='text'
                    fullWidth
                    onChange={(e) => setSearchUser(e.target.value)}
                    value={searchUser}
                  />
                  <List>
                    {matchedUser.map((user) => (
                      <ListItem key={user.id} onClick={() => openNewChat(user)}>
                        {user.name}
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant='subtitle1'>{responseMessage}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={srchUser}>Search</Button>
                </DialogActions>
              </Dialog>
            </div>
          </Paper>
        </Grid>
        <Grid item md={8} xs={12}>
          {currentChatRoom !== undefined &&
          socket !== undefined &&
          userChatRooms.length > 0 ? (
            <Chat
              currentChatRoom={currentChatRoom}
              currentUser={user}
              toggleChatList={toggleChatList}
              socket={socket}
            />
          ) : null}
        </Grid>
      </Grid>
      {userNotifications.openNotification ? (
        <Notifications socketNotify={props.socketNotify} />
      ) : null}
    </Box>
  ) : (
    <Typography variant='h3'>Please SignIn</Typography>
  );
};

export default Messages;

const useStyles = makeStyles({
  messagesComp: {
    height: window.innerHeight - 80,
  },
  chatList: {
    position: "relative",
    height: "4rem",
    display: "flex",
    borderBottom: "1px solid #f1f1f1",
    padding: "0px 20px 0px 20px",
    lineHeight: "60px",
  },
  header: {
    paddingTop: "10px",
  },
  // mobileMenu: {
  //   position: "absolute",
  //   right: "20px",
  //   fontSize: "40px",
  //   paddingTop: "10px",
  // },
  // hideMobileMenu: {
  //   display: "none",
  // },
  userPanel: {
    height: "100%",
  },
  userPanelMobile: {
    display: "none",
  },
  button: {
    margin: "20px 0px 20px 20px",
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "0",
    padding: "10px",
    "&:hover": {
      background: "green",
      cursor: "pointer",
    },
  },
  messageBox: {
    display: "flex",
    width: "100%",
    margin: "0px",
    padding: "0px",
    borderTop: "1px solid #f1f1f1",
    alignItems: "center",
  },
  list: {
    padding: "0px",
  },
  listItem: {
    borderBottom: "1px solid #f1f1f1",
    "&:hover": {
      background: "#f1f1f1",
      cursor: "pointer",
    },
    "&:active": {
      background: "#f1f1f1",
    },
  },
});
