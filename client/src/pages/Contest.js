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
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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

  title: {
    margin: "30px 0px 7px 0px",
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
    width: 525,
    height: 280,
    overflow: "auto",
    padding: "0px 15px 0px 5px",
    margin: "15px 0px 15px 0px!important",
    /* width */
    "&::-webkit-scrollbar": {
      width: "4px",
    },

    /* Track */
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },

    /* Handle */
    "&::-webkit-scrollbar-thumb": {
      background: "#555",
    },

    /* Handle on hover */
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#000",
    },
  },
  button: {
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "black",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "0",
    padding: "15px",
    "&:hover": {
      background: "green",
      cursor: "pointer",
    },
  },
  imageTile: {
    "&:hover": {
      cursor: "pointer",
    },
    "&.selected": {
      filter: "brightness(50%)",
    },
  },
  checked: {
    fontSize: "30px",
    display: "none",
    color: "white",
    "&.selected": {
      display: "block",
      zIndex: 10,
      position: "absolute",
      top: "40%",
      left: "40%",

      "&:hover": {
        cursor: "pointer",
      },
    },
  },
});
const Contest = () => {
  const currentDate = new Date();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prize, setPrize] = useState();
  const [deadlineDate, setDeadlineDate] = useState(
    new Date(currentDate.setDate(currentDate.getDate() + 1))
  );
  const [deadlineTime, setDeadlineTime] = useState(currentDate);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [message, setMessage] = useState("");
  const classes = styles();
  const imageGridList = [
    { id: 1, imageURL: "https://i.imgur.com/HFJL0eq.png" },
    { id: 2, imageURL: "https://i.imgur.com/Nf8SsCu.png" },
    { id: 3, imageURL: "https://i.imgur.com/GiwnXsg.png" },
    { id: 4, imageURL: "https://i.imgur.com/ihBkO9i.png" },
    { id: 5, imageURL: "https://i.imgur.com/mFs0fVv.png" },
    { id: 6, imageURL: "https://i.imgur.com/YJYmGtD.png" },
    { id: 7, imageURL: "https://i.imgur.com/AtGXbpx.png" },
    { id: 8, imageURL: "https://i.imgur.com/hxhWXk9.png" },
    { id: 9, imageURL: "https://i.imgur.com/02iEupb.png" },
    { id: 10, imageURL: "https://i.imgur.com/u6v65NG.png" },
    { id: 11, imageURL: "https://i.imgur.com/C4atyQX.png" },
    { id: 12, imageURL: "https://i.imgur.com/Gh4Nrxo.png" },
  ];

  const selectDesign = (e, image) => {
    let selectedImage = document.getElementById(image.id);
    let selectedMark = document.getElementById(image.id + "done");
    console.log(selectedImage.classList);
    if (selectedImage.classList.contains("selected")) {
      console.log("remove selected");
      selectedImage.classList.remove("selected");
      selectedMark.classList.remove("selected");
    } else {
      console.log("add selected");
      selectedImage.classList.add("selected");
      selectedMark.classList.add("selected");
    }
  };
  const handleSubmit = (e) => {
    if (!(title && description && prize && deadlineDate && deadlineTime)) {
      setOpenAlert(true);
      setSeverity("error");
      setMessage("Please enter all required fields");
    } else {
      const deadlineDateToSubmit = new Date();
      let status;
      deadlineDateToSubmit.setDate(deadlineDate.getDate());
      deadlineDateToSubmit.setMonth(deadlineDate.getMonth());
      deadlineDateToSubmit.setFullYear(deadlineDate.getFullYear());
      deadlineDateToSubmit.setHours(deadlineTime.getHours());
      deadlineDateToSubmit.setMinutes(deadlineTime.getMinutes());

      if (deadlineDateToSubmit < new Date()) {
        setMessage("Deadline Date must be in future");
        setSeverity("error");
        setOpenAlert(true);
      } else {
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
            status = res.status;
            return res.json();
          })
          .then((json) => {
            console.log(json);
            status < 400 ? setSeverity("success") : setSeverity("error");
            setOpenAlert(true);
            setMessage(json.message);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const closeAlert = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  return (
    <Container maxWidth='lg'>
      <Typography variant='h1' className={classes.title} align='center'>
        Create new contest
      </Typography>
      <Paper elevation={3} className={classes.box}>
        <br />

        <Box width='60%' margin='auto'>
          <Typography className={classes.title} variant='subtitle1'>
            What do you need designed?*
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
            Description*
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
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Typography className={classes.title} variant='subtitle1'>
                Prize amount*
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
              <Typography
                className={classes.title}
                variant='subtitle1'
                align='center'
              >
                Deadline*
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <KeyboardDatePicker
                      style={{ border: "1px" }}
                      disableToolbar
                      format='MM/dd/yyyy'
                      margin='normal'
                      required
                      id='contest-deadline-date'
                      placeholder='mm/dd/yyyy'
                      disablePast
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
            <Typography variant='subtitle2'>
              Let's start by helping your designers understand which styles you
              prefer
            </Typography>
          </Typography>

          <Box border={1} borderColor='grey.300' className={classes.designBox}>
            <GridList
              cellHeight={140}
              className={classes.gridList}
              cols={4}
              spacing={10}
            >
              {imageGridList.map((image) => (
                <GridListTile key={image.id} cols={1}>
                  <CheckCircleOutlineIcon
                    className={classes.checked}
                    id={image.id + "done"}
                    onClick={(e) => selectDesign(e, image)}
                  />
                  <img
                    src={image.imageURL}
                    alt={image.id}
                    id={image.id}
                    className={classes.imageTile}
                    onClick={(e) => selectDesign(e, image)}
                  ></img>
                </GridListTile>
              ))}
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
        <Snackbar autoHideDuration={5000} open={openAlert} onClose={closeAlert}>
          <Alert onClose={closeAlert} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Contest;
