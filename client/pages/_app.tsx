import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import React, { useReducer } from "react";
import createEmotionCache from "../src/createEmotionCache";
import { GlobalAppContext } from "../src/store/global-app-context";
import { initialState, reducer } from "../src/store/reducer";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  // Create a theme instance.
  const theme: any = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: state.isDarkMode ? "dark" : "light",
          primary: {
            main: "#556cd6",
          },
          secondary: {
            main: "#19857b",
          },
          error: {
            main: red.A400,
          },
        },
        typography: {
          fontFamily: roboto.style.fontFamily,
        },
      }),
    [state.isDarkMode]
  );
  return (
    <GlobalAppContext.Provider value={{ state, dispatch }}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
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
              <Component {...pageProps} />
            </ThirdwebProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </GlobalAppContext.Provider>
  );
}
