import React, { useEffect, useRef, useState } from "react";

import analysisLogo from "@/assets/images/Menu Icons/analysis.png";
import calendarLogo from "@/assets/images/Menu Icons/calendar.png";

import blogImage from "@/assets/images/landingPageIcons/blog.png";
import bulkBlockImage from "@/assets/images/landingPageIcons/bulk_block.png";
import earningsImage from "@/assets/images/landingPageIcons/earnings.png";
import eventsImage from "@/assets/images/landingPageIcons/events.png";
import marketImage from "@/assets/images/landingPageIcons/market.png";
import newsImage from "@/assets/images/landingPageIcons/news.png";
import sectorImage from "@/assets/images/landingPageIcons/sector.png";
import watchlistImage from "@/assets/images/landingPageIcons/watchlist.png";
import homeImage from "@/assets/images/landingPageIcons/home.png";

import industryImage from "@/assets/images/Menu Icons/industry.png";
import screenerImage from "@/assets/images/Menu Icons/screener.png";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { useRouter } from "next/router";
import { useInfoContext } from "@/context/info";
import { useSelect } from "downshift";
import { IoPieChart, IoPieChartOutline } from "react-icons/io5";
import {
  HiOutlineGlobe,
  HiOutlinePresentationChartBar,
  HiPresentationChartBar,
} from "react-icons/hi";
import { FaGlobeAmericas, FaIndustry } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { CgWebsite } from "react-icons/cg";
import { TbChartCandleFilled } from "react-icons/tb";
import { LuCandlestickChart, LuFactory } from "react-icons/lu";

const NewSidebar = ({ isSidebarOpen, openSidebar, closeSidebar }) => {
  const router = useRouter();
  const { fincodeLink } = router.query;
  const sidebarRef = useRef(null);
  const {
    menuFincode,
    uid,
    setUid,
    companyPage,
    setCompanyPage,
    screenerPage,
    setScreenerPage,
    industryPage,
    setIndustryPage,
    marketPage,
    setMarketPage,
    earningsPage,
    setEarningsPage,
    selectedSideMenu,
    setSelectedSideMenu,
    selectedMenu,
    setSelectedMenu,
    newsPage,
  } = useInfoContext();

  useEffect(() => {
    // HOMEPAGE
    router.pathname == `/` &&
      (setSelectedMenu(null), setSelectedSideMenu(null));

    // COMPANY
    (router.pathname == `/companyinfo/[fincodeLink]` ||
      router.pathname == `/valuation` ||
      router.pathname == `/researchDashboard`) &&
      setSelectedSideMenu("Company");
    router.pathname == `/companyinfo/[fincodeLink]` &&
      setSelectedMenu("SnapShot");
    router.pathname == `/valuation` &&
      setSelectedMenu("Valuation");
    router.pathname == `/researchDashboard` && setSelectedMenu("Resources");

    //Screener
    (router.pathname == `/technicalScreen` ||
      router.pathname == `/fundamentalScreen` ||
      router.pathname == `/bulk-block` ||
      router.pathname == `/resultScreen`) &&
      setSelectedSideMenu("Screener");
    router.pathname == `/technicalScreen` && setSelectedMenu("Technical");
    router.pathname == `/fundamentalScreen` && setSelectedMenu("Fundamental");
    router.pathname == `/bulk-block` && setSelectedMenu("Bulk Block");
    router.pathname == `/resultScreen` && setSelectedMenu("Result");

    // Industry
    (router.pathname == `/economy` || router.pathname == `/metals`) &&
      setSelectedSideMenu("Industry");
    router.pathname == `/economy` && setSelectedMenu("Economy");
    router.pathname == `/metals` && setSelectedMenu("Metals");

    // Market
    (router.pathname == `/marketPage` ||
      router.pathname == `/globalMarket` ||
      router.pathname == `/watchlist`) &&
      setSelectedSideMenu("Market");
    router.pathname == `/marketPage` && setSelectedMenu("Market");
    router.pathname == `/globalMarket` && setSelectedMenu("Global");
    router.pathname == `/watchlist` && setSelectedMenu("Watchlist");

    // Earnings
    (router.pathname == `/earningcalls/[uid]` ||
      router.pathname == `/calendar/[uid]`) &&
      setSelectedSideMenu("Earnings");
    router.pathname == `/calendar/[uid]` && setSelectedMenu("Calendar");
    router.pathname == `/earningcalls/[uid]` && setSelectedMenu("Analysis");

    // News
    router.pathname == `/news` &&
      (setSelectedMenu("News"), setSelectedSideMenu("News"));
    router.pathname == `/news` && setSelectedMenu("News");
    router.pathname == `/interviews` && setSelectedMenu("Interviews");
    router.pathname == `/brokerReport` && setSelectedMenu("Broker Report");
  }, [router.pathname]);

  const [topOptionsSideBar, setTopOptionsSidebar] = useState([
    // {
    //   Option: "StockInsta",
    //   link: `/stockInsta/${uid}`,
    //   image: sectorImage,
    // },
    {
      Option: "Company",
      link: `/companyinfo/${menuFincode}`,
      image: sectorImage,
      subMenu: companyPage,
    },
    {
      Option: "Screener",
      link: "/technicalScreen",
      image: screenerImage,
      subMenu: screenerPage,
    },
    {
      Option: "Industry",
      link: "/economy",
      image: industryImage,
      subMenu: industryPage,
    },
    {
      Option: "Market",
      link: "/marketPage",
      image: marketImage,
      subMenu: marketPage,
    },
    {
      Option: "Earnings",
      link: `/calendar/${uid}`,
      image: earningsImage,
      subMenu: earningsPage,
    },
    {
      Option: "News",
      link: "/news",
      image: newsImage,
      subMenu: newsPage,
    },
    {
      Option: "Blogs",
      link: "/blogs",
      image: blogImage,
    },
  ]);

  useEffect(() => {
    const items = window.localStorage.getItem("localFincode");
    const userID = window.localStorage.getItem("UserId");

    if (items) {
      setTopOptionsSidebar([
        // {
        //   Option: "StockInsta",
        //   link: `/stockInsta/${uid}`,
        //   image: sectorImage,
        // },
        {
          Option: "Company",
          link: `/companyinfo/${items}`,
          image: sectorImage,
          subMenu: companyPage,
        },
        {
          Option: "Screener",
          link: "/technicalScreen",
          image: screenerImage,
          subMenu: screenerPage,
        },
        {
          Option: "Industry",
          link: "/economy",
          image: industryImage,
          subMenu: industryPage,
        },
        {
          Option: "Market",
          link: "/marketPage",
          image: marketImage,
          subMenu: marketPage,
        },
        {
          Option: "Earnings",
          link: `/calendar/${uid}`,
          image: earningsImage,
          subMenu: earningsPage,
        },
        {
          Option: "News",
          link: "/news",
          image: newsImage,
          subMenu: newsPage,
        },
        {
          Option: "Blogs",
          link: "/blogs",
          image: blogImage,
        },
      ]);

      setEarningsPage([
        {
          name: "Calendar",
          link: `/calendar/${uid}`,
          image: calendarLogo,
          type: "tab",
        },
        {
          name: "Analysis",
          link: `/earningcalls/${uid}`,
          image: analysisLogo,
          type: "tab",
        },
      ]);
    }

    if (userID) {
      setTopOptionsSidebar([
        // {
        //   Option: "StockInsta",
        //   link: `/stockInsta/${userID}`,
        //   image: sectorImage,
        // },
        {
          Option: "Company",
          link: `/companyinfo/${menuFincode}`,
          image: sectorImage,
          subMenu: companyPage,
        },
        {
          Option: "Screener",
          link: "/technicalScreen",
          image: screenerImage,
          subMenu: screenerPage,
        },
        {
          Option: "Industry",
          link: "/economy",
          image: industryImage,
          subMenu: industryPage,
        },
        {
          Option: "Market",
          link: "/marketPage",
          image: marketImage,
          subMenu: marketPage,
        },
        {
          Option: "Earnings",
          link: `/calendar/${userID}`,
          image: earningsImage,
          subMenu: earningsPage,
        },
        {
          Option: "News",
          link: "/news",
          image: newsImage,
          subMenu: newsPage,
        },
        {
          Option: "Blogs",
          link: "/blogs",
          image: blogImage,
        },
      ]);

      setEarningsPage([
        {
          name: "Calendar",
          link: `/calendar/${userID}`,
          image: calendarLogo,
          type: "tab",
        },
        {
          name: "Analysis",
          link: `/earningcalls/${userID}`,
          image: analysisLogo,
          type: "tab",
        },
      ]);
    }

    if (items && userID) {
      setTopOptionsSidebar([
        // {
        //   Option: "StockInsta",
        //   link: `/stockInsta/${userID}`,
        //   image: sectorImage,
        // },
        {
          Option: "Company",
          link: `/companyinfo/${items}`,
          image: sectorImage,
          subMenu: companyPage,
        },
        {
          Option: "Screener",
          link: "/technicalScreen",
          image: screenerImage,
          subMenu: screenerPage,
        },
        {
          Option: "Industry",
          link: "/economy",
          image: industryImage,
          subMenu: industryPage,
        },
        {
          Option: "Market",
          link: "/marketPage",
          image: marketImage,
          subMenu: marketPage,
        },
        {
          Option: "Earnings",
          link: `/calendar/${userID}`,
          image: earningsImage,
          subMenu: earningsPage,
        },
        {
          Option: "News",
          link: "/news",
          image: newsImage,
          subMenu: newsPage,
        },
        {
          Option: "Blogs",
          link: "/blogs",
          image: blogImage,
        },
      ]);

      setEarningsPage([
        {
          name: "Calendar",
          link: `/calendar/${userID}`,
          image: calendarLogo,
          type: "tab",
        },
        {
          name: "Analysis",
          link: `/earningcalls/${userID}`,
          image: analysisLogo,
          type: "tab",
        },
      ]);
    }
  }, [fincodeLink, selectedSideMenu, selectedMenu, uid]);

  return (
    <>
      <div
        className={`z-[200] min-w-[70px] max-w-[70px] w-full fixed
         h-full bg-[#f4f7fa] flex flex-col  scrollbar-none
        `}
      >
        {/* LOGO/HOME */}
        <Link
          href={"/"}
          className="flex justify-center items-center mx-1 mt-2 mb-4"
        >
          <Image src={logo} alt="GIS" className="w-auto h-[40px] md:h-[40px]" />
        </Link>

        {/* Menu Items */}
        <div className="w-full flex flex-col items-start justify-start gap-3 overflow-y-auto font-semibold scrollbar-hide">
          {topOptionsSideBar.map((item, index) => (
            <div key={index} className="w-full group">
              <div
                onClick={() => (
                  setSelectedSideMenu(item.Option), router.push(item.link)
                )}
                className={`flex flex-col py-1 ml-1 justify-center items-center rounded-l-md hover:bg-sky-950 hover:text-white cursor-pointer
                      ${
                        selectedSideMenu === item.Option
                          ? "bg-sky-950 text-white"
                          : "text-[#153557]"
                      }
                      `}
              >
                <Image
                  src={item.image}
                  alt={item.Option}
                  className="w-[28px] h-[28px]"
                />
                {/* {item?.Option == "Company" ? (
                  <IoPieChartOutline size={30} />
                ) : item?.Option == "Screener" ? (
                  <HiOutlinePresentationChartBar size={30} />
                ) : item?.Option == "Industry" ? (
                  <LuFactory size={30} />
                ) : item?.Option == "Market" ? (
                  <LuCandlestickChart size={30} />
                ) : item?.Option == "Earnings" ? (
                  <GiTakeMyMoney size={30} />
                ) : item?.Option == "News" ? (
                  <HiOutlineGlobe size={30} />
                ) : (
                  item?.Option == "Blogs" && <CgWebsite size={30} />
                )} */}
                <span className="text-xs">{item.Option}</span>
              </div>
              {item.subMenu && (
                <div
                  className={`absolute hidden group-hover:flex flex-col left-[66px] translate-y-[-52px] bg-white border shadow-md border-[#B0B0B0] text-sm w-max rounded-md ml-1 z-[1000]`}
                  style={{ zIndex: 9999 }}
                >
                  {item?.subMenu?.map((item1, index1) => (
                    <div
                      key={index1}
                      onClick={() => router.push(item1.link)}
                      className={`flex flex-row items-center gap-1 cursor-pointer px-2 py-2
                        ${
                          selectedMenu == item1.name
                            ? "bg-[#183e68] text-white"
                            : "hover:bg-[#d7e6ff]"
                        } 
                      `}
                    >
                      {/* {console.log("Item : ", item1)} */}
                      <Image src={item1?.image} alt="" height={20} width={20} />
                      {}
                      <div className={`font-semibold  whitespace-nowrap p-1`}>
                        {item1.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col flex-1 py-1 justify-end items-center text-xs gap-2">
          <Link
            href={"/contactus"}
            className="underline underline-offset-2 cursor-pointer "
          >
            Contact Us
          </Link>
          <Link
            target="_blank"
            href={"https://www.goindiastocks.in/"}
            className="underline underline-offset-2 cursor-pointer "
          >
            Old Version
          </Link>
        </div>
      </div>
    </>
  );
};

export default NewSidebar;
