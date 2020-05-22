import React, { useState } from "react";
import "date-fns";
import {
  makeStyles,
  Container,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  GridList,
  GridListTile,
  Typography,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { theme } from "../themes/theme";

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props}></MuiAlert>;
}
const styles = makeStyles({
  box: {
    width: "80%",
    margin: "auto",
    marginTop: "30px",
    marginBottom: "30px",
  },
  text: {
    fontFamily: "poppins",
  },
  title: {
    fontFamily: "poppins",
    fontWeight: 600,
    margin: "30px 0px 7px 0px",
  },
  title2: {
    color: "grey",
  },
  designBox: {
    padding: "10px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: 0,
        borderColor: "#e2e8f0",
      },
    },
  },
  gridList: {
    width: 500,
  },
  button: {
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "0",
    border: "none",
  },
});
const Contest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prize, setPrize] = useState();
  const [deadlineDate, setDeadlineDate] = useState();
  const [deadlineTime, setDeadlineTime] = useState();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [message, setMessage] = useState("sdf");
  const classes = styles();

  const handleSubmit = (e) => {
    if (!(title && description && prize && deadlineDate && deadlineTime)) {
      setOpenError(true);
      setMessage("Please enter all required fields");
    } else {
      const deadlineDateToSubmit = new Date();
      deadlineDateToSubmit.setDate(deadlineDate.getDate());
      deadlineDateToSubmit.setMonth(deadlineDate.getMonth());
      deadlineDateToSubmit.setFullYear(deadlineDate.getFullYear());
      deadlineDateToSubmit.setHours(deadlineTime.getHours());
      deadlineDateToSubmit.setMinutes(deadlineTime.getMinutes());

      fetch("/api/contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //set x-auth-token
        },
        body: JSON.stringify({
          title,
          description,
          prize,
          deadlineDateToSubmit,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          console.log(json);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const closeAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  return (
    <Container maxWidth='lg'>
      <Typography variant='h5' className={classes.title} align='center'>
        Create new contest
      </Typography>
      <Paper elevation={3} className={classes.box}>
        <br />

        <Box width='60%' margin='auto'>
          <Typography className={classes.title} variant='subtitle1'>
            What do you need designed?
          </Typography>

          <TextField
            id='contest-title'
            type='text'
            className={classes.textField}
            label='Write a descriptive contest title'
            variant='outlined'
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box width='60%' margin='auto'>
          <Typography className={classes.title} variant='subtitle1'>
            Description
          </Typography>

          <TextField
            id='contest-description'
            label='Details about what type of tattoo you want'
            className={classes.textField}
            type='text'
            variant='outlined'
            fullWidth
            required
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Box width='60%' margin='auto' display='flex'>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography className={classes.title} variant='subtitle1'>
                Prize amount
              </Typography>

              <TextField
                id='contest-prize'
                type='number'
                variant='outlined'
                className={classes.textField}
                fullWidth
                required
                placeholder={"100.00"}
                value={prize}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AttachMoneyOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPrize(e.target.value)}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography className={classes.title} variant='subtitle1'>
                Deadline
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <KeyboardDatePicker
                      style={{ border: "1px" }}
                      disableToolbar
                      format='MM/dd/yyyy'
                      margin='normal'
                      required
                      id='contest-deadline-date'
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <KeyboardTimePicker
                      margin='normal'
                      id='contest-deadline-time'
                      required
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e)}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Box>
        <Box width='60%' margin='auto'>
          <Typography className={classes.title} variant='subtitle1'>
            Which designs do you like?
            <br />
            <Typography variant='subtitle2' className={classes.title2}>
              Let's start by helping your designers understand which styles you
              prefer
            </Typography>
          </Typography>

          <Box border={1} borderColor='grey.300' className={classes.designBox}>
            <GridList cellHeight={160} className={classes.gridList} cols={4}>
              <GridListTile key={1} cols={1}>
                <Typography>1</Typography>
              </GridListTile>
              <GridListTile key={2} cols={1}>
                <Typography>2</Typography>
              </GridListTile>
              <GridListTile key={3} cols={1}>
                <Typography>3</Typography>
              </GridListTile>
              <GridListTile key={4} cols={1}>
                <Typography>4</Typography>
              </GridListTile>
            </GridList>
          </Box>
        </Box>

        <Grid container justify='center' className={classes.grid}>
          <Button
            size='large'
            type='submit'
            className={classes.button}
            onClick={handleSubmit}
          >
            CREATE CONTEST
          </Button>
        </Grid>
        <Snackbar autoHideDuration={6000} open={openError}>
          <Alert onClose={closeAlert} severity='error'>
            {message}
          </Alert>
        </Snackbar>
        <Snackbar autoHideDuration={6000} open={openSuccess}>
          <Alert onClose={closeAlert} severity='success'>
            {message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Contest;
