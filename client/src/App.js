import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";

import Header from "./components/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contest from "./pages/Contest";
import Profile from "./pages/Profile";
import Submission from "./pages/SubmitSubmission";
import Settings from './pages/Settings'
import ContestSubmissions from './pages/ContestSubmissions'

import { AuthContext } from "./components/UserContext";

import "./App.css";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <BrowserRouter>
          <Route path='/' component={Header} />
          <Route exact path='/' render={(props) => <Redirect to='/login' />} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profile} />
          <Route path='/contest' component={Contest} />
          <Route path='/submission' component={Submission} />
          <Route path='/settings' component={Settings} />
          <Route path='/contestsubmissions' component={ContestSubmissions} />
        </BrowserRouter>
      </AuthContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
