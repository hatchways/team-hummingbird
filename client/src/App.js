import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import Header from "./components/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path="/" component={Header} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
