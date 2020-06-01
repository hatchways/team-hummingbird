import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Grid,
} from "@material-ui/core";

import { useAuth, useNotification } from "./UserContext";
import Notifications from "./Notifications";

const useStyles = makeStyles({
  bar: {
    backgroundColor: "black",
    height: "5rem",
  },
  title: {
    marginTop: "60px",
    marginBottom: "60px",
    marginLeft: "30px",
    fontFamily: "Poppins",
    fontWeight: 600,
    textAlign: "center",
    letterSpacing: "0.5em",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    padding: "0.8rem 2.5rem",
    borderRadius: "0",
    border: "1px solid #ffffff",
    marginTop: "50px",
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  tabs: {
    textDecoration: "none",
    color: "white",
    padding: "5px",
    margin: "60px 15px 45px 0px",
  },
  auth: {
    visibility: "hidden",
  },
});

function Header(props) {
  const { authTokens } = useAuth();
  const { openNotification, setOpenNotification } = useNotification();
  const path = window.location.pathname;
  const classes = useStyles();

  const showNotifications = () => {
    setOpenNotification(!openNotification);
  };
  return (
    <>
      <AppBar position='static' className={classes.bar}>
        <Toolbar>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <a className={classes.link} href='/'>
                <Typography variant='h6' className={classes.title}>
                  TATTOO ART
                </Typography>
              </a>
            </Grid>

            <Grid
              item
              xs={6}
              container
              direction='row-reverse'
              spacing={2}
              className={authTokens ? "" : classes.auth}
            >
              <a className={classes.tabs} href='/messages'>
                Messages
              </a>
              <a href='#' className={classes.tabs} onClick={showNotifications}>
                Notifications
              </a>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant='outlined'
                className={classes.button}
                href={
                  authTokens
                    ? "/contest"
                    : path === "/login"
                    ? "/register"
                    : "/login"
                }
              >
                {authTokens
                  ? "CREATE CONTEST"
                  : path === "/login"
                  ? "SIGN UP"
                  : "SIGN IN"}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
