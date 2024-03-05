import React, { useEffect, useRef, useState } from "react";
import logo from "@/assets/images/logo.png";
import avatar from "@/assets/images/avatar.png";
import Select from "@/components/GisSelect";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/router";
import { useInfoContext } from "@/context/info";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import {
  IoSearchCircleOutline,
  IoSearchCircleSharp,
  IoSearchOutline,
} from "react-icons/io5";
import SearchBar from "./SearchBar";

const Navbar = ({ isSidebarOpen, openSidebar }) => {
  const router = useRouter();
  const { fincodeLink } = router.query;

  const dropdownRef = useRef(null);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchFlag, setSearchFlag] = useState(false);
  const navSearchRef = useRef(null);
  const inputRef = useRef(null);

  const {
    uid,
    setUid,
    companyName,
    setCompanyName,
    companySymbol,
    setCompanySymbol,
    initData,
    fincode,
    setFincode,
    dashFincode,
    setDashFincode,
    dashCompName,
    setDashCompName,
    companyPage,
    setCompanyPage,
    setMenuFincode,
    earningsPage,
    setEarningsPage,
  } = useInfoContext();
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  useEffect(() => {
    var uidLocal = window?.localStorage?.getItem("UserId");
    var uNameLocal = window?.localStorage?.getItem("UserName");
    uidLocal ? setUid(uidLocal) : setUid(-1);
    uNameLocal ? setUserName(uNameLocal) : setUserName(null);
  }, [uid]);

  useEffect(() => {
    const userID = window.localStorage.getItem("UserId");
    userID &&
      setEarningsPage([
        {
          name: "Calendar",
          link: `/calendar/${userID}`,
          type: "tab",
        },
        {
          name: "Analysis",
          link: `/earningcalls/${userID}`,
          type: "tab",
        },
      ]);
  }, []);

  useEffect(() => {
    let handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   console.log("Name" + companyName);
  //   console.log("Symbol" + Symbol);
  // }, [companyName, companySymbol]);

  // SearchBy for React Select
  const customFilterOption = (option, rawInput) => {
    const optionLabel = option.data.search.toLowerCase();
    const input = rawInput.toLowerCase();

    return optionLabel.toLowerCase().includes(input);
  };

  useEffect(() => {
    initData && setDashFincode(initData?.fincode.value);
    initData && setDashCompName(initData?.CompName.value);
  }, [initData]);

  // Handle Outside Clicks
  const handleOutsideClick = (e) => {
    if (navSearchRef.current && !navSearchRef.current.contains(e.target)) {
      setSearchFlag(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
  // const clearInput = (e) => {
  //   inputRef.current.value = "";
  // };

  return (
    <>
      <div className="w-full z-50 flex flex-row justify-between items-center bg-[#f4f7fa] p-1 relative scrollbar-thin">
        <div className="flex flex-row gap-2 lg:gap-4">
          <button
            className="text-2xl max-w-xs md:hidden"
            onClick={() => openSidebar()}
          >
            {isSidebarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>

          <div className="flex flex-row gap-1 lg:gap-4 items-center">
            {router.pathname === "/" ? (
              <>
                <button
                  onClick={() => {
                    router.push("/featuredcompanies");
                  }}
                  className="font-semibold text-rose-600 text-lg md:text-xl flex flex-row gap-3"
                >
                  Featured Companies
                </button>
              </>
            ) : (
              <>
                <Link
                  href={"/"}
                  className="flex items-center mx-1 lg:mx-4 md:hidden"
                >
                  <Image src={logo} alt="GIS" className="w-[60px] h-auto" />
                </Link>

                <div className="min-w-[170px] md:min-w-[300px] lg:min-w-[500px]  max-w-[220px] md:max-w-[300px] lg:max-w-[500px] lg:ml-5">
                  <SearchBar
                    handleChange={(option) => {
                      setCompanyName(option?.label);
                      setCompanySymbol(option?.symbol);
                      router.pathname != "/researchDashboard" &&
                        router.pathname != "/valuation" &&
                        router.push(`/companyinfo/${option.value}`);

                      router.pathname === "/valuation" &&
                        router.push(`/valuation`);

                      setFincode(option.value);
                      window.localStorage.setItem("localFincode", option.value);
                      setCompanyPage([
                        {
                          name: "SnapShot",
                          link: `/companyinfo/${option.value}`,
                          type: "tab",
                        },
                        {
                          name: "Resources",
                          link: "/researchDashboard",
                          type: "tab",
                        },
                        {
                          name: "Valuation",
                          link: `/valuation`,
                          type: "tab",
                        },
                      ]);
                      setDashFincode(option.value);
                      setDashCompName(option.label);
                      setMenuFincode(option.value);
                    }}
                    placeholder={
                      router.pathname === "/researchDashboard"
                        ? dashCompName
                        : router.pathname === "/companyinfo/[fincodeLink]"
                        ? initData?.CompName.value
                        : router.pathname === "/valuation" &&
                          dashCompName
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* USER LOGIN and All */}
        <div className="flex flex-row">
          {uid !== -1 ? (
            <>
              <div className="relative">
                <div
                  className="flex flex-row p-1 md:border border-black items-center rounded-md cursor-pointer"
                  onClick={() => {
                    setIsDropdownOpen((prev) => !prev);
                  }}
                >
                  <Image
                    src={avatar}
                    alt=""
                    className="h-[32px] w-auto md:h-[29px] rounded-full"
                  />
                  <div className="items-center justify-center mx-2 text-[10px] md:text-base hidden md:block">
                    {userName}
                  </div>
                </div>
                {/* DROPDOWN MENU */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-[80%] md:top-[90%] right-[10%] md:right-[0%] w-28 md:w-36 bg-white border border-black mt-2 px-3 rounded-md shadow-lg z-100"
                  >
                    {/* Dropdown content goes here */}
                    <ul>
                      <Link
                        href={`/profile`}
                        className="w-full flex items-center text-xs md:text-base mt-1"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/contactus`}
                        className="w-full flex items-center text-xs md:text-base mt-1"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        Contact Us
                      </Link>
                      <hr className="border-t border-gray-400 -mx-3" />
                      <li
                        className="w-full flex items-center text-xs md:text-base mt-1 cursor-pointer"
                        onClick={() => {
                          setUserName(null);
                          setUid(null);
                          window.localStorage.removeItem("UserId");
                          window.localStorage.removeItem("UserName");
                          window.localStorage.removeItem("UserEmail");
                          router.push("/");
                        }}
                      >
                        Log Out <FiLogOut className="ml-2" />
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row gap-3">
                <Link href={`/contactus`} className="text-[10px] md:text-sm py-0.5 md:py-1 underline underline-offset-2 lg:no-underline lg:hover:underline lg:hover:underline-offset-2 hidden md:block">
                  CONTACT US
                </Link>
                <Link
                  href={"/loginpage"}
                  className="text-[10px] md:text-sm py-1.5 md:py-1 px-1.5 md:px-6 ml-1 md:ml-0 border md:border-2 border-gray-400 rounded-md hover:border-black flex items-center whitespace-nowrap"
                >
                  SIGN IN
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
