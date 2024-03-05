import { AiFillCheckCircle } from "react-icons/ai";
import { BiDownload, BiSearchAlt } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import Table from "../Tables/Table";
import { useEffect, useState } from "react";
import DownloadExcel from "../Tables/DownloadExcel";
import AnalystsLineChart from "./ConsensusComponents/AnalystsLineChart";
import AnalystsBarChart from "./ConsensusComponents/AnalystsBarChart";
import ConsensusEstimateTrend from "./ConsensusComponents/ConsensusEstimateTrend";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useInfoContext } from "@/context/info";
import { useRouter } from "next/router";

const Consensus = () => {
  const router = useRouter();
  const { fincodeLink } = router.query;
  const {
    fincode,
    setFincode,
    initData,
    setInitData,
    consoleStatus,
    setConsoleStatus,
    globalStandalone,
    setGlobalStandalone,
    uid,
    setUid,
  } = useInfoContext();
  const [menu, setMenu] = useState({
    consensus: true,
    actual: false,
  });

  const [tableData, setTableData] = useState(null);
  const [isCheckedStandalone, setIsCheckedStandalone] = useState(false);

  const [fileName, setFileName] = useState("ConsensusEstimateTrend");

  // Fetch Standalone/Consolodated Table Data Func
  const fetchTableData = async (url, body) => {
    try {
      const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const resJson = await res.json();
      setTableData(resJson);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Calling Fetch Company Data
  useEffect(() => {
    setTableData(null);
    menu.consensus &&
      fincodeLink &&
      fetchTableData(
        "https://transcriptanalyser.com/goindiastock/consensus_estimate",
        {
          symbol: initData?.Symbol?.value,
          estimate: "",
          mode: "C",
          year: "",
        }
      );

    menu.analysts &&
      fincodeLink &&
      fetchTableData(
        "https://transcriptanalyser.com/goindiastock/analyst_recomendation",
        {
          fincode: fincodeLink,
        }
      );
  }, [isCheckedStandalone, menu, fincodeLink, initData]);

  useEffect(() => {
    globalStandalone
      ? setIsCheckedStandalone(true)
      : setIsCheckedStandalone(false);
  }, [globalStandalone]);

  useEffect(() => {
    setMenu({
      consensus: true,
      actual: false,
    });
  }, [fincodeLink]);

  return (
    <div className="w-full">
      <div className="flex flex-col  gap-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md p-2 sm:p-5">
        <div className="flex justify-between items-center flex-wrap pb-2">
          <h1 className="font-semibold text-[28px]">Consensus</h1>
          {/* Standalone/ Consolidated Toggle */}
          <div
            className={` justify-end text-sm font-semibold gap-1 ${
              menu.actual ? "flex" : "hidden"
            }`}
          >
            <span
              onClick={() => {
                isCheckedStandalone &&
                  (setIsCheckedStandalone(false), setTableData(null));
              }}
              className={`${
                !isCheckedStandalone
                  ? "cursor-pointer text-[#083966]  italic"
                  : "text-black underline underline-offset-2 cursor-pointer hover:text-[#2f70ac]"
              } `}
            >
              {!isCheckedStandalone ? "Standalone Figures" : "View Standalone"}
            </span>
            <span>/</span>
            <span
              onClick={() => {
                !isCheckedStandalone &&
                  (setIsCheckedStandalone(true), setTableData(null));
              }}
              className={`${
                isCheckedStandalone
                  ? "cursor-pointer text-[#083966]  italic"
                  : "text-black underline underline-offset-2 cursor-pointer hover:text-[#2f70ac]"
              } `}
            >
              {isCheckedStandalone
                ? "Consolidated Figures"
                : "View Consolidated"}
            </span>
          </div>
        </div>
        {/* Menu Buttons Start*/}
        <div className="flex justify-center w-full">
          <div className="flex  justify-between w-full gap-2 whitespace-nowrap flex-wrap">
            <button
              onClick={() => {
                setTableData(null);
                setMenu({
                  consensus: true,
                  actual: false,
                  analysts: false,
                });
                setFileName("ConsensusEstimateTrend");
              }}
              className={`col-span-1 relative  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.consensus && "bg-green-200 "
              } flex-1`}
            >
              Consensus Estimate Trend
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.consensus ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setTableData(null);
                setMenu({
                  consensus: false,
                  actual: false,
                  analysts: true,
                });
                setFileName("AnalystsRecommendation");
              }}
              className={`col-span-1 relative px-2  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.analysts && "bg-green-200 "
              } flex-1`}
            >
              Broker View
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.analysts ? "inline-block" : "hidden"
                } `}
              />
            </button>
          </div>
        </div>
        {/* Menu BUTTON Ends here */}

        {/* MAIN COMPONENT */}
        <div className="flex flex-col gap-2">
          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg">
            {menu.consensus ? (
              <>
                <ConsensusEstimateTrend />
              </>
            ) : tableData && menu.analysts ? (
              <div>
                {/* <div>
                  <BiDownload
                    onClick={() => handleDownload("BrokerView")}
                    className="flex items-center gap-2 text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm"
                    size={30}
                  />
                </div> */}
                <div
                  id="brokerViewChart"
                  className="md:flex gap-4 py-1 justify-center items-center w-full overflow-x-auto h-full"
                >
                  <div className="flex-1">
                    <AnalystsLineChart data={tableData.coverage} />
                  </div>
                  <div className="flex-1">
                    <AnalystsBarChart data={tableData.pricetarget} />
                  </div>
                </div>
              </div>
            ) : (
              // Loading Animation
              <div
                className={`flex justify-center items-center h-[calc(100vh-200px)]`}
              >
                <span className="relative flex h-[80px] w-[80px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consensus;
