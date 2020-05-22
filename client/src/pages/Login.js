import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Container, 
  Paper, 
  makeStyles, 
  Grid, 
  TextField, 
  Button, 
  Box,
  Snackbar
 } from '@material-ui/core';
 import MuiAlert from '@material-ui/lab/Alert';

import { Route, Link } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    marginTop: "40px",
    marginBottom: "60px",
    fontFamily: 'Poppins',
    fontWeight: 600,
    textAlign: "center"
  },
  text: {
    fontFamily: 'Poppins'
  },
  grid: {
    marginTop: "20px",
    marginBottom: "20px"
  },
  button: {
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "black",
    color: "white",
    fontFamily: 'Poppins',
    fontWeight: 600,
    paddingTop: "1rem",
    paddingBottom: "1rem",
    paddingLeft: "4rem",
    paddingRight: "4rem",
    borderRadius: "0"
  },
});

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
    setOpenError(false);
  };

  const handleSubmit = () => {
    let status;
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        email,
        password
       })
    })
      .then(res => {
        status = res.status;
        return res.json();
      })
      .then(json => {
        console.log(json);
        if (status < 400) setOpenSuccess(true);
        else setOpenError(true);
        setResponseMessage(json.message);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="sm">
      <Paper className={classes.box} square>
      <br/>
        <Typography className={classes.title} variant="h3">
          Sign In
        </Typography>
        <div >
            <Grid direction="column" container spacing={3} alignItems="center">
                <Box width="50%">
                    <TextField 
                      id="email" 
                      label="Email" 
                      type="email" 
                      variant="outlined" 
                      fullWidth 
                      required
                      onChange={e => setEmail(e.target.value)}
                    />
                </Box>
                <br/>
                <Box width="50%">
                  <TextField 
                      id="password" 
                      label="Password" 
                      type="password" 
                      variant="outlined" 
                      fullWidth 
                      required
                      onChange={e => setPassword(e.target.value)}
                    />
                </Box>
            </Grid>
            <Grid container justify="center" className={classes.grid}>
                <Button
                  size="large" 
                  className={classes.button}
                  onClick={handleSubmit}
                >
                Sign In
                </Button>
            </Grid>
        </div>
    </Paper>
    <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
        {responseMessage}
      </Alert>
    </Snackbar>
    <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {responseMessage}
      </Alert>
    </Snackbar>
    </Container>
  );
}

export default Login;
