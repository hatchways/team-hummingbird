import React from "react";
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

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path='/' component={Header} />
        <Route exact path='/' render={(props) => <Redirect to='/register' />} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/profile' component={Profile} />
        <Route path='/contest' component={Contest} />
        <Route path='/submission' component={Submission} />
        <Route path='/settings' component={Settings} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
