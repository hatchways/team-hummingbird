import React, { useState } from "react";
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
import { useAuth } from "../components/UserContext";

const Messages = () => {
  const classes = useStyles();
  const { authTokens, setAuthTokens } = useAuth();
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState(authTokens ? authTokens.user : null);
  const [userChatList, setUserChatList] = useState([{ id: "1", name: "A" }]);

  const [chatWithUser, setChatWithUser] = useState(userChatList[0]);

  const srchUser = (e) => {
    if (e.keyCode == 13 && searchUser !== "") {
      fetch("/api/users/" + searchUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authTokens.token,
        },
      }).then((res) =>
        res.json().then((result) => {
          setUserChatList([...userChatList, ...result.users]);
        })
      );
    }
  };

  return { user } ? (
    <Box className={classes.messagesComp}>
      <Grid direction='row' container spacing={0}>
        <Grid item sm={4}>
          <Paper elevation={2} className={classes.userPanel}>
            <Typography variant='h4' className={classes.header}>
              Inbox Messages
            </Typography>
            <ListItem className={classes.messageBox}>
              <TextField
                type='text'
                variant='outlined'
                fullWidth
                placeholder='Search User'
                onKeyDown={srchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                value={searchUser}
              ></TextField>
            </ListItem>
            <List className={classes.list}>
              {userChatList.map((user) => (
                <ListItem
                  onClick={() => setChatWithUser(user)}
                  className={classes.listItem}
                  key={user.id}
                >
                  User {user.name}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item sm={8}>
          <Chat chatWithUser={chatWithUser} currentUser={user} />
        </Grid>
      </Grid>
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
