import React from "react";

import Head from "next/head";

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Head>
        <title>Bidder</title>
        <meta name="description" content="Bidder app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </React.Fragment>
  );
}
