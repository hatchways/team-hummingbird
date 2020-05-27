import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  makeStyles,
  TextField,
  Button,
  List,
  ListItem,
  Box,
} from "@material-ui/core";
import socketIoClient from "socket.io-client";
let socket;

const Chat = (props) => {
  const classes = useStyles();
  const currentUser = { id: "4", username: "D" };
  const [chatMessage, setChatMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [chatWithUser, setChatWithUser] = useState(props.user);
  const ENDPOINT = "/";
  const chatRoomId = chatWithUser.id + currentUser.id;

  useEffect(() => {
    setChatWithUser(props.user);
  }, [props.user]);

  useEffect(() => {
    socket = socketIoClient(ENDPOINT);

    socket.emit("join", { chatWithUser, currentUser }, () => {});
    socket.on("pass-message-hist", (msgHistory) => {
      console.log(msgHistory);
      setMessageList([...msgHistory]);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
      socket.close();
    };
  }, [chatWithUser]);

  useEffect(() => {
    socket.off("receive-message").on("receive-message", (msg) => {
      console.log(messageList);
      setMessageList([...messageList, msg]);
    });

    socket.on("pass-message-hist", (msgHistory) => {
      setMessageList([...msgHistory]);
    });
  }, [messageList]);

  const sendChatMessage = (e) => {
    e.preventDefault();
    //sends this message to server
    if (chatMessage) {
      socket.emit(
        "send-message",
        { chatRoomId, chatMessage, currentUser },
        () => {
          setChatMessage("");
        }
      );
    }
  };
  return (
    <Paper>
      <Typography variant='h5'>{props.user.username}</Typography>
      <Box>
        <List>
          {messageList.map((msg) => (
            <ListItem
              className={
                msg.sender === currentUser.username
                  ? classes.listItem
                  : classes.listItem2
              }
              key={msg.time}
            >
              {msg.text}
            </ListItem>
          ))}
        </List>
      </Box>
      <TextField
        type='text'
        variant='outlined'
        fullWidth
        onChange={(e) => setChatMessage(e.target.value)}
        value={chatMessage}
      ></TextField>

      <Button className={classes.button} onClick={sendChatMessage}>
        Send
      </Button>
    </Paper>
  );
};

export default Chat;

const useStyles = makeStyles({
  button: {
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "0",
    padding: "15px",
    "&:hover": {
      background: "green",
      cursor: "pointer",
    },
  },
  listItem: {
    flexDirection: "row-reverse",
    backgroundColor: "lightblue",
  },
  listItem2: {
    flexDirection: "reverse",
    backgroundColor: "lightgreen",
  },
});
