"use client";

import Footer from "@/components/Footer";
import FundamentalScreen from "@/components/FundamentalScreen/FundamentalScreen";
import GraphSectorUpgrade from "@/components/FundamentalScreen/GraphSectorUpgrade";
import MobileFooter from "@/components/MobileFooter";
import React, { useState } from "react";

const FundamentalScreenPage = () => {
  return (
    <>
      <div
        className={`h-[calc(100vh-80px)] bg-white  overflow-y-auto scrollbar-none lg:scrollbar px-2`}
      >
        <div className="p-2 border shadow-md mt-2 rounded-md">
          <FundamentalScreen />
        </div>
        <div className="p-2 border shadow-md mt-5 mb-2 rounded-md">
          <GraphSectorUpgrade />
        </div>

        <footer className="-mx-2">
          <MobileFooter />
        </footer>
      </div>
    </>
  );
};

export default FundamentalScreenPage;
