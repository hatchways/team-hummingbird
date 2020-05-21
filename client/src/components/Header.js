import React, { useState, useEffect } from "react";
import { 
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
  Box
 } from '@material-ui/core';


const useStyles = makeStyles({
  container: {
    marginTop: "80px"
  },
  box: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderWidth: "1px",
    borderColor: "#edf2f7"
  },
  title: {
    marginTop: "60px",
    marginBottom: "60px",
    marginLeft: "30px",
    fontFamily: 'Poppins',
    fontWeight: 600,
    textAlign: "center",
    letterSpacing: "0.5em"
  },
  text: {
    fontFamily: 'Poppins'
  },
  grid: {
    marginTop: "20px",
    marginBottom: "20px"
  },
  button: {
    backgroundColor: "black",
    color: "white",
    fontFamily: 'Poppins',
    fontWeight: 600,
    paddingTop: "0.8rem",
    paddingBottom: "0.8rem",
    paddingLeft: "2.5rem",
    paddingRight: "2.5rem",
    borderRadius: "0",
    border: "1px solid #ffffff",
    align: "right",
  },
  button2: {
    backgroundColor: "black",
    color: "black",
    fontFamily: 'Poppins',
    fontWeight: 600,
    paddingTop: "0.8rem",
    paddingBottom: "0.8rem",
    paddingLeft: "2.5rem",
    paddingRight: "2.5rem",
    borderRadius: "0",
    border: "1px solid #000000",
    align: "right",
  }
});

 function Header(props) {
  const [responseMessage, setResponseMessage] = useState('');

  const classes = useStyles();
  return (
    <AppBar position="static" style={{backgroundColor: "black", height: "5rem"}}>
      <Toolbar>
        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" className={classes.title}>
          TATTOO ART
        </Typography>
        <Button variant="outlined" className={classes.button2}>SIGN IN</Button>
        <Button variant="outlined" className={classes.button2}>SIGN IN</Button>
        <Button variant="outlined" className={classes.button2}>SIGN IN</Button>
        <Button variant="outlined" className={classes.button2}>SIGN IN</Button>
        <Button variant="outlined" className={classes.button2}>SIGN IN</Button>
        <Button variant="outlined" className={classes.button}>SIGN IN</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;