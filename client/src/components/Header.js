import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Grid,
  useMediaQuery,
} from "@material-ui/core";

import { useAuth } from "./UserContext";
import { MailOutline, PublicOutlined } from "@material-ui/icons";

function Header() {
  const { authTokens } = useAuth();
  const path = window.location.pathname;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.bar}>
      <Toolbar>
        <Grid className={classes.container} container>
          <Grid item className={classes.titleWrapper} xs={3}>
            <a className={classes.link} href="/">
              <Typography
                variant={isMobile ? "body1" : "h5"}
                className={classes.title}
              >
                TATTOO ART
              </Typography>
            </a>
          </Grid>
          {authTokens ? (
            <>
              <Grid className={classes.linkWrapper} item xs={3}>
                <a className={classes.link} href="/">
                  {isMobile ? (
                    <PublicOutlined fontSize="large" />
                  ) : (
                    <Typography variant="subtitle1" className={classes.links}>
                      Discover
                    </Typography>
                  )}
                </a>
              </Grid>
              <Grid className={classes.linkWrapper} item xs={3}>
                <a className={classes.link} href="/messages">
                  {isMobile ? (
                    <MailOutline fontSize="large" />
                  ) : (
                    <Typography variant="subtitle1" className={classes.links}>
                      Messages
                    </Typography>
                  )}
                </a>
              </Grid>
            </>
          ) : (
            <Grid item xs={6} />
          )}

          <Grid className={classes.buttonWrapper} item xs={3}>
            <Button
              variant="outlined"
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
                ? isMobile
                  ? "CREATE"
                  : "CREATE CONTEST"
                : path === "/login"
                ? "SIGN UP"
                : "SIGN IN"}
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

const useStyles = makeStyles((theme) => ({
  bar: {
    backgroundColor: "black",
    maxHeight: "5rem",
  },
  container: {
    "& .MuiGrid-grid-xs-3": {
      minHeight: "64px",
      maxHeight: "5rem",
    },
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      padding: "0.25rem 0.25rem",
    },
  },
  title: {
    fontFamily: "Poppins",
    fontWeight: 600,
    textAlign: "center",
    letterSpacing: "0.5em",
  },
  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    textAlign: "center",
    padding: "0.8rem 2.5rem",
    borderRadius: "0",
    border: "1px solid #ffffff",
    [theme.breakpoints.down("sm")]: {
      //when screen fits text links but button too large
      padding: "0.5rem 0.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      //to match icon styles
      padding: "0.25rem 0.25rem",
      border: "2.5px solid #ffffff",
      borderRadius: "5px",
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  links: {
    color: "white",
  },
  linkWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
