import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Notes from "../NotesNew/Notes";
import { useInfoContext } from "@/context/info";
import {
  IoClose,
  IoDocumentTextOutline,
  IoNewspaperOutline,
} from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useEffect } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import WebSidebar from "./Sidebar/WebSidebar";
import { GoLinkExternal, GoPeople } from "react-icons/go";
import { MdMan2 } from "react-icons/md";
import { BsFiletypePpt } from "react-icons/bs";
import { TfiAnnouncement } from "react-icons/tfi";
import Image from "next/image";
const ResearchDashboard = () => {
  const {
    uid,
    notesToggle,
    setNotesToggle,
    tabsList,
    setTabsList,
    selectedTab,
    setSelectedTab,
    openedTabs,
    setOpenedTabs,
    dashFincode,
    dashCompName,
    selectedMenu,
    setSelectedMenu,
    subMenus,
    setSubMenus,
  } = useInfoContext();

  const [transcriptData, setTranscriptData] = useState(null);
  const [interviewSummary, setInterviewSummary] = useState(null);
  const [interviewTranscript, setInterviewTranscript] = useState(null);
  const [detailedSummary, setDetailedSummary] = useState(null);
  const [transcriptSummaryToggle, setTranscriptSummaryToggle] = useState(true);

  useEffect(() => {
    setSelectedMenu("Resources");
  }, []);

  function slideLeft() {
    var slider = document.getElementById("dashRowsId");
    slider.scrollLeft -= 500;
  }
  function slideRight() {
    var slider = document.getElementById("dashRowsId");
    slider.scrollLeft += 500;
  }

  const executeScrollIntoView = (id) => {
    var id1 = document?.getElementById(id);
    id1?.scrollIntoView({
      inline: "nearest",
    });
  };

  useEffect(() => {
    selectedTab != null && executeScrollIntoView(selectedTab.link);
  }, [selectedTab]);

  const fetchTranscriptWithoutSummary = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/transcript-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keydevid: selectedTab?.link,
          }),
        }
      );
      const data = await res.json();
      setTranscriptData(data?.transcript);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTranscriptWithSummary = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/gis/calendar-detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calendar_id: selectedTab?.calendar_id,
            user_id: 1,
          }),
        }
      );
      const data = await res.json();
      setDetailedSummary(data?.key?.notes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setTranscriptData(null);
    selectedTab?.type == "transcript" && fetchTranscriptWithoutSummary();
    selectedTab?.type == "transcript" &&
      selectedTab?.calendar_id != 0 &&
      (fetchTranscriptWithoutSummary(), fetchTranscriptWithSummary());
  }, [selectedTab]);

  // Fetch Summary
  const fetchInterviewSummary = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/interview/interview_detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interview_id: selectedTab?.interview_id,
          }),
        }
      );
      const data = await res.json();
      setInterviewSummary(data?.summary);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    selectedTab?.type == "interview" && fetchInterviewSummary();
    selectedTab?.type == "interview" && console.log(selectedTab?.interview_id);
  }, [selectedTab]);

  return (
    <div className="flex w-full bg-white h-[calc(100vh-82px)]">
      {/* Sidebar */}
      <div className="p-1">
        <WebSidebar />
      </div>

      {/* RIGHT SECTION */}
      {openedTabs[0] ? (
        <div className="p-1 h-full w-full overflow-x-auto">
          <div className="flex gap-4 items-center">
            <FaAngleLeft
              onClick={() => slideLeft()}
              size={20}
              className="text-[#0d2844] hover:bg-gray-400/30 rounded-md cursor-pointer"
            />
            {/* Tabs */}
            <div
              id="dashRowsId"
              className="flex gap-2 px-2 overflow-x-auto scrollbar-hide flex-1"
            >
              {openedTabs.map((item, index) => (
                // Tab
                <div
                  key={item.link}
                  id={item.link}
                  className={`text-xs rounded-t-md whitespace-nowrap font-bold ${
                    item.link == selectedTab.link
                      ? "bg-[#0d2844] text-white "
                      : "bg-[#f0f0f0] text-black"
                  } flex items-center`}
                >
                  {/* Icon Logic */}
                  {item.type == "transcript" ? (
                    <IoDocumentTextOutline size={20} />
                  ) : item.type == "investor_ppt" ? (
                    <BsFiletypePpt size={20} />
                  ) : item.type == "announcement" ? (
                    <TfiAnnouncement size={20} />
                  ) : item.type == "annual_report" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 29 29"
                      fill="none"
                    >
                      <path
                        d="M27.3083 23.6833V0.483333C27.3083 0.193333 27.115 0 26.825 0H5.07501C4.78501 0 4.59167 0.193333 4.59167 0.483333V7.25H5.55834V0.966667H26.3417V23.2H21.9917C21.7017 23.2 21.5083 23.3933 21.5083 23.6833V28.0333H5.55834V20.7833H4.59167V28.5167C4.59167 28.8067 4.78501 29 5.07501 29H21.9917C22.1367 29 22.2333 28.9517 22.33 28.855L27.1633 24.0217C27.2117 23.9733 27.2117 23.925 27.26 23.8767V23.8283C27.3083 23.78 27.3083 23.7317 27.3083 23.6833ZM22.475 24.1667H25.665L24.07 25.7617L22.475 27.3567V24.1667Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M7.97498 18.3667H10.875H12.8083V17.4H11.3583V8.21667C11.3583 7.92667 11.165 7.73333 10.875 7.73333H7.97498C7.68498 7.73333 7.49165 7.92667 7.49165 8.21667V11.1167H5.07498C4.78498 11.1167 4.59165 11.31 4.59165 11.6V13.5333H2.17498C1.88498 13.5333 1.69165 13.7267 1.69165 14.0167V17.8833C1.69165 18.1733 1.88498 18.3667 2.17498 18.3667H5.07498H7.97498ZM8.45832 8.7H10.3917V17.4H8.45832V11.6V8.7ZM5.55832 12.0833H7.49165V17.4H5.55832V14.0167V12.0833ZM2.65832 14.5H4.59165V17.4H2.65832V14.5Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M24.4083 11.6V3.38333C24.4083 3.09333 24.215 2.9 23.925 2.9H13.775C13.485 2.9 13.2916 3.09333 13.2916 3.38333V11.6C13.2916 11.89 13.485 12.0833 13.775 12.0833H23.925C24.215 12.0833 24.4083 11.89 24.4083 11.6ZM23.4416 5.8H17.6416V3.86667H23.4416V5.8ZM16.675 3.86667V5.8H14.2583C14.2583 5.02667 14.2583 3.86667 14.2583 3.86667H16.675ZM14.2583 6.76667H16.675V11.1167H14.2583C14.2583 11.1167 14.2583 8.845 14.2583 6.76667ZM17.6416 11.1167V6.76667H23.4416V11.1167H17.6416Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M23.925 13.5333H13.775V14.5H23.925V13.5333Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M23.925 15.95H13.775V16.9167H23.925V15.95Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M23.925 18.3667H13.775V19.3333H23.925V18.3667Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M9.9083 2.9H7.0083V3.86667H9.9083V2.9Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M11.3583 5.31667H7.0083V6.28333H11.3583V5.31667Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M10.3916 20.7833H7.0083V21.75H10.3916V20.7833Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M15.225 20.7833H11.8417V21.75H15.225V20.7833Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M20.0584 20.7833H16.675V21.75H20.0584V20.7833Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M10.3916 23.2H7.0083V24.1667H10.3916V23.2Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M15.225 23.2H11.8417V24.1667H15.225V23.2Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M20.0584 23.2H16.675V24.1667H20.0584V23.2Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M10.3916 25.6167H7.0083V26.5833H10.3916V25.6167Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M15.225 25.6167H11.8417V26.5833H15.225V25.6167Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                      <path
                        d="M20.0584 25.6167H16.675V26.5833H20.0584V25.6167Z"
                        fill={`${
                          item.link == selectedTab.link ? "white" : "black"
                        }`}
                      />
                    </svg>
                  ) : item.type == "news" ? (
                    <IoNewspaperOutline size={20} />
                  ) : item.type == "interview" ? (
                    <GoPeople size={20} />
                  ) : (
                    item.type == "broker" && <MdMan2 size={20} />
                  )}
                  {/* Heading */}
                  <p
                    className="cursor-pointer  px-2 pt-1"
                    onClick={() => {
                      setSelectedTab(item);
                      setDetailedSummary(null);
                      setTranscriptData(null);
                    }}
                  >
                    {item.heading}
                  </p>
                  <div
                    onClick={() => {
                      setOpenedTabs(
                        openedTabs.filter((item1) => item1 != item)
                      );
                      selectedTab == item && setSelectedTab(openedTabs[0]);
                      item == openedTabs[0] && setSelectedTab(openedTabs[1]);
                      console.log(selectedTab);
                    }}
                    className="hover:bg-white hover:text-[#0d2844] rounded-full cursor-pointer"
                  >
                    <IoClose size={15} />
                  </div>
                </div>
              ))}
            </div>
            <FaAngleRight
              onClick={() => slideRight()}
              size={20}
              className="text-[#0d2844] hover:bg-gray-400/30 rounded-md cursor-pointer"
            />
          </div>
          {/* I-Frame and Transcript */}
          <div
            className={`border-[3px] border-[#0d2844] rounded-md w-full h-[calc(100vh-110px)] overflow-hidden`}
          >
            {selectedTab?.type != "transcript" &&
            selectedTab?.type !== "news" &&
            selectedTab?.type != "interview" ? (
              // I-Frames
              <iframe src={selectedTab.link} className="w-full h-full"></iframe>
            ) : selectedTab?.type == "transcript" &&
              selectedTab?.calendar_id == 0 ? (
              // Transcript
              <div className="text-black w-full overflow-y-auto p-1 max-h-[calc(100vh-116px)]">
                <div className="flex justify-center text-lg sm:text-2xl underline underline-offset-4 mb-4 font-bold">
                  {transcriptData &&
                    transcriptData[0] &&
                    transcriptData[0]?.headline}
                </div>
                {transcriptData ? (
                  transcriptData?.map((item, index) => (
                    <div key={index} className="text-sm md:text-base my-4">
                      {/* Name */}
                      <div className="text-xl italic font-semibold">
                        {item?.transcriptPersonName}:
                      </div>

                      {/* Words */}
                      <div className="px-4 text-justify">
                        {item?.componentText}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="font-bold flex items-center animate-pulse">
                    Loading....
                  </div>
                )}
              </div>
            ) : selectedTab?.type == "transcript" &&
              selectedTab?.calendar_id != 0 ? (
              <div>
                {/* Trans/Summary toggle */}
                <div className="flex rounded-md text-sm justify-end font-semibold m-[1px]">
                  <div
                    onClick={() => setTranscriptSummaryToggle(true)}
                    className={`px-1 rounded-l-md cursor-pointer ${
                      transcriptSummaryToggle
                        ? "bg-[#0d2844] hover:bg-[#0d2844]/90 text-white"
                        : "text-black bg-gray-100 border hover:bg-[#0d2844]/10 border-[#0d2844]"
                    }`}
                  >
                    Transcript
                  </div>
                  <div
                    onClick={() => setTranscriptSummaryToggle(false)}
                    className={`px-1 rounded-r-md cursor-pointer ${
                      !transcriptSummaryToggle
                        ? "bg-[#0d2844] hover:bg-[#0d2844]/90 text-white"
                        : "text-black bg-gray-100 border hover:bg-[#0d2844]/10 border-[#0d2844]"
                    }`}
                  >
                    Summary
                  </div>
                </div>
                {/* Transcript*/}
                <div
                  className={`text-black w-full overflow-y-auto p-1 max-h-[calc(100vh-143px)] ${
                    transcriptSummaryToggle ? "inline-block" : "hidden"
                  }`}
                >
                  <div className="flex justify-center text-lg sm:text-2xl underline underline-offset-4 mb-4 font-bold">
                    {transcriptData &&
                      transcriptData[0] &&
                      transcriptData[0]?.headline}
                  </div>
                  {transcriptData ? (
                    transcriptData?.map((item, index) => (
                      <div key={index} className="text-sm md:text-base my-4">
                        {/* Name */}
                        <div className="text-xl italic font-semibold">
                          {item?.transcriptPersonName}:
                        </div>

                        {/* Words */}
                        <div className="px-4 text-justify">
                          {item?.componentText}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="font-bold flex items-center animate-pulse">
                      Loading....
                    </div>
                  )}
                </div>
                {/* Detailed Summary */}
                <div
                  className={`text-justify ${
                    !transcriptSummaryToggle ? "inline-block" : "hidden"
                  } max-h-[calc(100vh-143px)] overflow-y-auto`}
                >
                  {!detailedSummary ? (
                    <div className="text-sm font-bold flex items-center animate-pulse">
                      Loading....
                    </div>
                  ) : detailedSummary?.summary[0] ? (
                    // Summary
                    <div>
                      <h1 className="text-lg sm:text-2xl italic font-semibold ">
                        Summary :
                      </h1>
                      {detailedSummary?.summary?.map((items) => (
                        <div key={items} className="my-2">
                          <p className="text-base px-3">{items}</p>
                        </div>
                      ))}
                      {detailedSummary?.heading?.map((items) => (
                        <div key={items?.text} className="my-4">
                          <h1 className="text-lg sm:text-2xl italic font-semibold ">
                            {items?.heading} :
                          </h1>
                          {items?.text?.map((items) => (
                            <div key={items} className="my-2 select-none">
                              <p className="text-base px-3">{items}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                      No Summary Available
                    </p>
                  )}
                </div>
              </div>
            ) : selectedTab?.type == "interview" ? (
              <div className="flex flex-col gap-2 h-full w-full overflow-y-auto">
                <iframe
                  src={selectedTab.link}
                  className="w-full h-full min-h-[300px] md:min-h-[500px]  flex-1"
                ></iframe>

                <div className="p-1">
                  <div className="font-[700] text-2xl underline-offset-4 decoration-red-500 underline">
                    Summary:
                  </div>
                  <div className="font-[500] text-sm text-justify">
                    {interviewSummary?.length > 0 ? (
                      <p className=" whitespace-pre-wrap">{interviewSummary}</p>
                    ) : interviewSummary?.length == 0 ? (
                      "Summary not available!"
                    ) : (
                      "Loading...."
                    )}
                  </div>
                </div>

                <div className="p-1">
                  <div className="font-[700] text-2xl underline-offset-4 decoration-red-500 underline">
                    Transcript:
                  </div>
                  <div className="font-[500] text-sm text-justify">
                    {interviewTranscript?.length > 0 ? (
                      <p className=" whitespace-pre-wrap">
                        {interviewTranscript}
                      </p>
                    ) : interviewTranscript?.length == 0 ? (
                      "Summary not available!"
                    ) : (
                      "Loading...."
                    )}
                  </div>
                </div>
              </div>
            ) : (
              selectedTab?.type == "news" && (
                <div className="w-full max-h-[calc(100vh-117px)] p-2 overflow-y-auto grid grid-flow-row grid-auto-fit-md gap-4 bg-[#f4f5fa]">
                  {selectedTab?.data?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white text-black rounded-md  h-[140px] p-1 flex flex-col justify-between hover:underline underline-offset-4 cursor-pointer group shadow-lg"
                    >
                      <div
                        onClick={() => window.open(item?.link, "_blank")}
                        className="text-sm font-[600]"
                      >
                        {item?.heading}
                      </div>
                      <div className="flex items-center justify-between text-xs font-[500]">
                        <div className="flex items-center gap-1">
                          {item?.news_logo != "none" && (
                            <Image
                              src={item?.news_logo}
                              width={25}
                              height={25}
                              alt={item?.source}
                            />
                          )}
                          <p className="text-blue-700">{item?.source}</p>
                        </div>
                        <p className="text-gray-500">{item?.news_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="text-white p-2 h-full w-full flex flex-col justify-center items-center text-3xl">
          {!dashFincode ? (
            <p className="bg-[#0d2844] p-5 rounded-md">Search any Company!</p>
          ) : (
            <p className={`${subMenus && "bg-[#0d2844]"} p-5 rounded-md`}>
              {subMenus && !subMenus?.annoucement ? (
                "Data not available for this Company, please select another Company!"
              ) : subMenus ? (
                " Select any option from left!"
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
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchDashboard;
