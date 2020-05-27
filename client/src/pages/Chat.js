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

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      sendChatMessage();
    }
  };

  const sendChatMessage = () => {
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
    <Paper className={classes.chatComp}>
      <Typography variant='h4' className={classes.userHeader}>
        {props.user.username}
      </Typography>
      <Box>
        <List className={classes.list}>
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
      <Box className={classes.messageBox}>
        <TextField
          type='text'
          variant='outlined'
          fullWidth
          placeholder='write your message here'
          onKeyDown={keyPress}
          onChange={(e) => setChatMessage(e.target.value)}
          value={chatMessage}
        ></TextField>

        <Button className={classes.button} onClick={sendChatMessage}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;

const useStyles = makeStyles({
  chatComp: {
    height: window.innerHeight - 80,
    position: "relative",
  },
  userHeader: {
    backgroundColor: "#f1f1f1",
    height: "4rem",
    paddingLeft: "10px",
    lineHeight: "60px",
  },
  button: {
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "2px",
    padding: "15px",
    "&:hover": {
      background: "green",
      cursor: "pointer",
    },
  },
  list: {
    margin: "0px 10px 0px 10px",
  },
  listItem: {
    boxShadow: " 0px 0px 5px 1px rgba(0, 0, 0, 0.2)",
    borderRadius: "20px",
    flexDirection: "row-reverse",
    width: "fit-content",
    marginBottom: "10px",
  },
  listItem2: {
    flexDirection: "row",
    width: "fit-content",
    backgroundColor: "#f1f1f1",
    marginBottom: "10px",
  },
  messageBox: {
    display: "flex",
    position: "absolute",
    width: "100%",
    borderTop: "1px solid #f1f1f1",
    bottom: "0px",
    alignItems: "center",
  },
});
