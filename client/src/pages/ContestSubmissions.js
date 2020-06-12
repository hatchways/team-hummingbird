import React, { useState, useEffect } from "react";

import {
  Typography,
  Container,
  Box,
  Grid,
  GridList,
  GridListTile,
  makeStyles,
  Avatar,
  Button,
  Tab,
  Tabs,
  useMediaQuery,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { useAuth } from "../components/UserContext";
import { Link } from "react-router-dom";

export default function ContestSubmissions(props) {
  const { authTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  const date = new Date();

  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [submissions, setSubmissions] = useState(imageGridList);
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const contestId = props.match.params.id;
  const [contestInfo, setContestInfo] = useState({
    creation_date: "",
    deadline_date: "",
    description: "",
    prize_amount: 0,
    title: "",
    user_id: "",
    _id: contestId,
  });
  const [contestOwner, setContestOwner] = useState(null);
  const [chosenSubmission, setChosenSubmission] = useState({});
  const [contestWinner, setContestWinner] = useState(null);

  const handleClickOpen = (submissionId) => {
    setOpenDialog(true);
    setChosenSubmission(
      submissions.filter((submission) => submission._id === submissionId)[0]
    );
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    console.log(user);
    const getInfo = async () => {
      const contestInfo = await fetch(`/api/contest/${contestId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authTokens.token,
        },
      });
      let jsonContestInfo = await contestInfo.json();
      console.log(jsonContestInfo);
      setContestInfo(jsonContestInfo.contest);
      setSubmissions(jsonContestInfo.submissions);
      setContestOwner(jsonContestInfo.owner);
      setContestWinner(
        jsonContestInfo.submissions.filter((submission) => submission.winner)[0]
      );
    };
    getInfo();
  }, [user]);

  const handleChooseWinner = (submission) => {
    fetch(`/api/contest/${contestId}/submission/${submission._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
      body: JSON.stringify({
        winner: true,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        //   handleAlert("Uploaded successfully", "success");
        console.log(json.message);
        handleClose();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        //   handleAlert("Error updating profile image", "error");
      });
  };

  return (
    <Container>
      <Box size="large" className={classes.breadcrumbWrapper}>
        <Link to="/profile">
          <Typography variant="caption" className={classes.breadcrumb}>
            Back to profile
          </Typography>
        </Link>
      </Box>

      <Grid container>
        <Grid container direction="column" item sm={8} justifyContent="center">
          <div className={classes.titleWrapper}>
            <Typography variant="h4">
              {contestInfo ? contestInfo.title : ""}
            </Typography>
            <span className={classes.price}>
              ${contestInfo ? contestInfo.prize_amount : ""}
            </span>
          </div>
          <Grid item container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                alt="user profile image"
                src={
                  contestOwner
                    ? contestOwner.profile_image_url
                    : "https://hatchways-hummingbird.s3.amazonaws.com/1590245137718image-2.png"
                }
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">
                Created by{" "}
                {contestInfo && user.id == contestInfo.user_id
                  ? "you"
                  : contestOwner
                    ? contestOwner.name
                    : "Placeholder Paul"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={4} justify="center">
          <Link
            style={{ textDecoration: "none" }}
            to={
              date > new Date(contestInfo.deadline_date)
                ? `#`
                : `/submit/${contestId}`
            }
          >
            <Button
              size="large"
              className={
                date > new Date(contestInfo.deadline_date)
                  ? classes.submitButtonEnded
                  : classes.submitButton
              }
              variant="outlined"
            >
              {date > new Date(contestInfo.deadline_date)
                ? "Ended"
                : "Submit a Design"}
            </Button>
          </Link>
        </Grid>
      </Grid>
      {contestWinner ? (
        <Typography
          style={{ marginTop: 30, marginBottom: 60, fontSize: 16 }}
          variant="h3"
        >
          Winner: <b>@{contestWinner.user_name}</b>
        </Typography>
      ) : (
          ""
        )}
      <Tabs
        variant="fullWidth"
        value={activeTab}
        onChange={(e, index) => setActiveTab(index)}
        className={classes.tabs}
      >
        <Tab label="DESIGNS" />
        <Tab label="DETAILS" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={activeTab} index={0}>
        <Paper style={{ minHeight: "300px", padding: "3rem" }}>
          <GridList
            cellHeight={isMobile ? 300 : 180}
            className={classes.gridList}
            cols={isMobile ? 1 : 4}
            spacing={2}
          >
            {submissions
              ? submissions.map((submission, index) => (
                <GridListTile key={index} cols={1}>
                  <a
                    href="#"
                    style={{
                      margin: "5px",
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${
                        submission.upload_files[0]["url"] ||
                        submission.upload_files[0]
                        })`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      display: "flex",
                      justifyContent: "center",
                      "&:hover": {
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                    onClick={() =>
                      user.id === contestInfo.user_id && !contestWinner
                        ? handleClickOpen(submission._id)
                        : null
                    }
                  >
                    <div
                      style={{
                        margin: "5px",
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${submission.upload_files[0]})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        style={{
                          color: "white",
                          alignSelf: "flex-end",
                          marginBottom: "0.5rem",
                          fontWeight: "bold",
                          textShadow: "0px 0px 3px black",
                        }}
                        to="/messages"
                      >
                        <Typography
                          style={{
                            color: "white",
                            alignSelf: "flex-end",
                            marginBottom: "0.5rem",
                            fontWeight: "bold",
                            textShadow: "0px 0px 3px black",
                          }}
                        >
                          by @
                            <span style={{ textDecoration: "underline" }}>
                            {submission.user_name
                              ? submission.user_name
                              : "artist"}
                          </span>
                        </Typography>
                      </Link>
                      {/* <IconButton
                      aria-label={`info about ${submission.title}`}
                      style={{ color: "green", float: "right" }}
                    >
                      <CheckCircle />
                    </IconButton> */}
                    </div>
                  </a>
                </GridListTile>
              ))
              : ""}
          </GridList>
        </Paper>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={activeTab} index={1}>
        <Paper style={{ minHeight: "300px", padding: "3rem" }}>
          <Typography bottomGutter variant="h1">
            Description
          </Typography>
          <Typography variant="body1">
            {contestInfo ? contestInfo.description : ""}
          </Typography>
        </Paper>
      </TabPanel>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Choose @{chosenSubmission.user_name || "artist"} as winner and send
          payment?
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleChooseWinner(chosenSubmission)}>
            Confirm & Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} id={`vertical-tab-panel-${index}`} {...other}>
      {value === index && <Box width="100%">{children}</Box>}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  breadcrumbWrapper: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  breadcrumb: {
    color: "gray",
    textDecoration: "underline",
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  price: {
    backgroundColor: "black",
    color: "white",
    padding: "6px",
    fontSize: "10px",
    fontWeight: "bold",
    marginLeft: "0.5rem",
  },
  submitButton: {
    borderRadius: 0,
    borderColor: "black",
    maxHeight: 50,
  },
  submitButtonEnded: {
    borderRadius: 0,
    borderColor: "black",
    backgroundColor: "black",
    color: "white",
    fontWeight: 600,
    maxHeight: 50,
  },
  winnerButton: {
    borderRadius: 0,
    borderColor: "green",
    backgroundColor: "green",
    color: "white",
    fontWeight: 600,
    maxHeight: 50,
    marginTop: 10,
  },
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "#252525",
    },
  },
}));

//placeholder
const imageGridList = [
  {
    active: true,
    contest_id: "",
    creation_date: "",
    upload_files: ["https://via.placeholder.com/180"],
    user_id: "",
    user_name: "",
  },
];
