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
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import Chat from "./Chat";
import { useAuth } from "../components/UserContext";

const Messages = () => {
  const classes = useStyles();
  const { authTokens, setAuthTokens } = useAuth();
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState(authTokens ? authTokens.user : null);
  const [userChatRooms, setUserChatRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [matchedUser, setMatchedUser] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const handleClickOpen = () => {
    setResponseMessage("");
    setSearchUser("");
    setMatchedUser([]);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const [currentChatRoom, setCurrentChatRoom] = useState();

  useEffect(() => {
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
    console.log(changeRoom);
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
        console.log(updRoom);
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
          console.log(result);
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
  // console.log(authTokens);
  // console.log(userChatRooms);
  return { user } ? (
    <Box className={classes.messagesComp}>
      <Grid direction="row" container spacing={0}>
        <Grid item sm={4}>
          <Paper elevation={2} className={classes.userPanel}>
            <Typography variant="h4" className={classes.header}>
              Inbox Messages
            </Typography>

            <ListItem className={classes.messageBox}>
              {/* <TextField
                type='text'
                variant='outlined'
                fullWidth
                placeholder='Search User'
                onKeyDown={srchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                value={searchUser}
              ></TextField> */}
            </ListItem>
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
                variant="outlined"
                onClick={handleClickOpen}
                className={classes.button}
              >
                New Chat
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Search User</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
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
                  <Typography variant="subtitle1">{responseMessage}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={srchUser}>Search</Button>
                </DialogActions>
              </Dialog>
            </div>
          </Paper>
        </Grid>
        <Grid item sm={8}>
          {currentChatRoom !== undefined && userChatRooms.length > 0 ? (
            <Chat currentChatRoom={currentChatRoom} currentUser={user} />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Typography variant="h3">Please SignIn</Typography>
  );
};

export default Messages;

const useStyles = makeStyles({
  messagesComp: {
    height: window.innerHeight - 80,
  },
  header: {
    height: "4rem",
    borderBottom: "1px solid #f1f1f1",
    paddingLeft: "10px",
    lineHeight: "60px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  userPanel: {
    height: "100%",
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
