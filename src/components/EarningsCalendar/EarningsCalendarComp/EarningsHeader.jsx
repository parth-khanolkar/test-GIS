import { useEarningsContext } from "@/context/Context";
import React from "react";

const EarningsCalendarHeader = () => {
  const { previousMenu, setPreviousMenu } = useEarningsContext();
  return (
    <div>
      {/* Web Header */}
      <div className="w-full bg-white hidden md:inline-block">
        <h1 className="text-xl text-red-600 font-semibold px-5 py-1 w-full">
          EARNINGS CALENDAR
        </h1>
        <div className="h-11 bg-[#1a3c61] flex justify-between items-center p-5 text-xl font-semibold text-white gap-5 border-b-[5px] border-red-700">
          <div className="flex-[0.6] lg:flex-[0.65] border-r-2 border-gray-600 lg:border-none">
            Previous Earning Calls
          </div>
          <div className="flex-[0.4] lg:flex-[0.35] ">
            Upcoming Earning Calls
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="w-full bg-white md:hidden">
        <h1 className="text-xl text-red-600 font-semibold px-5 py-1 w-full">
          EARNINGS CALENDAR
        </h1>
        <div className="flex w-screen text-white bg-[#1a3c61] ">
          <button
            onClick={() => setPreviousMenu(!previousMenu)}
            className={`w-full ${
              previousMenu && "bg-[#0f2339] border-b-4 border-red-700"
            } py-2`}
          >
            Previous Earning Calls
          </button>
          <button
            onClick={() => setPreviousMenu(!previousMenu)}
            className={`w-full ${
              !previousMenu && "bg-[#0f2339] border-b-4 border-red-700"
            } py-2`}
          >
            Upcoming Earning Calls
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalendarHeader;
