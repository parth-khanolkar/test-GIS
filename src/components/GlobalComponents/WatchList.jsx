"use client";

import { useWatchlistContext } from "@/context/WatchlistContext";
import { useInfoContext } from "@/context/info";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { BsBoxArrowUpRight } from "react-icons/bs";
import addWatchlistImage from "@/assets/images/landingPageIcons/addWatchList.png";
import GlobalWatchlistTable from "./Watchlist/GlobalWatchlistTable";
import Image from "next/image";
import { HiRefresh } from "react-icons/hi";

import watchlistImage from "@/assets/images/landingPageIcons/watchlist.png";
import { MdClose } from "react-icons/md";
import Notes from "../NotesNew/Notes";
import { useEarningsContext } from "@/context/Context";

const NoWatchlist = ({ closeWatchlist, isLogin }) => {
  return (
    <div className="my-5 bg-white flex flex-col items-center justify-center rounded-sm h-[90vh] md:h-[80vh]">
      <div className="text-lg flex items-center justify-center text-center">
        Stay Ahead, Create Your Watchlist Today!
      </div>
      <Image
        src={addWatchlistImage}
        alt="WatchList"
        className="w-[120px] h-auto md:w-[158px] mt-10"
      />
      <Link
        href={isLogin ? "/watchlist" : "/loginpage"}
        className="text-white mt-10 py-1.5 px-6 rounded-md bg-red-600 hover:bg-red-900"
        onClick={closeWatchlist}
      >
        {isLogin ? "Create Watchlist" : "Log In"}
      </Link>
    </div>
  );
};

const ShowWatchlistTable = ({
  isWLLoading,
  getWLCompanies,
  WLData,
  refreshButtonRef,
}) => {
  const { watchlist, setWatchlist, watchlistArray } = useWatchlistContext();
  return (
    <>
      <div className="flex flex-row justify-between items-center mb-5">
        <div className="text-2xl md:text-2xl">My Watchlist</div>
        <Link
          href="/watchlist"
          onClick={() => closeWatchlist()}
          className="text-[10px] md:text-sm text-sky-900 underline underline-offset-2 flex flex-row gap-1"
        >
          Detailed Watchlist
          <span className="flex items-start">
            <BsBoxArrowUpRight />
          </span>
        </Link>
      </div>
      <div className="flex flex-row gap-2 px-1 justify-between w-full">
        <Select
          value={watchlist}
          placeholder="Select Watchlist..."
          options={watchlistArray}
          getOptionLabel={(option) => option.WatchGroupName}
          getOptionValue={(option) => option.WatchListGroupId}
          onChange={(option) => setWatchlist(option)}
          isLoading={isWLLoading}
          className="min-w-[200px] md:min-w-[250px] lg:min-w-[350px]"
        />
        <button
          className="py-0.5 px-1.5 bg-cyan-900 text-white rounded-md"
          ref={refreshButtonRef}
          onClick={getWLCompanies}
        >
          <span className="flex items-center">
            <HiRefresh />
          </span>
        </button>
      </div>
      <div className="px-1 mt-2 z-0 flex justify-center w-full max-h-[80vh]">
        {<GlobalWatchlistTable data={WLData} />}
      </div>
    </>
  );
};

const WatchList = ({ isWatchlistOpen, openWatchlist, closeWatchlist }) => {
  const { uid, setUid, notesToggle, setNotesToggle } = useInfoContext();
  const {
    watchlist,
    setWatchlist,
    watchlistArray,
    setWatchlistArray,
    companyGraphModalRef,
    notificationCount,
    setNotificationCount,
  } = useWatchlistContext();

  const watchlistRef = useRef(null);
  const refreshButtonRef = useRef(null);

  const [WLData, setWLData] = useState([]);
  const [isWLLoading, setIsWLLoading] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  //To close Watchlist automatically
  useEffect(() => {
    let handleClickOutside = (e) => {
      if (watchlistRef.current && !watchlistRef.current.contains(e.target)) {
        if (!companyGraphModalRef.current) {
          closeWatchlist();
        } else if (
          companyGraphModalRef.current &&
          !companyGraphModalRef.current.props.isOpen
        ) {
          closeWatchlist();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchWatchlistDropdown = async () => {
    try {
      const response = await fetch(
        "https://transcriptanalyser.com/watchlists/user_watchlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data[0]) {
          setWatchlist(data.data[0]);
        }
        setWatchlistArray(data.data);
        setNotificationCount(data.notification_count);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (uid !== -1 && watchlistArray.length === 0) {
      fetchWatchlistDropdown();
    }
  }, [uid]);

  const getWLCompanies = async () => {
    setIsWLLoading(true);
    try {
      const response = await fetch(
        "https://transcriptanalyser.com/watchlists/live_watchlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            WatchListGroupId: watchlist.WatchListGroupId,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setWLData(responseData);
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      setIsWLLoading(false);
    } catch (error) {
      console.log("Error in getWLCompanies", error);
    }
  };
  
  // const simulateRefreshClick = () => {
  //   if (refreshButtonRef.current) {
  //     refreshButtonRef.current.click();
  //   }
  // };

  useEffect(() => {
    if (watchlist && uid !== -1) {
      getWLCompanies();
      // const timer = setInterval(simulateRefreshClick, 60000);

      // return () => {
      //   clearInterval(timer);
      // };
    }
  }, [watchlist]);

  return (
    <>
      <div className="z-[500] fixed top-1/2 right-[-79px] flex items-center gap-2 -rotate-90 ">
        <button
          className="flex items-center flex-row gap-1 bg-[#0d2844] text-white rounded-t-md px-2 text-sm opacity-30 md:opacity-100"
          onClick={() => {
            openWatchlist();
          }}
        >
          <span className="flex items-center">
            <BiSolidUpArrow />
          </span>{" "}
          My Watchlist
        </button>
        <button
          className="flex items-center flex-row gap-1 bg-[#0d2844] text-white rounded-t-md px-2 text-sm opacity-30 md:opacity-100"
          onClick={() => {
            setNotesToggle(true);
          }}
        >
          Notes
        </button>
      </div>

      {/* Watchlist */}
      <div
        ref={watchlistRef}
        className={`z-[999] w-[85vw] md:w-[40vw] lg:w-[30vw] bg-white fixed right-0 h-screen flex flex-col ease-in-out duration-500  shadow-md p-3 transform
            ${isWatchlistOpen ? "translate-x-0 " : "translate-x-full"}
        `}
      >
        {uid === -1 ? (
          <>
            <NoWatchlist closeWatchlist={closeWatchlist} isLogin={false} />
          </>
        ) : watchlistArray.length === 0 ? (
          <>
            <NoWatchlist closeWatchlist={closeWatchlist} isLogin={true} />
          </>
        ) : (
          <>
            <ShowWatchlistTable
              watchlist={watchlist}
              watchlistArray={watchlistArray}
              isWLLoading={isWLLoading}
              getWLCompanies={getWLCompanies}
              WLData={WLData}
              refreshButtonRef={refreshButtonRef}
            />
          </>
        )}
      </div>

      {/* Notes*/}
      <div
        className={`z-[500] bg-white fixed sm:w-[450px] w-[380px] right-0 h-full flex flex-col ease-in-out duration-500  shadow-md transform
            ${notesToggle ? "translate-x-0 " : "translate-x-full"}
        `}
      >
        <Notes uid={uid} />
      </div>
    </>
  );
};

export default WatchList;
