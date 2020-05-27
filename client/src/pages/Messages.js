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
    <Box>
      <Grid direction='row' container spacing={0}>
        <Grid item sm={4}>
          <Paper elevation={2}>
            <List>
              {userList.map((user) => (
                <ListItem
                  onClick={() => setChatWithUser(user)}
                  className={classes.list}
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
  list: {
    "&:hover": {
      background: "grey",
      cursor: "pointer",
    },
    "&:active": {
      background: "grey",
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
