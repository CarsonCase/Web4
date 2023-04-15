import CssBaseline from "@mui/material/CssBaseline";
import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { SnackbarProvider } from "notistack";
import React, { useReducer } from "react";
import { useRoutes } from "react-router-dom";
import { GlobalAppContext } from "../src/store/global-app-context";
import { routes } from "./routes";
import { initialState, reducer } from "./store/reducer";

export default function App() {
  const routing = useRoutes(routes);
  const [state, dispatch] = useReducer(reducer, initialState);

  const theme: any = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: state.isDarkMode ? "dark" : "light",
          primary: {
            main: "#fd7565",
          },
          secondary: {
            main: "#19857b",
          },
          error: {
            main: red.A400,
          },
        },
      }),
    [state.isDarkMode]
  );

  return (
    <GlobalAppContext.Provider value={{ state, dispatch }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <ThirdwebProvider activeChain="ethereum" autoConnect>
            {routing}
          </ThirdwebProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </GlobalAppContext.Provider>
  );
}
