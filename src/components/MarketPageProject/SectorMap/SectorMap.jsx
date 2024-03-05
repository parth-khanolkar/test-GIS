import LoadingIndicator from "@/components/ReusableComps/LoadingIndicator";
import { useInfoContext } from "@/context/info";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import Select from "react-select";

const SectorMap = () => {
  const {
    sectorDetail,
    setSectorDetail,
    sectorDetailName,
    setSectorDetailName,
    sectorDetailPeriod,
    setSectorDetailPeriod,
  } = useInfoContext();
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("");

  async function postNewNoteFunc() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/sectore_map`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period: period,
        }),
      }
    );
    const data1 = await res.json();
    setData(data1);
  }

  useEffect(() => {
    setData(null);
    postNewNoteFunc();
  }, [period]);

  return (
    <div className="p-2 ">
      <div className="flex justify-center font-semibold text-lg sm:text-xl text-[#153c65] underline underline-offset-4 decoration-slate-300 ">
        SECTORS
      </div>
      {/* Period Select */}
      <div className="pb-3 w-[100px]">
        {data && (
          <Select
            className="font-bold text-sm"
            options={data?.period}
            placeholder="Period"
            onChange={(values) => {
              values && setPeriod(values.value);
            }}
            defaultValue={data?.selected_period}
          />
        )}
      </div>
      {/* Heat Maps */}
      <div className="flex gap-3 flex-wrap justify-center md:max-h-[400px] overflow-y-auto scrollbar-thin px-2">
        {data != null ? (
          data?.data?.map((item) => (
            <div
              onClick={() => (
                setSectorDetail(item?.Index_Code),
                setSectorDetailName(item?.Index_Name),
                setSectorDetailPeriod(period)
              )}
              key={item?.Index_Code}
              // style={{ backgroundColor: item?.color }}
              className={`flex items-center justify-center text-white text-center rounded-md min-w-[90px] max-w-[90px] h-[60px] text-sm font-semibold cursor-pointer hover:underline flex-1 relative ${
                item?.Index_Code == sectorDetail && "border-2 border-gray-500"
              }
              
              ${
                (period == "1D" ||
                  period == "" ||
                  period == "1W" ||
                  period == "1M") &&
                item?.ClosePercent > 0 &&
                item?.ClosePercent <= 1
                  ? "bg-[#38bb6c]"
                  : (period == "1D" ||
                      period == "" ||
                      period == "1W" ||
                      period == "1M") &&
                    item?.ClosePercent > 1 &&
                    item?.ClosePercent <= 2
                  ? "bg-[#169649]"
                  : (period == "1D" ||
                      period == "" ||
                      period == "1W" ||
                      period == "1M") &&
                    item?.ClosePercent > 2 &&
                    item?.ClosePercent <= 3
                  ? "bg-[#0a662f]"
                  : (period == "1D" ||
                      period == "" ||
                      period == "1W" ||
                      period == "1M") &&
                    item?.ClosePercent > 3
                  ? "bg-[#073f1d]"
                  : (period == "1D" ||
                      period == "" ||
                      period == "1W" ||
                      period == "1M") &&
                    item?.ClosePercent > -1 &&
                    item?.ClosePercent <= 0
                  ? "bg-[#d86161]"
                  : (period == "1D" ||
                      period == "" ||
                      period == "1W" ||
                      period == "1M") &&
                    item?.ClosePercent >= -2
                  ? "bg-[#a64444]"
                  : (period == "1D" ||
                      period == "" ||
                      period == "1W" ||
                      period == "1M") &&
                    item?.ClosePercent < -2 &&
                    "bg-[#6b2929]"
              }

              ${
                period == "3M" &&
                item?.ClosePercent > 0 &&
                item?.ClosePercent <= 3
                  ? "bg-[#38bb6c]"
                  : period == "3M" &&
                    item?.ClosePercent > 3 &&
                    item?.ClosePercent <= 4
                  ? "bg-[#169649]"
                  : period == "3M" &&
                    item?.ClosePercent > 4 &&
                    item?.ClosePercent <= 6
                  ? "bg-[#0a662f]"
                  : period == "3M" && item?.ClosePercent > 6
                  ? "bg-[#073f1d]"
                  : period == "3M" &&
                    item?.ClosePercent > -3 &&
                    item?.ClosePercent <= 0
                  ? "bg-[#d86161]"
                  : period == "3M" && item?.ClosePercent >= -4
                  ? "bg-[#a64444]"
                  : period == "3M" && item?.ClosePercent < -4 && "bg-[#6b2929]"
              }

              ${
                period == "6M" &&
                item?.ClosePercent > 0 &&
                item?.ClosePercent <= 6
                  ? "bg-[#38bb6c]"
                  : period == "6M" &&
                    item?.ClosePercent > 6 &&
                    item?.ClosePercent <= 9
                  ? "bg-[#169649]"
                  : period == "6M" &&
                    item?.ClosePercent > 9 &&
                    item?.ClosePercent <= 11
                  ? "bg-[#0a662f]"
                  : period == "6M" && item?.ClosePercent > 11
                  ? "bg-[#073f1d]"
                  : period == "6M" &&
                    item?.ClosePercent > -6 &&
                    item?.ClosePercent <= 0
                  ? "bg-[#d86161]"
                  : period == "6M" && item?.ClosePercent >= -9
                  ? "bg-[#a64444]"
                  : period == "6M" && item?.ClosePercent < -9 && "bg-[#6b2929]"
              }

              ${
                period == "12M" &&
                item?.ClosePercent > 0 &&
                item?.ClosePercent <= 13
                  ? "bg-[#38bb6c]"
                  : period == "12M" &&
                    item?.ClosePercent > 13 &&
                    item?.ClosePercent <= 17
                  ? "bg-[#169649]"
                  : period == "12M" &&
                    item?.ClosePercent > 17 &&
                    item?.ClosePercent <= 22
                  ? "bg-[#0a662f]"
                  : period == "12M" && item?.ClosePercent > 22
                  ? "bg-[#073f1d]"
                  : period == "12M" &&
                    item?.ClosePercent > -13 &&
                    item?.ClosePercent <= 0
                  ? "bg-[#d86161]"
                  : period == "12M" && item?.ClosePercent >= -17
                  ? "bg-[#a64444]"
                  : period == "12M" &&
                    item?.ClosePercent < -17 &&
                    "bg-[#6b2929]"
              }`}
            >
              <div
                className={`${
                  item?.Index_Code == sectorDetail && "blur-[1px]"
                }`}
              >
                <p>{item?.Index_Name}</p>
                <p>{item?.ClosePercent}%</p>
              </div>
              <div
                style={{ color: item?.color }}
                className={`p-2 rounded-full bg-white ${
                  item?.Index_Code == sectorDetail ? "absolute" : "hidden"
                }`}
              >
                <TiTick size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <div className="text-[#1d3763] font-semibold text-2xl animate-pulse h-full">
              Loading...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorMap;
