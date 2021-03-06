import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { theme, createEmotionCache } from "styles";
import { MobileGate, Navbar } from "components";
import { AuthProvider } from "@lib/firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: Props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>dev rings</title>
        </Head>
        <AuthProvider>
          <Navbar />
          <MobileGate>
            <Component {...pageProps} />
          </MobileGate>
          <ToastContainer position="top-center" hideProgressBar />
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
