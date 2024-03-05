/* eslint-disable react/no-unescaped-entities */
import { useEarningsContext } from "@/context/Context";
import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import {
  MdOutlineNotificationsNone,
  MdOutlineNotificationsActive,
} from "react-icons/md";

const UpcomingCard = ({
  name,
  date,
  time,
  phone,
  uid,
  keyDevId,
  smpGlobalCompany,
  eventDate,
  notify,
}) => {
  const [notifyState, setNotifyState] = useState(false);

  function handleNotify() {
    setNotifyState(true);
    apifetch();
  }

  async function apifetch() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/transcript-alert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyDevId: keyDevId,
          UserId: uid,
          smp_global_company: smpGlobalCompany,
          eventDate: eventDate,
        }),
      }
    );
    const data = await res.json();
    console.log(data);
  }

  return (
    <div className="w-full h-full cursor-pointer shadow-lg flex-1 ">
      {/* MainCard */}
      <div className="w-full justify-center bg-white p-4 gap-3 rounded-t-lg text-left items-center">
        <div>
          {/* Name */}
          <h1 className="text-lg sm:text-2xl font-bold pb-1 tracking-tighter border-b border-[#1a3c61] flex justify-center">
            {name}
          </h1>
          <div className="flex items-center justify-between">
            {/* Date and Time */}
            <div className="italic flex-1">
              <p className="text-lg font-semibold flex justify-center">
                {date}
              </p>
              <div className="text-sm font-semibold gap-2 items-center flex justify-center">
                <p>{time}</p>
                <AiOutlineClockCircle />
              </div>
            </div>
            {/* Contacts */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-400 flex justify-center">
                {phone[1] ? "+" + phone[1] : "No Contact"}
              </p>
              <p className="text-sm font-semibold text-gray-400 flex justify-center">
                {phone[1] ? "+" + phone[1] : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notify */}
      <div
        className="bg-[#1a3c61] overflow-hidden p-1 text-white h-auto flex justify-center 
      rounded-b-lg "
      >
        {uid == 0 ? (
          <div className="flex gap-2 font-semibold items-center hover:scale-110">
            <MdOutlineNotificationsNone size={25} />
            <p>Login to get notification</p>
          </div>
        ) : notify == "yes" || notifyState ? (
          <div className="flex gap-2 font-semibold items-center">
            <MdOutlineNotificationsActive size={25} />
            <p>Will be Notified</p>
          </div>
        ) : (
          notify == "no" &&
          !notifyState && (
            <div
              onClick={handleNotify}
              className="flex gap-2 font-semibold items-center hover:scale-110"
            >
              <MdOutlineNotificationsNone size={25} />
              <p>Notify me</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UpcomingCard;
