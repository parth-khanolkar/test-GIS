"use client";

import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import Forward from "@/components/Valuation Page/Forward";
import Trailing from "@/components/Valuation Page/Trailing";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const ValuationPage = () => {
  const router = useRouter();
  const { fincodeLink } = router.query;

  const [mode, setMode] = useState("");
  const [sector, setSector] = useState("");

  const [isTrailingActive, setIsTrailingActive] = useState(true);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [graphData, setGraphData] = useState([]);
  const [data, setData] = useState({});

  const getValuationData = async (modeParam) => {
    setIsLoading(true);
    setIsDataAvailable(true);
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/gis/valuation-chart`,
        {
          fincode: fincodeLink,
          mode: modeParam ? modeParam : "",
        }
      );

      setMode(response.data?.mode);
      setSector(response.data?.sector);
      if (Object.keys(response.data?.key).length === 0) {
        setIsDataAvailable(false);
      } else {
        setMode(response.data?.mode);
        setSector(response.data?.sector);
        const { graph, ...dataWithoutGraph } = response.data?.key;
        setGraphData(graph);
        setData(dataWithoutGraph);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Error in getValuationData: ", error);
    }
  };

  useEffect(() => {
    if (fincodeLink) {
      getValuationData();
    }
  }, [fincodeLink]);

  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-white  overflow-y-auto scrollbar-none lg:scrollbar px-2">
        <div className="md:mx-2 p-2 pb-8 border shadow-md mt-2 rounded-md">
          <div className="flex justify-between">
            <div className="flex flex-row space-x-3">
              <button
                className={`px-3 md:px-10 py-1 border border-black text-xs md:text-base flex items-center justify-center rounded-md
                            ${isTrailingActive && "bg-green-200"}

                        `}
                onClick={() => {
                  setIsTrailingActive(true);
                }}
              >
                {"Trailing"}
                <AiFillCheckCircle
                  className={`text-green-600 ${
                    isTrailingActive ? "inline-block" : "hidden"
                  } `}
                />
              </button>
              <button
                className={`px-3 md:px-10 py-1.5 border border-black text-xs md:text-base flex items-center justify-center rounded-md
                            ${!isTrailingActive && "bg-green-200"}

                        `}
                onClick={() => {
                  setIsTrailingActive(false);
                }}
              >
                {"Forward"}
                <AiFillCheckCircle
                  className={`text-green-600 ${
                    !isTrailingActive ? "inline-block" : "hidden"
                  } `}
                />
              </button>
            </div>
            <div className="flex items-center justify-end mt-2">
              <div className="flex justify-end text-sm font-semibold gap-1">
                <button
                  disabled={mode === "" ? true : false}
                  onClick={() => {
                    setMode("S");
                    getValuationData("S");
                  }}
                  className={` text-[10px] md:text-base
                                ${
                                  mode === "S"
                                    ? "text-[#083966] underline underline-offset-2"
                                    : " text-gray-500 cursor-pointer hover:text-[#2f70ac] italic"
                                } `}
                >
                  {"Standalone"}
                </button>
                <span className="text-[10px] md:text-base">/</span>
                <button
                  disabled={mode === "" ? true : false}
                  onClick={() => {
                    setMode("C");
                    getValuationData("C");
                  }}
                  className={` text-[10px] md:text-base
                                ${
                                  mode === "C"
                                    ? "text-[#083966] underline underline-offset-2"
                                    : "text-gray-500 cursor-pointer hover:text-[#2f70ac] italic"
                                } `}
                >
                  {"Consolidated"}
                </button>
              </div>
            </div>
          </div>
          {isDataAvailable ? (
            <>
              {isTrailingActive ? (
                <Trailing
                  mode={mode}
                  graph={graphData}
                  data={data}
                  sector={sector}
                  isLoading={isLoading}
                />
              ) : (
                <Forward
                  mode={mode}
                  graph={graphData}
                  data={data}
                  sector={sector}
                  isLoading={isLoading}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center font-bold text-2xl h-[40vh]">
              {"No data available."}
            </div>
          )}
        </div>

        <footer className="-mx-2 mt-2">
          <MobileFooter />
        </footer>
      </div>
    </>
  );
};

export default ValuationPage;
