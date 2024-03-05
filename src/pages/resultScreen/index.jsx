"use client";

import React from "react";
import MarketTrends from "@/components/Result Screen/MarketTrends";
import QuarterlyResults from "@/components/Result Screen/QuarterlyResults";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";

const ResultScreenPage = () => {
  return (
    <>
      <div
        className={`h-[calc(100vh-80px)] bg-white  overflow-y-auto scrollbar-none lg:scrollbar px-2`}
      >
        <div className="p-2 border shadow-md mt-2 rounded-md">
          <QuarterlyResults />
        </div>
        <div className="p-2 border shadow-md mt-5 mb-2 rounded-md">
          <MarketTrends />
        </div>

        <footer className="-mx-2 mt-2">
          <MobileFooter />
        </footer>
      </div>
    </>
  );
};

export default ResultScreenPage;
