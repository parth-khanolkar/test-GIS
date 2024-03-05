import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Table from "../Table/Table";
import { useInfoContext } from "@/context/info";
import Select from "react-select";
import LoadingIndicator from "@/components/ReusableComps/LoadingIndicator";
import { TbArrowsSort } from "react-icons/tb";
import { useRouter } from "next/router";

const SectorDetail = () => {
  const {
    sectorDetail,
    setSectorDetail,
    sectorDetailName,
    setSectorDetailName,
    sectorDetailPeriod,
    setSectorDetailPeriod,
  } = useInfoContext();

  const router = useRouter();

  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("");
  const [reverse, setReverse] = useState(false);

  async function postNewNoteFunc() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/sector_detail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indexcode: sectorDetail,
          period: sectorDetailPeriod,
        }),
      }
    );
    const data1 = await res.json();
    setData(data1);
  }

  useEffect(() => {
    setData(null);
    postNewNoteFunc();
  }, [sectorDetail, sectorDetailPeriod]);

  return (
    <div className="p-1 border-[#4577A8]">
      {/* Close Button */}
      <div className="text-[18px] font-semibold border-b-2 border-black pb-2 flex justify-between">
        <h1 className="font-bold underline underline-offset-2 p-2 ">
          {sectorDetailName}
        </h1>
        <div className="flex gap-1 items-center hover:text-[#193b64] hover:underline ">
          <div
            onClick={() => (setSectorDetail(null), setSectorDetailName(null))}
            className="cursor-pointer"
          >
            <AiFillCloseCircle size={25} />
          </div>
          {/* <p onClick={() => setSectorDetail(null)} className="cursor-pointer ">
            close
          </p> */}
        </div>
      </div>
      <div className="flex justify-between items-center">
        {/* <h1 className="font-bold underline underline-offset-2 p-2 ">ENERGY</h1> */}
        {/* Period Select */}
        <div className="py-2 w-[100px]">
          {data && (
            <Select
              className="font-bold text-sm"
              options={data?.periodList}
              placeholder="Period"
              onChange={(values) => {
                values && setSectorDetailPeriod(values.value);
              }}
              defaultValue={data?.selected_period}
            />
          )}
        </div>
        <div
          onClick={() => setReverse(!reverse)}
          className="flex gap-2 items-center cursor-pointer hover:text-[#193b64] hover:underline font-bold"
        >
          <div className="rotate-90">
            <TbArrowsSort size={20} />
          </div>
          <p>Reverse</p>
        </div>
      </div>
      {/* Heat Maps*/}
      <div className="flex gap-3 flex-wrap justify-center w-full h-full max-h-[620px] scrollbar-thin overflow-x-auto px-2 ">
        {data != null && reverse ? (
          data?.data?.Table?.toReversed().map((item) => (
            <div
              key={item?.FINCODE}
              // style={{ backgroundColor: item?.color }}
              className={`flex items-center justify-center text-white text-center rounded-md min-w-[90px] max-w-[90px] h-[60px] text-sm font-bold flex-1 cursor-pointer hover:underline ${
                item?.PERCHG >= 0 && item?.PERCHG <= 3
                  ? "bg-[#38bb6c]"
                  : item?.PERCHG > 3 && item?.PERCHG <= 4
                  ? "bg-[#169649]"
                  : item?.PERCHG > 4 && item?.PERCHG <= 6
                  ? "bg-[#0a662f]"
                  : item?.PERCHG > 6
                  ? "bg-[#073f1d]"
                  : item?.PERCHG > -3 && item?.PERCHG <= 0
                  ? "bg-[#d86161]"
                  : item?.PERCHG >= -4
                  ? "bg-[#a64444]"
                  : item?.PERCHG < -4
                  ? "bg-[#6b2929]"
                  : "bg-gray-500"
              }`}
              onClick={() => router.push(`/companyinfo/${item?.FINCODE}`)}
            >
              <div>
                <p>
                  {item?.S_NAME?.length >= 10
                    ? item?.S_NAME.substring(0, 10) + "..."
                    : item?.S_NAME}
                </p>
                <p>{item?.PERCHG}%</p>
              </div>
            </div>
          ))
        ) : data != null && !reverse ? (
          data?.data?.Table?.map((item) => (
            <div
              key={item?.FINCODE}
              // style={{ backgroundColor: item?.color }}
              className={`flex items-center justify-center text-white text-center rounded-md min-w-[90px] max-w-[90px] h-[60px] text-sm font-bold flex-1 cursor-pointer hover:underline ${
                item?.PERCHG >= 0 && item?.PERCHG <= 3
                  ? "bg-[#38bb6c]"
                  : item?.PERCHG > 3 && item?.PERCHG <= 4
                  ? "bg-[#169649]"
                  : item?.PERCHG > 4 && item?.PERCHG <= 6
                  ? "bg-[#0a662f]"
                  : item?.PERCHG > 6
                  ? "bg-[#073f1d]"
                  : item?.PERCHG > -3 && item?.PERCHG <= 0
                  ? "bg-[#d86161]"
                  : item?.PERCHG >= -4
                  ? "bg-[#a64444]"
                  : item?.PERCHG < -4
                  ? "bg-[#6b2929]"
                  : "bg-gray-500"
              }`}
              onClick={() => router.push(`/companyinfo/${item?.FINCODE}`)}
            >
              <div>
                <p>
                  {item?.S_NAME?.length >= 10
                    ? item?.S_NAME.substring(0, 10) + "..."
                    : item?.S_NAME}
                </p>
                <p>{item?.PERCHG}%</p>
              </div>
            </div>
          ))
        ) : (
          // <div
          //   className={`flex flex-col justify-center items-center w-full h-full `}
          // >
          //   <span className="relative flex h-[80px] w-[80px]">
          //     <span className="animate-pulse inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
          //     <span className="relative inline-flex rounded-full h-2"></span>
          //   </span>
          // </div>
          <div className="text-[#1d3763] font-bold text-2xl animate-pulse h-full">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorDetail;
