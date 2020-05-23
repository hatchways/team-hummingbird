import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Poppins"',
    fontSize: 12,
    color: "red",
    h1: {
      fontSize: 20,
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      color: "grey",
    },
  },
  palette: {
    primary: { main: "#DF1B1B", error: "red" },
  },
});
