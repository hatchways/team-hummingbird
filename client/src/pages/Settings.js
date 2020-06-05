import React, { useState } from "react";
import AddCard from "../components/AddCard";
import {
  Tab,
  Tabs,
  Box,
  makeStyles,
  Container,
  useMediaQuery,
  Typography,
} from "@material-ui/core";
import { useAuth } from "../components/UserContext";
import { Link } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} id={`vertical-tab-panel-${index}`} {...other}>
      {value === index && <div p={3}>{children}</div>}
    </div>
  );
}

export default function Settings(props) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const { authTokens, setAuthTokens } = useAuth();
  const [user, setUser] = useState(authTokens ? authTokens.user : null);
  const classes = useStyles();
  const [value, setValue] = useState(0); //defaults to payment details for
  return (
    <Container className={classes.root}>
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="scrollable"
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        className={classes.tabs}
      >
        <Tab label="Profile" />
        <Tab label="Modify Payment" />
        <Tab label="Notifications" />
        <Tab label="Password" />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <Container>
          <Typography style={{ marginBottom: 20 }} variant="h3">
            Profile
          </Typography>
          <div className={classes.profileInfoWrapper}>
            <div className={classes.profileInfoRow}>
              <Typography className={classes.profileText} variant="body1">
                <b>Name:</b>&nbsp;&nbsp;&nbsp;{user?.name}
              </Typography>
            </div>
            <div className={classes.profileInfoRow}>
              <Typography className={classes.profileText} variant="body1">
                <b>Email:</b>&nbsp;&nbsp;&nbsp;{user?.email}
              </Typography>
            </div>
            <div className={classes.profileInfoRow}>
              <Typography className={classes.profileText} variant="body1">
                <b>Payment Info:</b>&nbsp;&nbsp;&nbsp;
                {user.hasPaymentInfo
                  ? `${user?.payment?.cardType?.toUpperCase()} ending in ${
                      user?.payment?.last4
                    }`
                  : "No payment method on file."}
              </Typography>
            </div>
          </div>
        </Container>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <AddCard />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={2}></TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={3}></TabPanel>
      <Box size="large" className={classes.breadcrumbWrapper}>
        <Link to="/profile">
          <Typography variant="caption" className={classes.breadcrumb}>
            Back to profile
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%",
    width: "100%",
    marginTop: 40,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginTop: 0,
    },
  },
  breadcrumbWrapper: {
    position: "absolute",
    left: "2rem",
    bottom: "2rem",
  },
  breadcrumb: {
    color: "gray",
    textDecoration: "underline",
  },
  tabPanel: {
    // display: "flex",
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
  },
  profileInfoWrapper: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    minWidth: "300px",
  },
  profileInfoRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  profileText: {
    fontSize: 16,
  },
  tabs: {
    "& .Mui-selected .MuiTab-wrapper": {
      fontWeight: "bold",
      color: "black",
    },
    "& .MuiTab-wrapper": {
      alignItems: "flex-start",
      color: "gray",
      [theme.breakpoints.up("sm")]: {
        marginLeft: "1.5rem",
      },
    },
    "& .MuiTabs-indicator": {
      left: 0,
      backgroundColor: "#252525",
      width: "1px",
      [theme.breakpoints.up("sm")]: {
        transform: "rotate(90deg)",
      },
    },
    minWidth: "200px",
  },
}));
