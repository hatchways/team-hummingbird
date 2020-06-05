import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  makeStyles,
  Typography,
  Button,
  Box,
} from "@material-ui/core";

import { useAuth, useNotification } from "./UserContext";

const Notifications = (props) => {
  let { socketNotify } = props;
  //const [socketNotify]=useState(props)
  const classes = useStyles();
  const { authTokens } = useAuth();
  const { userNotifications, setUserNotifications } = useNotification();
  const [newList, setNewList] = useState([]);
  const [oldList, setOldList] = useState([]);

  useEffect(() => {
    setNewList(userNotifications.new_notifications);
    setOldList(userNotifications.old_notifications);
  }, [userNotifications]);

  useEffect(() => {
    return () => {
      if (
        userNotifications.new_notifications.length !== newList.length &&
        (newList.length > 0 || oldList.length > 0)
      ) {
        fetch("/api/notifications/read", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authTokens.token,
          },
          body: JSON.stringify({
            upd_new_notifications: [...newList],
            upd_old_notifications: [...oldList],
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          });
      }
    };
  }, [newList, oldList]);

  const markNotificationRead = (index) => {
    let moveToOldList = newList[index];
    let updNewList = [...newList];
    updNewList.splice(index, 1);
    setNewList([...updNewList]);
    setOldList([...oldList, moveToOldList]);
  };
  return (
    <Paper elevation={10} className={classes.root}>
      <Typography variant='h6'>New Notifications</Typography>
      <List>
        {newList.map((notification, index) => (
          <Box className={classes.listItem} key={index}>
            <ListItem>{notification.text}</ListItem>
            <Button onClick={() => markNotificationRead(index)}>
              Mark Read
            </Button>
          </Box>
        ))}
      </List>
      <Typography variant='h6'>Past Notifications</Typography>
      <List>
        {oldList.map((notification, index) => (
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
  list: {},
  listItem: {
    display: "flex",
  },
});
