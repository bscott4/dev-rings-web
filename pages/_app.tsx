import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Navbar } from "components";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
