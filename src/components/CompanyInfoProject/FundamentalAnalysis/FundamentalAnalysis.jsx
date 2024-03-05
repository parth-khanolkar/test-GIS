/* eslint-disable @next/next/no-img-element */
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiFillCheckCircle,
  AiOutlineBarChart,
  AiOutlineCaretLeft,
  AiOutlineDownload,
} from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import ShareholdingTable from "../Tables/ShareholdingTable";
import { useEffect, useRef, useState } from "react";
import DuPoint from "./FundamentalAnalysisComponents/DuPoint";
import TSR from "./FundamentalAnalysisComponents/TSR";
import CashFlowChart from "./FundamentalAnalysisComponents/CashFlowChart";
import logo from "../../../assetsCompanyInfo/logo.png";
import Image from "next/image";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { useInfoContext } from "@/context/info";
import Select from "react-select";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import Table from "../Tables/Table";
import { useRouter } from "next/router";

// import html2pdf from "html2pdf.js";
const FundamentalAnalysis = () => {
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

  const router = useRouter();
  const { fincodeLink } = router.query;

  const [menu, setMenu] = useState({
    working: true,
    du: false,
    ratio: false,
    total: false,
    cash: false,
  });

  const watermarkImageRef = useRef(null);

  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [isCheckedStandalone, setIsCheckedStandalone] = useState(false);
  const [fileName, setFileName] = useState("WorkingCapital");
  const [period, setPeriod] = useState(null);
  const [ratioMenu, setRatioMenu] = useState(null);

  // Fetch Standalone/Consolodated Table Data Func
  const fetchTableData = async (url, body) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/${url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(body),
        }
      );
      const resJson = await res.json();
      setTableData(resJson);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  // Calling Fetch Company Data
  useEffect(() => {
    setTableData(null);
    menu.working && fincodeLink && isCheckedStandalone
      ? fetchTableData("working_capital_ana", {
          fincode: fincodeLink,
          mode: "C",
          divval: 100,
        })
      : menu.working &&
        !isCheckedStandalone &&
        fincodeLink &&
        fetchTableData("working_capital_ana", {
          fincode: fincodeLink,
          mode: "S",
          divval: 100,
        });

    menu.du && fincodeLink && isCheckedStandalone
      ? fetchTableData("du_point_chart", {
          fincode: fincodeLink,
          sector: initData?.Sector?.value,
          mode: "C",
        })
      : menu.du &&
        !isCheckedStandalone &&
        fincodeLink &&
        fetchTableData("du_point_chart", {
          fincode: fincodeLink,
          sector: initData?.Sector?.value,
          mode: "S",
        });

    menu.ratio && fincodeLink && isCheckedStandalone
      ? fetchTableData("new_ratios", {
          fincode: fincodeLink,
          mode: "C",
          sec_type: initData?.sector_type?.value,
        })
      : menu.ratio &&
        !isCheckedStandalone &&
        fincodeLink &&
        fetchTableData("new_ratios", {
          fincode: fincodeLink,
          mode: "S",
          sec_type: initData?.sector_type?.value,
        });

    menu.total && fincodeLink && isCheckedStandalone
      ? fetchTableData("total_shareholder_return", {
          fincode: fincodeLink,
          mode: "C",
          exchange: "BSE",
          startdate: "08/30/2022",
          enddate: "08/30/2023",
        })
      : menu.total &&
        !isCheckedStandalone &&
        fincodeLink &&
        fetchTableData("total_shareholder_return", {
          fincode: fincodeLink,
          mode: "S",
          exchange: "BSE",
          startdate: "08/30/2022",
          enddate: "08/30/2023",
        });

    menu.cash && isCheckedStandalone && fincodeLink && period == null
      ? fetchTableData("cash_flow_waterfall", {
          fincode: fincodeLink,
          mode: "C",
          period: "",
          divval: 10,
        })
      : menu.cash &&
        !isCheckedStandalone &&
        period == null &&
        fincodeLink &&
        fetchTableData("cash_flow_waterfall", {
          fincode: fincodeLink,
          mode: "S",
          period: "",
          divval: 10,
        });
    menu.cash && isCheckedStandalone && fincodeLink && period != null
      ? fetchTableData("cash_flow_waterfall", {
          fincode: fincodeLink,
          mode: "C",
          period: period,
          divval: 10,
        })
      : menu.cash &&
        !isCheckedStandalone &&
        period != null &&
        fincodeLink &&
        fetchTableData("cash_flow_waterfall", {
          fincode: fincodeLink,
          mode: "S",
          period: period,
          divval: 10,
        });
  }, [isCheckedStandalone, menu, period, fincodeLink, initData]);

  useEffect(() => {
    globalStandalone
      ? setIsCheckedStandalone(true)
      : setIsCheckedStandalone(false);
  }, [globalStandalone]);

  // Download Chart
  const handleDownload = async (id, name) => {
    htmlToImage
      .toPng(document.getElementById(id), { quality: 1 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name.jpeg";
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(name);
      });
  };

  function slideLeft() {
    var slider = document.getElementById("FunId");
    slider.scrollLeft -= 500;
  }
  function slideRight() {
    var slider = document.getElementById("FunId");
    slider.scrollLeft += 500;
  }

  useEffect(() => {
    initData?.Sector?.value == "Bank"
      ? setMenu({
          working: false,
          du: true,
          ratio: false,
          total: false,
          cash: false,
        })
      : setMenu({
          working: true,
          du: false,
          ratio: false,
          total: false,
          cash: false,
        });
  }, [initData]);

  useEffect(() => {
    menu.ratio && tableData && setRatioMenu(tableData?.sheets[0]);
    menu.ratio && tableData && console.log(tableData?.data?.[ratioMenu]?.value);
  }, [menu, tableData]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md p-2 sm:p-5 ">
        <div className="flex justify-between items-center flex-wrap">
          <h1 className="font-semibold text-[28px] pb-2">
            Fundamental Analysis
          </h1>
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
        <div className="flex justify-between w-full relative items-center pb-2">
          {/* Left Scroll */}
          <BsFillCaretLeftFill
            className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 lg:hidden"
            size={40}
            onClick={slideLeft}
          />
          {/* Menu Buttons */}
          <div
            id="FunId"
            className="flex justify-between w-full gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide"
          >
            <button
              onClick={() => {
                setMenu({
                  working: true,
                  du: false,
                  ratio: false,
                  total: false,
                  cash: false,
                });
                setFileName("WorkingCapital");
                setTableData(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4  ${
                menu.working && "bg-green-200"
              } flex-1 ${initData?.Sector?.value == "Bank" && "hidden"}`}
            >
              Working Capital
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.working ? "inline-block" : "hidden"
                }`}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  working: false,
                  du: true,
                  ratio: false,
                  total: false,
                  cash: false,
                });
                setFileName("DuPont");
                setTableData(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4  ${
                menu.du && "bg-green-200"
              } flex-1`}
            >
              Du Pont
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.du ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setTableData(null);
                setMenu({
                  working: false,
                  du: false,
                  ratio: true,
                  total: false,
                  cash: false,
                });
                setFileName("RatioAnalysis");
                setRatioMenu(null);
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4  ${
                menu.ratio && "bg-green-200"
              } flex-1`}
            >
              Ratios
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.ratio ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  working: false,
                  du: false,
                  ratio: false,
                  total: true,
                  cash: false,
                });
                setTableData(null);
                setFileName("TSR");
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.total && "bg-green-200"
              } flex-1`}
            >
              Return Analysis
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.total ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  working: false,
                  du: false,
                  ratio: false,
                  total: false,
                  cash: true,
                });
                setTableData(null);
                setFileName("CashFlowWaterfall");
              }}
              className={`col-span-1 relative px-2 md:px-8 py-2 border-2 border-black text-semibold rounded-lg flex justify-center items-center gap-4 ${
                menu.cash && "bg-green-200 "
              } flex-1 ${initData?.Sector?.value == "Bank" && "hidden"}`}
            >
              CashFlow Trend
              <AiFillCheckCircle
                className={`text-green-600  ${
                  menu.cash ? "inline-block" : "hidden"
                } `}
              />
            </button>
          </div>
          {/* Right Scroll */}
          <BsFillCaretRightFill
            className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 lg:hidden"
            size={40}
            onClick={slideRight}
          />
        </div>

        {/* RATIO MENU */}
        <div
          className={`flex gap-2 text-sm whitespace-nowrap overflow-x-auto scrollbar-thin ${
            !menu.ratio && "hidden"
          }`}
        >
          {tableData?.sheets?.map((item, index) => (
            <button
              key={index}
              onClick={() => setRatioMenu(item)}
              className={`${
                ratioMenu == item &&
                "bg-[#0d2844] border-t-4 border-red-600 rounded-md text-white"
              } px-2 lg:px-5 py-1`}
            >
              {item}
            </button>
          ))}
        </div>
        {/* MAIN COMPONENT */}
        <div className="flex flex-col gap-2">
          {/* Table */}
          {tableData &&
          (tableData?.column ||
            tableData?.data?.[ratioMenu]?.column ||
            tableData?.chart ||
            tableData?.Data) &&
          (menu.working || menu.ratio) ? (
            <div className="w-full overflow-x-auto rounded-lg">
              <div className="relative">
                {tableData && menu.working ? (
                  <Table columns={tableData.column} data={tableData.values} />
                ) : (
                  tableData &&
                  menu.ratio &&
                  ratioMenu && (
                    <ShareholdingTable
                      columns={tableData?.data?.[ratioMenu]?.column}
                      data={tableData?.data?.[ratioMenu]?.value}
                    />
                    // <div>Hello</div>
                  )
                )}
              </div>
            </div>
          ) : menu.du ? (
            <div>
              {/* <DuPontTree /> */}
              {isCheckedStandalone ? (
                <DuPoint mode={"C"} />
              ) : (
                <DuPoint mode={"S"} />
              )}
            </div>
          ) : tableData && !tableData?.detail && menu.total ? (
            <div className="w-full overflow-x-auto rounded-lg">
              <div>
                <div
                  className="md:flex flex-wrap gap-4 justify-center items-center w-full overflow-x-auto h-full"
                  // style={{ width: "100%" }}
                >
                  <div className="w-full flex-1">
                    <TSR data={tableData.chart} />
                  </div>
                  <div id="table" className="overflow-x-auto flex-1">
                    <Table columns={tableData.column} data={tableData.values} />
                  </div>
                </div>
              </div>
            </div>
          ) : tableData && menu.cash ? (
            <div className="w-full overflow-x-auto rounded-lg">
              <div>
                {/* Search */}
                <div className="flex gap-2 items-center bg-white flex-wrap px-1 flex-[0.5]">
                  {/* <input type="text" onChange={(e) => setSearch(e.target.value)} /> */}

                  <Select
                    // ref={selectCompRef}
                    className="text-[#0d2843] font-semibold text-sm absolute z-50 flex-1 max-w-[230px] min-w-[230px]"
                    options={tableData?.PeriodFilter}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    placeholder="Select Period..."
                    onChange={(values) => {
                      values ? setPeriod(values?.value) : setPeriod(null);
                    }}
                    // onInputChange={(value) => setSearch(value)}
                    // onChange={(values) => setSearch(values)}
                    // isOptionDisabled={(option) => option.isdisabled}
                    maxMenuHeight="160px"
                    defaultValue={{
                      label: tableData?.SelectedFilter,
                      value: tableData?.SelectedFilter,
                    }}
                  />
                </div>

                <div className="flex gap-4 flex-wrap justify-center items-center">
                  <CashFlowChart data={tableData.Data} />
                </div>
              </div>
            </div>
          ) : tableData && !tableData[0] ? (
            <p className="text-gray-500 font-semibold">Data not loaded!</p>
          ) : tableData && (!tableData[0] || tableData?.detail) ? (
            <div>Data not Loaded!</div>
          ) : (
            // Loading Animation
            <div className="w-full overflow-x-auto rounded-lg">
              <div
                className={`flex justify-center items-center h-[calc(100vh-200px)]`}
              >
                <span className="relative flex h-[80px] w-[80px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundamentalAnalysis;
