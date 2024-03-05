import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Sidebar from "./GlobalComponents/Sidebar";
import Navbar from "./GlobalComponents/Navbar";
import { useRouter } from "next/router";
import WatchList from "./GlobalComponents/WatchList";
import { ToastContainer } from "./Toaster";
import "react-toastify/dist/ReactToastify.css";
import NewSidebar from "./GlobalComponents/NewSidebar";
import { useInfoContext } from "@/context/info";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useEarningsContext } from "@/context/Context";
import Link from "next/link";


const Layout = ({ children }) => {
  const {
    selectedMenu,
    setSelectedMenu,
    fincode,
    setFincode,
    companyPage,
    setCompanyPage,
    selectedSideMenu,
    setSelectedSideMenu,
    screenerPage,
    setScreenerPage,
    industryPage,
    setIndustryPage,
    marketPage,
    setMarketPage,
    earningsPage,
    setEarningsPage,
    newsPage,
    setInitData,
    menuFincode,
    setMenuFincode,
    whatsapp,
    setWhatsapp,
    dashFincode,
  } = useInfoContext();

  const { detailsPage, setDetailsPage } = useEarningsContext();
  const router = useRouter();
  const { fincodeLink } = router.query;

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [headerMenu, setHeaderMenu] = useState(null);

  const closeSidebar = () => {
    setIsSideBarOpen(false);
  };
  const openSidebar = () => {
    setIsSideBarOpen(true);
  };

  const closeWatchlist = () => {
    setIsWatchlistOpen(false);
  };
  const openWatchlist = () => {
    setIsWatchlistOpen(true);
  };

  // Setting selected Sidebar
  useEffect(() => {
    // HOMEPAGE
    (router.pathname == `/` ||
      router.pathname == `/blogs` ||
      router.pathname == `/loginpage` ||
      router.pathname == "/stockInsta/[userId]") &&
      setHeaderMenu(null);

    // COMPANY
    (router.pathname == `/companyinfo/[fincodeLink]` ||
      router.pathname == `/valuation` ||
      router.pathname == `/researchDashboard`) &&
      setHeaderMenu(companyPage);
    //Screener
    (router.pathname == `/technicalScreen` ||
      router.pathname == `/fundamentalScreen` ||
      router.pathname == `/bulk-block` ||
      router.pathname == `/resultScreen`) &&
      setHeaderMenu(screenerPage);

    // Industry
    (router.pathname == `/economy` || router.pathname == `/metals`) &&
      setHeaderMenu(industryPage);

    // Market
    (router.pathname == `/marketPage` ||
      router.pathname == `/globalMarket` ||
      router.pathname == `/watchlist`) &&
      setHeaderMenu(marketPage);

    // Earnings
    (router.pathname == `/earningcalls/[uid]` ||
      router.pathname == `/calendar/[uid]`) &&
      setHeaderMenu(earningsPage);

    // News
    (router.pathname == `/news` ||
      router.pathname == `/interviews` ||
      router.pathname == `/brokerReport`) &&
      setHeaderMenu(newsPage);
  }, [router.pathname, dashFincode]);

  return (
    <div className={`${whatsapp && "bg-black/50"}`}>
      {/*Black Overlay */}
      {whatsapp && (
        <div
          className={`h-full w-full bg-black/70 absolute top-0 z-[250]`}
        ></div>
      )}

      <header>
        <div className="md:hidden">
          <Sidebar
            isSidebarOpen={isSideBarOpen}
            openSidebar={openSidebar}
            closeSidebar={closeSidebar}
          />
        </div>
        <div className="hidden md:block">
          <NewSidebar />
        </div>
        <WatchList
          isWatchlistOpen={isWatchlistOpen}
          openWatchlist={openWatchlist}
          closeWatchlist={closeWatchlist}
        />
      </header>

      {/* REST OF THE PAGE */}
      <div className="md:ml-[70px] bg-white">
        <div className="">
          <header className="bg-[#f1f8ff]">
            <Navbar isSidebarOpen={isSideBarOpen} openSidebar={openSidebar} />

            {/* Sub Menus PAGE */}
            {
              <div
                className={`${
                  router.pathname == `/` ||
                  router.pathname == `/blogs` ||
                  router.pathname == `/loginpage` ||
                  router.pathname == "/stockInsta/[userId]"
                    ? "bg-white border-t-[1px] border-gray-200"
                    : "bg-white border-y-[1px] border-gray-200 px-1 pt-1 "
                } flex gap-2 text-sm w-full whitespace-nowrap text-black overflow-y-hidden  overflow-x-auto `}
              >
                {headerMenu &&
                  headerMenu.map((item) =>
                    item.type == "tab" ? (
                      <Link
                        key={item.name}
                        href={item.link}
                        onClick={() => setSelectedMenu(item.name)}
                        className={`${
                          selectedMenu == item.name
                            ? "bg-[#0d2844] border-b-4 border-red-600 rounded-t-md text-white"
                            : "bg-[#f0f0f0] rounded-t-md"
                        } px-2 lg:px-5 py-1`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        key={item.name}
                        className={` px-2 lg:px-5 py-1 flex items-center gap-1 bg-[#0d2844]  rounded-md text-white`}
                        // onClick={() => router.push("/researchDashboard")}
                        href={"/researchDashboard"}
                        target="_blank"
                      >
                        <span>{item.name}</span>
                        <span>
                          <FaExternalLinkAlt size={11} />
                        </span>
                      </a>
                    )
                  )}
              </div>
            }
          </header>
          <main className="overflow-hidden">
            {children}
            <ToastContainer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
