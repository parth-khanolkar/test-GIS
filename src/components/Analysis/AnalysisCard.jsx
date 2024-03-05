/* eslint-disable react/no-unescaped-entities */
import { BsFillFileEarmarkTextFill, BsFillShareFill } from "react-icons/bs";
import { HiPresentationChartBar, HiMusicNote } from "react-icons/hi";
import { MdTranscribe } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";
import "animate.css";
import { FiSearch } from "react-icons/fi";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useEarningsContext } from "@/context/Context";
import { TwitterShareButton, TwitterIcon } from "react-share";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Broker from "@/components/EarningsWidgetsPage/Widgets/Broker";
import { BiLeftArrow, BiLeftTopArrowCircle } from "react-icons/bi";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
const AnalysisCard = ({
  uid,
  calendarId,
  name,
  date,
  share,
  shareChange,
  sharePerc,
  consensus,
  consensusChange,
  consensusPerc,
  summary,
  consensusTarget,
  resultFlag,
  pptFlag,
  transcriptFlag,
  audioFlag,
  brokerFlag,
  fincode,
  tableFlag,
}) => {
  const dateSplit = date.split(" ");
  const [broker, setBroker] = useState(null);
  const [table, setTable] = useState(null);
  const { setWidgets, setDetailsPage, setCalendarIdContext } =
    useEarningsContext();
  const [viewSummary, setViewSummary] = useState(false);
  const [viewBroker, setViewBroker] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [brokerLength, setBrokerLength] = useState(null);
  const [currentBroker, setCurrentBroker] = useState(0);

  function handleTranscript() {
    setWidgets({
      results: false,
      transcripts: true,
      broker: false,
      ppt: false,
      summary: false,
      sentiment: false,
    });
    setDetailsPage(true);
  }
  function handleResults() {
    setWidgets({
      results: true,
      broker: false,
      transcripts: false,
      ppt: false,
      summary: false,
      sentiment: false,
    });
    setDetailsPage(true);
  }
  function handleBroker() {
    setWidgets({
      results: false,
      broker: true,
      transcripts: false,
      ppt: false,
      summary: false,
      sentiment: false,
    });
    setDetailsPage(true);
  }
  function handlePpt() {
    setWidgets({
      results: false,
      broker: false,
      transcripts: false,
      ppt: true,
      summary: false,
      sentiment: false,
    });
    setDetailsPage(true);
  }
  function handleSummary() {
    setWidgets({
      results: false,
      broker: false,
      transcripts: false,
      ppt: false,
      summary: true,
      sentiment: false,
    });
    setDetailsPage(true);
  }

  function handleViewSummary() {
    if (viewSummary == false && viewBroker == false && viewTable == false) {
      setViewSummary(!viewSummary);
    } else {
      setViewSummary(!viewSummary);
      setViewBroker(false);
      setViewTable(false);
    }
  }
  function handleViewBroker() {
    if (viewSummary == false && viewBroker == false && viewTable == false) {
      setViewBroker(!viewBroker);
    } else {
      setViewSummary(false);
      setViewTable(false);
      setViewBroker(!viewBroker);
    }
  }

  function handleViewTable() {
    if (viewSummary == false && viewBroker == false && viewTable == false) {
      setViewTable(!viewTable);
    } else {
      setViewSummary(false);
      setViewBroker(false);
      setViewTable(!viewTable);
    }
  }
  function onHoverHandleViewSummary() {
    if (viewSummary == false && viewBroker == false && viewTable == false) {
      setViewSummary(true);
    } else {
      setViewSummary(true);
      setViewBroker(false);
      setViewTable(false);
    }
  }

  function onHoverHandleViewBroker() {
    if (viewSummary == false && viewBroker == false && viewTable == false) {
      setViewBroker(true);
    } else {
      setViewSummary(false);
      setViewTable(false);
      setViewBroker(true);
    }
  }

  function onHoverHandleViewTable() {
    if (viewSummary == false && viewBroker == false && viewTable == false) {
      setViewTable(true);
    } else {
      setViewSummary(false);
      setViewBroker(false);
      setViewTable(true);
    }
  }
  // fetching broker radar data
  // useEffect(() => {
  //   async function brokerfetch() {
  //     const res = await fetch(
  //       `https://transcriptanalyser.com/gis/broker-radar`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           fincode: fincode,
  //         }),
  //       }
  //     );
  //     const data = await res.json();
  //     setBroker(data);
  //   }
  //   if (brokerFlag == "yes") {
  //     brokerfetch();
  //   }
  // }, [viewBroker]);

  // Fetch Broker Radar
  async function brokerfetch() {
    const res = await fetch(`https://transcriptanalyser.com/gis/broker-radar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fincode: fincode,
      }),
    });
    const data = await res.json();
    setBroker(data);
  }

  // Fetch Table
  async function tablefetch() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/earning-table`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendar_id: calendarId,
        }),
      }
    );
    const data1 = await res.json();
    setTable(data1?.key);
  }

  return (
    <div>
      {/* __________________________Web View_________________________________ */}
      <div className="hidden md:flex md:flex-col overflow-hidden group cursor-pointer shadow-lg w-full ">
        {/* MainCard */}
        <div
          onClick={() => {
            setDetailsPage(true);
            setCalendarIdContext(calendarId);
          }}
          className="flex md:flex-col lg:flex-row w-full justify-between bg-white p-4 gap-3 rounded-t-lg text-left"
        >
          {/* Left Side for responsiveness */}
          <div className="flex flex-1 w-full justify-between bg-white p-4 gap-3 rounded-t-lg text-left">
            {/* Date */}
            <div className="flex flex-col justify-center text-lg font-semibold italic">
              <p className="text-lg">{dateSplit[0] + " " + dateSplit[1]}</p>
              <p className="text-2xl">{dateSplit[2]}</p>
            </div>
            {/* Company Name and Contactss */}
            <div className="flex flex-1 flex-col">
              <h1 className="text-2xl tracking-tighter font-semibold border-b border-[#153b65] flex items-center justify-center">
                {name}
              </h1>
              {/* Widgets */}
              <div className="flex justify-between gap-2 font-semibold text-sm items-center text-[#1a3c61]">
                {/* TranscriptFlag !*/}
                {transcriptFlag == "true" ? (
                  <div
                    onClick={handleTranscript}
                    className="flex flex-col gap-1 items-center"
                  >
                    <p className="text-black">Transcript</p>
                    <MdTranscribe
                      size={25}
                      className="hover:scale-110 transfrom ease"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col gap-1 items-center">
                    <p>Transcript</p>
                    <MdTranscribe size={25} />
                  </div>
                )}
                {/* ResultsFlag */}
                {resultFlag == "true" ? (
                  <div
                    onClick={handleResults}
                    className="flex flex-col gap-1 items-center"
                  >
                    <p>Result</p>
                    <BsFillFileEarmarkTextFill
                      size={25}
                      className="hover:scale-110 transfrom ease"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col gap-1 items-center">
                    <p>Result</p>
                    <BsFillFileEarmarkTextFill size={25} />
                  </div>
                )}
                {/* brokerFlag */}
                {/* {brokerFlag == "yes" ? (
                  <div
                    onClick={handleBroker}
                    className="flex flex-col gap-1 items-center"
                  >
                    <p>Brokers</p>
                    <FaPeopleArrows
                      size={25}
                      className="hover:scale-110 transfrom ease"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col gap-1 items-center">
                    <p>Brokers</p>
                    <FaPeopleArrows size={25} />
                  </div>
                )} */}
                {/* pptFlag */}
                {pptFlag == "true" ? (
                  <div
                    onClick={handlePpt}
                    className="flex flex-col gap-1 items-center"
                  >
                    <p>PPT</p>
                    <HiPresentationChartBar
                      size={25}
                      className="hover:scale-110 transfrom ease"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col gap-1 items-center">
                    <p>PPT</p>
                    <HiPresentationChartBar size={25} />
                  </div>
                )}
                {/* audioFlag */}
                {audioFlag == "true" ? (
                  <div
                    onClick={handleTranscript}
                    className="flex flex-col gap-1"
                  >
                    <p> Audio </p>
                    <HiMusicNote
                      size={25}
                      className="hover:scale-110 transfrom ease"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col gap-1 items-center">
                    <p> Audio </p>
                    <HiMusicNote size={25} />
                  </div>
                )}
              </div>
            </div>
            {/* Stock Price (Large Screen)*/}
            <div className="hidden lg:flex gap-2 items-center">
              {/* Share */}
              <div className="w-full h-full">
                <div
                  className={`flex flex-col h-full w-full justify-center items-center rounded-lg font-semibold p-1 ${
                    shareChange > 0 && "bg-green-300/50 text-green-700"
                  }
                  ${shareChange < 0 && "bg-red-400/50 text-red-700"}
                  ${
                    (!shareChange || shareChange == 0) &&
                    "bg-gray-300/50 text-gray-600"
                  }`}
                >
                  <div className="border-b w-full flex justify-center text-sm border-gray-400">
                    <h1 className="text-black">Price Impact</h1>
                  </div>
                  <h1 className="text-2xl italic">
                    {share ? "₹" + share : "NA"}
                  </h1>
                  <div className={`flex gap-1 items-center`}>
                    {shareChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                    <p className="text-xs">({sharePerc}%)</p>
                  </div>
                  {/* Result day impact*/}
                  <div
                    className={`flex text-xs border-t border-gray-400 w-full justify-center items-center `}
                  >
                    <span>Result day impact</span>
                    <span>
                      {shareChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                    </span>
                    <span>{shareChange ? "₹" + shareChange : "NA"}</span>
                  </div>
                </div>
              </div>
              {/* Consensus */}
              <div className="w-full h-full">
                <div
                  className={`flex flex-col w-full h-full justify-center items-center rounded-lg font-semibold p-1 ${
                    consensusChange > 0 && "bg-green-300/50 text-green-700"
                  }
                  ${consensusChange < 0 && "bg-red-400/50 text-red-700"}
                  ${
                    (!consensusChange || consensusChange == 0) &&
                    "bg-gray-300/50 text-gray-600"
                  }`}
                >
                  <div className="border-b w-full flex justify-center text-sm border-gray-400">
                    <h1 className="text-black">
                      EPS Change ({consensusTarget})
                    </h1>
                  </div>
                  <h1 className="text-2xl italic">
                    {consensus ? "₹" + consensus : "NA"}
                  </h1>
                  <div className={`flex gap-1 items-center`}>
                    {consensusChange >= 0 ? (
                      <GoTriangleUp />
                    ) : (
                      <GoTriangleDown />
                    )}
                    <p className="text-xs">({consensusPerc}%)</p>
                  </div>
                  {/* This Quarter change*/}
                  <div
                    className={`flex text-xs border-t border-gray-400 w-full justify-center items-center`}
                  >
                    <span>This Quarter change</span>
                    <span>
                      {consensusChange >= 0 ? (
                        <GoTriangleUp />
                      ) : (
                        <GoTriangleDown />
                      )}
                    </span>
                    <span>
                      {consensusChange ? "₹" + consensusChange : "NA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Price (Medium Screen) */}
          {/* Stock Price */}
          <div className="md:flex lg:hidden gap-1 justify-center items-center w-full h-full">
            {/* Share */}
            <div className="flex-1">
              <div
                className={`flex flex-col justify-center items-center rounded-lg font-semibold p-1 ${
                  shareChange > 0 && "bg-green-300/50 text-green-700"
                }
                ${shareChange < 0 && "bg-red-400/50 text-red-700"}
                ${
                  (!shareChange || shareChange == 0) &&
                  "bg-gray-300/50 text-gray-600 "
                }}`}
              >
                <div className="border-b w-full flex justify-center text-sm border-gray-400">
                  <h1 className="text-black">Price Impact</h1>
                </div>

                <div className="flex gap-1 items-center">
                  <h1 className="text-xs sm:text-lg italic">
                    {share ? "₹" + share : "NA"}
                  </h1>
                  {shareChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                  <p className="text-xs">({sharePerc}%)</p>
                </div>
                {/* Result day impact*/}
                <div
                  className={`flex text-xs border-t border-gray-400 w-full justify-center items-center`}
                >
                  <span>Result day impact</span>
                  <span>
                    {shareChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                  </span>
                  <span>{shareChange ? "₹" + shareChange : "NA"}</span>
                </div>
              </div>
            </div>
            {/* Consensus */}
            <div className="flex-1">
              <div
                className={`flex flex-col justify-center items-center rounded-lg font-semibold p-1 ${
                  consensusChange > 0 && "bg-green-300/50 text-green-700"
                }
                ${consensusChange < 0 && "bg-red-400/50 text-red-700"}
                ${
                  (!consensusChange || consensusChange == 0) &&
                  "bg-gray-300/50 text-gray-600"
                }`}
              >
                <div className="border-b w-full flex justify-center text-sm border-gray-400">
                  <h1 className="text-black">EPS Change ({consensusTarget})</h1>
                </div>

                <div className={`flex gap-1 items-center`}>
                  <h1 className="text-xs sm:text-lg italic">
                    {consensus ? "₹" + consensus : "NA"}
                  </h1>
                  {consensusChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                  <p className="text-xs">({consensusPerc}%)</p>
                </div>
                {/* This Quarter change*/}
                <div
                  className={`flex text-xs border-t border-gray-400 w-full justify-center items-center `}
                >
                  <span>This Quarter change</span>
                  <span>
                    {consensusChange >= 0 ? (
                      <GoTriangleUp />
                    ) : (
                      <GoTriangleDown />
                    )}
                  </span>
                  <span>{consensusChange ? "₹" + consensusChange : "NA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Summary */}
        <div>
          {/* Twitter Share
          <div
            className={`${!view && "hidden"} ${
              !summary[0] && "hidden"
            } flex justify-center items-center pt-1 bg-[#1a3c61]`}
          >
            <TwitterShareButton
              url={`https://www.goindiastocks.com/GIA/EarningsCalendarNew/`}
              title={
                name +
                "\n" +
                summary[0] +
                "\n" +
                summary[1] +
                "\n" +
                summary[2] +
                "\n" +
                summary[3] +
                "\n" +
                summary[4] +
                "\n" +
                "Visit the link to view more...."
              }
            >
              <TwitterIcon size={30} round="true" />
            </TwitterShareButton>
          </div> */}

          {/* Summary / Broker Buttons */}
          <div className="bg-white flex justify-between px-5 lg:px-10">
            {/* Summary Button */}
            <div
              onMouseOver={onHoverHandleViewSummary}
              onMouseLeave={() => setViewSummary(false)}
              className="flex justify-center"
            >
              <div
                className={`border-b-[24px] border-l-[20px] border-r-[20px] ${
                  !summary[0]
                    ? "border-b-[#d6d7d7]"
                    : viewSummary
                    ? "border-b-[#081f37]"
                    : "border-b-[#153b65] "
                } w-[126px] border-l-transparent border-r-transparent relative`}
              >
                <p
                  className={` ${
                    !summary[0]
                      ? "text-gray-500"
                      : viewSummary
                      ? "text-white underline underline-offset-2 decoration-red-500"
                      : "text-white "
                  } bg-transparent px-2 rounded-t-md font-semibold absolute`}
                >
                  Summary
                </p>
              </div>
            </div>

            {/* Table Button */}
            <div
              onMouseOver={() => {
                onHoverHandleViewTable();
                tablefetch();
              }}
              onMouseLeave={() => setViewTable(false)}
              className="flex justify-center"
            >
              <div
                className={`border-b-[24px] border-l-[20px] border-r-[20px] ${
                  tableFlag == null
                    ? "border-b-[#d6d7d7]"
                    : viewTable
                    ? "border-b-[#081f37]"
                    : "border-b-[#153b65]"
                } w-[93px] border-l-transparent border-r-transparent relative`}
              >
                <p
                  className={`${
                    tableFlag == null
                      ? "text-gray-500"
                      : viewTable
                      ? "text-white underline underline-offset-2 decoration-red-500 "
                      : "text-white "
                  } bg-transparent px-2 rounded-t-md font-semibold absolute whitespace-nowrap`}
                >
                  Table
                </p>
              </div>
            </div>

            {/* Broker Button */}
            <div
              onMouseOver={() => {
                onHoverHandleViewBroker();
                brokerfetch();
              }}
              onMouseLeave={() => setViewBroker(false)}
              className="flex justify-center"
            >
              <div
                className={`border-b-[24px] border-l-[20px] border-r-[20px] ${
                  brokerFlag == "no"
                    ? "border-b-[#d6d7d7]"
                    : viewBroker
                    ? "border-b-[#081f37] "
                    : "border-b-[#153b65] "
                } w-[105px] border-l-transparent border-r-transparent relative`}
              >
                <p
                  className={`${
                    brokerFlag == "no"
                      ? "text-gray-500"
                      : viewBroker
                      ? "text-white underline underline-offset-2 decoration-red-500"
                      : "text-white "
                  } bg-transparent px-2 rounded-t-md font-semibold absolute whitespace-nowrap`}
                >
                  Broker
                </p>
              </div>
            </div>
          </div>

          {/* Summary Points */}
          <div
            onMouseOver={onHoverHandleViewSummary}
            onMouseLeave={() => setViewSummary(false)}
            className={`${
              !summary[0]
                ? "bg-[#d6d7d7] text-gray-500"
                : "bg-[#081f37] text-white"
            }  overflow-hidden rounded-b-lg  p-4 text-justify ${
              !viewSummary && "hidden"
            }`}
          >
            {summary[0] ? (
              summary.map((item, index) => (
                <p key={index} className="text-sm mb-1">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-sm mb-1">Summary not available yet.</p>
            )}
          </div>

          {/* Table */}
          <div
            onMouseOver={onHoverHandleViewTable}
            onMouseLeave={() => setViewTable(false)}
            className={`${
              tableFlag == null
                ? "bg-[#d6d7d7] text-gray-500"
                : "bg-[#081f37] text-white"
            } overflow-hidden rounded-b-lg p-4 text-justify ${
              !viewTable && "hidden"
            } flex justify-center`}
          >
            {tableFlag != null ? (
              table == null ? (
                <p className="text-lg animate-pulse w-full flex justify-center items-center">
                  Loading Table
                </p>
              ) : (
                <div className="overflow-none">
                  <table className="table-auto rounded-md overflow-hidden">
                    <thead className="text-sm">
                      <tr className="bg-[#056eef] text-white text-left font-semibold">
                        <td></td>
                        <th className="px-4 py-2">Value</th>
                        <th className="px-4 py-2">QoQ</th>
                        <th className="px-4 py-2">YoY</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className={`bg-[#eaeef5]`}>
                        <td className="font-bold px-4 py-2 text-black">
                          Revenue (Rs. cr)
                        </td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.revenue}
                        </td>
                        <td
                          className={`${
                            table?.revenue_growth_qoq > 0
                              ? "text-green-700"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.revenue_growth_qoq > 0 && "+"}
                          {table?.revenue_growth_qoq}%
                        </td>
                        <td
                          className={`${
                            table?.revenue_growth_yoy > 0
                              ? "text-green-700"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.revenue_growth_yoy > 0 && "+"}
                          {table?.revenue_growth_yoy}%
                        </td>
                      </tr>
                    </tbody>
                    <tbody className="text-sm">
                      <tr className={`bg-white text-black`}>
                        <td className="font-bold px-4 py-2">EBITDA (Rs. cr)</td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.ebitda}
                        </td>
                        <td
                          className={`${
                            table?.ebitda_growth_qoq > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_growth_qoq > 0 && "+"}
                          {table?.ebitda_growth_qoq}%
                        </td>
                        <td
                          className={`${
                            table?.ebitda_growth_yoy > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_growth_yoy > 0 && "+"}
                          {table?.ebitda_growth_yoy}%
                        </td>
                      </tr>
                    </tbody>
                    <tbody className="text-sm">
                      <tr className={`bg-[#eaeef5] text-black`}>
                        <td className="font-bold px-4 py-2">
                          EBITDA Margin (%)
                        </td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.ebitda_margin}
                        </td>
                        <td
                          className={`${
                            table?.ebitda_margin_growth_qoq > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_margin_growth_qoq > 0 && "+"}
                          {table?.ebitda_margin_growth_qoq.toFixed(0)} bps
                        </td>
                        <td
                          className={`${
                            table?.ebitda_margin_growth_yoy > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_margin_growth_yoy > 0 && "+"}
                          {table?.ebitda_margin_growth_yoy.toFixed(0)} bps
                        </td>
                      </tr>
                    </tbody>
                    <tbody className="text-sm">
                      <tr className={`bg-white text-black`}>
                        <td className="font-bold px-4 py-2">PAT (Rs. cr)</td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.pat}
                        </td>
                        <td
                          className={`${
                            table?.pat_growth_qoq > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.pat_growth_qoq > 0 && "+"}
                          {table?.pat_growth_qoq}%
                        </td>
                        <td
                          className={`${
                            table?.pat_growth_yoy > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.pat_growth_yoy > 0 && "+"}
                          {table?.pat_growth_yoy}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="text-sm mb-1">Table not available yet.</p>
            )}
          </div>

          {/* Broker Radar Cards */}
          <div
            onMouseOver={onHoverHandleViewBroker}
            onMouseLeave={() => setViewBroker(false)}
            className={`${
              brokerFlag == "no"
                ? "bg-[#d6d7d7] text-gray-500"
                : "bg-[#081f37] text-white"
            }  rounded-b-lg p-4 text-justify ${
              !viewBroker && "hidden"
            } relative flex items-center`}
          >
            {brokerFlag == "no" ? (
              <p className="text-sm mb-1">Broker Radar not available</p>
            ) : broker == null ? (
              <div className="text-lg animate-pulse w-full flex justify-center items-center">
                Loading Broker Reports...
              </div>
            ) : (
              <div className="w-full">
                {broker?.key?.map(
                  (item, index, array) =>
                    index == currentBroker && (
                      <div key={index}>
                        <div className="flex justify-center items-center gap-4 mb-2">
                          <AiFillLeftCircle
                            onClick={() => {
                              if (currentBroker > 0) {
                                setCurrentBroker(currentBroker - 1);
                              }
                            }}
                            size={30}
                            className="text-gray-400 hover:text-white"
                          />
                          <p className="italic font-semibold">
                            {index + 1} of {array?.length}
                          </p>
                          <AiFillRightCircle
                            onClick={() => {
                              if (currentBroker < array?.length - 1) {
                                setCurrentBroker(currentBroker + 1);
                              }
                            }}
                            size={30}
                            className="text-gray-400 hover:text-white"
                          />
                        </div>
                        <div className="flex justify-center">
                          <Broker
                            date={item?.["REPORT DATE"]}
                            broker={item?.["BROKER NAME"]}
                            company={item?.["comp_name"]}
                            summary1={item?.["SUMMARY PT 1"]}
                            summary2={item?.["SUMMARY PT 2"]}
                            summary3={item?.["SUMMARY PT 3"]}
                            cmp={item?.["CMP"]}
                            tp={item?.["TP"]}
                            updown={item?.["UP/DOWN"]}
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          {/* Bottom div only for design */}
          <div
            className={` ${
              !summary[0] && brokerFlag == "no" && tableFlag == null
                ? "bg-[#d6d7d7]"
                : "bg-[#1a3c61]"
            } overflow-hidden text-white rounded-b-lg p-1 ${
              (viewSummary || viewBroker || viewTable) && "hidden"
            }`}
          ></div>
          {/* <div
            onClick={() => setView(!view)}
            className={`bg-[#1a3c61] overflow-hidden text-white rounded-b-lg text-justify p-1 flex justify-center items-center hover:underline ${
              view && "border-t border-white"
            } `}
          >
            {!summary[0]
              ? "Summary not available"
              : view
              ? "Close Summary"
              : "View Summary"}
          </div> */}
        </div>
      </div>

      {/*____________________________MOBILE VIEW__________________________ */}
      <div className="md:hidden w-full h-full group cursor-pointer shadow-lg overflow-hidden">
        {/* MainCard */}
        <div
          onClick={() => {
            setDetailsPage(true);
            setCalendarIdContext(calendarId);
          }}
          className="flex flex-col sm:flex-row w-full justify-between bg-white p-4 gap-3 rounded-t-lg text-left"
        >
          {/* Company Name and Date */}
          <div className="flex flex-col gap-2 justify-center flex-1">
            <div className="font-semibold border-b border-[#153b65] flex justify-between gap-1 items-center">
              <p className="text-sm tracking-tighter sm:text-xl font-semibold italic">
                {date}
              </p>
              <p className="font-semibold text-lg sm:text-2xl">{name}</p>
            </div>

            {/* Widgets */}
            <div className="flex justify-between gap-2 font-semibold text-sm items-center text-[#1a3c61]">
              {/* TranscriptFlag */}
              {transcriptFlag == "true" ? (
                <div
                  onClick={handleTranscript}
                  className="flex flex-col gap-1 items-center"
                >
                  <p className="text-black">Transcript</p>
                  <MdTranscribe
                    size={25}
                    className="hover:scale-110 transfrom ease"
                  />
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col gap-1 items-center">
                  <p>Transcript</p>
                  <MdTranscribe size={25} />
                </div>
              )}
              {/* ResultsFlag */}
              {resultFlag == "true" ? (
                <div
                  onClick={handleResults}
                  className="flex flex-col gap-1 items-center"
                >
                  <p>Result</p>
                  <BsFillFileEarmarkTextFill
                    size={25}
                    className="hover:scale-110 transfrom ease"
                  />
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col gap-1 items-center">
                  <p>Result</p>
                  <BsFillFileEarmarkTextFill size={25} />
                </div>
              )}
              {/* brokerFlag */}
              {/* {brokerFlag == "yes" ? (
                <div
                  onClick={handleBroker}
                  className="flex flex-col gap-1 items-center"
                >
                  <p>Brokers</p>
                  <FaPeopleArrows
                    size={25}
                    className="hover:scale-110 transfrom ease"
                  />
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col gap-1 items-center">
                  <p>Brokers</p>
                  <FaPeopleArrows size={25} />
                </div>
              )} */}
              {/* pptFlag */}
              {pptFlag == "true" ? (
                <div
                  onClick={handlePpt}
                  className="flex flex-col gap-1 items-center"
                >
                  <p>PPT</p>
                  <HiPresentationChartBar
                    size={25}
                    className="hover:scale-110 transfrom ease"
                  />
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col gap-1 items-center">
                  <p>PPT</p>
                  <HiPresentationChartBar size={25} />
                </div>
              )}
              {/* audioFlag */}
              {audioFlag == "true" ? (
                <div onClick={handleTranscript} className="flex flex-col gap-1">
                  <p> Audio </p>
                  <HiMusicNote
                    size={25}
                    className="hover:scale-110 transfrom ease"
                  />
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col gap-1 items-center">
                  <p> Audio </p>
                  <HiMusicNote size={25} />
                </div>
              )}
            </div>
          </div>

          {/* Stock Price */}
          <div className="flex sm:flex-col gap-1 justify-center items-center ">
            {/* Share */}
            <div className="flex-1 w-full h-full">
              <div
                className={`flex flex-col justify-center items-center rounded-lg font-semibold p-1 ${
                  shareChange > 0 && "bg-green-300/50 text-green-700"
                }
                ${shareChange < 0 && "bg-red-400/50 text-red-700"}
                ${
                  (!shareChange || shareChange == 0) &&
                  "bg-gray-300/50 text-gray-600"
                }`}
              >
                <div className="border-b w-full flex justify-center text-sm border-gray-400">
                  <h1 className="text-black">Price Impact</h1>
                </div>

                <div className={`flex gap-1 py-1 items-center `}>
                  <h1 className="text-xs sm:text-lg italic">
                    {share ? "₹" + share : "NA"}
                  </h1>
                  {shareChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                  <p className="text-xs">({sharePerc}%)</p>
                </div>

                {/* Result Day Impact */}
                <div
                  className={`flex text-xs border-t border-gray-400 w-full justify-center items-center `}
                >
                  <span>Result day impact</span>
                  <span>
                    {shareChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                  </span>
                  <span>{shareChange ? "₹" + shareChange : "NA"}</span>
                </div>
              </div>
            </div>
            {/* Consensus */}
            <div className="flex-1 w-full h-full">
              <div
                className={`flex flex-col justify-center items-center rounded-lg font-semibold p-1  ${
                  consensusChange > 0 && "bg-green-300/50 text-green-700"
                }
                ${consensusChange < 0 && "bg-red-400/50 text-red-700"}
                ${
                  (!consensusChange || consensusChange == 0) &&
                  "bg-gray-300/50 text-gray-600"
                }`}
              >
                <div className="border-b w-full flex justify-center text-sm border-gray-400">
                  <h1 className="text-black">EPS Change ({consensusTarget})</h1>
                </div>

                <div className={`flex gap-1 py-1 items-center`}>
                  <h1 className="text-xs sm:text-lg italic">
                    {consensus ? "₹" + consensus : "NA"}
                  </h1>
                  {consensusChange >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
                  <p className="text-xs">({consensusPerc}%)</p>
                </div>
                {/* This Quarter change*/}
                <div
                  className={`flex text-xs border-t border-gray-400 w-full justify-center items-center`}
                >
                  <span>This Quarter change</span>
                  <span>
                    {consensusChange >= 0 ? (
                      <GoTriangleUp />
                    ) : (
                      <GoTriangleDown />
                    )}
                  </span>
                  <span>{consensusChange ? "₹" + consensusChange : "NA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Summary */}
        <div>
          {/* Twitter Share
          <div
            className={`${!view && "hidden"} ${
              !summary[0] && "hidden"
            } flex justify-center items-center pt-1 bg-[#1a3c61]`}
          >
            <TwitterShareButton
              url={`https://www.goindiastocks.com/GIA/EarningsCalendarNew/`}
              title={
                name +
                "\n" +
                summary[0] +
                "\n" +
                summary[1] +
                "\n" +
                summary[2] +
                "\n" +
                summary[3] +
                "\n" +
                summary[4] +
                "\n" +
                "Visit the link to view more...."
              }
            >
              <TwitterIcon size={30} round="true" />
            </TwitterShareButton>
          </div> */}

          {/* Summary / Broker Buttons */}
          <div className="bg-white flex justify-between sm:px-10">
            {/* Summary Button */}
            <div onClick={handleViewSummary} className="flex justify-center">
              <div
                className={`border-b-[24px] border-l-[20px] border-r-[20px] ${
                  !summary[0]
                    ? "border-b-[#d6d7d7]"
                    : viewSummary
                    ? "border-b-[#081f37] "
                    : "border-b-[#153b65] "
                } w-[126px] border-l-transparent border-r-transparent relative`}
              >
                <p
                  className={` ${
                    !summary[0]
                      ? "text-gray-500"
                      : viewSummary
                      ? "text-white underline underline-offset-2 decoration-red-500"
                      : "text-white "
                  } bg-transparent px-2 rounded-t-md font-semibold absolute`}
                >
                  Summary
                </p>
              </div>
            </div>

            {/* Table Button */}
            <div
              onClick={() => {
                handleViewTable();
                tablefetch();
              }}
              className="flex justify-center"
            >
              <div
                className={`border-b-[24px] border-l-[20px] border-r-[20px] ${
                  tableFlag == null
                    ? "border-b-[#d6d7d7]"
                    : viewTable
                    ? "border-b-[#081f37] "
                    : "border-b-[#153b65] "
                } w-[93px] border-l-transparent border-r-transparent relative`}
              >
                <p
                  className={`${
                    tableFlag == null
                      ? "text-gray-500"
                      : viewTable
                      ? "text-white underline underline-offset-2 decoration-red-500"
                      : "text-white "
                  } bg-transparent px-2 rounded-t-md font-semibold absolute whitespace-nowrap`}
                >
                  Table
                </p>
              </div>
            </div>

            {/* Broker Button */}
            <div
              onClick={() => {
                handleViewBroker();
                brokerfetch();
              }}
              className="flex justify-center"
            >
              <div
                className={`border-b-[24px] border-l-[20px] border-r-[20px] ${
                  brokerFlag == "no"
                    ? "border-b-[#d6d7d7]"
                    : viewBroker
                    ? "border-b-[#081f37] "
                    : "border-b-[#153b65] "
                } w-[105px] border-l-transparent border-r-transparent relative`}
              >
                <p
                  className={`${
                    brokerFlag == "no"
                      ? "text-gray-500"
                      : viewBroker
                      ? "text-white underline underline-offset-2 decoration-red-500"
                      : "text-white "
                  } bg-transparent px-2 rounded-t-md font-semibold absolute whitespace-nowrap`}
                >
                  Broker
                </p>
              </div>
            </div>
          </div>

          {/* Summary Points */}
          <div
            className={`${
              !summary[0]
                ? "bg-[#d6d7d7] text-gray-500"
                : "bg-[#081f37] text-white"
            } overflow-hidden rounded-b-lg p-4 text-justify ${
              !viewSummary && "hidden"
            }`}
          >
            {summary[0] ? (
              summary.map((item) => (
                <p key={item} className="text-sm mb-1">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-sm mb-1">Summary not available yet.</p>
            )}
          </div>

          {/* Table */}
          <div
            className={`${
              tableFlag == null
                ? "bg-[#d6d7d7] text-gray-500"
                : "bg-[#081f37] text-white"
            } overflow-hidden rounded-b-lg p-4 text-justify ${
              !viewTable && "hidden"
            } flex justify-center`}
          >
            {tableFlag != null ? (
              table == null ? (
                <p className="text-lg animate-pulse w-full flex justify-center items-center">
                  Loading Table...
                </p>
              ) : (
                <div className="overflow-none">
                  <table className="table-auto rounded-md overflow-hidden">
                    <thead className="text-sm">
                      <tr className="bg-[#056eef] text-white text-left font-semibold">
                        <td></td>
                        <th className="px-4 py-2">Value</th>
                        <th className="px-4 py-2">QoQ</th>
                        <th className="px-4 py-2">YoY</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className={`bg-[#eaeef5]`}>
                        <td className="font-bold px-4 py-2 text-black">
                          Revenue (Rs. cr)
                        </td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.revenue}
                        </td>
                        <td
                          className={`${
                            table?.revenue_growth_qoq > 0
                              ? "text-green-700"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.revenue_growth_qoq > 0 && "+"}
                          {table?.revenue_growth_qoq}%
                        </td>
                        <td
                          className={`${
                            table?.revenue_growth_yoy > 0
                              ? "text-green-700"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.revenue_growth_yoy > 0 && "+"}
                          {table?.revenue_growth_yoy}%
                        </td>
                      </tr>
                    </tbody>
                    <tbody className="text-sm">
                      <tr className={`bg-white text-black`}>
                        <td className="font-bold px-4 py-2">EBITDA (Rs. cr)</td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.ebitda}
                        </td>
                        <td
                          className={`${
                            table?.ebitda_growth_qoq > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_growth_qoq > 0 && "+"}
                          {table?.ebitda_growth_qoq}%
                        </td>
                        <td
                          className={`${
                            table?.ebitda_growth_yoy > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_growth_yoy > 0 && "+"}
                          {table?.ebitda_growth_yoy}%
                        </td>
                      </tr>
                    </tbody>
                    <tbody className="text-sm">
                      <tr className={`bg-[#eaeef5] text-black`}>
                        <td className="font-bold px-4 py-2">
                          EBITDA Margin (%)
                        </td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.ebitda_margin}
                        </td>
                        <td
                          className={`${
                            table?.ebitda_margin_growth_qoq > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_margin_growth_qoq > 0 && "+"}
                          {table?.ebitda_margin_growth_qoq.toFixed(0)} bps
                        </td>
                        <td
                          className={`${
                            table?.ebitda_margin_growth_yoy > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.ebitda_margin_growth_yoy > 0 && "+"}
                          {table?.ebitda_margin_growth_yoy.toFixed(0)} bps
                        </td>
                      </tr>
                    </tbody>
                    <tbody className="text-sm">
                      <tr className={`bg-white text-black`}>
                        <td className="font-bold px-4 py-2">PAT (Rs. cr)</td>
                        <td className={`text-black font-semibold px-4 py-2`}>
                          {table?.pat}
                        </td>
                        <td
                          className={`${
                            table?.pat_growth_qoq > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.pat_growth_qoq > 0 && "+"}
                          {table?.pat_growth_qoq}%
                        </td>
                        <td
                          className={`${
                            table?.pat_growth_yoy > 0
                              ? "text-green-600"
                              : "text-red-600"
                          } font-semibold px-4 py-2`}
                        >
                          {table?.pat_growth_yoy > 0 && "+"}
                          {table?.pat_growth_yoy}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="text-sm mb-1">Table not available yet.</p>
            )}
          </div>

          {/* Broker Radar Cards */}
          <div
            className={`${
              brokerFlag == "no"
                ? "bg-[#d6d7d7] text-gray-500"
                : "bg-[#081f37] text-white"
            } rounded-b-lg p-4 text-justify ${
              !viewBroker && "hidden"
            } relative flex items-center`}
          >
            {brokerFlag == "no" ? (
              <p className="text-sm mb-1">Broker Radar not available</p>
            ) : broker == null ? (
              <div className="text-lg animate-pulse w-full flex justify-center items-center">
                Loading Broker Reports....
              </div>
            ) : (
              <div className="w-full">
                {broker?.key?.map(
                  (item, index, array) =>
                    index == currentBroker && (
                      <div key={index}>
                        <div className="flex justify-center items-center gap-4 mb-2">
                          <AiFillLeftCircle
                            onClick={() => {
                              if (currentBroker > 0) {
                                setCurrentBroker(currentBroker - 1);
                              }
                            }}
                            size={30}
                            className="text-gray-400 hover:text-white"
                          />
                          <p className="italic font-semibold">
                            {index + 1} of {array?.length}
                          </p>
                          <AiFillRightCircle
                            onClick={() => {
                              if (currentBroker < array?.length - 1) {
                                setCurrentBroker(currentBroker + 1);
                              }
                            }}
                            size={30}
                            className="text-gray-400 hover:text-white"
                          />
                        </div>
                        <div className="flex justify-center">
                          <Broker
                            date={item?.["REPORT DATE"]}
                            broker={item?.["BROKER NAME"]}
                            company={item?.["comp_name"]}
                            summary1={item?.["SUMMARY PT 1"]}
                            summary2={item?.["SUMMARY PT 2"]}
                            summary3={item?.["SUMMARY PT 3"]}
                            cmp={item?.["CMP"]}
                            tp={item?.["TP"]}
                            updown={item?.["UP/DOWN"]}
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          {/* Bottom div only for design */}
          <div
            className={`${
              !summary[0] && brokerFlag == "no" && tableFlag == null
                ? "bg-[#d6d7d7]"
                : "bg-[#1a3c61]"
            } overflow-hidden text-white rounded-b-lg p-1 ${
              (viewSummary || viewBroker || viewTable) && "hidden"
            }`}
          ></div>
          {/* <div
            onClick={() => setView(!view)}
            className={`bg-[#1a3c61] overflow-hidden text-white rounded-b-lg text-justify p-1 flex justify-center items-center hover:underline ${
              view && "border-t border-white"
            } `}
          >
            {!summary[0]
              ? "Summary not available"
              : view
              ? "Close Summary"
              : "View Summary"}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
