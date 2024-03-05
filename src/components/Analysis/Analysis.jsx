import React, { use, useEffect, useRef, useState } from "react";
import {
  BiArrowBack,
  BiMessageRoundedDots,
  BiMessageRoundedX,
  BiReset,
  BiSearch,
} from "react-icons/bi";
import Select from "react-select";
import { FaFilter } from "react-icons/fa6";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { FaWhatsapp } from "react-icons/fa";
import { useInfoContext } from "@/context/info";
import { IoIosCloseCircle } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useInView } from "react-intersection-observer";
import Slider from "./Slider";
import { useEarningsContext } from "@/context/Context";
import AnalysisCard from "./AnalysisCard";
import EarningsWidgetsPage from "../EarningsWidgetsPage/EarningsWidgetsPage";
import { setConfig } from "next/config";

const Analysis = ({ uid }) => {
  const {
    epsChangeMin,
    epsChangeMax,
    setEpsChangeMax,
    setEpsChangeMin,
    minValContext,
    setMinValContext,
    maxValContext,
    setMaxValContext,
    previousMenu,
    calendarIdContext,
    detailsPage,
    setDetailsPage,
    setWidgets,
    widgets,
    stockGptUrl,
    setStockGptUrl,
    masterNotesFlag,
    setMasterNotesFlag,
    selectedText,
    setSelectedText,
  } = useEarningsContext();

  const filterRef = useRef(null);

  const [data, setData] = useState(null);
  const [dataList, setDataList] = useState(null);
  const [filter, setFilter] = useState(false);
  const [counter, setCounter] = useState(1);
  const [compFilter, setCompFilter] = useState(null);
  const [quartFilter, setQuartFilter] = useState(null);
  const [sectorFilter, setSectorFilter] = useState(null);
  const [watchFilter, setWatchFilter] = useState(null);
  const [epsMinFilter, setEpsMinFilter] = useState(null);
  const [epsMaxFilter, setEpsMaxFilter] = useState(null);
  const [stockGpt, setStockGpt] = useState(false);

  // Fetch Earnings Calendar Data
  async function fetchInit() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/calendar-master`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: uid,
          counter: counter,
        }),
      }
    );
    const resJson = await res.json();
    setData(resJson?.key);
    setStockGptUrl(resJson?.key?.chat_url);
    !epsChangeMin && setEpsChangeMin(resJson?.key?.eps_change_min);
    !epsChangeMax && setEpsChangeMax(resJson?.key?.eps_change_max);
    !minValContext && setMinValContext(resJson?.key?.eps_change_min);
    !maxValContext && setMaxValContext(resJson?.key?.eps_change_max);
    setData(resJson?.key);
    dataList
      ? setDataList([...dataList, ...resJson?.key?.prev_earning])
      : setDataList(resJson?.key?.prev_earning);
  }

  async function fetchFilter(payload) {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/calendar-master`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const resJson = await res.json();
    // setData(resJson?.key);
    dataList &&
    minValContext == data?.eps_change_min &&
    maxValContext == data?.eps_change_max
      ? setDataList([...dataList, ...resJson?.key?.prev_earning])
      : setDataList(resJson?.key?.prev_earning);
  }

  useEffect(() => {
    uid && fetchInit();
  }, [uid]);

  useEffect(() => {
    uid &&
      !compFilter &&
      !quartFilter &&
      !sectorFilter &&
      !watchFilter &&
      minValContext == data?.eps_change_min &&
      maxValContext == data?.eps_change_max &&
      fetchInit();
  }, [
    uid,
    counter,
    compFilter,
    quartFilter,
    sectorFilter,
    watchFilter,
    minValContext,
    maxValContext,
  ]);

  // Company Filter
  useEffect(() => {
    uid &&
      compFilter &&
      fetchFilter({
        user_id: uid,
        first_time: "no",
        comp_fincode: compFilter?.value,
      });
  }, [uid, compFilter]);

  // Quarter Filter
  useEffect(() => {
    uid &&
      quartFilter &&
      fetchFilter({
        user_id: uid,
        counter: counter,
        quarter_value: quartFilter?.value,
      });
  }, [uid, quartFilter, counter]);

  // Sector Filter
  useEffect(() => {
    uid &&
      sectorFilter &&
      fetchFilter({
        user_id: uid,
        quarter_value: quartFilter?.value
          ? quartFilter?.value
          : data?.quarter_dropdown[0].value,
        sector: sectorFilter?.value,
      });
  }, [uid, sectorFilter]);

  // Watchlist Filter
  useEffect(() => {
    uid &&
      watchFilter &&
      fetchFilter({
        user_id: uid,
        quarter_value: quartFilter?.value
          ? quartFilter?.value
          : data?.quarter_dropdown[0].value,
        watchlist_fincodes: watchFilter?.codes,
      });
  }, [uid, watchFilter]);

  // EPS Range Filter
  useEffect(() => {
    (minValContext != data?.eps_change_min ||
      maxValContext != data?.eps_change_max) &&
      (setDataList(null),
      setCompFilter(null),
      setSectorFilter(null),
      setWatchFilter(null));
    (minValContext != data?.eps_change_min ||
      maxValContext != data?.eps_change_max) &&
      fetchFilter({
        user_id: uid,
        quarter_value: quartFilter?.value
          ? quartFilter?.value
          : data?.quarter_dropdown[0].value,
        eps_change_min: minValContext,
        eps_change_max: maxValContext,
      });
  }, [uid, minValContext, maxValContext]);

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

  // Loading State Ref
  const { ref: loadingCalendar, inView: calendarView } = useInView(0.1);
  useEffect(() => {
    calendarView && setCounter((prev) => prev + 1);
  }, [calendarView]);

  return (
    <div className="h-full w-full max-w-[1000px] sm:px-1">
      {/* Toggle etc. */}
      <div className="flex justify-between p-1 items-center gap-1 sm:gap-2">
        {/* Search and Quarter Filter */}
        <div className="flex w-full pl-2 gap-1 pb-1">
          {/* Company Select */}
          {data && (
            <Select
              className="text-[#0d2843] font-semibold text-sm flex-1 z-[40]"
              options={data?.comp_dropdown_list}
              placeholder="Company..."
              value={compFilter}
              onChange={(values) => {
                values &&
                  (setCompFilter(values),
                  setQuartFilter(null),
                  setWatchFilter(null),
                  setSectorFilter(null),
                  setDataList(null));
                setMinValContext(data?.eps_change_min);
                setMaxValContext(data?.eps_change_max);
              }}
              color="#0d2843"
            />
          )}
          {/* Quarter Select */}
          {data && (
            <Select
              className="text-[#0d2843] font-semibold text-sm flex-1 z-[40]"
              options={data?.quarter_dropdown}
              defaultValue={data?.quarter_dropdown[0]}
              value={quartFilter ? quartFilter : data?.quarter_dropdown[0]}
              placeholder="Quarter..."
              onChange={(values) => {
                values &&
                  (setCompFilter(null),
                  setQuartFilter(values),
                  setWatchFilter(null),
                  setSectorFilter(null),
                  setDataList(null));
                setMinValContext(data?.eps_change_min);
                setMaxValContext(data?.eps_change_max);
                setCounter(1);
              }}
              color="#0d2843"
            />
          )}
        </div>

        {/* Reset Filter */}
        {(compFilter ||
          quartFilter ||
          sectorFilter ||
          watchFilter ||
          minValContext != data?.eps_change_min ||
          maxValContext != data?.eps_change_max) && (
          <div
            onClick={() => {
              setDataList(null);
              setCompFilter(null);
              setQuartFilter(null);
              setSectorFilter(null);
              setWatchFilter(null);
              setMinValContext(data?.eps_change_min);
              setMaxValContext(data?.eps_change_max);
              setCounter(1);
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
        <div className="text-[#093967] cursor-pointer flex justify-end">
          {filter ? (
            <FaFilterCircleXmark onClick={() => setFilter(false)} size={25} />
          ) : (
            <FaFilter onClick={() => setFilter(true)} size={25} />
          )}
        </div>
      </div>

      {/* Actual Filters */}
      {filter && (
        <div
          ref={filterRef}
          className="absolute z-[300] bg-[#f1f8ff] p-4 rounded-md right-5"
        >
          <div className="mb-2 flex flex-col gap-3 w-full min-w-[200px]">
            {/* Sector Filter */}
            <div>
              <p className="font-semibold">Sector:</p>
              {data && (
                <Select
                  className="text-[#0d2843] font-semibold text-sm flex-1 z-[200]"
                  options={[
                    ...data?.sector_dropdown.map((item) => {
                      return { label: item, value: item };
                    }),
                  ]}
                  maxMenuHeight={150}
                  placeholder="Sector..."
                  value={sectorFilter}
                  onChange={(values) => {
                    values
                      ? (setDataList(null),
                        setCompFilter(null),
                        setWatchFilter(null),
                        setSectorFilter(values),
                        setMinValContext(data?.eps_change_min),
                        setMaxValContext(data?.eps_change_max))
                      : (setDataList(null),
                        setSectorFilter(null),
                        setWatchFilter(null),
                        setCompFilter(null),
                        setMinValContext(data?.eps_change_min),
                        setMaxValContext(data?.eps_change_max));

                    setCounter(1);
                  }}
                  color="#0d2843"
                  isClearable={true}
                />
              )}
            </div>

            {/* Watchlist Filter */}
            <div>
              <p className="font-semibold">Watchlist:</p>
              {data && (
                <Select
                  className="text-[#0d2843] font-semibold text-sm flex-1 z-100"
                  options={data?.watchlist_fincode}
                  getOptionLabel={(option) => option?.watch}
                  getOptionValue={(option) => option?.codes}
                  maxMenuHeight={150}
                  placeholder="Watchlists..."
                  value={watchFilter}
                  onChange={(values) => {
                    values
                      ? (setDataList(null),
                        setCompFilter(null),
                        setWatchFilter(values),
                        setSectorFilter(null),
                        setMinValContext(data?.eps_change_min),
                        setMaxValContext(data?.eps_change_max))
                      : (setDataList(null),
                        setCompFilter(null),
                        setWatchFilter(null),
                        setSectorFilter(null),
                        setMinValContext(data?.eps_change_min),
                        setMaxValContext(data?.eps_change_max));
                    setCounter(1);
                  }}
                  color="#0d2843"
                  isClearable={true}
                />
              )}
            </div>

            {/* EPS Slider */}
            <div>
              {/* Consensus Slider Filter */}
              {data && (
                <div className=" my-1 bg-[#1a3c61] p-2 rounded-md">
                  <div className="font-semibold text-sm text-white  rounded-md flex justify-center">
                    EPS Change
                  </div>
                  <div className="pt-1">
                    <Slider
                      min={data?.eps_change_min}
                      max={data?.eps_change_max}
                      onChange={(min, max) => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/*CARDS*/}
      {dataList && dataList[0] ? (
        <div className="flex flex-col gap-3 overflow-y-auto h-[calc(100vh-135px)] pr-1">
          {dataList?.map((item, index) => (
            <div key={index}>
              <AnalysisCard
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
          <div className="relative">
            {!compFilter &&
              !sectorFilter &&
              !watchFilter &&
              minValContext == data?.eps_change_min &&
              maxValContext == data?.eps_change_max && (
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
              )}
          </div>
        </div>
      ) : dataList && !dataList[0] ? (
        <p className="text-gray-500 font-semibold">
          No data available for selected Filters!
        </p>
      ) : (
        // Loading Animation
        <div className="flex justify-center items-center h-[calc(100vh-135px)]">
          <span className="relative flex h-[80px] w-[80px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-"></span>
          </span>
        </div>
      )}

      {/* Details Page */}
      <div
        key={calendarIdContext}
        className={`items-center rounded-lg absolute top-0 left-0 h-full w-full z-[400] ${
          !detailsPage && "hidden"
        }`}
      >
        <div className="w-full h-full">
          <EarningsWidgetsPage uid={uid} cid={calendarIdContext} />
        </div>
      </div>

      {/* Close Details */}
      <div
        className={`flex justify-start cursor-pointer absolute top-0 z-[400] left-0 ${
          !detailsPage && "hidden"
        } `}
      >
        <BiArrowBack
          className="rounded-full p-1 text-white"
          onClick={() => {
            setDetailsPage(false);
            setSelectedText(null);
            setWidgets({
              results: false,
              transcripts: true,
              ppt: false,
              summary: false,
              sentiment: false,
            });
          }}
          size={40}
        />
      </div>

      {/* Stock GPT Open/Close buttons
      <div
        className={`absolute right-0 z-10  ${
          !stockGpt ? "bottom-0" : "top-0 sm:top-auto"
        } flex justify-end pr-4`}
      >
        {!stockGpt ? (
          <div>
            <div
              className={`flex flex-col items-center rounded-lg text-white p-1 cursor-pointer`}
            >
              <BiMessageRoundedDots
                onClick={() => setStockGpt(!stockGpt)}
                size={50}
                className={`rounded-full bg-[#1e3e60] p-1 flex justify-end`}
              />
              <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                Stock GPT
              </h1>
            </div>
          </div>
        ) : (
          <div
            className={` flex flex-col items-center rounded-lg p-1 cursor-pointer`}
          >
            <BiMessageRoundedX
              onClick={() => setStockGpt(!stockGpt)}
              size={50}
              className="rounded-full text-[#1e3e60] bg-white sm:bg-[#1e3e60] sm:text-white p-1 "
            />
            <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
              Stock GPT
            </h1>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Analysis;
