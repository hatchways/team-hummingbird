import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import socketIoClient from "socket.io-client";

import { theme } from "./themes/theme";

import Header from "./components/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contest from "./pages/Contest";
import Profile from "./pages/Profile";
import Submission from "./pages/SubmitSubmission";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ContestSubmissions from "./pages/ContestSubmissions";

import { AuthContext, NotificationContext } from "./components/UserContext";

import "./App.css";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [userNotifications, setUserNotifications] = useState({
    openNotification: false,
  });
  const ENDPOINT = "/";
  let socketNotify;

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  useEffect(() => {
    socketNotify = socketIoClient(ENDPOINT);
    if (authTokens) {
      socketNotify.emit("login", authTokens.user);
    }
    socketNotify.on("send-user-notifications", (fetchNotification) => {
      //set this in notification context
      let newList = [];
      let oldList = [];
      fetchNotification.notifications.map((notification) => {
        if (!notification.read_status) {
          newList.push(notification);
        } else {
          oldList.push(notification);
        }
      });
      setUserNotifications({
        ...userNotifications,
        ...fetchNotification,
        newList: newList.sort((a, b) => a.time > b.time),
        oldList: oldList.sort((a, b) => a.time > b.time),
      });
    });
    return () => {
      socketNotify.emit("disconnect");
      socketNotify.off();
      socketNotify.close();
    };
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <NotificationContext.Provider
          value={{ userNotifications, setUserNotifications }}
        >
          <BrowserRouter>
            <Route path='/' component={Header} />
            <Route
              exact
              path='/'
              render={(props) => <Redirect to='/login' />}
            />
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/profile' component={Profile} />
            <Route path='/contest' component={Contest} />
            <Route path='/submission' component={Submission} />
            <Route
              path='/messages'
              component={Messages}
              socketNotify={socketNotify}
            />
            <Route exact path='/contest/:id' component={ContestSubmissions} />
            <Route path='/submit/:id' component={Submission} />
            <Route path='/settings' component={Settings} />
          </BrowserRouter>
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
