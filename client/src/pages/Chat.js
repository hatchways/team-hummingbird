import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  makeStyles,
  TextField,
  Button,
  List,
  ListItem,
  Box,
  useMediaQuery,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Chat = (props) => {
  const classes = useStyles();
  const { currentUser } = props;
  const [chatMessage, setChatMessage] = useState("");
  const [chatRoom, setChatRoom] = useState(props.currentChatRoom);
  const [showMore, setShowMore] = useState(true);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  let socket = props.socket;
  /* Connect to chatrooms namespace */
  // const ENDPOINT = "/chatrooms";

  useEffect(() => {
    setChatRoom(props.currentChatRoom);
  }, [props.currentChatRoom]);

  // useEffect(() => {
  //   socket = socketIoClient(ENDPOINT);
  //   socket.emit("join", chatRoom, () => {});
  //   return () => {
  //     socket.emit("disconnect");
  //     socket.off();
  //     socket.close();
  //   };
  // }, [chatRoom]);

  useEffect(() => {
    socket.off("receive-message").on("receive-message", (msg) => {
      const updRoomMessages = [...chatRoom.roomMessages, msg];
      setChatRoom({ ...chatRoom, roomMessages: updRoomMessages });
      setChatMessage("");
    });
  });

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      sendChatMessage();
    }
  };

  const sendChatMessage = () => {
    //sends this message to server
    if (chatMessage) {
      socket.emit("send-message", chatMessage, currentUser, () => {
        console.log("Ever executes?");
        setChatMessage("");
      });
    }
  };
  const toggleChatList = () => {
    setShowMore(!showMore);
    props.toggleChatList();
  };
  return (
    <Paper className={classes.chatComp}>
      <Box className={classes.userHeader}>
        <Typography variant='h4'>
          {chatRoom.roomUser1.id === currentUser.id
            ? chatRoom.roomUser2.name
            : chatRoom.roomUser1.name}
        </Typography>
        <ExpandMoreIcon
          className={
            isMobile
              ? showMore
                ? classes.hideMobileMenu
                : classes.mobileMenu
              : classes.hideMobileMenu
          }
          onClick={toggleChatList}
        ></ExpandMoreIcon>
        <ExpandLessIcon
          className={
            isMobile
              ? showMore
                ? classes.mobileMenu
                : classes.hideMobileMenu
              : classes.hideMobileMenu
          }
          onClick={toggleChatList}
        ></ExpandLessIcon>
      </Box>
      <Box>
        <List className={classes.list}>
          {chatRoom.roomMessages.map((msg) => (
            <ListItem
              className={
                msg.sender === currentUser.name
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
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    height: "4rem",
    paddingLeft: "20px",
  },
  mobileMenu: {
    position: "absolute",
    right: "20px",
    fontSize: "40px",
  },
  hideMobileMenu: {
    display: "none",
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
    maxHeight: "364px",
    overflow: "auto",
    marginTop: "5px",
    padding: "5px 10px 0px 5px",
    position: "relative",
    /* width */
    "&::-webkit-scrollbar": {
      width: "4px",
    },

    /* Track */
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },

    /* Handle */
    "&::-webkit-scrollbar-thumb": {
      background: "#555",
    },

    /* Handle on hover */
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#000",
    },
  },
  listItem: {
    boxShadow: " 0px 0px 5px 1px rgba(0, 0, 0, 0.2)",
    borderRadius: "20px",
    flexDirection: "row-reverse",
    marginBottom: "10px",
  },
  listItem2: {
    flexDirection: "row",
    width: "fit-content",
    borderRadius: "20px",
    backgroundColor: "#f1f1f1",
    marginBottom: "10px",
  },
  messageBox: {
    display: "flex",
    position: "absolute",
    bottom: "0px",
    width: "100%",
    borderTop: "1px solid #f1f1f1",
    bottom: "0px",
    alignItems: "center",
    zIndex: "2",
  },
});
