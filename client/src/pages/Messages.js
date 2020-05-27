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
} from "@material-ui/core";

import Chat from "./Chat";

const Messages = () => {
  const classes = useStyles();
  const userList = [
    { id: "1", username: "A" },
    { id: "2", username: "B" },
    { id: "3", username: "C" },
  ];
  const [chatWithUser, setChatWithUser] = useState(userList[0]);

  return (
    <Box className={classes.messagesComp}>
      <Grid direction='row' container spacing={0}>
        <Grid item sm={4}>
          <Paper elevation={2} className={classes.userPanel}>
            <Typography variant='h4' className={classes.header}>
              Inbox Messages
            </Typography>
            <List className={classes.list}>
              {userList.map((user) => (
                <ListItem
                  onClick={() => setChatWithUser(user)}
                  className={classes.listItem}
                  key={user.id}
                >
                  User {user.username}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item sm={8}>
          <Chat user={chatWithUser} />
        </Grid>
      </Grid>
    </Box>
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
});
