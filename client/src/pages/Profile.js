import React, { useState, useEffect } from "react";
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
  Tab
 } from '@material-ui/core';

 import {
  useLocation
} from "react-router-dom";

import ContestCard from '../components/ContestCard';

const useStyles = makeStyles({
  container: {
    marginTop: "80px"
  },
  box: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderWidth: "1px",
    borderColor: "#edf2f7",
    marginTop: "-23px",
    marginLeft: "-23px",
    marginRight: "-23px"
  },
  title: {
    marginTop: "20px",
    marginBottom: "40px",
    fontFamily: 'Poppins',
    fontSize: "26px",
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
    marginBottom: "100px",
    backgroundColor: "white",
    color: "black",
    fontFamily: 'Poppins',
    fontWeight: 600,
    padding: "0.8rem 2rem",
    borderRadius: "0",
    border: "1px solid #e2e8f0",
    textTransform: "none"
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
    fontSize: "14px"
  }
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
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
  const [currentTab, setCurrentTab] = useState(0);
  const [myContests, setMyContests] = useState(null);
  const [enteredContests, setEnteredContests] = useState(null);
  let location = useLocation();
  const user = location.state ? location.state.user : null;

  async function fetchData() {
    const resMyContests = await fetch("/api/users/contests?user_id=" + user.id);
    resMyContests
      .json()
      .then(res => setMyContests(res.contests))
      .catch(err => console.error(err));

    const resEnteredContests = await fetch("/api/users/submissions?user_id=" + user.id, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "x-auth-token": user.token
      }
    });
    resEnteredContests
      .json()
      .then(res => setEnteredContests(res.contests))
      .catch(err => console.error(err));
  }
  
  useEffect(() => {
    if (user && !myContests && !enteredContests) fetchData();
  });

  function handleEditProfileClick() {

  }

  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="lg">
      <Grid direction="column" container spacing={3} alignItems="center">
        <div className={classes.imageCropper}>
          <img 
            className={classes.profilePic}
            src={user ? user.profile_image_url : ''}
          ></img>
        </div>
        <Typography className={classes.title} variant="h1">
          {user ? user.name : ''}
        </Typography>
        <Button
          size="large" 
          className={classes.button}
          onClick={handleEditProfileClick}
          >
          Edit Profile
        </Button>
      </Grid>
      <AppBar position="static" className={classes.tabBar}>
        <Tabs 
          value={currentTab} 
          TabIndicatorProps={{style: {background:'black', height: '4px'}}}
          variant="fullWidth"
          onChange={() => currentTab === 0 ? setCurrentTab(1) : setCurrentTab(0)} 
          aria-label="user contests"
        >
          <Tab label="My Contests" {...a11yProps(0)} className={classes.tabs} />
          <Tab label="Entered Contests" {...a11yProps(1)} className={classes.tabs}/>
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <Paper className={classes.box} square>
          {
            myContests ? 
            myContests.map(contest => {
              return (
                <ContestCard 
                  imageUrl="https://hatchways-hummingbird.s3.amazonaws.com/Assets/612bd8560dbfd2834c5d539bf0a1055d505f48a4.png" //placeholder
                  title={contest.title}
                  description={contest.description}
                  prizeAmount={contest.prize_amount}
                  deadlineDate={new Date(contest.deadline_date)}
                />
              )
            })
            :
            ''
          }
        </Paper>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Paper className={classes.box} square>
        {
            enteredContests ? 
            enteredContests.map(contest => {
              return (
                <ContestCard 
                  imageUrl="https://hatchways-hummingbird.s3.amazonaws.com/Assets/612bd8560dbfd2834c5d539bf0a1055d505f48a4.png" //placeholder
                  title={contest.title}
                  description={contest.description}
                  prizeAmount={contest.prize_amount}
                  deadlineDate={new Date(contest.deadline_date)}
                />
              )
            })
            :
            ''
          }
        </Paper>
      </TabPanel>
    </Container>
  );
}

export default Profile;
