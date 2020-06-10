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
import numeral from "numeral";
import { useAuth } from "../components/UserContext";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

export default function Stats(props) {
  const { authTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  const date = new Date();

  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [myContests, setMyContests] = useState(null);
  const [enteredContests, setEnteredContests] = useState(null);
  const [mySubmissions, setMySubmissions] = useState(null);
  const [moneyReceived, setMoneyReceived] = useState(null);
  const [moneySent, setMoneySent] = useState(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [dataYTDReceived, setDataYTDReceived] = useState({
    labels: [],
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
        data: monthlyEarnings,
      },
    ],
  });
  const [monthlySpendings, setMonthlySpendings] = useState([]);
  const [dataYTDSent, setDataYTDSent] = useState({
    labels: [],
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
        data: monthlyEarnings,
      },
    ],
  });
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthLabels = [];
  for (let i = 0; i <= date.getMonth(); i++) {
    if (dataYTDReceived.labels.length <= i)
      dataYTDReceived.labels.push(months[i]);
    if (monthlyEarnings.length <= i) monthlyEarnings.push(0);
    if (dataYTDSent.labels.length <= i) dataYTDSent.labels.push(months[i]);
    if (monthlySpendings.length <= i) monthlySpendings.push(0);
  }

  const handleClickOpen = (submissionId) => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  async function fetchData() {
    let tempDataYTDReceived = {
      labels: [],
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
          data: monthlyEarnings,
        },
      ],
    };

    let tempDataYTDSent = {
      labels: [],
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
          data: monthlySpendings,
        },
      ],
    };

    const resMyContests = await fetch("/api/users/contests?user_id=" + user.id);
    resMyContests
      .json()
      .then((res) => {
        setMyContests(res.contests);
        console.log(res.contests);
      })
      .catch((err) => console.error(err));

    const resEnteredContests = await fetch("/api/users/submissions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
    });
    resEnteredContests
      .json()
      .then((res) => {
        console.log(res);
        setEnteredContests(res.contests);
        setMySubmissions(res.submissions);
      })
      .catch((err) => console.error(err));

    const resTransactions = await fetch("/api/users/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authTokens.token,
      },
    });
    resTransactions
      .json()
      .then((res) => {
        console.log(res);
        setMoneyReceived(res.moneyReceived);
        setMoneySent(res.moneySent);
        res.moneyReceived.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          monthlyEarnings[transactionDate.getMonth()] += transaction.amount;
        });
        tempDataYTDReceived.datasets[0].data = monthlyEarnings;
        setDataYTDReceived(tempDataYTDReceived);

        res.moneySent.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          monthlySpendings[transactionDate.getMonth()] += transaction.amount;
        });
        tempDataYTDSent.datasets[0].data = monthlySpendings;
        setDataYTDSent(tempDataYTDSent);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (user && !myContests && !enteredContests && !moneyReceived) fetchData();
  });

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
                  {mySubmissions ? mySubmissions.length : 0}
                  <br />
                  {mySubmissions && mySubmissions.length === 1
                    ? "submission"
                    : "submissions"}
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={1}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {mySubmissions
                    ? mySubmissions.filter((submission) => submission.winner)
                        .length
                    : 0}
                  <br />
                  chosen
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={2}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {mySubmissions
                    ? mySubmissions.filter((submission) => submission.active)
                        .length
                    : 0}
                  <br />
                  active
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={3}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {user.earnings_total
                    ? `${numeral(user.earnings_total).format("$0,0")}`
                    : "$0"}
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
            Earnings in {date.getFullYear()}
          </Typography>
          <Line data={dataYTDReceived} />
        </Paper>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={activeTab} index={1}>
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
                  {myContests ? myContests.length : 0}
                  <br />
                  {myContests && myContests.length === 1
                    ? "contest"
                    : "contests"}
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={1}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {myContests
                    ? myContests.filter(
                        (contest) => new Date(contest.deadline_date) < date
                      ).length
                    : 0}
                  <br />
                  completed
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={2}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {myContests
                    ? myContests.filter(
                        (contest) => new Date(contest.deadline_date) > date
                      ).length
                    : 0}
                  <br />
                  in progress
                </Typography>
              </div>
            </GridListTile>
            <GridListTile
              className={isMobile ? classes.tileRootMobile : classes.tileRoot}
              key={3}
              cols={1}
            >
              <div className={isMobile ? classes.tileMobile : classes.tile}>
                <Typography
                  className={classes.tileText}
                  bottomGutter
                  variant="h1"
                >
                  {moneySent && moneySent.length === 1
                    ? `${numeral(moneySent[0].amount).format("$0,0")}`
                    : moneySent && moneySent.length > 1
                    ? `${numeral(
                        moneySent.reduce((a, b) => a.amount + b.amount)
                      ).format("$0,0")}`
                    : "$0"}
                  <br />
                  paid
                </Typography>
              </div>
            </GridListTile>
          </GridList>
          <Typography
            style={{ marginTop: 60, marginBottom: 20 }}
            bottomGutter
            variant="h1"
          >
            Spendings in {date.getFullYear()}
          </Typography>
          <Line data={dataYTDSent} />
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
