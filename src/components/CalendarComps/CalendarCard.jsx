import React, { useEffect, useState } from "react";
import { BiPhoneCall } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import {
  MdOutlineNotificationsActive,
  MdOutlineNotificationsNone,
} from "react-icons/md";
import moment from "moment";
import { useInfoContext } from "@/context/info";
import { FaFilePdf } from "react-icons/fa6";

const CalendarCard = ({ data, uid }) => {
  const { earningsToggle, setEarningsToggle } = useInfoContext();
  const [alertFlag, setAlertFlag] = useState(false);
  // Fetch Alert
  async function fetchAlert() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/transcript-alert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyDevId: data?.keyDevId,
          UserId: uid,
          smp_global_company: data?.smp_global_company,
          eventDate: data?.eventDate,
        }),
      }
    );
  }

  useEffect(() => {
    data && data?.notify == "yes" && setAlertFlag(true);
  }, [data]);

  return (
    <div className="border border-gray-200 shadow-md rounded-md flex justify-between  overflow-hidden p-2 gap-5 md:gap-10">
      {/* Left*/}
      <div className="flex flex-col items-center justify-center text-xs sm:text-sm italic font-[600]">
        {/* Day */}
        <p className="text-xs">{moment(data?.eventDate).format("dddd")}</p>
        {/* DATE */}
        <p className="">{moment(data?.eventDate).format("Do MMM' YY")}</p>
        {/* TIME */}
        <div className="flex gap-1 items-center text-xs">
          <FaRegClock />
          <p>{moment(data?.eventDate).format("hh:mm A")}</p>
        </div>
      </div>

      {/* Middle*/}
      <div className="flex flex-1 w-full">
        <div className="flex flex-col gap-2 flex-1">
          {/* STOCK */}
          <h1 className="text-xl sm:text-2xl font-semibold md:px-4">
            {earningsToggle == "Earning"
              ? data?.company_name
              : data?.companyName}
          </h1>

          {/* <hr className="bg-black min-h-[1px] max-h-[1px] w-full" /> */}
          {/* Type */}
          {earningsToggle == "Events" && (
            <p className="text-[#6A6A6A] text-sm font-[600] md:px-4">
              Type: {data?.eventType}
            </p>
          )}
          {/*PDF and CONTACT */}
          <div className="flex items-center gap-2 sm:gap-3 md:px-4 flex-shrink-0">
            {earningsToggle == "Earning" &&
              (data?.pdf_link[0] ? (
                <a
                  href={data?.pdf_link}
                  target="_blank"
                  className="cursor-pointer text-[#093967] hover:text-[#093967]/80"
                >
                  <FaFilePdf className="flex-shrink-0" size={22} />
                </a>
              ) : (
                <FaFilePdf
                  className="flex-shrink-0 text-gray-400 cursor-not-allowed"
                  size={22}
                />
              ))}
            {earningsToggle == "Earning" && (
              <vr className="h-4 w-[1px] text-gray-400 bg-gray-400 flex-shrink-0" />
            )}
            <div className={`text-[#6A6A6A] flex items-center`}>
              <BiPhoneCall className="flex-shrink-0" size={18} />
              {earningsToggle == "Earning" ? (
                <p className="flex  flex-wrap text-sm">
                  <span className="px-1">
                    {data?.phone_no[0] == "None"
                      ? data?.phone_no[0]
                      : "+" + data?.phone_no[0]}
                  </span>
                  <span className="px-1">
                    {data?.phone_no[1] && "+" + data?.phone_no[1]}
                  </span>
                </p>
              ) : (
                <p>{data?.contact[0] ? data?.contact : "NA"}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      {earningsToggle == "Earning" ? (
        <div
          onClick={() => {
            uid > 0
              ? (setAlertFlag(true), fetchAlert())
              : alert("Login to get alerts!");
          }}
          className={`${
            alertFlag
              ? "bg-[#143B64] text-[#E2F0FF]"
              : "text-[#143B64] bg-[#E2F0FF]"
          }  overflow-hidden p-1 h-auto flex justify-center items-center rounded-lg cursor-pointer`}
        >
          {alertFlag ? (
            <div>
              <MdOutlineNotificationsActive size={25} />{" "}
            </div>
          ) : (
            <div>
              <MdOutlineNotificationsNone size={25} />{" "}
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-[#6A6A6A] font-[600] overflow-hidden p-1 text-center flex-[0.4] hidden sm:flex items-center justify-center">
          {data?.headLine}
        </div>
      )}
    </div>
  );
};

export default CalendarCard;
