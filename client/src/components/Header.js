import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Grid,
} from "@material-ui/core";

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
});

function Header(props) {
  const [responseMessage, setResponseMessage] = useState("");

  const classes = useStyles();
  return (
    <AppBar position='static' className={classes.bar}>
      <Toolbar>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant='h6' className={classes.title}>
              TATTOO ART
            </Typography>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>
            <Button variant='outlined' className={classes.button} href='/login'>
              SIGN IN
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;