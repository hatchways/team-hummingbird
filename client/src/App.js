import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Submission from './pages/Submit-Submission'
import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        {/* <Route path="/" component={LandingPage} /> */}
        <Route path="/submission" component={Submission} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
