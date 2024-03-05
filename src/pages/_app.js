import { EarningsContextProvider } from "@/context/Context";
import "@/styles/globals.css";
import Modal from "react-modal";
import React, { useEffect } from "react";
// import AppBar from "@/components/UserAuth/AppBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthGaurd from "@/components/UserAuth/AuthGuard";
import Layout from "@/components/layout";

import { InfoContextProvider } from "@/context/info";
import { WatchlistContextProvider } from "@/context/WatchlistContext";
import { BulkBlockContextProvider } from "@/context/BulkBlockContext";
// import 'dotenv';

import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";
import { CustomScreenerContextProvider } from "@/context/CustomScreenerContext";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  // require("dotenv").config();
  var clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  useEffect(() => {
    Modal.setAppElement("#__next"); // Set the appElement to "#__next" on the client-side
  }, []);
  return (<>
    <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>GoIndiaStocks - Unbiased & Balanced</title>
        <meta name="description" content="GoIndiaStocks - Unbiased & Balanced" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-152x152.png"
            sizes="152x152"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-192x192.png"
            sizes="192x192"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-144x144.png"
            sizes="144x144"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GoIndiaStocks - Unbiased & Balanced" />
        <meta property="og:description" content="" />
        <meta property="og:site_name" content="GoIndiaStocks - Unbiased & Balanced" />
        <meta property="og:url" content="https://www.goindiastocks.com/" />
        {/* <meta property="og:image" content="/icons/og.png" /> */}
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-72x72.png"
            sizes="72x72"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-96x96.png"
            sizes="96x96"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-128x128.png"
            sizes="128x128"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-144x144.png"
            sizes="144x144"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-152x152.png"
            sizes="152x152"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-192x192.png"
            sizes="192x192"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-384x384.png"
            sizes="384x384"
        />
        <link
            rel="apple-touch-startup-image"
            href="images/icons/icon-512x512.png"
            sizes="512x512"
        />

    </Head>

    <InfoContextProvider>
      <WatchlistContextProvider>
        <BulkBlockContextProvider>
          <CustomScreenerContextProvider>
            <GoogleOAuthProvider clientId={clientId}>
              <EarningsContextProvider>
                <Layout>
                  {Component?.requireAuth ? (
                    <AuthGaurd>
                      {/* <AppBar /> */}
                      <Component {...pageProps} />
                    </AuthGaurd>
                  ) : (
                    <>
                      {/* <AppBar /> */}
                      <Component {...pageProps} />
                    </>
                  )}
                  <ProgressBar
                    height="2px"
                    color="#D82F44"
                    options={{ showSpinner: false }}
                    shallowRouting
                  />
                </Layout>
              </EarningsContextProvider>
            </GoogleOAuthProvider>
          </CustomScreenerContextProvider>
        </BulkBlockContextProvider>
      </WatchlistContextProvider>
    </InfoContextProvider>
  </>
  );
}
