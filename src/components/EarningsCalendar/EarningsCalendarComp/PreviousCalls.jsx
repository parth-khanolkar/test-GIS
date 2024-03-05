import React, {
  Suspense,
  SuspenseList,
  useEffect,
  useRef,
  useState,
} from "react";
import PreviousCard from "./PreviousCard";
import { useEarningsContext } from "@/context/Context";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import {
  AiFillFilter,
  AiFillCloseCircle,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Slider from "./Slider";
import Select from "react-select";
import { useInView } from "react-intersection-observer";
import GisSelect from "@/components/GisSelect";

const PreviousEarningCalls = ({ uid }) => {
  const {
    previous,
    setPrevious,
    sector,
    setSelectedCompanyName,
    setCalendarIdContext,
    minValContext,
    setMinValContext,
    maxValContext,
    setMaxValContext,
    watchDrop,
    watchFincode,
    compDropdown,
    setCompDropdown,
    quarterDropdown,
    setQuarterDropdown,
    compPayload,
    setCompPayload,
    quarterPayload,
    setQuarterPayload,
    compReload,
    setCompReload,
    quartReload,
    setQuartReload,
    flagReload,
    setFlagReload,
    counterEarnings,
    setCounterEarnings,
    defaultQuart,
    setDefaultQuart,
    loadingFlag,
    setLoadingflag,
    watchFilter,
    setWatchFilter,
    sectorFilter,
    setSectorFilter,
    epsChangeMin,
    epsChangeMax,
  } = useEarningsContext();

  //References
  const CompFilter = useRef();
  const QuartFilter = useRef();
  const SectorRef = useRef();
  const WatchRef = useRef();

  // Hooks
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [checked, setChecked] = useState([]); //sectorChecked
  const [checkedWatch, setCheckedWatch] = useState([]);
  const [checkedWatchFin, setCheckedWatchedFin] = useState([]);
  const [flatWatchFin, setFlatWatchFin] = useState([]);
  const [sectorDropdown, setSectorDropdown] = useState(true);
  const [watchlistDropdown, setWatchlistDropdown] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [previousFilters, setPreviousFilters] = useState(null);

  useEffect(() => {
    setPreviousFilters(previous);
  }, [previous]);

  useEffect(() => {
    !checked[0] &&
      minValContext == epsChangeMin &&
      maxValContext == epsChangeMax &&
      !checkedWatch[0] &&
      setResetting(false);
  }, [
    checked,
    checkedWatch,
    minValContext,
    maxValContext,
    compReload,
    quartReload,
  ]);

  // Resetting SLider default values while changing quarters
  useEffect(() => {
    counterEarnings == 1 && setMinValContext(epsChangeMin);
    counterEarnings == 1 && setMaxValContext(epsChangeMax);
  }, [epsChangeMin, epsChangeMax]);

  // Reset EPS Change Slider
  function resetEPSslider() {
    setMinValContext(epsChangeMin);
    setMaxValContext(epsChangeMax);
  }

  // Reset all Filters
  function resetAllFilters() {
    setSectorFilter(null);
    setWatchFilter(null);
    setMinValContext(epsChangeMin);
    setMaxValContext(epsChangeMax);
    setCompPayload(null);
    setQuarterPayload(null);
    QuartFilter?.current?.setValue(quarterDropdown[0]);
    CompFilter?.current?.clearValue();
    SectorRef?.current?.clearValue();
    WatchRef?.current?.clearValue();
  }

  useEffect(() => {
    (minValContext != epsChangeMin || maxValContext != epsChangeMax) &&
      setSectorFilter(null);
    (minValContext != epsChangeMin || maxValContext != epsChangeMax) &&
      setWatchFilter(null);
  }, [maxValContext, minValContext]);

  const { ref: loadingEarnings, inView: earningsView } = useInView(1);
  useEffect(() => {
    earningsView && setCounterEarnings((prev) => prev + 1);
  }, [earningsView]);

  return (
    <div className="w-full h-full md:pr-3 ">
      {/* Search and Checkbox */}
      <div className="flex gap-1 items-center">
        {/* Search and Quarter on API Level */}
        <div className="flex w-full pl-2 gap-1 pb-1">
          {/* Company Select */}
          {compDropdown && (
            <Select
              ref={CompFilter}
              className="text-[#0d2843] font-semibold text-sm flex-1"
              options={compDropdown}
              placeholder="Company"
              onChange={(values) => {
                values &&
                  (setCompPayload(values.value),
                  setQuarterPayload(null),
                  QuartFilter?.current?.clearValue(),
                  setCounterEarnings(1));
              }}
              color="#0d2843"
            />
          )}
          {/* Quarter Select */}
          {quarterDropdown && (
            <Select
              ref={QuartFilter}
              className="text-[#0d2843] font-semibold text-sm flex-1"
              options={quarterDropdown}
              defaultValue={quarterDropdown[0]}
              placeholder="Quarter"
              onChange={(values) => {
                values &&
                  (setCompPayload(null),
                  setQuarterPayload(values.value),
                  setWatchFilter(null),
                  setSectorFilter(null),
                  CompFilter?.current?.clearValue(),
                  setCounterEarnings(1));
              }}
              color="#0d2843"
            />
          )}
        </div>
        {/* Reset all filters Button */}
        <div className="">
          {(compPayload ||
            watchFilter ||
            minValContext > epsChangeMin ||
            maxValContext < epsChangeMax ||
            sectorFilter) && (
            <div
              className={`flex ${
                openFilter ? "justify-center mr-4" : "justify-end"
              }`}
              onClick={() => (setPrevious([]), setCounterEarnings(0))}
            >
              <div className="">
                <div
                  onClick={() => {
                    setResetting(true);
                    setTimeout(resetAllFilters, 10);
                  }}
                  className="text-sm bg-[#1a3c61] text-white px-2 py-1 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    <BiReset size={20} />
                  </span>

                  {/* {!resetting ? ( */}
                  <span className="text-xs md:text-sm whitespace-nowrap">
                    Reset All
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Sector, Watchlist and Range Filters */}
        <div className="relative">
          {/* Filter Icon */}
          <div className="flex flex-col">
            {!openFilter ? (
              <MdFilterAlt
                onClick={() => setOpenFilter(!openFilter)}
                size={30}
                className="text-[#1a3c61] cursor-pointer"
              />
            ) : (
              <AiFillCloseCircle
                onClick={() => setOpenFilter(!openFilter)}
                size={30}
                className="text-[#1a3c61] cursor-pointer"
              />
            )}
          </div>

          {/* Filters */}
          <div
            className={`p-1 absolute z-40 left-[-290px] flex flex-col gap-2 ${
              !openFilter && "hidden"
            } bg-[#f1f8ff] rounded-md overflow-y-auto min-h-[300px] h-full px-2 `}
          >
            {/* Sector Filter */}
            <div>
              <p className="font-semibold">Sector:</p>
              {sector && (
                <Select
                  ref={SectorRef}
                  className="text-[#0d2843] font-semibold text-sm flex-1 z-[200]"
                  options={[
                    ...sector.map((item) => {
                      return { label: item, value: item };
                    }),
                  ]}
                  maxMenuHeight={150}
                  placeholder="Sector..."
                  value={sectorFilter}
                  onChange={(values) => {
                    values
                      ? (setSectorFilter(values),
                        setWatchFilter(null),
                        resetEPSslider(),
                        setSelectedCompanyName(null))
                      : (setSectorFilter(null),
                        setWatchFilter(null),
                        resetEPSslider(),
                        setSelectedCompanyName(null));
                  }}
                  color="#0d2843"
                  isClearable={true}
                />
              )}
            </div>

            {/* Watchlist Filter */}
            <div>
              <p className="font-semibold">Watchlist:</p>
              {watchDrop && (
                <Select
                  ref={WatchRef}
                  className="text-[#0d2843] font-semibold text-sm flex-1 z-100"
                  options={watchFincode}
                  getOptionLabel={(option) => option?.watch}
                  getOptionValue={(option) => option?.codes}
                  maxMenuHeight={150}
                  placeholder="Watchlists..."
                  value={watchFilter}
                  onChange={(values) => {
                    values
                      ? (setWatchFilter(values),
                        setSectorFilter(null),
                        resetEPSslider(),
                        setSelectedCompanyName(null))
                      : (setWatchFilter(null),
                        setSectorFilter(null),
                        resetEPSslider(),
                        setSelectedCompanyName(null));
                  }}
                  color="#0d2843"
                  isClearable={true}
                />
              )}
            </div>

            {/* Slider Filter */}
            <div>
              {/* Consensus Slider Filter */}
              {epsChangeMin && (
                <div className=" my-1 bg-[#1a3c61] p-2 flex justify-between rounded-md">
                  <div className="font-semibold text-sm p-1 text-white  rounded-md my-1 flex justify-center">
                    EPS Change
                  </div>
                  <div className="pt-1">
                    <div className="">
                      <Slider
                        min={epsChangeMin}
                        max={epsChangeMax}
                        onChange={({ min, max }) => {
                          // console.log(`min = ${min}, max = ${max}`)
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full flex justify-center">
                {minValContext > epsChangeMin ||
                maxValContext < epsChangeMax ? (
                  <button
                    onClick={resetEPSslider}
                    className="text-sm bg-[#21568e] text-white px-2 py-1 rounded-md flex items-center justify-center gap-2 focus:bg-[#2676cb]"
                  >
                    <span>
                      <BiReset size={20} />
                    </span>
                    <span>Reset EPS Change Slider</span>
                  </button>
                ) : (
                  <div className="text-sm bg-gray-400 text-white px-2 py-1 rounded-md flex items-center justify-center gap-2 cursor-not-allowed">
                    <span>
                      <BiReset size={20} />
                    </span>
                    <span>Reset EPS Change</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mapping of Earning Call Cards */}
      {!previous[0] ? (
        // Loading Animation
        <div className="flex justify-center items-center h-[calc(100vh-135px)]">
          <span className="relative flex h-[80px] w-[80px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-"></span>
          </span>
        </div>
      ) : !previous[0] &&
        (epsChangeMin != minValContext || epsChangeMax != maxValContext) ? (
        <p className="font-semibold text-gray-500">
          Data not available for selected filters!
        </p>
      ) : (
        <div className="overflow-y-auto flex flex-col gap-1 px-2 h-[calc(100vh-135px)]">
          {previous?.map((item) => (
            <div
              key={item?.calendar_id}
              onClick={() => {
                setSelectedCompanyName(item?.company_name);
              }}
            >
              <PreviousCard
                calendarId={item?.calendar_id}
                uid={uid}
                name={item?.company_name}
                date={item?.earning_date}
                share={item?.share_price}
                shareChange={item?.share_price_change}
                sharePerc={item?.share_price_perc}
                consensus={item?.consensus_eps}
                consensusChange={item?.consensus_eps_change}
                consensusPerc={item?.consensus_eps_perc}
                consensusTarget={item?.consensus_eps_target}
                resultFlag={item?.result_flag}
                pptFlag={item?.ppt_flag}
                transcriptFlag={item?.transcript_flag}
                audioFlag={item?.audio_flag}
                brokerFlag={item?.broker_exist}
                summary={item?.summary}
                fincode={item?.fincode}
                tableFlag={item?.result_table_flag}
              />
            </div>
          ))}

          {/* Transparent Loading for NEW CARDS */}
          {!compPayload &&
            loadingFlag &&
            !sectorFilter &&
            !watchFilter &&
            (minValContext == epsChangeMin ||
              maxValContext == epsChangeMax) && (
              <div
                ref={loadingEarnings}
                className="flex justify-center items-center  md:mt-4"
              >
                <span className="relative flex h-[40px] w-[40px] md:h-[60px]  md:w-[60px]">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"
                    style={{ animationDuration: "1.2s" }}
                  ></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default PreviousEarningCalls;
