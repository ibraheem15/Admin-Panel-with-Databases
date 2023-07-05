import React from "react";
import { ReduxProvider } from "../redux/provider";
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}
