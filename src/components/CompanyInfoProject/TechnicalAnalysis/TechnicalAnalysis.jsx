import { AiFillCheckCircle } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import Table from "../Tables/Table";
import { useEffect, useState } from "react";
import DownloadExcel from "../Tables/DownloadExcel";
import DeliveryVolume from "./TechnicalAnalysisComps/DeliveryVolume";
import { useInfoContext } from "@/context/info";
import TechnicalAnalysisCharts from "./TechnicalAnalysisComps/TechnicalAnalysisCharts";

const TechnicalAnalysis = () => {
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
    technical: true,
    delivery: false,
  });

  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [isCheckedStandalone, setIsCheckedStandalone] = useState(true);

  // Fetch Financials Data Func
  const fetchFinancials = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/ api/financials/financials`
      );
      const resJson = await res.json();
      setData(resJson.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch Standalone/Consolodated Table Data Func
  const fetchTableData = async (url) => {
    try {
      const res = await fetch(`http://localhost:3000/api/consensus/${url}`);
      const resJson = await res.json();
      setTableData(resJson.dummyTable);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Calling Fetch Company Data
  useEffect(() => {
    setTimeout(() => {
      fetchFinancials();
    }, "500");
  }, []);

  // Calling Fetch Company Data
  useEffect(() => {
    menu.technical &&
      setTimeout(() => {
        fetchTableData("ConsensusEstimateTrend");
      }, "500");

    // menu.actual &&
    //   setTimeout(() => {
    //     fetchTableData("actual");
    //   }, "500");
  }, [tableData]);

  useEffect(() => {
    (initData?.ta_daily?.value == null &&
      initData?.ta_weekly?.value == null &&
      initData?.ta_month?.value == null) ||
    (initData?.ta_daily?.value == "NA" &&
      initData?.ta_weekly?.value == "NA" &&
      initData?.ta_month?.value == "NA")
      ? setMenu({
          technical: false,
          delivery: true,
        })
      : setMenu({
          technical: true,
          delivery: false,
        });
  }, [initData]);

  return (
    <div className="w-full">
      <div className="flex flex-col  gap-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md p-2 sm:p-5 ">
        <h1 className="font-semibold text-[28px]">Technical Analysis</h1>
        {/* Menu Buttons Start*/}
        <div className="flex justify-center w-full">
          <div className="flex justify-between w-full gap-2 whitespace-nowrap flex-wrap">
            {!(
              (initData?.ta_daily?.value == null &&
                initData?.ta_weekly?.value == null &&
                initData?.ta_month?.value == null) ||
              (initData?.ta_daily?.value == "NA" &&
                initData?.ta_weekly?.value == "NA" &&
                initData?.ta_month?.value == "NA")
            ) && (
              <button
                onClick={() => {
                  setTableData(null);
                  setMenu({
                    technical: true,
                    delivery: false,
                  });
                }}
                className={`col-span-1 relative px-2  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                  menu.technical && "bg-green-200 "
                } flex-1`}
              >
                Technical Analysis
                <AiFillCheckCircle
                  className={`text-green-600 ${
                    menu.technical ? "inline-block" : "hidden"
                  } `}
                />
              </button>
            )}
            <button
              onClick={() => {
                setTableData(null);
                setMenu({
                  technical: false,
                  delivery: true,
                });
              }}
              className={`col-span-1 relative px-2  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.delivery && "bg-green-200 "
              } flex-1`}
            >
              Delivery Volume
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.delivery ? "inline-block" : "hidden"
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
            {
              menu.technical &&
              ((initData?.ta_daily?.value &&
                initData?.ta_weekly?.value &&
                initData?.ta_month?.value) ||
                (initData?.ta_daily?.value != "NA" &&
                  initData?.ta_weekly?.value != "NA" &&
                  initData?.ta_month?.value != "NA")) ? (
                <div className="w-full h-full">
                  <TechnicalAnalysisCharts />
                </div>
              ) : (
                menu.delivery && (
                  <div>
                    <div className="w-full">
                      <DeliveryVolume />
                    </div>
                  </div>
                )
              )
              //  (
              //   // Loading Animation
              //   <div
              //     className={`flex justify-center items-center h-[calc(100vh-200px)]`}
              //   >
              //     <span className="relative flex h-[80px] w-[80px]">
              //       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
              //       <span className="relative inline-flex rounded-full h-3 w-"></span>
              //     </span>
              //   </div>
              // )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
