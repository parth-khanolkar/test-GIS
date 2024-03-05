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

export default function App({ Component, pageProps }) {
  // require("dotenv").config();
  var clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  useEffect(() => {
    Modal.setAppElement("#__next"); // Set the appElement to "#__next" on the client-side
  }, []);
  return (
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
  );
}
