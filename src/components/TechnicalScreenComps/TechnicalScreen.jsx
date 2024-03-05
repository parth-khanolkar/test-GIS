import React, { useEffect, useState } from "react";
import TechnicalTrend from "./TechnicalTrend/TechnicalTrend";
import MovingAverage from "./MovingAverage/MovingAverage";
import Select from "react-select";
import { useInfoContext } from "@/context/info";
import TechnicalAnalysis from "./TechnicalAnalysis/TechnicalAnalysis";

const TechnicalScreen = () => {
  const {
    indicesDrop,
    setIndicesDrop,
    watchlistDrop,
    setWatchlistDrop,
    uid,
    periodTS,
    setPeriodTS,
  } = useInfoContext();

  async function indicesDropdown() {
    const res = await fetch(
      "https://transcriptanalyser.com/market/indecies_list"
    );
    const data = await res.json();
    setIndicesDrop(data);
  }

  async function watchlistDropdown() {
    const res = await fetch(
      `https://transcriptanalyser.com/watchlists/user_watchlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
        }),
      }
    );
    const data = await res.json();
    setWatchlistDrop(data);
  }

  useEffect(() => {
    if (uid !== -1) {
      watchlistDropdown();
    }
    indicesDropdown();
  }, [uid]);
  return (
    <div className="flex flex-col gap-6">
      {/* Technical Analysis */}
      <div className="bg-white p-1 scrollbar-thin border-[#4577A8] border-[1px] rounded-md shadow-md ">
        {/* Filtered Fetch */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-[28px] pb-2 text-[#143b64] font-semibold">
            Technical Trend
          </h1>
          <div className="flex items-center text-white text-xs sm:text-sm">
            <div
              onClick={() => setPeriodTS("1D")}
              className={`cursor-pointer p-1 border border-white rounded-l-md ${
                periodTS == "1D" ? "bg-[#093967]" : "bg-[#808080]"
              }`}
            >
              Daily
            </div>
            <div
              onClick={() => setPeriodTS("1W")}
              className={`cursor-pointer p-1 ${
                periodTS == "1W" ? "bg-[#093967]" : "bg-[#808080]"
              }`}
            >
              Weekly
            </div>
            <div
              onClick={() => setPeriodTS("1M")}
              className={`cursor-pointer  p-1 border border-white rounded-r-md ${
                periodTS == "1M" ? "bg-[#093967]" : "bg-[#808080]"
              }`}
            >
              Monthly
            </div>
          </div>
        </div>
        <div className=" overflow-y-auto scrollbar-thin ">
          <TechnicalTrend />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
        {/* Technical Analysis */}
        <div className="bg-white p-1 rounded-md shadow-md scrollbar-thin flex-[0.5] border-[#4577A8] border-[1px]">
          <h1 className="text-lg sm:text-[28px] pb-2 text-[#143b64] font-semibold">
            Technical Analysis
          </h1>
          <div className=" overflow-y-auto scrollbar-thin lg:max-h-[calc(100vh-195px)] ">
            <TechnicalAnalysis />
          </div>
        </div>
        {/* Moving Average */}
        <div className="bg-white p-1 rounded-md shadow-md scrollbar-thin flex-[0.5] border-[#4577A8] border-[1px] ">
          <h1 className="text-lg sm:text-[28px] pb-2 text-[#143b64] font-semibold">
            Moving Average
          </h1>
          <div className=" overflow-y-auto scrollbar-thin lg:max-h-[calc(100vh-195px)] ">
            <MovingAverage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalScreen;
