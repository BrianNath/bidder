import React from "react";

import Head from "next/head";
import TopBar from "@/components/TopBar";
import Breadcrumb from "@/components/Breadcrumb";

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Head>
        <title>Bidder</title>
        <meta name="description" content="Bidder app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <div className="w-7/12 m-auto mt-4">
        <Breadcrumb />
      </div>
      <main className="w-full lg:w-9/12 m-auto mt-4 lg:px-0 px-4">{children}</main>
    </React.Fragment>
  );
}
