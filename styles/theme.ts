import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
export const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#D655AD", // "#D6556C",
    },
    success: {
      main: "#55D67E",
    },
    error: {
      main: red.A400,
    },
  },
});
