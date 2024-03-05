import React from "react";
import moment from "moment";
const Broker = ({
  date,
  broker,
  company,
  summary1,
  summary2,
  summary3,
  tp,
  cmp,
  updown,
}) => {
  return (
    <div className="bg-[#06182e] text-white px-5 py-3 rounded-md shadow-xl flex flex-col gap-2 text-md">
      {/* Date */}
      <p className="font-semibold">
        {moment.utc(date).format("MMMM Do, YYYY")}
      </p>
      {/* Company Name */}
      <h1 className="text-xl font-bold italic">
        {broker} on {company}
      </h1>
      {/* CMP , Target Price and Recommendation */}
      <div className="flex gap-5 font-semibold">
        <div className="flex flex-col">
          <p className="border-b-2 border-red-600">CMP</p>
          <p>{cmp}</p>
        </div>
        <div className="flex flex-col">
          <p className="border-b-2 border-red-600">Target Price</p>
          <p>{tp}</p>
        </div>
        <div className="flex flex-col">
          <p className="border-b-2 border-red-600">Recommendation</p>
          <p className={`${updown >= 0 ? "text-green-400" : "text-red-400"} `}>
            {updown && updown.toFixed(2)}% {updown >= 0 ? "BUY" : "SELL"}
          </p>
        </div>
      </div>

      {/* Texts */}
      <div className="flex flex-col gap-2 text-sm my-2">
        <p className="flex gap-1">
          <span>-</span>
          <span className="text-justify tracking-wide italic">{summary1}</span>
        </p>
        <p className="flex gap-1">
          <span>-</span>
          <span className="text-justify tracking-wide italic">{summary2}</span>
        </p>
        <p className="flex gap-1">
          <span>-</span>
          <span className="text-justify tracking-wide italic">{summary3}</span>
        </p>
      </div>
    </div>
  );
};

export default Broker;
