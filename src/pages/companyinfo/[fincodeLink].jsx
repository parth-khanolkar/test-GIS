import BasicInfo from "@/components/CompanyInfoProject/BasicInfo/BasicInfo";
import Documents from "@/components/CompanyInfoProject/Documents/Documents";
import Financials from "@/components/CompanyInfoProject/Financials/Financials";
import PeerComparison from "@/components/CompanyInfoProject/PeerComparison/PeerComparison";
import FundamentalAnalysis from "@/components/CompanyInfoProject/FundamentalAnalysis/FundamentalAnalysis";
import { useInfoContext } from "@/context/info";
import Consensus from "@/components/CompanyInfoProject/Consensus/Consensus";
import { useInView } from "react-intersection-observer";
import TechnicalAnalysis from "@/components/CompanyInfoProject/TechnicalAnalysis/TechnicalAnalysis";
import { useRef, useState } from "react";
import ShareholdingPattern from "@/components/CompanyInfoProject/ShareholdingPattern/ShareholdingPattern";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import axios from "axios";
import { useEarningsContext } from "@/context/Context";

export default function Home() {
  const router = useRouter();
  const { fincodeLink } = router.query;
  var [menuItem, setMenuItem] = useState("basic");

  const executeScrollIntoView = (id) => {
    var id1 = document.getElementById(id);
    id1.scrollIntoView({
      // behavior: "smooth",
      inline: "nearest",
    });
  };
  const executeScrollIntoViewH = (id) => {
    var id1 = document.getElementById(id);
    id1.scrollIntoView({
      inline: "nearest",
    });
  };

  const {
    fincode,
    setFincode,
    consensusFlag,
    setConsensusFlag,
    initData,
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
    selectedMenu,
    setSelectedMenu,
    dashFincode,
    setDashFincode,
    dashCompName,
    setDashCompName,
    menuFincode,
    setMenuFincode,
  } = useInfoContext();

  const mainRef = useRef();

  useEffect(() => {
    mainRef?.current?.scrollTo(0, 0);
  }, [fincodeLink]);

  useEffect(() => {
    setSelectedMenu("SnapShot");
  }, []);

  useEffect(() => {
    setMenuFincode(fincodeLink);
  }, [fincodeLink]);

  useEffect(() => {
    console.log(menuFincode);
  }, [menuFincode]);

  // useEffect(() => {
  //   setFincode(fincodeLink);
  // }, [fincodeLink]);

  useEffect(() => {
    setFincode(fincodeLink);
  }, [fincodeLink]);

  const [top, setTop] = useState(true);
  var [menuItem, setMenuItem] = useState("basic");

  const options = { threshold: 0.3 };

  const { ref: basicRef, inView: basicView } = useInView(options);
  const { ref: peerRef, inView: peerView } = useInView(options);
  const { ref: financialsRef, inView: financialsView } = useInView(options);
  const { ref: fundamentalRef, inView: fundamentalView } = useInView(options);
  const { ref: consensusRef, inView: consensusView } = useInView(options);
  const { ref: technicalRef, inView: technicalView } = useInView(options);
  const { ref: shareholdingRef, inView: shareholdingView } = useInView(options);
  const { ref: documentsRef, inView: documentsView } = useInView(options);
  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop === 0) {
      setTop(true);
    } else setTop(false);
  };

  useEffect(() => {
    mainRef?.current?.scrollTo(0, 0);
  }, [fincode]);

  useEffect(() => {
    basicView && executeScrollIntoViewH("basicButton");
    peerView && executeScrollIntoViewH("peerButton");
    financialsView && executeScrollIntoViewH("financialsButton");
    fundamentalView && executeScrollIntoViewH("fundamentalButton");
    consensusView && executeScrollIntoViewH("consensusButton");
    technicalView && executeScrollIntoViewH("technicalButton");
    shareholdingView && executeScrollIntoViewH("shareholdingButton");
    documentsView && executeScrollIntoViewH("documentsButton");
  }, [
    basicView,
    peerView,
    financialsView,
    fundamentalView,
    consensusView,
    technicalView,
    shareholdingView,
    documentsView,
  ]);

  useEffect(() => {
    basicView && setMenuItem("basic");
    peerView && setMenuItem("peer");
    financialsView && setMenuItem("financials");
    fundamentalView && setMenuItem("fundamental");
    consensusView && setMenuItem("consensus");
    technicalView && setMenuItem("technical");
    shareholdingView && setMenuItem("shareholding");
    documentsView && setMenuItem("documents");
  }, [
    basicView,
    peerView,
    financialsView,
    fundamentalView,
    consensusView,
    technicalView,
    shareholdingView,
    documentsView,
  ]);

  return (
    // <InfoContextProvider>
    <div className="">
      <header className="sticky top z-40 p-1 bg-white border-b-[1px] border-gray-200">
        <div className="flex justify-start gap-2 text-sm w-full whitespace-nowrap overflow-x-auto  scrollbar-none text-[#5E5E5E] font-[500] py-1">
          <button
            id="basicButton"
            onClick={() => executeScrollIntoView("basicID")}
            className={`${
              menuItem == "basic" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Basic info
          </button>
          <button
            id="financialsButton"
            onClick={() => executeScrollIntoView("financialsID")}
            className={`${
              menuItem == "financials" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Financials
          </button>
          <button
            id="peerButton"
            onClick={() => executeScrollIntoView("peerID")}
            className={`${
              menuItem == "peer" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Peer Comparison
          </button>

          <button
            id="fundamentalButton"
            onClick={() => executeScrollIntoView("fundamentalID")}
            className={`${
              menuItem == "fundamental" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Fundamental Analysis
          </button>
          <button
            id="consensusButton"
            onClick={() => executeScrollIntoView("consensusID")}
            className={`${
              menuItem == "consensus" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2 ${!initData?.analyst_count?.value && "hidden"}`}
          >
            Consensus
          </button>
          <button
            id="technicalButton"
            onClick={() => executeScrollIntoView("technicalID")}
            className={`${
              menuItem == "technical" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Technical Analysis
          </button>
          <button
            id="shareholdingButton"
            onClick={() => executeScrollIntoView("shareholdingID")}
            className={`${
              menuItem == "shareholding" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Shareholding Pattern
          </button>
          <button
            id="documentsButton"
            onClick={() => executeScrollIntoView("documentsID")}
            className={`${
              menuItem == "documents" &&
              "text-black underline underline-offset-4 decoration-[#093967] decoration-2"
            } px-2`}
          >
            Documents
          </button>
        </div>
        {/* </div> */}
      </header>
      <div
        ref={mainRef}
        id="main"
        className={`overflow-y-auto bg-[#f4f7fa] overflow-hidden flex flex-col gap-9 h-[calc(100vh-121px)] sm:pr-5 sm:pl-1 sm:pt-2 
          `}
      >
        <div ref={basicRef} id="basicID">
          <BasicInfo />
        </div>
        <div ref={financialsRef} id="financialsID">
          <Financials fincodeLink={fincodeLink} />
        </div>
        <div ref={peerRef} id="peerID">
          <PeerComparison fincodeLink={fincodeLink} />
        </div>
        <div ref={fundamentalRef} id="fundamentalID">
          <FundamentalAnalysis fincodeLink={fincodeLink} />
        </div>
        <div
          ref={consensusRef}
          id="consensusID"
          className={`${!initData?.analyst_count?.value && "hidden"}`}
        >
          {consensusFlag && <Consensus fincodeLink={fincodeLink} />}
        </div>
        <div ref={technicalRef} id="technicalID">
          <TechnicalAnalysis fincodeLink={fincodeLink} />
        </div>
        <div ref={shareholdingRef} id="shareholdingID">
          <ShareholdingPattern fincodeLink={fincodeLink} />
        </div>
        <div ref={documentsRef} id="documentsID">
          <Documents />
        </div>
        <footer>
          <MobileFooter />
        </footer>
      </div>
    </div>
    // </InfoContextProvider>
  );
}
// Home.requireAuth = true;
