import { useInfoContext } from "@/context/info";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { CgPlayListSearch } from "react-icons/cg";
import {
  FaAngleDown,
  FaAngleUp,
  FaExternalLinkSquareAlt,
} from "react-icons/fa";
import {
  IoCloseSharp,
  IoDocumentText,
  IoDocumentTextOutline,
  IoNewspaperOutline,
  IoSearch,
} from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import transcript from "@/assets/dashboardImages/transcript.png";
import Image from "next/image";
import { BsFiletypePpt } from "react-icons/bs";
import { TfiAnnouncement } from "react-icons/tfi";
import { GoPeople } from "react-icons/go";
import { MdMan2 } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";

const WebSidebar = () => {
  const {
    notesToggle,
    setNotesToggle,
    subMenus,
    setSubMenus,
    selectedTab,
    setSelectedTab,
    openedTabs,
    setOpenedTabs,
    dashFincode,
    setDashFincode,
    dashCompName,
    setDashCompName,
  } = useInfoContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [ppt, setPpt] = useState(false);
  const [announcement, setAnnouncement] = useState(false);
  const [annualReport, setAnnualReport] = useState(false);
  const [brokerReport, setBrokerReport] = useState(false);
  const [news, setNews] = useState(false);
  const [interview, setInterview] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Search Bar Companies Fetch
  const fetchCompanySearch = async () => {
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/company_search`,
        {
          searchtxt: searchInput,
        }
      );
      setSearchOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchCompanySearch();
  }, [searchInput]);

  // Fetch Selected Companies data
  const fetchCompanyData = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/comp-docs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fincode: dashFincode,
          }),
        }
      );
      const data = await res.json();
      console.log("Response --> ", data);
      setSubMenus(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    setSubMenus(null);
    dashFincode && fetchCompanyData();
    setOpenedTabs([]);
    setSelectedTab(null);
  }, [dashFincode]);

  useEffect(() => {
    console.log(openedTabs);
  }, [openedTabs]);

  return (
    <div
      className={`text-black w-full h-full flex flex-col gap-[11px] py-[20px] overflow-y-auto border border-gray-200 shadow-md rounded-md max-w-[100px] `}
    >
      {/* Menu Items */}
      {
        <div
          className={`flex flex-col items-center gap-[11px] h-full overflow-y-auto overflow-x-hidden scrollbar-thin font-bold scrollbar-none`}
        >
          {/* Transcript */}
          <div
            onMouseOver={() => setTranscript(true)}
            onMouseLeave={() => setTranscript(false)}
            className="w-full"
          >
            <div
              className={`flex gap-1 flex-col hover:rounded-md items-center hover:bg-white/20  ${
                transcript && "bg-white/20"
              } cursor-pointer p-2 ${
                subMenus?.transcript[0] ? "text-black" : "text-gray-400"
              }`}
              onClick={() => {
                dashFincode && setTranscript(!transcript);
                // dashFincode && setSidebarOpen(true);
              }}
            >
              <IoDocumentTextOutline size={35} />
              <p className={`text-[9px] font-bold`}>Transcript</p>
            </div>
            <div
              className={`absolute z-100 text-black left-[50px] md:left-[125px] translate-y-[-62px] text-xs p-1 rounded-md bg-[#c8e3ff]/90 ml-2 min-w-[110px] font-semibold ${
                !transcript && "hidden"
              }`}
              onMouseOver={() => setTranscript(true)}
              onMouseLeave={() => setTranscript(false)}
            >
              {subMenus?.sentiment && (
                <p
                  onClick={() => window.open(subMenus?.sentiment, "_blank")}
                  className="cursor-pointer hover:underline flex items-center gap-1 border-b-2 border-black px-1 mb-1"
                >
                  <span>Sentiment Analyser</span>
                  <FaExternalLinkSquareAlt />
                </p>
              )}
              <div className="overflow-y-auto  max-h-[150px] ">
                {subMenus?.transcript[0] ? (
                  subMenus?.transcript?.map((item) => (
                    <p
                      onClick={() => {
                        !openedTabs.includes(item) &&
                          setOpenedTabs([...openedTabs, item]);
                        setSelectedTab(item);
                      }}
                      key={item.link}
                      className="cursor-pointer hover:underline"
                    >
                      {item.heading}
                    </p>
                  ))
                ) : (
                  <p>No Transcripts!</p>
                )}
              </div>
            </div>
          </div>

          {/* PPT */}
          <div
            onMouseOver={() => setPpt(true)}
            onMouseLeave={() => setPpt(false)}
            className="w-full"
          >
            <div
              className={`flex gap-1 flex-col hover:rounded-md items-center hover:bg-white/20  cursor-pointer p-2 ${
                subMenus?.investor_ppt[0] ? "text-black" : "text-gray-400"
              }`}
            >
              <BsFiletypePpt size={30} />
              <p className={`text-[9px]`}>PPT</p>
            </div>
            <div
              onMouseOver={() => setPpt(true)}
              onMouseLeave={() => setPpt(false)}
              className={`absolute inline-block z-100 text-black left-[50px] md:left-[125px] translate-y-[-52px] max-h-[150px] overflow-y-auto text-xs p-1 rounded-md min-w-[110px] bg-[#c8e3ff]/90 ml-2 font-semibold ${
                !ppt && "hidden"
              }`}
            >
              {subMenus?.investor_ppt[0] ? (
                subMenus?.investor_ppt?.map((item) => (
                  <p
                    onClick={() => {
                      !openedTabs.includes(item) &&
                        setOpenedTabs([...openedTabs, item]);
                      setSelectedTab(item);
                    }}
                    key={item?.link}
                    className="cursor-pointer hover:underline"
                  >
                    {item?.heading}
                  </p>
                ))
              ) : (
                <p>No PPTs!</p>
              )}
            </div>
          </div>

          {/* Announcement */}
          <div
            onMouseOver={() => setAnnouncement(true)}
            onMouseLeave={() => setAnnouncement(false)}
            className="w-full"
          >
            <div
              className={`flex gap-1 ${
                !sidebarOpen && "flex-col hover:rounded-md"
              } items-center hover:bg-white/20  ${
                announcement && "bg-white/20"
              } cursor-pointer p-2 ${
                subMenus?.annoucement[0] ? "text-black" : "text-gray-400"
              }`}
            >
              <TfiAnnouncement size={30} />
              <p className={`text-[9px]`}>Anncmnt</p>
              {announcement ? (
                <FaAngleUp className={`${!sidebarOpen && "hidden"}`} />
              ) : (
                <FaAngleDown className={`${!sidebarOpen && "hidden"}`} />
              )}
            </div>
            <div
              className={`absolute z-100 text-black left-[50px] md:left-[125px] translate-y-[-52px] text-xs p-1 rounded-md bg-[#c8e3ff]/90 ml-2 max-h-[150px] overflow-y-auto min-w-[110px] font-semibold ${
                !announcement && "hidden"
              }`}
              onMouseOver={() => setAnnouncement(true)}
              onMouseLeave={() => setAnnouncement(false)}
            >
              {subMenus?.annoucement[0] ? (
                subMenus?.annoucement?.map((item) => (
                  <p
                    onClick={() => {
                      !openedTabs.includes(item) &&
                        setOpenedTabs([...openedTabs, item]);
                      setSelectedTab(item);
                    }}
                    key={item.link}
                    className="cursor-pointer hover:underline"
                  >
                    {item.heading}
                  </p>
                ))
              ) : (
                <p>No Announcement!</p>
              )}
            </div>
          </div>

          {/* Annual Report*/}
          <div
            onMouseOver={() => setAnnualReport(true)}
            onMouseLeave={() => setAnnualReport(false)}
            className="w-full"
          >
            <div
              className={`flex gap-1 ${
                !sidebarOpen && "flex-col hover:rounded-md"
              } items-center hover:bg-white/20  ${
                annualReport && "bg-white/20"
              } cursor-pointer p-2 text-center ${
                subMenus?.transcript[0] ? "text-black" : "text-gray-400"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
              >
                <path
                  d="M27.3083 23.6833V0.483333C27.3083 0.193333 27.115 0 26.825 0H5.07501C4.78501 0 4.59167 0.193333 4.59167 0.483333V7.25H5.55834V0.966667H26.3417V23.2H21.9917C21.7017 23.2 21.5083 23.3933 21.5083 23.6833V28.0333H5.55834V20.7833H4.59167V28.5167C4.59167 28.8067 4.78501 29 5.07501 29H21.9917C22.1367 29 22.2333 28.9517 22.33 28.855L27.1633 24.0217C27.2117 23.9733 27.2117 23.925 27.26 23.8767V23.8283C27.3083 23.78 27.3083 23.7317 27.3083 23.6833ZM22.475 24.1667H25.665L24.07 25.7617L22.475 27.3567V24.1667Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M7.97498 18.3666H10.875H12.8083V17.3999H11.3583V8.21661C11.3583 7.92661 11.165 7.73328 10.875 7.73328H7.97498C7.68498 7.73328 7.49165 7.92661 7.49165 8.21661V11.1166H5.07498C4.78498 11.1166 4.59165 11.3099 4.59165 11.5999V13.5333H2.17498C1.88498 13.5333 1.69165 13.7266 1.69165 14.0166V17.8833C1.69165 18.1733 1.88498 18.3666 2.17498 18.3666H5.07498H7.97498ZM8.45832 8.69994H10.3917V17.3999H8.45832V11.5999V8.69994ZM5.55832 12.0833H7.49165V17.3999H5.55832V14.0166V12.0833ZM2.65832 14.4999H4.59165V17.3999H2.65832V14.4999Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M24.4083 11.6V3.38336C24.4083 3.09336 24.215 2.90002 23.925 2.90002H13.775C13.485 2.90002 13.2916 3.09336 13.2916 3.38336V11.6C13.2916 11.89 13.485 12.0834 13.775 12.0834H23.925C24.215 12.0834 24.4083 11.89 24.4083 11.6ZM23.4416 5.80002H17.6416V3.86669H23.4416V5.80002ZM16.675 3.86669V5.80002H14.2583C14.2583 5.02669 14.2583 3.86669 14.2583 3.86669H16.675ZM14.2583 6.76669H16.675V11.1167H14.2583C14.2583 11.1167 14.2583 8.84502 14.2583 6.76669ZM17.6416 11.1167V6.76669H23.4416V11.1167H17.6416Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M23.925 13.5333H13.775V14.5H23.925V13.5333Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M23.925 15.95H13.775V16.9166H23.925V15.95Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M23.925 18.3667H13.775V19.3334H23.925V18.3667Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M9.9083 2.90002H7.0083V3.86669H9.9083V2.90002Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M11.3583 5.31665H7.0083V6.28332H11.3583V5.31665Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M10.3916 20.7833H7.0083V21.75H10.3916V20.7833Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M15.225 20.7833H11.8417V21.75H15.225V20.7833Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M20.0584 20.7833H16.675V21.75H20.0584V20.7833Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M10.3916 23.2H7.0083V24.1666H10.3916V23.2Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M15.225 23.2H11.8417V24.1666H15.225V23.2Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M20.0584 23.2H16.675V24.1666H20.0584V23.2Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M10.3916 25.6167H7.0083V26.5834H10.3916V25.6167Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M15.225 25.6167H11.8417V26.5834H15.225V25.6167Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
                <path
                  d="M20.0584 25.6167H16.675V26.5834H20.0584V25.6167Z"
                  fill={`${subMenus?.transcript[0] ? "black" : "#a3a9b5"}`}
                />
              </svg>
              <p className={`text-[9px]`}>Annual Report</p>
            </div>
            <div
              onMouseOver={() => setAnnualReport(true)}
              onMouseLeave={() => setAnnualReport(false)}
              className={`absolute z-100 text-black left-[50px] md:left-[125px] translate-y-[-72px] text-xs p-1 rounded-md bg-[#c8e3ff]/90 ml-2 max-h-[150px] overflow-y-auto min-w-[110px] font-semibold ${
                !annualReport && "hidden"
              }`}
            >
              {subMenus?.annual_report[0] ? (
                subMenus?.annual_report?.map((item) => (
                  <p
                    onClick={() => {
                      !openedTabs.includes(item) &&
                        setOpenedTabs([...openedTabs, item]);
                      setSelectedTab(item);
                    }}
                    key={item.link}
                    className="cursor-pointer hover:underline"
                  >
                    {item.heading}
                  </p>
                ))
              ) : (
                <p>No Annual Reports!</p>
              )}
            </div>
          </div>

          {/* Interview*/}
          <div
            onMouseOver={() => setInterview(true)}
            onMouseLeave={() => setInterview(false)}
            className="w-full"
          >
            <div
              className={`flex gap-1 ${
                !sidebarOpen && "flex-col hover:rounded-md"
              } items-center hover:bg-white/20  ${
                interview && "bg-white/20"
              } cursor-pointer p-2 text-center ${
                subMenus?.interview[0] ? "text-black" : "text-gray-400"
              }`}
            >
              <GoPeople size={30} />
              <p className={`text-[9px]`}>Interview</p>
            </div>
            <div
              onMouseOver={() => setInterview(true)}
              onMouseLeave={() => setInterview(false)}
              className={`absolute z-100 text-black left-[50px] md:left-[125px] translate-y-[-56px] text-xs p-1 rounded-md  bg-[#c8e3ff]/90 ml-2 max-h-[150px] overflow-y-auto min-w-[110px] font-semibold ${
                !interview && "hidden"
              }`}
            >
              {subMenus?.interview[0] ? (
                subMenus?.interview?.map((item) => (
                  <p
                    onClick={() => {
                      !openedTabs.includes(item) &&
                        setOpenedTabs([...openedTabs, item]);
                      setSelectedTab(item);
                    }}
                    key={item.link}
                    className="cursor-pointer hover:underline"
                  >
                    {item.heading}
                  </p>
                ))
              ) : (
                <p>No Interviews!</p>
              )}
            </div>
          </div>

          {/* Broker*/}
          <div
            onMouseOver={() => setBrokerReport(true)}
            onMouseLeave={() => setBrokerReport(false)}
            className="w-full"
          >
            <div
              className={`flex gap-1 flex-col hover:rounded-md items-center hover:bg-white/20  ${
                brokerReport && "bg-white/20"
              } cursor-pointer p-2 text-center ${
                subMenus?.broker[0] ? "text-black" : "text-gray-400"
              }`}
            >
              <MdMan2 size={35} />
              <p className={`text-[9px]`}>Broker Report</p>
            </div>
            <div
              onMouseOver={() => setBrokerReport(true)}
              onMouseLeave={() => setBrokerReport(false)}
              className={`absolute z-100 text-black left-[50px] md:left-[125px] translate-y-[-72px] text-xs p-1 rounded-md bg-[#c8e3ff]/90 ml-2 max-h-[150px] overflow-y-auto min-w-[110px] font-semibold ${
                !brokerReport && "hidden"
              } `}
            >
              {subMenus?.broker[0] ? (
                subMenus?.broker?.map((item) => (
                  <p
                    onClick={() => {
                      !openedTabs.includes(item) &&
                        setOpenedTabs([...openedTabs, item]);
                      setSelectedTab(item);
                    }}
                    key={item.link}
                    className="cursor-pointer hover:underline"
                  >
                    {item.heading}
                  </p>
                ))
              ) : (
                <p>No Broker Reports!</p>
              )}
            </div>
          </div>

          {/* News*/}
          <div
            onMouseOver={() => setNews(true)}
            onMouseLeave={() => setNews(false)}
            onClick={() => {
              subMenus?.news[0] &&
                !openedTabs?.filter((item) => item.type == "news").length > 0 &&
                setOpenedTabs([
                  ...openedTabs,
                  {
                    heading: "NEWS",
                    type: "news",
                    data: subMenus?.news,
                    link: "news",
                  },
                ]);
              subMenus?.news[0] &&
                setSelectedTab({
                  heading: "NEWS",
                  type: "news",
                  data: subMenus?.news,
                  link: "news",
                });
            }}
            className={`w-full ${
              subMenus?.news[0] ? "text-black" : "text-gray-400"
            }`}
          >
            <div
              className={`flex gap-1 flex-col  items-center hover:bg-white/20  ${
                interview && "bg-white/20"
              } cursor-pointer p-2 text-center`}
            >
              <IoNewspaperOutline size={35} />
              <p className={`text-[9px]`}>News</p>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default WebSidebar;
