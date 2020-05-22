import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Poppins"',
    fontSize: 12,
    h1: {
      fontSize: 20,
      fontWeight: 600,
    }
  },
  palette: {
    primary: { main: "#DF1B1B" }
  }
});
