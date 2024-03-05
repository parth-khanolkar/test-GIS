import { useInfoContext } from "@/context/info";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { CgPlayListSearch } from "react-icons/cg";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  IoCloseSharp,
  IoDocumentText,
  IoDocumentTextOutline,
  IoSearch,
} from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import transcript from "@/assets/dashboardImages/transcript.png";
import Image from "next/image";
import { BsFiletypePpt } from "react-icons/bs";
import { TfiAnnouncement } from "react-icons/tfi";

const Sidebar = () => {
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

  // SearchBy for React Select
  const customFilterOption = (option, rawInput) => {
    const optionLabel = option.data.search.toLowerCase();
    const input = rawInput.toLowerCase();

    return optionLabel.toLowerCase().includes(input);
  };

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

  return (
    <div
      className={`text-black w-full h-full flex flex-col gap-[11px] py-[20px] overflow-y-auto min-w-[60px] ${
        sidebarOpen && "w-[200px]"
      } border border-gray-200 shadow-md rounded-md`}
    >
      {/* Open/Close MENU Button */}
      <div
        className={`flex ${
          sidebarOpen ? "justify-left" : "justify-center"
        } items-center cursor-pointer`}
      >
        {sidebarOpen ? (
          <IoCloseSharp
            onClick={() => {
              setSidebarOpen(false);
              setTranscript(false);
              setSearch(false);
              setPpt(false);
              setAnnouncement(false);
              setAnnualReport(false);
              setNews(false);
              setInterview(false);
            }}
            size={34}
            className="hover:bg-white/20 rounded-md"
          />
        ) : (
          <RxHamburgerMenu
            onClick={() => {
              setSidebarOpen(true);
              setTranscript(false);
            }}
            size={34}
            className="hover:bg-white/20 rounded-md"
          />
        )}
      </div>

      {/* Menu Items */}
      <div
        className={`flex flex-col ${
          !sidebarOpen && "items-center"
        } gap-[11px] h-full overflow-y-auto overflow-x-hidden scrollbar-thin font-bold`}
      >
        {/* Transcript */}
        <div className="relative">
          <div
            className={`flex gap-1 ${
              !sidebarOpen && "flex-col hover:rounded-md"
            } items-center hover:bg-white/20  ${
              transcript && "bg-white/20"
            } cursor-pointer p-2`}
            onClick={() => {
              dashFincode && setTranscript(!transcript);
              dashFincode && setSidebarOpen(true);
            }}
          >
            <IoDocumentTextOutline size={35} />
            <p
              className={`${
                sidebarOpen ? "text-base" : "text-[9px]"
              } font-bold`}
            >
              Transcript
            </p>
            {transcript ? (
              <FaAngleUp className={`${!sidebarOpen && "hidden"}`} />
            ) : (
              <FaAngleDown className={`${!sidebarOpen && "hidden"}`} />
            )}
          </div>
          <div
            className={`text-xs ${
              !transcript && "hidden"
            } bg-white/20 p-2 flex flex-col gap-1 border-t-2 border-white/50`}
          >
            {subMenus?.transcript?.map((item) => (
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
            ))}
          </div>
        </div>

        {/* PPT */}
        <div>
          <div
            className={`flex gap-1 ${
              !sidebarOpen && "flex-col hover:rounded-md"
            } items-center hover:bg-white/20  ${
              ppt && "bg-white/20"
            } cursor-pointer p-2`}
            onClick={() => {
              dashFincode && setPpt(!ppt);
              dashFincode && setSidebarOpen(true);
            }}
          >
            <BsFiletypePpt size={30} />
            <p className={`${sidebarOpen ? "text-base" : "text-[9px]"}`}>PPT</p>
            {ppt ? (
              <FaAngleUp className={`${!sidebarOpen && "hidden"}`} />
            ) : (
              <FaAngleDown className={`${!sidebarOpen && "hidden"}`} />
            )}
          </div>
          <div
            className={`text-xs ${!sidebarOpen && "hidden"} ${
              !ppt && "hidden"
            } bg-white/20 p-2 flex flex-col gap-1 border-t-2 border-white/50`}
          >
            {subMenus?.investor_ppt?.map((item) => (
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
            ))}
          </div>
        </div>

        {/* Announcement */}
        <div>
          <div
            className={`flex gap-1 ${
              !sidebarOpen && "flex-col hover:rounded-md"
            } items-center hover:bg-white/20  ${
              announcement && "bg-white/20"
            } cursor-pointer p-2`}
            onClick={() => {
              dashFincode && setAnnouncement(!announcement);
              dashFincode && setSidebarOpen(true);
            }}
          >
            <TfiAnnouncement size={30} />
            <p className={`${sidebarOpen ? "text-base" : "text-[9px]"}`}>
              Anncmnt
            </p>
            {announcement ? (
              <FaAngleUp className={`${!sidebarOpen && "hidden"}`} />
            ) : (
              <FaAngleDown className={`${!sidebarOpen && "hidden"}`} />
            )}
          </div>
          <div
            className={`text-xs ${!sidebarOpen && "hidden"} ${
              !announcement && "hidden"
            } bg-white/20 p-2 flex flex-col gap-1 border-t-2 border-white/50`}
          >
            {subMenus?.annoucement?.map((item) => (
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
            ))}
          </div>
        </div>

        {/* Annual Report*/}
        <div>
          <div
            className={`flex gap-1 ${
              !sidebarOpen && "flex-col hover:rounded-md"
            } items-center hover:bg-white/20  ${
              annualReport && "bg-white/20"
            } cursor-pointer p-2 text-center`}
            onClick={() => {
              dashFincode && setAnnualReport(!annualReport);
              dashFincode && setSidebarOpen(true);
            }}
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
                fill="black"
              />
              <path
                d="M7.97498 18.3666H10.875H12.8083V17.3999H11.3583V8.21661C11.3583 7.92661 11.165 7.73328 10.875 7.73328H7.97498C7.68498 7.73328 7.49165 7.92661 7.49165 8.21661V11.1166H5.07498C4.78498 11.1166 4.59165 11.3099 4.59165 11.5999V13.5333H2.17498C1.88498 13.5333 1.69165 13.7266 1.69165 14.0166V17.8833C1.69165 18.1733 1.88498 18.3666 2.17498 18.3666H5.07498H7.97498ZM8.45832 8.69994H10.3917V17.3999H8.45832V11.5999V8.69994ZM5.55832 12.0833H7.49165V17.3999H5.55832V14.0166V12.0833ZM2.65832 14.4999H4.59165V17.3999H2.65832V14.4999Z"
                fill="black"
              />
              <path
                d="M24.4083 11.6V3.38336C24.4083 3.09336 24.215 2.90002 23.925 2.90002H13.775C13.485 2.90002 13.2916 3.09336 13.2916 3.38336V11.6C13.2916 11.89 13.485 12.0834 13.775 12.0834H23.925C24.215 12.0834 24.4083 11.89 24.4083 11.6ZM23.4416 5.80002H17.6416V3.86669H23.4416V5.80002ZM16.675 3.86669V5.80002H14.2583C14.2583 5.02669 14.2583 3.86669 14.2583 3.86669H16.675ZM14.2583 6.76669H16.675V11.1167H14.2583C14.2583 11.1167 14.2583 8.84502 14.2583 6.76669ZM17.6416 11.1167V6.76669H23.4416V11.1167H17.6416Z"
                fill="black"
              />
              <path
                d="M23.925 13.5333H13.775V14.5H23.925V13.5333Z"
                fill="black"
              />
              <path
                d="M23.925 15.95H13.775V16.9166H23.925V15.95Z"
                fill="black"
              />
              <path
                d="M23.925 18.3667H13.775V19.3334H23.925V18.3667Z"
                fill="black"
              />
              <path
                d="M9.9083 2.90002H7.0083V3.86669H9.9083V2.90002Z"
                fill="black"
              />
              <path
                d="M11.3583 5.31665H7.0083V6.28332H11.3583V5.31665Z"
                fill="black"
              />
              <path
                d="M10.3916 20.7833H7.0083V21.75H10.3916V20.7833Z"
                fill="black"
              />
              <path
                d="M15.225 20.7833H11.8417V21.75H15.225V20.7833Z"
                fill="black"
              />
              <path
                d="M20.0584 20.7833H16.675V21.75H20.0584V20.7833Z"
                fill="black"
              />
              <path
                d="M10.3916 23.2H7.0083V24.1666H10.3916V23.2Z"
                fill="black"
              />
              <path
                d="M15.225 23.2H11.8417V24.1666H15.225V23.2Z"
                fill="black"
              />
              <path
                d="M20.0584 23.2H16.675V24.1666H20.0584V23.2Z"
                fill="black"
              />
              <path
                d="M10.3916 25.6167H7.0083V26.5834H10.3916V25.6167Z"
                fill="black"
              />
              <path
                d="M15.225 25.6167H11.8417V26.5834H15.225V25.6167Z"
                fill="black"
              />
              <path
                d="M20.0584 25.6167H16.675V26.5834H20.0584V25.6167Z"
                fill="black"
              />
            </svg>
            <p className={`${sidebarOpen ? "text-base" : "text-[9px]"}`}>
              Annual Report
            </p>
            {annualReport ? (
              <FaAngleUp className={`${!sidebarOpen && "hidden"}`} />
            ) : (
              <FaAngleDown className={`${!sidebarOpen && "hidden"}`} />
            )}
          </div>
          <div
            className={`text-xs ${!sidebarOpen && "hidden"} ${
              !annualReport && "hidden"
            } bg-white/20 p-2 flex flex-col gap-1 border-t-2 border-white/50`}
          >
            {subMenus?.annual_report?.map((item) => (
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
            ))}
          </div>
        </div>

        {/* News*/}
        {/* <div
          className={`flex gap-1 p-2 ${
            !sidebarOpen && "flex-col"
          } items-center hover:scale-105 cursor-pointer`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
          >
            <path
              d="M11.4502 22.8161C12.3376 24.702 13.6637 26.5049 15.3984 28.1835C11.7622 27.6375 8.73874 25.4182 7.09678 22.3487L11.4502 22.8161H11.4502ZM15.3324 5.90764C11.7899 6.46273 8.84004 8.60323 7.18991 11.5665L11.4513 11.1468C12.3277 9.29894 13.6337 7.54017 15.3324 5.9076L15.3324 5.90764ZM16.6685 11.2029L16.7276 5.78448H16.7156C14.8097 7.44806 13.3593 9.24893 12.3927 11.1549L16.6684 11.2031L16.6685 11.2029ZM7.46503 12.8855L6.67782 12.8785L5.89957 12.8684L5.83848 18.4962L2.68757 12.8343L0.930822 12.8152L0.844727 20.8238L1.62796 20.8348L2.40717 20.8418L2.46929 15.0687L5.71141 20.8778L7.38006 20.8969L7.4652 12.8854L7.46503 12.8855ZM14.9538 14.3889L14.9608 13.6748L14.9698 12.9657L9.07256 12.9026L8.98647 20.9142L15.067 20.9783L15.075 20.2662L15.082 19.5561L10.6761 19.509L10.6981 17.4187L14.6153 17.4608L14.6223 16.7737L14.6293 16.0826L10.7121 16.0415L10.7312 14.3428L14.9538 14.3888V14.3889ZM22.9483 18.8679L21.8507 13.0407L20.0688 13.0196L18.8619 18.8718L17.5859 12.9946L15.8462 12.9746L17.9896 21.0101L18.7838 21.0181L19.5801 21.0282L20.9051 14.7324L22.124 21.0543L22.9233 21.0653L23.7165 21.0733L26.0321 13.0857L24.3405 13.0677L22.9483 18.8678L22.9483 18.8679ZM17.588 5.79441H17.5759L17.5179 11.2119L21.7967 11.257C20.8692 9.32998 19.459 7.49909 17.588 5.79441H17.588ZM26.7263 11.3091C24.9455 8.33678 21.9068 6.27543 18.3648 5.85707C20.6337 7.61424 21.9007 9.40007 22.739 11.267L26.7262 11.309L26.7263 11.3091ZM18.4253 28.2156C22.0595 27.7498 25.1119 25.6108 26.8232 22.6083L22.4886 22.9352C21.5602 24.8011 20.194 26.5739 18.4253 28.2155L18.4253 28.2156ZM21.5401 22.9253L17.3926 22.8801L17.3365 28.0543C19.1614 26.4648 20.5725 24.7391 21.5401 22.9252L21.5401 22.9253ZM32.5854 17.3024C32.1949 16.9569 31.4216 16.6465 30.2587 16.377C29.4575 16.1847 28.9337 16.0274 28.6893 15.8912C28.4399 15.76 28.3147 15.5727 28.3178 15.3314C28.3198 15.0019 28.443 14.7345 28.6863 14.5511C28.9257 14.3738 29.2602 14.2827 29.6839 14.2887C30.1747 14.2927 30.5713 14.411 30.8748 14.6342C31.1762 14.8596 31.3396 15.1611 31.3636 15.5437L32.9931 15.5637C32.941 14.7575 32.6355 14.1204 32.0767 13.6417C31.5208 13.1629 30.7916 12.9196 29.8943 12.9106C28.9368 12.8996 28.1726 13.1209 27.6047 13.5656C27.0378 14.0154 26.7504 14.6363 26.7423 15.4095C26.7353 16.1037 26.9417 16.6164 27.3613 16.9499C27.7869 17.2814 28.6342 17.598 29.9003 17.8934C30.5894 18.0537 31.0371 18.2109 31.2474 18.3511C31.4598 18.4954 31.566 18.7157 31.5629 19.0202C31.5599 19.3256 31.4067 19.5601 31.1052 19.7303C30.8027 19.8986 30.3871 19.9807 29.8512 19.9747C29.3334 19.9687 28.9278 19.8515 28.6414 19.6181C28.351 19.3887 28.2027 19.0633 28.1887 18.6336L26.5772 18.6166C26.6062 19.482 26.9057 20.151 27.4706 20.6257C28.0365 21.1045 28.8268 21.3459 29.8373 21.3559C30.8498 21.3659 31.6501 21.1586 32.2471 20.7199C32.846 20.2832 33.1465 19.6913 33.1545 18.9381C33.1665 18.1909 32.9742 17.644 32.5856 17.3025L32.5854 17.3024ZM16.4882 28.0403L16.5443 22.8722L12.3968 22.8271C13.3282 24.6599 14.6994 26.4147 16.4882 28.0403L16.4882 28.0403Z"
              fill="white"
            />
          </svg>
          <p className={`${sidebarOpen ? "text-base" : "text-[9px]"}`}>News</p>
        </div> */}

        {/* Interview*/}
        <div>
          <div
            className={`flex gap-1 ${
              !sidebarOpen && "flex-col hover:rounded-md"
            } items-center hover:bg-white/20  ${
              interview && "bg-white/20"
            } cursor-pointer p-2 text-center`}
            onClick={() => {
              dashFincode && setInterview(!interview);
              dashFincode && setSidebarOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
            >
              <path
                d="M22.3954 21.875C22.99 22.5348 23.3333 23.4007 23.3333 24.3163V26.9792C23.3333 28.9927 21.701 30.625 19.6875 30.625H6.56246C4.54892 30.625 2.91663 28.9927 2.91663 26.9792V24.3165C2.91663 23.4008 3.25996 22.5348 3.85473 21.875H3.64579C3.24309 21.875 2.91663 21.5485 2.91663 21.1458C2.91663 20.7431 3.24309 20.4167 3.64579 20.4167H6.06895L9.04705 18.7545C7.96391 17.6954 7.29163 16.2179 7.29163 14.5833C7.29163 11.3617 9.9033 8.75001 13.125 8.75001C16.3466 8.75001 18.9583 11.3617 18.9583 14.5833C18.9583 14.7075 18.9544 14.8308 18.9468 14.953L19.7304 14.1493C19.2435 13.444 18.9583 12.5886 18.9583 11.6667C18.9583 9.25043 20.917 7.29167 23.3333 7.29167C25.7495 7.29167 27.7083 9.25043 27.7083 11.6667C27.7083 12.5875 27.4238 13.4419 26.9379 14.1467L26.9436 14.1525L29.5911 16.8711C30.254 17.5519 30.625 18.4645 30.625 19.4147V20.4167H31.3541C31.7568 20.4167 32.0833 20.7431 32.0833 21.1458C32.0833 21.5485 31.7568 21.875 31.3541 21.875H22.3954ZM20.1816 20.4167H29.1666V19.4147C29.1666 18.8446 28.944 18.297 28.5463 17.8885L25.9221 15.1939C25.1972 15.7268 24.302 16.0417 23.3333 16.0417C22.3657 16.0417 21.4714 15.7275 20.747 15.1957L18.1212 17.8886C17.8151 18.2026 17.7736 18.2465 17.6928 18.3483C17.5536 18.5234 17.5044 18.6537 17.5002 18.9198L20.1816 20.4167ZM19.3127 21.6018L15.9172 19.7062C15.0879 20.1592 14.1365 20.4167 13.125 20.4167C12.1137 20.4167 11.1626 20.1594 10.3334 19.7066L5.49635 22.4064C4.80401 22.7928 4.37496 23.5236 4.37496 24.3165V26.9792C4.37496 28.1873 5.35434 29.1667 6.56246 29.1667H19.6875C20.8956 29.1667 21.875 28.1873 21.875 26.9792V24.3163C21.875 23.5235 21.446 22.7927 20.7537 22.4063L19.7924 21.8696C19.5989 21.8459 19.4288 21.7465 19.3127 21.6018ZM13.125 18.9583C15.5412 18.9583 17.5 16.9996 17.5 14.5833C17.5 12.1671 15.5412 10.2083 13.125 10.2083C10.7087 10.2083 8.74996 12.1671 8.74996 14.5833C8.74996 16.9996 10.7087 18.9583 13.125 18.9583ZM23.3333 14.5833C24.9441 14.5833 26.25 13.2775 26.25 11.6667C26.25 10.0558 24.9441 8.75001 23.3333 8.75001C21.7225 8.75001 20.4166 10.0558 20.4166 11.6667C20.4166 13.2775 21.7225 14.5833 23.3333 14.5833Z"
                fill="black"
              />
            </svg>
            <p className={`${sidebarOpen ? "text-base" : "text-[9px]"}`}>
              Interview
            </p>
            {interview ? (
              <FaAngleUp className={`${!sidebarOpen && "hidden"}`} />
            ) : (
              <FaAngleDown className={`${!sidebarOpen && "hidden"}`} />
            )}
          </div>
          <div
            className={`text-xs ${!sidebarOpen && "hidden"} ${
              !interview && "hidden"
            } bg-white/20 p-2 flex flex-col gap-1 border-t-2 border-white/50`}
          >
            {subMenus?.interview?.map((item) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
