import { createContext, useContext, useState } from "react";

import analysisLogo from "@/assets/images/Menu Icons/analysis.png";
import calendarLogo from "@/assets/images/Menu Icons/calendar.png";
import bulkBlock2Logo from "@/assets/images/Menu Icons/bulk block2.png";
import earningLogo from "@/assets/images/Menu Icons/earning.png";
import economyLogo from "@/assets/images/Menu Icons/economy.png";
import financialsLogo from "@/assets/images/Menu Icons/financials.png";
import fundamentalLogo from "@/assets/images/Menu Icons/fundamental.png";
import globalLogo from "@/assets/images/Menu Icons/global.png";
import indianMarketLogo from "@/assets/images/Menu Icons/indian market.png";
import industryLogo from "@/assets/images/Menu Icons/industry.png";
import interviewLogo from "@/assets/images/Menu Icons/interview.png";
import marketLogo from "@/assets/images/Menu Icons/market.png";
import metal4Logo from "@/assets/images/Menu Icons/metal4.png";
import newsSubMenuLogo from "@/assets/images/Menu Icons/news(submenu).png";
import resources3Logo from "@/assets/images/Menu Icons/Resources3.png";
import screenerLogo from "@/assets/images/Menu Icons/screener.png";
import technicalLogo from "@/assets/images/Menu Icons/technical.png";
import watchlistLogo from "@/assets/images/Menu Icons/watchlist.png";
import valuationLogo from "@/assets/images/Menu Icons/valuation.png";
import resultLogo from "@/assets/images/Menu Icons/Result.png";
import brokerReportLogo from "@/assets/images/Menu Icons/BrokerReport.png";

const InfoContext = createContext({});

export const InfoContextProvider = ({ children }) => {
  // CompanyInfo
  const [fincode, setFincode] = useState(null);
  const [compAvailable, setCompAvailable] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [companySymbol, setCompanySymbol] = useState("LXCHEM");
  const [symbol, setSymbol] = useState(null);
  const [uid, setUid] = useState(-1);
  const [uName, setUName] = useState(null);
  const [globalStandalone, setGlobalStandalone] = useState(null);
  const [consoleStatus, setConsoleStatus] = useState(null);
  const [bseForBasic, setBseForBasic] = useState(null);
  const [standaloneForBasic, setStandaloneForBasic] = useState(null);
  const [initData, setInitData] = useState(null);
  const [initBse, setInitBse] = useState(null);
  const [info, setInfo] = useState(false);
  const [table, setTable] = useState(false);
  const [glance, setGlance] = useState(false);
  const [stories, setStories] = useState(false);
  const [peer, setPeer] = useState(false);
  const [peerFincode, setPeerFincode] = useState(null);
  const [reloadPeer, setReloadPeer] = useState(0);
  const [exchange, setExchange] = useState("");
  const [minPeerPossible, setMinPeerPossible] = useState(0);
  const [maxPeerPossible, setMaxPeerPossible] = useState(0);
  const [minPeerVal, setMinPeerVal] = useState(0);
  const [maxPeerVal, setMaxPeerVal] = useState(100);
  const [peerRestore, setPeerRestore] = useState(0);
  const [peerYearFilter, setPeerYearFilter] = useState(null);
  // Consensus FLAG
  const [consensusFlag, setConsensusFlag] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState({});
  const [parameterOptions, setParameterOptions] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [isStandalone, setIsStandalone] = useState(
    initData?.mode?.value === "S" ? true : false
  );

  // MarketPage
  const [sectorDetail, setSectorDetail] = useState(null);
  const [sectorDetailName, setSectorDetailName] = useState(null);
  const [marketDropdown, setMarketDropdown] = useState(null);
  const [filterSelected, setFilterSelected] = useState(123);
  const [sectorDetailPeriod, setSectorDetailPeriod] = useState("");

  // TechnicalScreen
  const [indicesDrop, setIndicesDrop] = useState(null);
  const [watchlistDrop, setWatchlistDrop] = useState(null);
  const [periodTS, setPeriodTS] = useState("1D");

  //Research Dashboard
  const [notesToggle, setNotesToggle] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [subMenus, setSubMenus] = useState(null);
  const [openedTabs, setOpenedTabs] = useState([]);
  const [dashFincode, setDashFincode] = useState(null);
  const [dashCompName, setDashCompName] = useState("Select any Company...");

  // SIDEBAR and NAVBAR Contexts
  const [menuFincode, setMenuFincode] = useState(283206);
  const [selectedSideMenu, setSelectedSideMenu] = useState("Home");
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [companyPage, setCompanyPage] = useState([
    {
      name: "SnapShot",
      link: `/companyinfo/${menuFincode}`,
      image: financialsLogo,
      type: "tab",
    },
    {
      name: "Resources",
      link: "/researchDashboard",
      image: resources3Logo,
      type: "tab",
    },
    {
      name: "Valuation",
      link: `/valuation`,
      image: valuationLogo,
      type: "tab",
    },
  ]);

  const [screenerPage, setScreenerPage] = useState([
    {
      name: "Technical",
      link: `/technicalScreen`,
      image: technicalLogo,
      type: "tab",
    },
    {
      name: "Fundamental",
      link: "/fundamentalScreen",
      image: fundamentalLogo,
      type: "tab",
    },
    {
      name: "Bulk Block",
      link: "/bulk-block",
      image: bulkBlock2Logo,
      type: "tab",
    },
    {
      name: "Result",
      link: "/resultScreen",
      image: resultLogo,
      type: "tab",
    },
  ]);

  const [industryPage, setIndustryPage] = useState([
    {
      name: "Economy",
      link: `/economy`,
      image: economyLogo,
      type: "tab",
    },
    {
      name: "Metals",
      link: "/metals",
      image: metal4Logo,
      type: "tab",
    },
  ]);

  const [marketPage, setMarketPage] = useState([
    {
      name: "Market",
      link: `/marketPage`,
      image: indianMarketLogo,
      type: "tab",
    },
    {
      name: "Global",
      link: "/globalMarket",
      image: globalLogo,
      type: "tab",
    },
    {
      name: "Watchlist",
      link: "/watchlist",
      image: watchlistLogo,
      type: "tab",
    },
  ]);

  const [earningsPage, setEarningsPage] = useState([
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

  const [newsPage, setNewsPage] = useState([
    {
      name: "News",
      link: `/news`,
      image: newsSubMenuLogo,
      type: "tab",
    },
    {
      name: "Interviews",
      link: "/interviews",
      image: interviewLogo,
      type: "tab",
    },
    {
      name: "Broker Report",
      link: "/brokerReport",
      image: brokerReportLogo,
      type: "tab",
    },
  ]);

  // Calendar PAGE
  const [earningsToggle, setEarningsToggle] = useState("Earning");
  const [whatsapp, setWhatsapp] = useState(false);
  return (
    <InfoContext.Provider
      value={{
        info,
        setInfo,
        table,
        setTable,
        glance,
        setGlance,
        stories,
        setStories,
        peer,
        setPeer,
        initData,
        setInitData,
        fincode,
        setFincode,
        consoleStatus,
        setConsoleStatus,
        standaloneForBasic,
        setStandaloneForBasic,
        bseForBasic,
        setBseForBasic,
        globalStandalone,
        setGlobalStandalone,
        bseForBasic,
        setBseForBasic,
        uid,
        setUid,
        uName,
        setUName,
        companyName,
        setCompanyName,
        companySymbol,
        setCompanySymbol,
        symbol,
        setSymbol,
        initBse,
        setInitBse,
        peerFincode,
        setPeerFincode,
        sectorDetail,
        setSectorDetail,
        sectorDetailName,
        setSectorDetailName,
        compAvailable,
        setCompAvailable,
        marketDropdown,
        setMarketDropdown,
        filterSelected,
        setFilterSelected,
        reloadPeer,
        setReloadPeer,
        indicesDrop,
        setIndicesDrop,
        watchlistDrop,
        setWatchlistDrop,
        exchange,
        setExchange,
        periodTS,
        setPeriodTS,
        sectorDetailPeriod,
        setSectorDetailPeriod,
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
        consensusFlag,
        setConsensusFlag,
        graphData,
        setGraphData,
        selectedParameter,
        setSelectedParameter,
        parameterOptions,
        setParameterOptions,
        isLoading,
        setIsLoading,
        isDataAvailable,
        setIsDataAvailable,
        isStandalone,
        setIsStandalone,
        minPeerVal,
        setMinPeerVal,
        maxPeerVal,
        setMaxPeerVal,
        minPeerPossible,
        setMinPeerPossible,
        maxPeerPossible,
        setMaxPeerPossible,
        selectedMenu,
        setSelectedMenu,
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
        setNewsPage,
        menuFincode,
        setMenuFincode,
        earningsToggle,
        setEarningsToggle,
        whatsapp,
        setWhatsapp,
        peerRestore,
        setPeerRestore,
        peerYearFilter,
        setPeerYearFilter,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
};

export const useInfoContext = () => useContext(InfoContext);
