import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { useAuth, useNotification } from "./UserContext";

const Notifications = (props) => {
  let { socketNotify } = props;
  const classes = useStyles();
  const { userNotifications, setUserNotifications } = useNotification();

  useEffect(() => {
    console.log(userNotifications);
    // socketNotify.emit("mark-new-notifications-read", authTokens.user);
    return () => {};
  }, [userNotifications]);

  return (
    <Paper elevation={10} className={classes.root}>
      <Typography variant='h6'>New Notifications</Typography>
      <List>
        {userNotifications.newList.map((notification, index) => (
          <ListItem key={index}>{notification.text}</ListItem>
        ))}
      </List>
      <Typography variant='h6'>Past Notifications</Typography>
      <List>
        {userNotifications.oldList.map((notification, index) => (
          <ListItem key={index}>{notification.text}</ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Notifications;

const useStyles = makeStyles({
  root: {
    width: "40%",

    direction: "ltr",
    zIndex: "100",
    position: "absolute",
    right: "0px",
    top: "80px",
  },
});
