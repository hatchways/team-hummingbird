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
import { Line } from "react-chartjs-2";

export default function Stats(props) {
  const { authTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  const date = new Date();

  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [submissions, setSubmissions] = useState(imageGridList);
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Earnings (USD)",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "black",
        borderColor: "black",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "black",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "black",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const handleClickOpen = (submissionId) => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // useEffect(() => {
  //   console.log(user);
  //   const getInfo = async () => {
  //     const contestInfo = await fetch(`/api/contest/${contestId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-auth-token": authTokens.token,
  //       },
  //     });
  //     let jsonContestInfo = await contestInfo.json();
  //     console.log(jsonContestInfo);
  //     setContestInfo(jsonContestInfo.contest);
  //     setSubmissions(jsonContestInfo.submissions);
  //     setContestOwner(jsonContestInfo.owner);
  //     setContestWinner(
  //       jsonContestInfo.submissions.filter((submission) => submission.winner)[0]
  //     );
  //   };
  //   getInfo();
  // }, [user]);

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
            <Typography variant="h4">Your Stats</Typography>
          </div>
        </Grid>
      </Grid>
      <Tabs
        variant="fullWidth"
        value={activeTab}
        onChange={(e, index) => setActiveTab(index)}
        className={classes.tabs}
      >
        <Tab label="SUBMISSIONS" />
        <Tab label="HOSTED CONTESTS" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={activeTab} index={0}>
        <Paper style={{ minHeight: "300px", padding: "3rem" }}>
          <Typography style={{ marginBottom: 20 }} bottomGutter variant="h1">
            Quick Totals
          </Typography>
          <GridList
            cellHeight={isMobile ? 300 : 90}
            className={classes.gridList}
            cols={isMobile ? 1 : 4}
            spacing={2}
          >
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={0}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  3<br />
                  submissions
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={0}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  1<br />
                  chosen
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={0}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  2<br />
                  in progress
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={0}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {user.earnings_total ? `$${user.earnings_total}` : "$0"}
                  <br />
                  earned
                </Typography>
              </div>
            </GridListTile>
          </GridList>
          <Typography
            style={{ marginTop: 60, marginBottom: 20 }}
            bottomGutter
            variant="h1"
          >
            Earnings in {new Date().getFullYear()}
          </Typography>
          <Line data={data} />
        </Paper>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={activeTab} index={1}>
        <Paper style={{ minHeight: "300px", padding: "3rem" }}>
          <Typography style={{ marginBottom: 20 }} bottomGutter variant="h1">
            Quick Totals
          </Typography>
        </Paper>
      </TabPanel>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Choose @ as winner and send payment?
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => null}>Confirm & Pay</Button>
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
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "#252525",
    },
  },
  tileRoot: {
    // marginBottom: -120,
  },
  tileRootMobile: {
    marginBottom: -180,
  },
  tile: {
    margin: "5px",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  tileMobile: {
    margin: "5px",
    width: "100%",
    height: "30%",
    backgroundColor: "black",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  tileText: {
    color: "white",
    marginTop: 10,
    fontSize: 28,
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
