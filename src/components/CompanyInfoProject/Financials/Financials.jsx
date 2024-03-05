import { AiFillCheckCircle } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import Table from "../Tables/FinancialsTable";
import { useEffect, useState } from "react";
import { useInfoContext } from "@/context/info";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { useRouter } from "next/router";
import TableTT from "@/components/TechnicalScreenComps/TechnicalTrend/TableTT";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DownloadExcel from "../Tables/DownloadExcel";

const Financials = () => {
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
    quarterly: false,
    balanceSheet: false,
    key: true,
    detailedPL: false,
    cashFlow: false,
  });
  const [salesType, setSalesType] = useState("amount");
  const [profitType, setProfitType] = useState("amount");
  const [capitalType, setCapitalType] = useState("amount");
  const [tableData, setTableData] = useState(null);
  const [isCheckedStandalone, setIsCheckedStandalone] = useState(false);
  const [segments, setSegments] = useState(false);
  const [segmentsData, setSegmentsData] = useState(null);
  useEffect(() => {
    globalStandalone
      ? setIsCheckedStandalone(true)
      : setIsCheckedStandalone(false);
  }, [globalStandalone]);

  // Fetch Standalone Table Data Func
  const fetchData = async (url, body) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/${url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          cache: "force-cache",
        }
      );
      const resJson = await res.json();
      setTableData(resJson);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  // Fetch SEGMENT Table Data Func
  const fetchSegment = async (mode) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/gis/segment-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fincode: fincodeLink, mode: mode }),
          cache: "force-cache",
        }
      );
      const resJson = await res.json();
      setSegmentsData(resJson?.key);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Calling Fetch Company Data
  useEffect(() => {
    menu.quarterly && fincodeLink && initData && isCheckedStandalone
      ? fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "QProfitLoss",
          mode: "C",
        })
      : menu.quarterly &&
        fincodeLink &&
        !isCheckedStandalone &&
        initData &&
        fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "QProfitLoss",
          mode: "S",
        });

    menu.balanceSheet && fincodeLink && initData && isCheckedStandalone
      ? fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "BalanceSheet",
          mode: "C",
        })
      : menu.balanceSheet &&
        fincodeLink &&
        !isCheckedStandalone &&
        initData &&
        fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "BalanceSheet",
          mode: "S",
        });

    menu.detailedPL && fincodeLink && isCheckedStandalone && initData
      ? fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "ProfitLoss",
          mode: "C",
        })
      : menu.detailedPL &&
        fincodeLink &&
        !isCheckedStandalone &&
        initData &&
        fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "ProfitLoss",
          mode: "S",
        });

    menu.cashFlow && fincodeLink && initData && isCheckedStandalone
      ? fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "CashFlow",
          mode: "C",
        })
      : menu.cashFlow &&
        fincodeLink &&
        !isCheckedStandalone &&
        initData &&
        fetchData("annual_profitloss", {
          fincode: fincodeLink,
          sector: initData?.sector_type?.value,
          sheet: "CashFlow",
          mode: "S",
        });

    menu.key && fincodeLink && isCheckedStandalone && initData
      ? fetchData("actuals_forwards", {
          fincode: fincodeLink,
          mode: "C",
          sector_type: initData?.sector_type?.value,
        })
      : menu.key &&
        !isCheckedStandalone &&
        fincodeLink &&
        initData &&
        fetchData("actuals_forwards", {
          fincode: fincodeLink,
          mode: "S",
          sector_type: initData?.sector_type?.value,
        });

    segments && fincodeLink && isCheckedStandalone
      ? fetchSegment("C")
      : segments && fincodeLink && !isCheckedStandalone && fetchSegment("S");
  }, [isCheckedStandalone, menu, uid, initData, segments]);

  // Calling Fetch on Company Change
  useEffect(() => {
    setTableData(null);
    setMenu({
      quarterly: false,
      balanceSheet: false,
      key: true,
      detailedPL: false,
      cashFlow: false,
    });
    setSegmentsData(null);
    setSalesType("amount");
    setProfitType("amount");
    setCapitalType("amount");
    setSegments(false);
  }, [fincodeLink]);

  function slideLeft() {
    var slider = document.getElementById("rowId");
    slider.scrollLeft -= 500;
  }
  function slideRight() {
    var slider = document.getElementById("rowId");
    slider.scrollLeft += 500;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md p-2 sm:p-5">
        <div className="flex justify-between flex-wrap items-center">
          <div className="flex items-center gap-1">
            <h1 className="font-semibold text-[28px]">Financials</h1>
            <div
              onClick={() => setSegments(!segments)}
              className="border-2 border-[#093967] text-[#093967] hover:text-[#236fb6] hover:border-[#236fb6] rounded-md px-1 text-sm font-[600] cursor-pointer "
            >
              {segments ? "Close Segments" : "Product Segments"}
            </div>
          </div>
          {/* Standalone/ Consolidated Toggle */}
          <div className="flex justify-end text-sm font-semibold gap-1">
            <span
              onClick={() => {
                isCheckedStandalone && setIsCheckedStandalone(false);
              }}
              className={`${
                !isCheckedStandalone
                  ? "text-[#083966] underline underline-offset-2 "
                  : " text-gray-500 cursor-pointer hover:text-[#2f70ac] italic "
              } `}
            >
              {!isCheckedStandalone ? "Standalone Figures" : "View Standalone"}
            </span>
            <span>/</span>
            <span
              onClick={() => {
                !isCheckedStandalone && setIsCheckedStandalone(true);
              }}
              className={`${
                isCheckedStandalone
                  ? "text-[#083966] underline underline-offset-2"
                  : "text-gray-500 cursor-pointer hover:text-[#2f70ac] italic "
              } `}
            >
              {isCheckedStandalone
                ? "Consolidated Figures"
                : "View Consolidated"}
            </span>
          </div>
        </div>
        {/* Menu Buttons Start*/}
        <div className={`flex justify-center w-full ${segments && "hidden"}`}>
          {/* Left Scroll */}
          <BsFillCaretLeftFill
            className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 md:hidden"
            size={40}
            onClick={slideLeft}
          />
          {/* Menu Buttons */}
          <div
            id="rowId"
            className="flex justify-between w-full gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide"
          >
            <button
              onClick={() => {
                setMenu({
                  quarterly: false,
                  balanceSheet: false,
                  detailedPL: false,
                  cashFlow: false,
                  key: true,
                });
                // setTableData(null);
              }}
              className={`relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.key && "bg-green-200 "
              } flex-1`}
            >
              Key Financials
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.key ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  quarterly: true,
                  balanceSheet: false,
                  detailedPL: false,
                  cashFlow: false,
                  key: false,
                });
                // setTableData(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.quarterly && "bg-green-200 "
              } flex-1`}
            >
              Qtrly P&L
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.quarterly ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  quarterly: false,
                  balanceSheet: false,
                  detailedPL: true,
                  cashFlow: false,
                  key: false,
                });
                // setTableData(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.detailedPL && "bg-green-200 "
              } flex-1`}
            >
              Annual P&L
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.detailedPL ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  quarterly: false,
                  balanceSheet: true,
                  detailedPL: false,
                  cashFlow: false,
                  key: false,
                });
                // setTableData(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.balanceSheet && "bg-green-200 "
              } flex-1`}
            >
              Balance Sheet
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.balanceSheet ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  quarterly: false,
                  balanceSheet: false,
                  detailedPL: false,
                  cashFlow: true,
                  key: false,
                });
                // setTableData(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.cashFlow && "bg-green-200 "
              } flex-1`}
            >
              Cash Flow
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.cashFlow ? "inline-block" : "hidden"
                } `}
              />
            </button>
          </div>
          {/* Right Scroll */}
          <BsFillCaretRightFill
            className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 md:hidden"
            size={40}
            onClick={slideRight}
          />
        </div>
        {/* Menu BUTTON Ends here */}

        {/* MAIN COMPONENT */}
        <div className={`flex flex-col gap-2 ${segments && "hidden"}`}>
          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg">
            {tableData?.column && tableData?.value ? (
              <div className="relative">
                <Table columns={tableData.column} data={tableData.value} />
              </div>
            ) : tableData && !tableData[0] ? (
              <p className="text-gray-500 font-semibold">Data not loaded!</p>
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

        {/* SEGMENT */}
        <div className={`flex flex-col gap-2 ${!segments && "hidden"}`}>
          <div className="w-full">
            {segmentsData && segmentsData?.Sales ? (
              <div className="">
                {/* Sales */}
                <div>
                  {/* Sales Toggle */}
                  <div className="flex items-center justify-between flex-wrap">
                    <h1 className="font-semibold underline underline-offset-2">
                      Sales
                    </h1>
                    <div className="flex items-center text-white text-xs mb-1">
                      <div
                        onClick={() => setSalesType("amount")}
                        className={`cursor-pointer p-1 border border-white rounded-l-md ${
                          salesType == "amount"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        }`}
                      >
                        Amount
                      </div>
                      <div
                        onClick={() => setSalesType("growth")}
                        className={`cursor-pointer p-1 ${
                          salesType == "growth"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        } rounded-r-md`}
                      >
                        Growth %
                      </div>
                      <DownloadExcel
                        data={
                          salesType == "amount"
                            ? segmentsData?.Sales?.sales
                            : salesType == "growth" &&
                              segmentsData?.Sales?.sales_growth
                        }
                        fileName="Sales"
                      />
                    </div>
                  </div>
                  {salesType == "amount" && segmentsData?.Sales?.sales[0] ? (
                    // Sales AMOUNT
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(segmentsData?.Sales?.sales[0]).map(
                            (key, index) => (
                              <th
                                className={`${
                                  index == 0
                                    ? "sticky left-0 z-10 text-left bg-[#093967]"
                                    : "text-right"
                                } whitespace-nowrap p-2`}
                                key={key}
                                style={{ fontWeight: 400 }}
                              >
                                {key}
                              </th>
                            )
                          )}
                        </tr>
                        {segmentsData?.Sales?.sales.map((item, index1) => (
                          <tr
                            key={item.id}
                            className={`even:bg-white odd:bg-[#eaeef5]`}
                          >
                            {Object.values(item).map((val, index) => (
                              <td
                                key={index}
                                className={`${index == 0 && "sticky"} p-2 ${
                                  index == 0
                                    ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                    : "text-right"
                                } ${
                                  index1 % 2 == 0 && index == 0
                                    ? "bg-white"
                                    : index1 % 2 != 0 &&
                                      index == 0 &&
                                      "bg-[#eaeef5]"
                                }
                        `}
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </table>
                    </div>
                  ) : salesType == "growth" &&
                    segmentsData?.Sales?.sales_growth[0] ? (
                    //  Sales GROWTH
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(
                            segmentsData?.Sales?.sales_growth[0]
                          ).map((key, index) => (
                            <th
                              className={`${
                                index == 0
                                  ? "sticky left-0 z-10 text-left bg-[#093967]"
                                  : "text-right"
                              } whitespace-nowrap p-2`}
                              key={key}
                              style={{ fontWeight: 400 }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                        {segmentsData?.Sales?.sales_growth.map(
                          (item, index1) => (
                            <tr
                              key={item.id}
                              className={`even:bg-white odd:bg-[#eaeef5]`}
                            >
                              {Object.values(item).map((val, index) => (
                                <td
                                  key={index}
                                  className={`${index == 0 && "sticky"} p-2 ${
                                    index == 0
                                      ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                      : "text-right"
                                  } ${
                                    index1 % 2 == 0 && index == 0
                                      ? "bg-white"
                                      : index1 % 2 != 0 &&
                                        index == 0 &&
                                        "bg-[#eaeef5]"
                                  }
                        `}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  ) : (
                    <p className="font-semibold text-gray-500">
                      Data not available!
                    </p>
                  )}
                </div>

                {/* Profit before Tax */}
                <div className="mt-4">
                  {/* Profit Toggle */}
                  <div className="flex items-center justify-between flex-wrap">
                    <h1 className="font-semibold underline underline-offset-2">
                      Profit before Tax
                    </h1>
                    <div className="flex items-center justify-end text-white text-xs mb-1 gap-[1px]">
                      <div
                        onClick={() => setProfitType("amount")}
                        className={`cursor-pointer p-1 border border-white rounded-l-md ${
                          profitType == "amount"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        }`}
                      >
                        Amount
                      </div>
                      <div
                        onClick={() => setProfitType("growth")}
                        className={`cursor-pointer p-1 ${
                          profitType == "growth"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        } `}
                      >
                        Growth %
                      </div>

                      <div
                        onClick={() => setProfitType("margin")}
                        className={`cursor-pointer p-1 ${
                          profitType == "margin"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        } rounded-r-md`}
                      >
                        Margin %
                      </div>
                      <DownloadExcel
                        data={
                          profitType == "amount"
                            ? segmentsData?.["Profit Before Tax"]?.profit
                            : profitType == "growth"
                            ? segmentsData?.["Profit Before Tax"]?.profit_growth
                            : profitType == "margin" &&
                              segmentsData?.["Profit Before Tax"]?.profit_margin
                        }
                        fileName="ProfitBeforeTax"
                      />
                    </div>
                  </div>
                  {profitType == "amount" &&
                  segmentsData?.["Profit Before Tax"]?.profit[0] ? (
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(
                            segmentsData?.["Profit Before Tax"]?.profit[0]
                          ).map((key, index) => (
                            <th
                              className={`${
                                index == 0
                                  ? "sticky left-0 z-10 text-left bg-[#093967]"
                                  : "text-right"
                              } whitespace-nowrap p-2`}
                              key={key}
                              style={{ fontWeight: 400 }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                        {segmentsData?.["Profit Before Tax"]?.profit.map(
                          (item, index1) => (
                            <tr
                              key={item.id}
                              className={`even:bg-white odd:bg-[#eaeef5]`}
                            >
                              {Object.values(item).map((val, index) => (
                                <td
                                  key={index}
                                  className={`${index == 0 && "sticky"} p-2 ${
                                    index == 0
                                      ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                      : "text-right"
                                  } ${
                                    index1 % 2 == 0 && index == 0
                                      ? "bg-white"
                                      : index1 % 2 != 0 &&
                                        index == 0 &&
                                        "bg-[#eaeef5]"
                                  }
                        `}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  ) : profitType == "growth" &&
                    segmentsData?.["Profit Before Tax"]?.profit_growth[0] ? (
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(
                            segmentsData?.["Profit Before Tax"]
                              ?.profit_growth[0]
                          ).map((key, index) => (
                            <th
                              className={`${
                                index == 0
                                  ? "sticky left-0 z-10 text-left bg-[#093967]"
                                  : "text-right"
                              } whitespace-nowrap p-2`}
                              key={key}
                              style={{ fontWeight: 400 }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                        {segmentsData?.["Profit Before Tax"]?.profit_growth.map(
                          (item, index1) => (
                            <tr
                              key={item.id}
                              className={`even:bg-white odd:bg-[#eaeef5]`}
                            >
                              {Object.values(item).map((val, index) => (
                                <td
                                  key={index}
                                  className={`${index == 0 && "sticky"} p-2 ${
                                    index == 0
                                      ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                      : "text-right"
                                  } ${
                                    index1 % 2 == 0 && index == 0
                                      ? "bg-white"
                                      : index1 % 2 != 0 &&
                                        index == 0 &&
                                        "bg-[#eaeef5]"
                                  }
                        `}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  ) : profitType == "margin" &&
                    segmentsData?.["Profit Before Tax"]?.profit_margin[0] ? (
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(
                            segmentsData?.["Profit Before Tax"]
                              ?.profit_margin[0]
                          ).map((key, index) => (
                            <th
                              className={`${
                                index == 0
                                  ? "sticky left-0 z-10 text-left bg-[#093967]"
                                  : "text-right"
                              } whitespace-nowrap p-2`}
                              key={key}
                              style={{ fontWeight: 400 }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                        {segmentsData?.["Profit Before Tax"]?.profit_margin.map(
                          (item, index1) => (
                            <tr
                              key={item.id}
                              className={`even:bg-white odd:bg-[#eaeef5]`}
                            >
                              {Object.values(item).map((val, index) => (
                                <td
                                  key={index}
                                  className={`${index == 0 && "sticky"} p-2 ${
                                    index == 0
                                      ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                      : "text-right"
                                  } ${
                                    index1 % 2 == 0 && index == 0
                                      ? "bg-white"
                                      : index1 % 2 != 0 &&
                                        index == 0 &&
                                        "bg-[#eaeef5]"
                                  }
                        `}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  ) : (
                    <p className="font-semibold text-gray-500">
                      Data not available!
                    </p>
                  )}
                </div>

                {/* Capital Employed*/}
                <div className="mt-4">
                  {/* Capital Toggle */}
                  <div className="flex items-center justify-between flex-wrap">
                    <h1 className="font-semibold underline underline-offset-2">
                      Capital Employed
                    </h1>
                    <div className="flex items-center justify-end text-white text-xs mb-1">
                      <div
                        onClick={() => setCapitalType("amount")}
                        className={`cursor-pointer p-1 border border-white rounded-l-md ${
                          capitalType == "amount"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        }`}
                      >
                        Amount
                      </div>
                      <div
                        onClick={() => setCapitalType("growth")}
                        className={`cursor-pointer p-1 ${
                          capitalType == "growth"
                            ? "bg-[#093967]"
                            : "bg-[#808080]"
                        } rounded-r-md`}
                      >
                        ROCE %
                      </div>
                      <DownloadExcel
                        data={
                          capitalType == "amount"
                            ? segmentsData?.["Capital Employed"]?.ce
                            : capitalType == "growth" &&
                              segmentsData?.["Capital Employed"]?.ce_roce
                        }
                        fileName="ProfitBeforeTax"
                      />
                    </div>
                  </div>
                  {capitalType == "amount" &&
                  segmentsData?.["Capital Employed"]?.ce[0] ? (
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(
                            segmentsData?.["Capital Employed"]?.ce[0]
                          ).map((key, index) => (
                            <th
                              className={`${
                                index == 0
                                  ? "sticky left-0 z-10 text-left bg-[#093967]"
                                  : "text-right"
                              } whitespace-nowrap p-2`}
                              key={key}
                              style={{ fontWeight: 400 }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                        {segmentsData?.["Capital Employed"]?.ce.map(
                          (item, index1) => (
                            <tr
                              key={item.id}
                              className={`even:bg-white odd:bg-[#eaeef5]`}
                            >
                              {Object.values(item).map((val, index) => (
                                <td
                                  key={index}
                                  className={`${index == 0 && "sticky"} p-2 ${
                                    index == 0
                                      ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                      : "text-right"
                                  } ${
                                    index1 % 2 == 0 && index == 0
                                      ? "bg-white"
                                      : index1 % 2 != 0 &&
                                        index == 0 &&
                                        "bg-[#eaeef5]"
                                  }
                        `}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  ) : capitalType == "growth" &&
                    segmentsData?.["Capital Employed"]?.ce_roce[0] ? (
                    <div className="rounded-md overflow-x-auto">
                      <table className="text-sm">
                        <tr
                          key={"header"}
                          className={`bg-[#093967] text-white font-bold`}
                        >
                          {Object.keys(
                            segmentsData?.["Capital Employed"]?.ce_roce[0]
                          ).map((key, index) => (
                            <th
                              className={`${
                                index == 0
                                  ? "sticky left-0 z-10 text-left bg-[#093967]"
                                  : "text-right"
                              } whitespace-nowrap p-2`}
                              key={key}
                              style={{ fontWeight: 400 }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                        {segmentsData?.["Capital Employed"]?.ce_roce.map(
                          (item, index1) => (
                            <tr
                              key={item.id}
                              className={`even:bg-white odd:bg-[#eaeef5]`}
                            >
                              {Object.values(item).map((val, index) => (
                                <td
                                  key={index}
                                  className={`${index == 0 && "sticky"} p-2 ${
                                    index == 0
                                      ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                      : "text-right"
                                  } ${
                                    index1 % 2 == 0 && index == 0
                                      ? "bg-white"
                                      : index1 % 2 != 0 &&
                                        index == 0 &&
                                        "bg-[#eaeef5]"
                                  }
                        `}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  ) : (
                    <p className="font-semibold text-gray-500">
                      Data not available!
                    </p>
                  )}
                </div>
              </div>
            ) : segmentsData && !segmentsData?.Sales ? (
              <p className="font-semibold text-gray-500">Data not available!</p>
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

export default Financials;
