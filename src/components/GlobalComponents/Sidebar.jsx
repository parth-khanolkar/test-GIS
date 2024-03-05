import React, { useEffect, useRef, useState } from "react";

import blogImage from "@/assets/images/landingPageIcons/blog.png";
import earningsImage from "@/assets/images/landingPageIcons/earnings.png";
import marketImage from "@/assets/images/landingPageIcons/market.png";
import newsImage from "@/assets/images/landingPageIcons/news.png";
import sectorImage from "@/assets/images/landingPageIcons/sector.png";
import industryImage from "@/assets/images/Menu Icons/industry.png"
import screenerImage from "@/assets/images/Menu Icons/screener.png"


import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useInfoContext } from "@/context/info";

const Sidebar = ({ isSidebarOpen, openSidebar, closeSidebar }) => {
  const router = useRouter();
  const { fincodeLink } = router.query;
  const sidebarRef = useRef(null);
  const {
    fincode,
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
    setNewsPage,
    menuFincode,
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
      router.pathname == `/bulkblock`) &&
      setSelectedSideMenu("Screener");
    router.pathname == `/technicalScreen` && setSelectedMenu("Technical");
    router.pathname == `/fundamentalScreen` && setSelectedMenu("Fundamental");
    router.pathname == `/bulkblock` && setSelectedMenu("Bulk Block");

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
      router.pathname == `/globalMarket`) &&
      setSelectedSideMenu("Earnings");
    router.pathname == `/calendar/[uid]` && setSelectedMenu("Calendar");
    router.pathname == `/earningcalls/[uid]` && setSelectedMenu("Analysis");

    // News
    (router.pathname == `/news` || router.pathname == `/interviews` || router.pathname == `/brokerReport` ) &&
      (setSelectedMenu("News"), setSelectedSideMenu("News"));
    router.pathname == `/news` && setSelectedMenu("News");
    router.pathname == `/interviews` && setSelectedMenu("Interviews");
    router.pathname == `/brokerReport` && setSelectedMenu("Broker Report");
  }, [router.pathname]);

  const [topOptionsSideBar, setTopOptionsSidebar] = useState([
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
      link: "/news&interviews",
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
    }

    if (userID) {
      setTopOptionsSidebar([
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
          type: "tab",
        },
        {
          name: "Analysis",
          link: `/earningcalls/${userID}`,
          type: "tab",
        },
      ]);
    }

    if (items && userID) {
      setTopOptionsSidebar([
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
          type: "tab",
        },
        {
          name: "Analysis",
          link: `/earningcalls/${userID}`,
          type: "tab",
        },
      ]);
    }
  }, [fincodeLink, selectedSideMenu, selectedMenu, uid]);

  useEffect(() => {
    let handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !isSidebarOpen
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`z-100 w-[60vw] md:w-[40vw] lg:w-[18vw] fixed left-0 h-screen bg-[#EAF4FF] flex flex-col   ease-in-out duration-500 shadow-md transform  overflow-y-auto scrollbar-none
            ${isSidebarOpen ? "translate-x-0 " : "-translate-x-full"}     
        `}
      >
        <div className="w-full flex flex-col items-start justify-start">
          {topOptionsSideBar.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className={`w-full flex flex-row pl-8 md:pl-14 py-3.5 space-x-4 hover:bg-sky-950 hover:text-white cursor-pointer
                        ${
                          selectedSideMenu === item.Option
                            ? "bg-sky-950 text-white"
                            : ""
                        }
                        `}
              onClick={() => {
                closeSidebar();
              }}
            >
              <Image
                src={item.image}
                alt={item.Option}
                className="w-[20px] h-[20px] md:w-[28px] md:h-[28px]"
              />
              <span>{item.Option}</span>
            </Link>
          ))}
        </div>
        <div className="w-full flex flex-col items-start justify-start mt-auto mb-16 md:mb-0 pl-8 md:pl-14 py-3.5 gap-3">
          <Link
            href={"/contactus"}
            className="underline underline-offset-2"
            onClick={() => {
              closeSidebar();
            }}
          >
            Contact Us
          </Link>
          <Link href={"https://www.goindiastocks.in/"} target="_blank" className="underline underline-offset-2">
            Old Version
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
