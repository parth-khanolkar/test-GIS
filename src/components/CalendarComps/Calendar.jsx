import React, { useEffect, useRef, useState } from "react";
import CalendarCard from "./CalendarCard";
import { BiReset, BiSearch } from "react-icons/bi";
import Select from "react-select";
import { FaFilter } from "react-icons/fa6";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { FaWhatsapp } from "react-icons/fa";
import { useInfoContext } from "@/context/info";
import { IoIosCloseCircle } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useInView } from "react-intersection-observer";

const Calendar = ({ uid }) => {
  const { earningsToggle, setEarningsToggle, whatsapp, setWhatsapp } =
    useInfoContext();

  const filterRef = useRef(null);

  const [data, setData] = useState(null);
  const [whatsappData, setWhatsappData] = useState(null);
  const [whatsappDate, setWhatsappDate] = useState("none");
  const [whatsappDropdown, setWhatsappDropdown] = useState([]);
  const [upcomingData, setUpcomingData] = useState(null);
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [eventType, setEventType] = useState({
    label: "All Event Type",
    value: 0,
  });
  const [watchlist, setWatchlist] = useState(0);
  const [counter, setCounter] = useState(1);

  // Fetch Earnings Calendar Data
  async function fetchEarningsCalendar() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/calendar-upcoming`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: uid,
          watchlist_id: watchlist?.value ? watchlist?.value : 0,
          event_category: "Earning",
          event_type: eventType?.value ? eventType?.value : 0,
          sector: sector,
        }),
      }
    );
    const resJson = await res.json();
    setData(resJson);
    setUpcomingData(resJson?.upcoming_list);
  }

  // Fetch Events Calendar Data
  async function fetchEventsCalendar() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/event-upcoming`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: uid,
          watchlist_id: watchlist?.value ? watchlist?.value : 0,
          event_type: eventType?.value ? eventType?.value : 0,
          sector: sector,
          counter: counter,
        }),
      }
    );
    const resJson = await res.json();
    setData(resJson);
    upcomingData
      ? setUpcomingData([...upcomingData, ...resJson?.upcoming_list])
      : setUpcomingData(resJson?.upcoming_list);
  }

  // Fetch Whatsapp
  async function fetchWhatsapp() {
    const res = await fetch(
      uid > 0
        ? `https://transcriptanalyser.com/report/event-whatsapp-new?date=${whatsappDate}&uid=${uid}`
        : `https://transcriptanalyser.com/report/event-whatsapp-new?email=none&date=${whatsappDate}`
    );
    const data = await res.json();
    setWhatsappData(data);
  }

  // Copy to Clipboard
  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      alert("Copy to clipboard failed.");
    }
  };

  useEffect(() => {
    uid && earningsToggle == "Earning" && fetchEarningsCalendar();
    uid && earningsToggle == "Events" && fetchEventsCalendar();
  }, [sector, watchlist, eventType, earningsToggle, uid, counter]);

  useEffect(() => {
    whatsapp && fetchWhatsapp();
  }, [whatsappDate, uid, whatsapp]);

  useEffect(() => {
    setWhatsappDropdown([]);
    whatsappData &&
      whatsappData?.date_dropdown?.map(
        (item) =>
          !whatsappDropdown.includes({
            label: item,
            value: item,
          }) &&
          setWhatsappDropdown((whatsappDropdown) => [
            ...whatsappDropdown,
            {
              label: item,
              value: item,
            },
          ])
      );
  }, [whatsappData]);

  // Handle Outside Clicks
  const handleOutsideClick = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      setFilter(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  const { ref: loadingCalendar, inView: calendarView } = useInView(0.1);
  useEffect(() => {
    calendarView && setCounter((prev) => prev + 1);
  }, [calendarView]);

  useEffect(() => {
    console.log(upcomingData);
  }, [upcomingData]);

  return (
    <div className="h-full w-full max-w-[1000px] sm:px-1 relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-1 mb-3">
        {/* Search */}
        <div className="flex justify-between items-center gap-2 border border-gray-400  p-1 rounded-md ">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Company"
            className="font-semibold outline-none max-w-[100px] sm:max-w-[250px]"
          />
          <button
            onClick={() => {
              setSearch("");
            }}
            className={`${search.length > 0 ? "visible" : "invisible"}`}
          >
            <RxCross1 />
          </button>
          <BiSearch />
        </div>
        {/* Toggle etc. */}
        <div className="flex p-1 items-center gap-1 sm:gap-2">
          {/* Earnings/Events Toggle */}
          <div className="flex border-2 border-[#093967] rounded-md text-sm sm:text-base">
            <div
              onClick={() => {
                setEarningsToggle("Earning");
                setUpcomingData(null);
                setSector("All");
                setWatchlist(0);
                setEventType({
                  label: "All Event Type",
                  value: 0,
                });
              }}
              className={`px-1 cursor-pointer ${
                earningsToggle == "Earning" && "bg-[#093967] text-white"
              }`}
            >
              Earnings
            </div>
            <div
              onClick={() => {
                setEarningsToggle("Events");
                setUpcomingData(null);
                setSector("All");
                setWatchlist(0);
                setEventType({
                  label: "All Event Type",
                  value: 0,
                });
              }}
              className={`px-1 cursor-pointer ${
                earningsToggle == "Events" && "bg-[#093967] text-white"
              }`}
            >
              Events
            </div>
          </div>

          {/* Reset Filter */}
          {(sector != "All" || watchlist != 0 || eventType.value != 0) && (
            <div
              onClick={() => {
                setUpcomingData(null);
                setSector("All");
                setWatchlist(0);
                setEventType({
                  label: "All Event Type",
                  value: 0,
                });
              }}
              className="bg-[#093967] text-white rounded-md p-1 sm:p-0 sm:px-1 cursor-pointer flex items-center gap-1 text-sm sm:text-base"
            >
              <span className="hidden sm:block">Reset</span>
              <span>
                <BiReset />
              </span>
            </div>
          )}

          {/* Filter Toggle*/}
          <div className="text-[#093967] cursor-pointer">
            {filter ? (
              <FaFilterCircleXmark onClick={() => setFilter(false)} size={25} />
            ) : (
              <FaFilter onClick={() => setFilter(true)} size={25} />
            )}
          </div>

          {/* Whatsapp */}
          <FaWhatsapp
            onClick={() => setWhatsapp(true)}
            className="text-[#29a155] hover:bg-[#29a155] hover:text-white rounded-full cursor-pointer"
            size={27}
          />
        </div>
      </div>

      {/* Actual Filters */}
      {filter && (
        <div
          ref={filterRef}
          className="absolute bg-[#f1f8ff] p-4 rounded-md right-5"
        >
          <div className="mb-2 flex flex-col gap-3 w-full">
            {/* Sectors */}
            {data && (
              <div className="min-w-[250px] max-w-[250px]">
                <p className="text-sm font-bold">Sectors:</p>
                <Select
                  className="text-[#0d2843] font-semibold text-sm flex-1"
                  options={data?.sector_dropdown}
                  // defaultValue={data?.sector_dropdown[0]}
                  value={{ label: sector, value: sector }}
                  placeholder="Sectors"
                  onChange={(values) => {
                    setSector(values.value);
                    setWatchlist(0);
                    setUpcomingData(null);
                    setEventType({
                      label: "All Event Type",
                      value: 0,
                    });
                  }}
                  color="#0d2843"
                />
              </div>
            )}
            {/* Watchlist */}
            {data && (
              <div className="min-w-[250px] max-w-[250px]">
                <p className="text-sm font-bold">Watchlist:</p>
                <Select
                  className="text-[#0d2843] font-semibold text-sm flex-1"
                  options={data?.watchlist_dropdown}
                  value={watchlist}
                  placeholder="Watchlist"
                  onChange={(values) => {
                    setWatchlist(values);
                    setSector("All");
                    setUpcomingData(null);
                    setEventType({
                      label: "All Event Type",
                      value: 0,
                    });
                  }}
                  color="#0d2843"
                />
              </div>
            )}
            {/* Events */}
            {data && earningsToggle == "Events" && (
              <div className="min-w-[250px] max-w-[250px]">
                <p className="text-sm font-bold">Event Type:</p>
                <Select
                  className="text-[#0d2843] font-semibold text-sm flex-1"
                  options={data?.event_type_dropdown}
                  value={eventType}
                  placeholder="Event type"
                  onChange={(values) => {
                    setWatchlist(0);
                    setSector("All");
                    setUpcomingData(null);
                    setEventType(values);
                  }}
                  color="#0d2843"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/*All Cards*/}
      {upcomingData && upcomingData[0] ? (
        <div className="flex flex-col gap-3 overflow-y-auto h-[calc(100vh-140px)] pr-1 py-11">
          {upcomingData?.map(
            (item, index) =>
              (earningsToggle == "Earning"
                ? item.company_name.toLowerCase().includes(search.toLowerCase())
                : item.companyName
                    .toLowerCase()
                    .includes(search.toLowerCase())) && (
                <div key={index}>
                  <CalendarCard data={item} uid={uid} />
                </div>
              )
          )}
          {/* Transparent Loading for NEW CARDS */}
          {earningsToggle == "Events" && (
            <div className="relative">
              <div
                ref={loadingCalendar}
                className="flex justify-center items-center md:mt-4 absolute bottom-[150px] w-full opacity-0"
              >
                <span className="relative flex h-[40px] w-[40px] md:h-[60px] md:w-[60px]">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"
                    style={{ animationDuration: "1.2s" }}
                  ></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : upcomingData && !upcomingData[0] ? (
        <div className="font-bold animate-pulse">No data available!</div>
      ) : (
        // Loading Animation
        <div className="flex justify-center items-center h-[calc(100vh-135px)]">
          <span className="relative flex h-[80px] w-[80px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-"></span>
          </span>
        </div>
      )}

      {/* WHATSAPP */}
      {whatsapp && (
        <div className="absolute sm:p-5 top-0 z-[250] h-full w-full max-w-[1000px]">
          <div className="bg-[#f1f8ff] h-full w-full px-2 pb-10 pt-2 text-wrap">
            <div className="flex justify-between items-center">
              {/* Whatsapp Dropdown */}
              <div className="min-w-[180px] max-w-[180px]">
                {whatsappDropdown[0] && (
                  <Select
                    className="text-[#0d2843] font-semibold text-sm flex-1"
                    options={whatsappDropdown}
                    value={
                      whatsappDate != "none" && {
                        label: whatsappDate,
                        value: whatsappDate,
                      }
                    }
                    placeholder="Dates"
                    onChange={(values) => {
                      values
                        ? setWhatsappDate(values.value)
                        : setWhatsappDate("none");
                    }}
                    color="#0d2843"
                    isClearable={true}
                  />
                )}
              </div>
              <div className="flex gap-1 items-center">
                {/* Copy */}
                <div className=" flex justify-end">
                  <p
                    onClick={() => handleCopyClick(whatsappData?.whatsapp)}
                    className="bg-[#093967] hover:bg-[#093967]/80 text-white rounded-md px-1 cursor-pointer"
                  >
                    Copy
                  </p>
                </div>
                {/* Close Whatsapp */}
                <div
                  className="flex items-center justify-end cursor-pointer text-black hover:text-black/80"
                  onClick={() => setWhatsapp(false)}
                >
                  <IoIosCloseCircle size={35} />
                </div>
              </div>
            </div>

            {/* Whatsapp HTML */}
            <div
              dangerouslySetInnerHTML={{ __html: whatsappData?.html }}
              className="overflow-y-scroll h-full w-full p-2 text-sm"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
