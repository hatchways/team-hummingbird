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
  useMediaQuery,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DateFnsUtils from "@date-io/date-fns";
import { useAuth } from "../components/UserContext";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Redirect } from "react-router-dom";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props}></MuiAlert>;
}
function Notice(props) {
  return <MuiAlert severity="error" {...props}></MuiAlert>;
}

const Contest = (props) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const { authTokens, setAuthTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  const currentDate = new Date();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prize, setPrize] = useState("");
  const [deadlineDate, setDeadlineDate] = useState(
    new Date(currentDate.setDate(currentDate.getDate() + 1))
  );
  const [deadlineTime, setDeadlineTime] = useState(currentDate);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [message, setMessage] = useState("");
  const classes = styles();

  const selectDesign = (e) => {
    let selectedImage = e.target;
    selectedImage.classList.contains("selected")
      ? selectedImage.classList.remove("selected")
      : selectedImage.classList.add("selected");
  };
  const handleSubmit = (e) => {
    if (!user.hasPayment) return;
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
            "x-auth-token": authTokens.token,
          },
          body: JSON.stringify({
            title,
            description,
            prize_amount: prize,
            deadline_date: deadlineDateToSubmit,
            user_id: user.id,
          }),
        })
          .then((res) => {
            status = res.status;
            return res.json();
          })
          .then((json) => {
            status < 400 ? setSeverity("success") : setSeverity("error");
            setOpenAlert(true);
            setMessage(json.message);

            setTimeout(() => {
              props.history.push("/profile");
            }, 1000);
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
    <Container maxWidth="lg">
      <Typography variant="h3" className={classes.title} align="center">
        New Contest
      </Typography>
      <Paper elevation={3} className={classes.box}>
        <br />

        <Box width={isMobile ? "90%" : "60%"} margin="auto">
          {!user.hasPayment ? (
            <Notice>
              Please <a href="/settings">add a payment method</a> in order to
              create a contest.
            </Notice>
          ) : null}
          <Typography className={classes.title} variant="subtitle1">
            What do you need designed?
          </Typography>

          <TextField
            id="contest-title"
            type="text"
            className={classes.textField}
            label="Write a descriptive contest title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box width={isMobile ? "90%" : "60%"} margin="auto">
          <Typography className={classes.title} variant="subtitle1">
            Description
          </Typography>

          <TextField
            id="contest-description"
            label="Describe your ideal tattoo"
            className={classes.textField}
            type="text"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Box width={isMobile ? "90%" : "60%"} margin="auto" display="flex">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography className={classes.title} variant="subtitle1">
                Prize amount*
              </Typography>

              <TextField
                id="contest-prize"
                type="number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                required
                placeholder={"100.00"}
                value={prize}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPrize(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography
                className={classes.title}
                variant="subtitle1"
                align="center"
                style={{ marginBottom: 0 }}
              >
                Deadline*
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  container
                  spacing={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Grid item xs={8} md={6}>
                    <KeyboardDatePicker
                      label="Due Date"
                      style={{ border: "1px" }}
                      disableToolbar
                      format="MM/dd/yyyy"
                      margin="normal"
                      required
                      id="contest-deadline-date"
                      placeholder="mm/dd/yyyy"
                      disablePast
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                  <Grid item xs={8} md={6}>
                    <KeyboardTimePicker
                      margin="normal"
                      label="End Time"
                      id="contest-deadline-time"
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
        <Box width={isMobile ? "90%" : "60%"} margin="auto">
          <Typography className={classes.title} variant="subtitle1">
            Which designs do you like?
            <br />
            <Typography variant="subtitle2">
              Let's start by helping your designers understand which styles you
              prefer
            </Typography>
          </Typography>

          <Box border={1} borderColor="grey.300" className={classes.designBox}>
            <GridList
              cellHeight={140}
              className={classes.gridList}
              cols={isMobile ? 1 : 3}
              spacing={10}
            >
              {imageGridList.map((image) => (
                <GridListTile key={image.id} cols={1} onClick={selectDesign}>
                  <CheckCircleOutlineIcon className={classes.checked} />
                  <img
                    src={image.imageURL}
                    alt={image.id}
                    className={classes.imageTile}
                  ></img>
                </GridListTile>
              ))}
            </GridList>
          </Box>
        </Box>

        <Grid container justify="center" className={classes.grid}>
          <Button
            size="large"
            type="submit"
            className={
              user.hasPayment ? classes.button : classes.buttonDisabled
            }
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

//Custom Style
const styles = makeStyles((theme) => ({
  box: {
    width: "80%",
    margin: "auto",
    marginTop: "30px",
    marginBottom: "30px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
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
      background: "gray",
      cursor: "pointer",
    },
  },
  buttonDisabled: {
    marginTop: "60px",
    marginBottom: "60px",
    cursor: "not-allowed",
    backgroundColor: "lightgray",
    color: "white",
    fontFamily: "Poppins",
    fontWeight: 600,
    borderRadius: "0",
    padding: "15px",
    "&:hover": {
      background: "lightgray",
    },
  },
  imageTile: {
    zIndex: 10,
    "&:hover": {
      cursor: "pointer",
    },
    "&.selected": {
      filter: "brightness(50%)",
      opacity: 0.7,
      zIndex: 1,
    },
  },
  checked: {
    fontSize: "30px",
    display: "block",
    color: "white",
    position: "absolute",
    top: "40%",
    left: "40%",
    zIndex: 10,
    pointerEvents: "none",
  },
}));

const imageGridList = [
  {
    id: 1,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/0de773f98a983912282d4a303e355329d5f592da.png",
  },
  {
    id: 2,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/6de131e306e4c3bb3e6696bd5fb3dc6f4dd1b885.png",
  },
  {
    id: 3,
    imageURL:
      "https://i.imgur.com/GiwnXsg.pnghttps://hatchways-hummingbird.s3.amazonaws.com/Assets/48bbc97ff2ad97160445538959a224e642ce5816.png",
  },
  {
    id: 4,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/612bd8560dbfd2834c5d539bf0a1055d505f48a4.png",
  },
  {
    id: 5,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/78824b24b626ad2ae8ae89c416b1b0826e46df3f.png",
  },
  {
    id: 6,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/553140e71d46dfd29da17bae491c57cffac51bd0.png",
  },
  {
    id: 7,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/767456347c13c8dd9e192ed52faaf6090c6d931c.png",
  },
  {
    id: 8,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/a9650901bb4fda628c17afb20236b129aba92220.png",
  },
  {
    id: 9,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/c91c45b97085fa64186472d903c1d1ef475d14d1.png",
  },
  {
    id: 10,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/dbb30a013fe6fea52a607300c14b486ded6fa859.png",
  },
  {
    id: 11,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/e32a7389eec971770e40497ee28d8c458a042fa4.png",
  },
  {
    id: 12,
    imageURL:
      "https://hatchways-hummingbird.s3.amazonaws.com/Assets/fb61d9c7dd33978f7274b8c47c42562a3d759e58.png",
  },
];
