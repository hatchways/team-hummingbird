import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Grid,
} from "@material-ui/core";

import { useAuth } from "./UserContext";

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
});

function Header(props) {
  const { authTokens } = useAuth();
  const path = window.location.pathname;
  const classes = useStyles();
  return (
    <AppBar position='static' className={classes.bar}>
      <Toolbar>
        <Grid container>
          <Grid item xs={3}>
            <a className={classes.link} href='/'>
              <Typography variant='h6' className={classes.title}>
                TATTOO ART
              </Typography>
            </a>
          </Grid>
          {
            !authTokens ?
            <React.Fragment>
              <Grid item xs={3}></Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={3}>
                <Button 
                  variant='outlined' 
                  className={classes.button} 
                  href={path === '/login' ? '/register' : '/login'}
                >
                  {path === '/login' ? 'SIGN UP' : 'SIGN IN'}
                </Button>
              </Grid>
            </React.Fragment>
            :
            ''
          }
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
