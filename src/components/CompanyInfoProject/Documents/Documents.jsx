"use client";

import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import axios from "axios";
import Select from "react-select";
import { saveAs } from "file-saver";

import { FaFileDownload } from "react-icons/fa";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useInfoContext } from "@/context/info";
import { useRouter } from "next/router";

function Documents() {
  const { fincode, setFincode } = useInfoContext();

  const router = useRouter();
  const { fincodeLink } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState(null);

  const [annualReports, setAnnualReports] = useState(null);

  const [earningcalls, setEarningcalls] = useState(null);

  const [announcementTypes, setAnnouncementTypes] = useState(null);
  const [selectedAnnouncementType, setSelectedAnnouncementType] =
    useState(null);

  const handlePdfDownload = (pdfUrl) => {
    saveAs(pdfUrl, "downloaded-file.pdf");
  };

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/anouncement`,
        {
          fincode: fincodeLink,
          type: selectedAnnouncementType?.value
            ? selectedAnnouncementType?.value
            : "",
        }
      );

      setAnnouncements(response.data.data);
      setAnnouncementTypes(
        response.data.dropdown.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAnnouncements([]);
    }
  };

  const fetchAnnualReports = async () => {
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/annual_report`,
        {
          fincode: fincodeLink,
        }
      );
      setAnnualReports(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAnnualReports([]);
    }
  };

  const fetchEarningCall = async () => {
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/earningcall`,
        {
          fincode: fincodeLink,
        }
      );
      setEarningcalls(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEarningcalls([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedAnnouncementType, fincodeLink]);

  useEffect(() => {
    fetchAnnualReports();
    fetchEarningCall();
  }, [fincodeLink]);

  return (
    <div className="bg-white border-[#4577A8] border-[1px] rounded-md shadow-md py-2 px-2 md:py-5 md:px-8">
      <h1 className="font-semibold text-[28px] underline underline-offset-4 ">
        Documents
      </h1>
      <div className="flex flex-col lg:flex-row mx-1">
        {/* ANNOUNCEMENTS */}
        <div className="lg:w-1/3 mx-2">
          <div className="my-3 md:mb-3  md:text-2xl font-semibold">
            Announcements
          </div>
          <div
            className={`rounded-lg border border-black p-4 
              ${announcements?.length > 0 ? "h-80" : ""}
            `}
          >
            <div className="mb-3">
              <Select
                options={announcementTypes}
                value={selectedAnnouncementType}
                onChange={(selectedOption) =>
                  setSelectedAnnouncementType(selectedOption)
                }
                className="text-xs md:text-sm w-56 md:w-56"
                placeholder="All Announcements"
                isClearable={true}
              />
            </div>
            <div className="overflow-y-auto scrollbar-none lg:scrollbar-thin max-h-60 overflow-x-hidden lg:pr-5 lg:-mr-1.5">
              <hr className="border border-black -mx-1" />
              {isLoading ? (
                <>
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="relative flex h-16 w-16">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-900 opacity-75"></span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {announcements?.length > 0 ? (
                    announcements.map((item, index) => (
                      <div key={index}>
                        <div className="flex flex-row h-16 my-1.5 text-sm space-x-1 font-semibold">
                          <div className="w-2/12 flex items-center justify-center border-r border-gray-300 pl-1 md:pl-2">
                            <Moment format="DD MMM, YYYY">
                              {item.Newsdate}
                            </Moment>
                          </div>
                          <a
                            href={item.Attachmenturl}
                            target="_blank"
                            className="w-9/12 line-clamp-3 hover:underline hover:text-blue-700"
                          >
                            {item.Heading}
                          </a>
                          <div className="w-1/12 flex justify-center items-center">
                            <button
                              onClick={() =>
                                handlePdfDownload(item.Attachmenturl)
                              }
                            >
                              <FaFileDownload className="w-5 h-5 text-cyan-900 hover:text-blue-700" />
                            </button>
                          </div>
                        </div>
                        <hr className="border border-black -mx-1" />
                      </div>
                    ))
                  ) : (
                    <p>No announcements available.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ANNUAL REPORTS */}
        <div className="lg:w-1/3 mx-2">
          <div className="my-3 md:mb-3 md:text-2xl font-semibold">
            Annual Reports
          </div>
          <div
            className={`rounded-lg border border-black p-4 overflow-y-auto scrollbar-none lg:scrollbar-thin max-h-80 grid grid-cols-3 gap-4`}
          >
            {annualReports?.length > 0 ? (
              <>
                {annualReports?.map((item, index) => (
                  <div key={index}>
                    <div className="col-span-1 cursor-pointer hover:shadow-2xl shadow-md">
                      <a
                        href={item.pdf_link}
                        target="_blank"
                        className=" p-2 rounded border border-black flex items-center justify-center font-semibold hover:border-blue-700 hover:text-blue-700"
                      >
                        {item.Name}
                      </a>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="col-span-3">No annual reports available</div>
              </>
            )}
          </div>
        </div>

        {/* EARNINGS CALLS */}
        <div className="lg:w-1/3 mx-2">
          <div className="my-3 md:mb-3  md:text-2xl font-semibold">
            Earnings Calls
          </div>
          <div
            className={`rounded-lg border border-black p-4 overflow-y-auto scrollbar-none lg:scrollbar-thin 
                ${earningcalls?.length > 0 ? "max-h-80" : ""}
              `}
          >
            {earningcalls?.length > 0 ? (
              <>
                {earningcalls?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row mb-3 items-center justify-center"
                  >
                    <div className="flex items-center justify-center font-semibold text-[11px] md:text-sm whitespace-nowrap">
                      {item.Name} | Q{item.quarter} {/*{item.year1}*/}
                    </div>
                    <div className="ml-auto grid grid-cols-3 gap-1 md:gap-3">
                      <a
                        href={item.transcript_link}
                        target="_blank"
                        className={`col-span-1 p-0.5 px-1 rounded flex items-center justify-center text-[11px] md:text-sm
                                              ${
                                                item.transcript_link
                                                  ? "border border-black hover:shadow-md hover:border-blue-700 hover:text-blue-700"
                                                  : "border border-gray-300 text-gray-300 cursor-text"
                                              }
                                          `}
                      >
                        Transcript
                      </a>
                      <a
                        href={item.pdf_link}
                        target="_blank"
                        className={`col-span-1 p-0.5 px-1 rounded flex items-center justify-center text-[11px] md:text-sm
                                              ${
                                                item.pdf_link
                                                  ? "border border-black hover:shadow-md hover:border-blue-700 hover:text-blue-700"
                                                  : "border border-gray-300 text-gray-300 cursor-text"
                                              }
                                          `}
                      >
                        PPT
                      </a>
                      <a
                        href={item.audio_link}
                        target="_blank"
                        className={`col-span-1 py-0.5 px-1 rounded flex items-center justify-center text-[11px] md:text-sm
                                              ${
                                                item.audio_link
                                                  ? "border border-black hover:shadow-md hover:border-blue-700 hover:text-blue-700"
                                                  : "border border-gray-300 text-gray-300 cursor-text"
                                              }
                                          `}
                      >
                        Audio
                      </a>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p>No earning calls available</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documents;
