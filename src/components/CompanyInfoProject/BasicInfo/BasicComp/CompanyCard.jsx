import {
  AiFillCaretDown,
  AiFillCaretLeft,
  AiFillCaretUp,
  AiFillLeftCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { useInfoContext } from "@/context/info";
import {
  CartesianGrid,
  ComposedChart,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Legend,
  Tooltip,
  Rectangle,
  Cross,
} from "recharts";
import moment from "moment";
import Image from "next/image";
import logo from "../../../../assets/images/logo.png";
import { MdAddAlert } from "react-icons/md";
import { useState } from "react";
import AddToWatchlistModal from "./Watchlist & Alert/AddToWatchlistModal";
import axios from "axios";
import { toast } from "react-toastify";
import SetAlertModal from "../../../Watchlist/SetAlertModal";

const CompanyCard = ({ data, graph }) => {
  // Contexts
  const {
    info,
    setInfo,
    initData,
    bseForBasic,
    setBseForBasic,
    uid,
    setUid,
    exchange,
  } = useInfoContext();

  const [isAddToWatchlistModalOpen, setIsAddToWatchlistModalOpen] =
    useState(false);
  const [isSetALertModalOpen, setIsSetALertModalOpen] = useState(false);
  const [isSetAlertActive, setIsSetAlertActive] = useState(true);

  const openAddToWatchlistModal = () => {
    setIsAddToWatchlistModalOpen(true);
  };
  const closeAddToWatchlistModal = () => {
    setIsAddToWatchlistModalOpen(false);
  };

  const openSetALertModal = () => {
    setIsSetALertModalOpen(true);
  };
  const closeSetALertModal = () => {
    setIsSetALertModalOpen(false);
  };

  const setAlert = async () => {
    console.log("From SetALertModal");
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/watchlists/alert_watchlist`,
        {
          UserId: uid,
          Fincode: initData?.fincode.value,
          CompanyName: initData?.CompName.value,
          Exchange: exchange,
          Type: "Company",
        }
      );

      if (response.data.data.Status === "Success") {
        toast.success(`${initData?.CompName.value} added to Alert Watchlist`, {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsSetAlertActive(false);
      } else if (response.data.data.Status === "Duplicate") {
        toast.info(
          `${initData?.CompName.value} alert added to Alert Watchlist`,
          {
            position: "bottom-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        setIsSetAlertActive(false);
      }
    } catch (error) {
      console.log("Error in setAlert", error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Customize the tooltip content here based on your needs
      return (
        <div className="bg-white bg-opacity-90 text-xs  p-3 rounded-md flex-col">
          <p className="font-bold">{`${moment(label).format(
            "MMM D, YYYY"
          )}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`}>
              <span style={{ color: entry.color }} className="font-bold">
                {entry.name}
              </span>
              {`: ${Number(entry.value).toLocaleString("en-IN")}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomActiveDot = (props) => {
    const { cx, cy } = props;

    // Replace 'your-image-url.png' with the URL of your image
    return (
      <circle
        x={cx - 10}
        y={cy - 10}
        width={20}
        height={20}
        // xlinkHref="../../../../assets/images/logo.png"
      />
    );
  };

  const CustomCursor = (props) => {
    const { x, y, width, height, stroke } = props;
    return (
      <Rectangle
        fill="red"
        stroke="red"
        x={x}
        y={y}
        width={width}
        height={height}
      />
    );
  };
  return (
    <>
      <div className="flex gap-2">
        {/* Loading Animation */}
        <div
          className={`flex justify-center items-center h-[calc(100vh-200px)] ${
            data && "hidden"
          }`}
        >
          <span className="relative flex h-[80px] w-[80px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-"></span>
          </span>
        </div>
        {/* Main Card */}
        <div
          className={`relative border-[#4577A8] border-[1px] shadow-md rounded-md overflow-hidden h-full w-full max-w-[550px] min-w-[350px] flex flex-col justify-center items-center bg-white z-30 ${
            !data && "hidden"
          }`}
        >
          {/* ABSOLUTE Info Button Result for Mobile */}
          {info && (
            <div className="relative w-full ">
              <div className="bg-[#153a64]/95 text-white gap-3 rounded-md p-2 absolute right-2 top-[110px] ">
                <div>
                  <p className="text-xs underline decoration-red-600 underline-offset-2 font-semibold">
                    Managing Director
                  </p>
                  <p className="text-sm italic font-semibold">
                    {data?.managing_dir?.value}
                  </p>
                </div>
                <div>
                  <p className="text-xs underline decoration-red-600 underline-offset-2 font-semibold">
                    Company Secretary
                  </p>
                  <p className="text-sm italic font-semibold">
                    {data?.company_secre?.value}
                  </p>
                </div>
                <div>
                  <p className="text-xs underline decoration-red-600 underline-offset-2 font-semibold">
                    Auditor
                  </p>
                  <p className="text-sm italic font-semibold">
                    {data?.auditor?.value}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Details Container */}
          <div className="py-2 px-4 flex flex-col w-full gap-2 justify-between ">
            <div className="flex justify-between w-full gap-3">
              {/* Company Details Container */}
              <div>
                {/* Logo and Name */}
                <div className="flex gap-5 items-center">
                  <div>
                    <h1 className="text-3xl font-semibold">
                      {data?.CompName?.value}
                    </h1>
                    <div className="flex gap-3 items-center">
                      <p className="font-semibold text-xl word-wrap">
                        {data?.Sector?.value}
                      </p>
                      <button
                        onClick={() => setInfo(!info)}
                        className="border border-black rounded-full"
                      >
                        <AiOutlineInfoCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stock Price */}
              <div className="flex flex-col">
                <div className="">
                  <p className="text-3xl font-semibold">
                    ₹
                    {data?.live_price?.value
                      ? data?.live_price?.value.toLocaleString()
                      : "NA"}
                  </p>
                </div>
                <div
                  className={`${
                    data?.change_percent?.value > 0
                      ? "text-green-600"
                      : data?.change_percent?.value == 0
                      ? "text-gray-500"
                      : "text-[#cf252d]"
                  } items-end font-semibold`}
                >
                  <div className="flex">
                    {data?.change_percent?.value >= 0 ? (
                      <AiFillCaretUp className="text-2xl" />
                    ) : (
                      <AiFillCaretDown className="text-2xl" />
                    )}
                    <h1 className="text-2xl">
                      ₹
                      {data?.change?.value
                        ? data?.change?.value.toLocaleString()
                        : "NA"}
                    </h1>
                  </div>
                  <p>
                    (
                    {data?.change_percent?.value
                      ? data?.change_percent?.value
                      : "NA"}
                    %)
                  </p>
                </div>
              </div>
            </div>

            {/* NSE /BSE Toggle for NULL */}
            {data &&
              bseForBasic != null &&
              data?.BSECode?.value != "" &&
              data?.NSECode?.value != "" && (
                <div className="flex items-center text-sm italic font-bold gap-2">
                  <p>NSE</p>
                  <label className="flex cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={bseForBasic}
                        onChange={() => {
                          setBseForBasic(!bseForBasic);
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`box block h-5 w-8 rounded-full ${
                          !bseForBasic ? "bg-gray-500" : "bg-[#143b64]"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white transition ${
                          bseForBasic ? "translate-x-full" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                  <p>BSE</p>
                </div>
              )}

            {/* NSE /BSE Toggle for NULL */}
            {/* {bseForBasic != null &&
            data?.BSECode != "" &&
            data?.NSECode == "" && (
              <div className="flex items-center text-sm italic font-bold gap-2">
                <p>NSE</p>
                <label className="flex cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={bseForBasic}
                      onChange={() => {
                        alert("NSE not available!");
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`box block h-5 w-8 rounded-full ${
                        !bseForBasic ? "bg-gray-500" : "bg-[#143b64]"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white transition ${
                        bseForBasic ? "translate-x-full" : ""
                      }`}
                    ></div>
                  </div>
                </label>
                <p>BSE</p>
              </div>
            )} */}
            {/* BSE, NSE, MCAP(INR) */}
            <div className="flex font-semibold justify-between w-full">
              {/* BSE */}
              <div>
                <h1 className="text-[#153a64] border-b border-gray-400 text-lg">
                  BSE Code
                </h1>
                <p className="text-sm">{data?.BSECode?.value}</p>
              </div>
              <div>
                <h1 className="text-[#153a64] border-b border-gray-400 text-lg">
                  NSE Code
                </h1>
                <p className="text-sm">{data?.NSECode?.value}</p>
              </div>
              <div>
                <h1 className="text-[#153a64] border-b border-gray-400 text-lg">
                  MCAP (INR)
                </h1>
                <p className="text-sm">
                  <span className="pr-1 font-normal text-gray-500">₹</span>
                  <span>
                    {data?.MCAP?.value.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="pl-1 font-normal text-gray-500">Cr.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 52 weeks and avg volume etc. */}
          <div className="w-full p-4">
            <div className="border-t-2 border-gray-700/50 pt-5">
              {/* <div className="flex justify-between text-lg font-semibold text-[#153a64]">
              <p>52 Week Lows</p>
              <p>52 Week High</p>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <AiFillCaretDown size={25} />
                <AiFillCaretDown size={25} />
              </div>
              <div className=" rounded-full">
                <input
                  type="range"
                  className="w-full stockSlider"
                  min={data?.["_52weekLow"]?.value}
                  max={data?.["_52weekHigh"]?.value}
                  value={data?.live_price?.value}
                />
              </div>
            </div> */}
              {/* <div className="flex justify-between font-bold text-[#153a64]">
              <p>
                ₹
                {data?.["_52weekLow"]?.value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p>
                ₹
                {data?.["_52weekHigh"]?.value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div> */}
              <div className="flex justify-between gap-2 text-sm sm:text-base">
                <div>
                  <h1 className="text-[#153a64] border-b border-gray-400 font-semibold">
                    30 Day Avg Volume
                  </h1>
                  <p className="text-sm font-bold">
                    <span>
                      {data?.avgVolume?.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="pl-1 font-normal text-gray-500">Cr.</span>
                  </p>
                </div>
                <div>
                  <h1 className="text-[#153a64] border-b border-gray-400 font-semibold">
                    Promoter Holding
                  </h1>
                  <p className="text-sm font-bold">
                    <span>{data?.promoterPerc?.value}</span>
                    <span>
                      <span className="pl-1 font-normal text-gray-500">%</span>
                    </span>
                  </p>
                </div>
                <div>
                  <h1 className="text-[#153a64] border-b border-gray-400 font-semibold">
                    Institutional Holding
                  </h1>
                  <p className="text-sm font-bold">
                    <span> {data?.institutionalPerc?.value}</span>
                    <span className="pl-1 font-normal text-gray-500">%</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Strong or Weak Buy */}
            {/* <div className=" flex pb-4 flex-col">
            <h1 className="font-semibold underline text-lg">
              Combined Analysis:
            </h1>
            <div className="flex w-full overflow-hidden rounded-md whitespace-nowrap">
              <div className="w-full flex-[0.2]">
                <div className="flex flex-col justify-center items-center h-[50px]">
                  <h1
                    className={`text-lg font-semibold ${
                      data?.weakStrong?.value != "weakest" && "hidden"
                    }`}
                  >
                    Weakest Buy
                  </h1>
                  <AiFillCaretDown
                    className={`${
                      data?.weakStrong?.value != "weakest" && "hidden"
                    }`}
                    size={30}
                  />
                </div>
                <div className="w-full bg-red-600/70 h-8 rounded-l-md"></div>
              </div>
              <div className="w-full flex-[0.2]">
                <div className="flex flex-col justify-center items-center h-[50px]">
                  <h1
                    className={`text-lg font-semibold ${
                      data?.weakStrong?.value != "weak" && "hidden"
                    }`}
                  >
                    Weak Buy
                  </h1>
                  <AiFillCaretDown
                    className={`${
                      data?.weakStrong?.value != "weak" && "hidden"
                    }`}
                    size={30}
                  />
                </div>
                <div className="w-full bg-pink-400/90 h-8"></div>
              </div>
              <div className="w-full flex-[0.2]">
                <div className="flex flex-col justify-center items-center h-[50px]">
                  <h1
                    className={`${
                      data?.weakStrong?.value != "average" && "hidden"
                    } text-lg font-semibold`}
                  >
                    Average Buy
                  </h1>
                  <AiFillCaretDown
                    className={`${
                      data?.weakStrong?.value != "average" && "hidden"
                    }`}
                    size={30}
                  />
                </div>
                <div className="w-full bg-yellow-600/90 h-8"></div>
              </div>
              <div className="w-full flex-[0.2]">
                <div className="flex flex-col justify-center items-center h-[50px]">
                  <h1
                    className={`text-lg font-semibold ${
                      data?.weakStrong?.value != "good" && "hidden"
                    }`}
                  >
                    Good Buy
                  </h1>
                  <AiFillCaretDown
                    className={`${
                      data?.weakStrong?.value != "good" && "hidden"
                    }`}
                    size={30}
                  />
                </div>
                <div className="w-full bg-green-300/90 h-8"></div>
              </div>
              <div className="w-full flex-[0.2]">
                <div className="flex flex-col justify-center items-center h-[50px]">
                  <h1
                    className={`text-lg font-semibold ${
                      data?.weakStrong?.value != "strong" && "hidden"
                    }`}
                  >
                    Strong Buy
                  </h1>
                  <AiFillCaretDown
                    className={`${
                      data?.weakStrong?.value != "strong" && "hidden"
                    }`}
                    size={30}
                  />
                </div>
                <div className="w-full bg-green-600/90 h-8 rounded-r-md"></div>
              </div>
            </div>
          </div> */}
            {/* Chart */}
            <div className="overflow-x-auto pt-8">
              <ResponsiveContainer
                width="99%"
                height={207}
                // minHeight={300}
                // minWidth={300}
              >
                <LineChart
                  // width={400}
                  // height={100}
                  // data={graph}
                  data={graph?.map((d) => ({ ...d, price: +d.price }))}
                  // margin={{ left: -20 }}
                  margin={{ top: 0, bottom: 20, left: -25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={"Date"}
                    tickFormatter={(Date) => moment(Date).format("MMM YY")}
                    angle={-90}
                    textAnchor="end"
                    tick={{ fontWeight: "bold", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="left-axis"
                    tick={{ fontWeight: "bold", fontSize: 12 }}
                    domain={["auto", "auto"]}
                    // allowDataOverflow={true}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* <Legend /> */}
                  <Line
                    type="monotone"
                    dataKey="price"
                    yAxisId="left-axis"
                    stroke="#6bac84"
                    dot={false}
                    name="Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Add to WatchList Container */}
          <div className="w-full  flex flex-row text-base md:text-lg">
            <button
              className="flex border-r border-white justify-center items-center p-2 gap-3 w-1/2 bg-[#153a64] hover:bg-[#1b508c]"
              onClick={() => {
                openAddToWatchlistModal();
              }}
            >
              <span className="bg-white w-5 h-5 flex justify-center items-center rounded-sm font-bold  ">
                +
              </span>
              <span className="text-white">Add to Watchlist</span>
            </button>

            <button
              className={`flex border-l border-white justify-center items-center p-2 gap-3 w-1/2 bg-[#153a64] 
            ${isSetAlertActive ? "hover:bg-[#1b508c]" : "cursor-default"}
          `}
              // disabled={!isSetAlertActive}
              onClick={() => {
                openSetALertModal();
              }}
            >
              <span className="bg-white w-5 h-5 flex justify-center items-center rounded-sm font-bold  ">
                <MdAddAlert />
              </span>
              <span className="text-white">Set Alert</span>
            </button>
          </div>
        </div>
      </div>

      <SetAlertModal
        isOpen={isSetALertModalOpen}
        closeModal={closeSetALertModal}
        companyName={initData?.CompName.value}
        fincode={initData?.fincode.value}
        exchange={exchange}
      />
      <AddToWatchlistModal
        isAddToWatchlistModalOpen={isAddToWatchlistModalOpen}
        closeAddToWatchlistModal={closeAddToWatchlistModal}
      />
    </>
  );
};

export default CompanyCard;
