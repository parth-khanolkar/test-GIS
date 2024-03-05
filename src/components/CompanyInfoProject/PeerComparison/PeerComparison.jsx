import { BiSearchAlt } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";

import { useEffect, useState } from "react";
import { useInfoContext } from "@/context/info";
import Select from "react-select";
import PeerTable from "../Tables/PeerTable";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const PeerComparison = () => {
  const {
    fincode,
    setFincode,
    initData,
    setInitData,
    consoleStatus,
    setConsoleStatus,
    globalStandalone,
    setGlobalStandalone,
    uid,
    setUid,
    peerFincode,
    setPeerFincode,
    reloadPeer,
    setReloadPeer,
    minPeerVal,
    setMinPeerVal,
    maxPeerVal,
    setMaxPeerVal,
    minPeerPossible,
    setMinPeerPossible,
    maxPeerPossible,
    setMaxPeerPossible,
    peerRestore,
    setPeerRestore,
    peerYearFilter,
    setPeerYearFilter,
  } = useInfoContext();

  const [tableData, setTableData] = useState(null);
  const [dataFiltered, setDataFiltered] = useState(null);
  const [isCheckedStandalone, setIsCheckedStandalone] = useState(false);
  const [addedPeer, setAddedPeer] = useState(null);

  useEffect(() => {
    globalStandalone
      ? setIsCheckedStandalone(true)
      : setIsCheckedStandalone(false);
  }, [globalStandalone]);
  const router = useRouter();
  const { fincodeLink } = router.query;
  const fetchData = async (mode) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/peer_comparison`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: String(uid),
            industry: initData?.Industry?.value,
            fincode: fincodeLink,
            mode: mode,
            year: peerYearFilter ? peerYearFilter?.value : "",
          }),
        }
      );
      const resJson = await res.json();
      setTableData(resJson);
      setMinPeerVal(resJson.Min_mcap);
      setMaxPeerVal(resJson.Max_mcap);
      setMinPeerPossible(resJson.Min_mcap);
      setMaxPeerPossible(resJson.Max_mcap);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const restorePeers = async (mode) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/restore_peer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: uid,
            industry: initData?.Industry?.value,
          }),
        }
      );
      const resJson = await res.json();
      initData && isCheckedStandalone && fetchData("C");
      initData && !isCheckedStandalone && fetchData("S");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAddPeer = async (mode) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/add_peer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: uid,
            fincode: peerFincode,
            industry: initData?.Industry?.value,
            mode: mode,
          }),
        }
      );
      const resJson = await res.json();
      resJson?.result ==
      "Duplicate combination of userid, fincode, and industry"
        ? toast("Company already exists!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        : resJson?.detail
        ? toast("Not able to add this Company", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        : (setAddedPeer(resJson),
          toast("Company is added!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Not able to add this Company", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // Calling Fetch Company Data
  useEffect(() => {
    initData && isCheckedStandalone && fetchData("C");
    initData && !isCheckedStandalone && fetchData("S");
  }, [
    uid,
    isCheckedStandalone,
    initData,
    reloadPeer,
    addedPeer,
    fincodeLink,
    peerYearFilter,
  ]);

  // Reload by setting data null again
  useEffect(() => {
    setTableData(null);
  }, [uid, initData, isCheckedStandalone, fincodeLink, peerYearFilter]);

  useEffect(() => {
    tableData &&
      peerFincode != null &&
      isCheckedStandalone &&
      tableData &&
      fetchAddPeer("C");

    tableData &&
      peerFincode != null &&
      !isCheckedStandalone &&
      tableData &&
      fetchAddPeer("S");
  }, [peerFincode]);

  // useEffect(() => {
  //   console.log("Peer USER" + uid);
  // }, [uid]);

  useEffect(() => {
    tableData &&
      tableData?.value &&
      setDataFiltered(
        tableData?.value.filter((item) => {
          return item?.MCAP <= maxPeerVal && item?.MCAP >= minPeerVal;
        })
      );
  }, [tableData, maxPeerVal, minPeerVal]);

  useEffect(() => {
    peerRestore > 0 && restorePeers();
  }, [peerRestore]);

  return (
    <div>
      {/* Web View */}
      <div className="">
        {/* <div>{uid}</div> */}
        <div className="flex flex-col gap-2 p-2 sm:p-5 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md">
          {/* Heading and Download Options */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="font-semibold text-[28px]">Peer Comparison</h1>
            <div className="flex justify-end text-sm font-semibold gap-1">
              <span
                onClick={() => {
                  isCheckedStandalone && setIsCheckedStandalone(false);
                }}
                className={`${
                  !isCheckedStandalone
                    ? "text-[#083966] underline underline-offset-2 "
                    : " text-gray-500 cursor-pointer hover:text-[#2f70ac] italic "
                } `}
              >
                {!isCheckedStandalone
                  ? "Standalone Figures"
                  : "View Standalone"}
              </span>
              <span>/</span>
              <span
                onClick={() => {
                  !isCheckedStandalone && setIsCheckedStandalone(true);
                }}
                className={`${
                  isCheckedStandalone
                    ? "text-[#083966] underline underline-offset-2"
                    : "text-gray-500 cursor-pointer hover:text-[#2f70ac] italic "
                } `}
              >
                {isCheckedStandalone
                  ? "Consolidated Figures"
                  : "View Consolidated"}
              </span>
            </div>
          </div>
          {/* Sector and Industry */}
          {/* <div className="font-semibold flex gap-5">
            <div>
              <span className="text-gray-500">Sector:</span>
              <span className="text-[#083966] pl-2">
                {initData ? (
                  initData?.Sector?.value
                ) : (
                  <span className="animate-pulse">Loading...</span>
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Industry:</span>
              <span className="text-[#083966] pl-2">
                {initData ? (
                  initData?.Industry?.value
                ) : (
                  <span className="animate-pulse">Loading...</span>
                )}
              </span>
            </div>
          </div> */}

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg">
            {
              // dataFiltered && tableData && tableData?.data?.data?.column
              tableData && tableData?.column ? (
                <div className="relative">
                  {/* Standalone/ Consolidated Toggle and ADD PEER */}
                  <div className="flex justify-between flex-wrap items-center pb-1"></div>
                  <PeerTable
                    columns={tableData.column}
                    data={tableData?.value}
                    mode={isCheckedStandalone}
                    yearDrop={tableData?.droplist}
                  />
                </div>
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
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default PeerComparison;
