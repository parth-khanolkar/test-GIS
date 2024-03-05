import React, { Suspense, useContext, useEffect, useState } from "react";
import PreviousEarningCalls from "./EarningsCalendarComp/PreviousCalls";
import UpcomingEarningCalls from "./EarningsCalendarComp/UpcomingCalls";
import { useEarningsContext } from "@/context/Context";
import {
  BiArrowBack,
  BiMessageRoundedDots,
  BiMessageRoundedX,
} from "react-icons/bi";
import EarningsWidgetsPage from "../EarningsWidgetsPage/EarningsWidgetsPage";
import Notes from "../Notes/Notes";
import { TbNotes } from "react-icons/tb";

const EarningsCalender = ({ uid, chatFincode }) => {
  const {
    previousMenu,
    calendarIdContext,
    detailsPage,
    setDetailsPage,
    setWidgets,
    widgets,
    stockGptUrl,
    masterNotesFlag,
    setMasterNotesFlag,
    selectedText,
    setSelectedText,
  } = useEarningsContext();
  const [stockGpt, setStockGpt] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        {/* Previous and Upcoming Earning Calls */}
        <div className="w-full md:w-[80vw] lg:w-[60vw] h-full pt-1 ">
          <div>
            <PreviousEarningCalls uid={uid} />
          </div>
        </div>
        {/* STOCK GPT */}
        <div
          className={`items-center rounded-lg absolute sm:right-4 sm:top-5 top-0 z-30  border-[#0c4b6f] ${
            !stockGpt && "hidden"
          }`}
        >
          <iframe
            key={chatFincode}
            src={`${stockGptUrl}/${chatFincode}`}
            className="bg-white rounded-lg sm:h-[calc(100vh-120px)] sm:w-[calc(100vh-250px)] shadow-2xl w-screen h-screen"
          />
        </div>

        {/* Stock GPT Open/Close buttons */}
        <div
          className={`absolute right-0 z-10 ${
            !masterNotesFlag ? "bottom-0" : "top-0 sm:top-auto"
          } ${
            !stockGpt ? "bottom-0" : "top-0 sm:top-auto"
          } flex justify-end pr-4`}
        >
          {!masterNotesFlag ? (
            <div className={` rounded-lg text-white p-1 cursor-pointer`}>
              <TbNotes
                onClick={() => setMasterNotesFlag(!masterNotesFlag)}
                size={50}
                className={`rounded-full bg-[#1e3e60] p-1 flex justify-end`}
              />
              <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                Notes
              </h1>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center rounded-lg p-1 cursor-pointer`}
            >
              <TbNotes
                onClick={() => setMasterNotesFlag(!masterNotesFlag)}
                size={50}
                className="rounded-full text-[#1e3e60] bg-white sm:bg-[#1e3e60] sm:text-white p-1 "
              />
              <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                Notes
              </h1>
            </div>
          )}
          {!stockGpt ? (
            <div>
              <div
                className={`flex flex-col items-center rounded-lg text-white p-1 cursor-pointer`}
              >
                <BiMessageRoundedDots
                  onClick={() => setStockGpt(!stockGpt)}
                  size={50}
                  className={`rounded-full bg-[#1e3e60] p-1 flex justify-end`}
                />
                <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                  Stock GPT
                </h1>
              </div>
            </div>
          ) : (
            <div
              className={` flex flex-col items-center rounded-lg p-1 cursor-pointer`}
            >
              <BiMessageRoundedX
                onClick={() => setStockGpt(!stockGpt)}
                size={50}
                className="rounded-full text-[#1e3e60] bg-white sm:bg-[#1e3e60] sm:text-white p-1 "
              />
              <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                Stock GPT
              </h1>
            </div>
          )}
        </div>

        {/* Details Page */}
        <div
          key={calendarIdContext}
          className={`items-center rounded-lg absolute top-0 left-0 h-full w-full z-[200] ${
            !detailsPage && "hidden"
          }`}
        >
          <div className="w-full h-full">
            <EarningsWidgetsPage uid={uid} cid={calendarIdContext} />
          </div>
        </div>

        {/* Close Details */}
        <div
          className={`flex justify-start cursor-pointer absolute top-0 z-[200] left-0 ${
            !detailsPage && "hidden"
          } `}
        >
          <BiArrowBack
            className="rounded-full p-1 text-white"
            onClick={() => {
              setDetailsPage(false);
              setSelectedText(null);
              setWidgets({
                results: false,
                transcripts: true,
                ppt: false,
                summary: false,
                sentiment: false,
              });
            }}
            size={40}
          />
        </div>
      </div>
    </div>
  );
};

export default EarningsCalender;
