import React, { useState } from "react";
import { Paper, List, ListItem, makeStyles } from "@material-ui/core";
const Notifications = () => {
  const classes = useStyles();

  return (
    <Paper elevation={10} className={classes.root}>
      <List>
        <ListItem>Notifications go here</ListItem>
        <ListItem>Notifications 1</ListItem>
        <ListItem>Notifications 2</ListItem>
        <ListItem>Notifications 3</ListItem>
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
