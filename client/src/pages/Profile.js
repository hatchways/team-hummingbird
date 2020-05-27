import React, { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import {
  Typography,
  Container,
  Paper,
  makeStyles,
  Grid,
  Button,
  Box,
  AppBar,
  Tabs,
  Tab,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import S3 from "react-s3-uploader";

import ContestCard from "../components/ContestCard";
import { useAuth } from "../components/UserContext";

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Profile(props) {
  const { authTokens, setAuthTokens } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);
  const [myContests, setMyContests] = useState(null);
  const [enteredContests, setEnteredContests] = useState(null);
  const [mySubmissions, setMySubmissions] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("WARNING");
  const [severity, setSeverity] = useState("error"); //allowed: error, warning, success, info

  let location = useLocation();
  const [user, setUser] = useState(authTokens ? authTokens.user : null);

  async function fetchData() {
    console.log(user);
    const resMyContests = await fetch("/api/users/contests?user_id=" + user.id);
    resMyContests
      .json()
      .then((res) => setMyContests(res.contests))
      .catch((err) => console.error(err));

    const resEnteredContests = await fetch(
      "/api/users/submissions?user_id=" + user.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authTokens.token,
        },
      }
    );
    resEnteredContests
      .json()
      .then((res) => {
        setEnteredContests(res.contests);
        setMySubmissions(res.submissions);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (user && !myContests && !enteredContests) fetchData();
  });

  async function handleUpdateProfileImage(url) {
    fetch(`/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
      body: JSON.stringify({
        user_id: user.id,
        url: url,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        handleAlert("Uploaded successfully", "success");
        user.profile_image_url = url;
        setAuthTokens({
          token: authTokens.token,
          user: user,
        });
      })
      .catch((err) => {
        console.log(err);
        handleAlert("Error updating profile image", "error");
      });
  }

  const handleAlert = (message, severity) => {
    setOpenAlert(true);
    setSeverity(severity);
    setAlertMessage(message);
  };

  const classes = useStyles();
  if (authTokens) {
    return (
      <Container className={classes.container} maxWidth='lg'>
        <Grid direction='column' container spacing={3} alignItems='center'>
          <div className={classes.imageCropper}>
            <img
              className={classes.profilePic}
              src={
                user && user.profile_image_url
                  ? user.profile_image_url
                  : "https://i.imgur.com/PoCp1VS.png"
              }
            ></img>
          </div>
          <Typography className={classes.title} variant='h1'>
            {user ? user.name : ""}
          </Typography>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openAlert}
            autoHideDuration={5000}
            onClose={() => setOpenAlert(false)}
          >
            <Alert severity={severity} onClose={() => setOpenAlert(false)}>
              {alertMessage}
            </Alert>
          </Snackbar>
          <div>
            <S3
              accept='image/*'
              multiple={false}
              signingUrl='/s3/sign'
              signingUrlWithCredentials={true}
              className={classes.uploadButton}
              id='s3'
              scrubFilename={(name) =>
                Date.now() + "-" + name.replace(/[^\w\d_\-.]+/gi, "")
              }
              onFinish={(e) => handleUpdateProfileImage(e["uploadUrl"])}
            />
            <label htmlFor='s3'>
              <Button component='span' size='large' className={classes.button}>
                Update Profile Image
              </Button>
            </label>
            <div style={{ marginTop: "0.5rem", marginBottom: "6rem" }}>
              <Typography
                display='block'
                className={classes.instructions}
                variant='caption'
              >
                PNG, JPG
              </Typography>
            </div>
          </div>
        </Grid>
        <AppBar position='static' className={classes.tabBar}>
          <Tabs
            value={currentTab}
            TabIndicatorProps={{
              style: { background: "black", height: "4px" },
            }}
            variant='fullWidth'
            onChange={() =>
              currentTab === 0 ? setCurrentTab(1) : setCurrentTab(0)
            }
            aria-label='user contests'
          >
            <Tab
              label='My Contests'
              {...a11yProps(0)}
              className={classes.tabs}
            />
            <Tab
              label='Entered Contests'
              {...a11yProps(1)}
              className={classes.tabs}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={currentTab} index={0}>
          <Paper className={classes.box} square>
            {myContests
              ? myContests.map((contest) => {
                  return (
                    <ContestCard
                      imageUrl='https://hatchways-hummingbird.s3.amazonaws.com/Assets/612bd8560dbfd2834c5d539bf0a1055d505f48a4.png' //placeholder
                      title={contest.title}
                      description={contest.description}
                      prizeAmount={contest.prize_amount}
                      deadlineDate={new Date(contest.deadline_date)}
                    />
                  );
                })
              : ""}
          </Paper>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Paper className={classes.box} square>
            {enteredContests && mySubmissions
              ? enteredContests.map((contest) => {
                  return (
                    <ContestCard
                      imageUrl={
                        mySubmissions.filter(
                          (s) => s.contest_id === contest._id
                        )[0].upload_files[0]
                      }
                      title={contest.title}
                      description={contest.description}
                      prizeAmount={contest.prize_amount}
                      deadlineDate={new Date(contest.deadline_date)}
                    />
                  );
                })
              : ""}
          </Paper>
        </TabPanel>
      </Container>
    );
  } else {
    return (
      <Redirect to={{ pathname: "/login", state: { referer: location } }} />
    );
  }
}

const useStyles = makeStyles({
  container: {
    marginTop: "80px",
  },
  box: {
    boxShadow:
      "0 0 20px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderWidth: "1px",
    borderColor: "#edf2f7",
    marginTop: "-23px",
    marginLeft: "-23px",
    marginRight: "-23px",
  },
  title: {
    marginTop: "20px",
    marginBottom: "40px",
    fontFamily: "Poppins",
    fontSize: "26px",
    fontWeight: 600,
    textAlign: "center",
  },
  text: {
    fontFamily: "Poppins",
  },
  grid: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  button: {
    // marginBottom: "100px",
    backgroundColor: "white",
    color: "black",
    fontFamily: "Poppins",
    fontWeight: 600,
    padding: "0.8rem 2rem",
    borderRadius: "0",
    border: "1px solid #e2e8f0",
    textTransform: "none",
  },
  imageCropper: {
    width: "150px",
    height: "150px",
    position: "relative",
    overflow: "hidden",
    borderRadius: "50%",
  },
  profilePic: {
    display: "inline",
    margin: "0 auto",
    height: "100%",
    width: "auto",
  },
  tabBar: {
    backgroundColor: "white",
    color: "black",
    boxShadow: "none",
  },
  tabs: {
    fontWeight: 600,
    fontSize: "14px",
  },
  uploadButton: {
    display: "none",
  },
  instructions: {
    color: "gray",
    fontWeight: "lighter",
    textAlign: "center",
  },
});

export default Profile;
