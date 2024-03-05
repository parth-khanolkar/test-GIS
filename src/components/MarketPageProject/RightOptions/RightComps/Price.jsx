import React, { useEffect, useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import Select from "react-select";
import { useInfoContext } from "@/context/info";
import Default from "./Default";
import PerformanceTable from "../../Table/PerformanceTable";

const Price = () => {
  const {
    marketDropdown,
    setMarketDropdown,
    filterSelected,
    setFilterSelected,
  } = useInfoContext();

  const [data, setData] = useState(null);
  const [actualData, setActualData] = useState(null);
  // const [fetchCount, setFetchCount] = useState(null);

  const column = [
    {
      header: "Stock Name",
      accessorKey: "S_NAME",
    },
    {
      header: "Price",
      accessorKey: "CLOSE_PRICE",
    },
    {
      header: "Change",
      accessorKey: "NETCHG",
    },
    {
      header: "Change %",
      accessorKey: "PERCHG",
    },
  ];

  // async function fetchPrice0() {
  //   const res = await fetch(
  //     `https://transcriptanalyser.com/market/live_index`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         indexid: filterSelected,
  //         page: 1,
  //       }),
  //     }
  //   );
  //   const data1 = await res.json();
  //   setData(data1);
  //   setActualData(data1?.data);
  // }

  // async function fetchPrice1() {
  //   const res = await fetch(
  //     `https://transcriptanalyser.com/market/live_index`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         indexid: filterSelected,
  //         page: data?.selectedpage + 1,
  //       }),
  //     }
  //   );
  //   const data1 = await res.json();
  //   setData(data1);
  //   setActualData([...actualData, ...data1?.data]);
  // }

  // useEffect(() => {
  //   // setData(null);
  //   // setActualData(null);
  //   fetchPrice0();
  // }, [filterSelected]);

  // useEffect(() => {
  //   data?.selectedpage < data?.totalpage && fetchPrice1();
  // }, [data]);

  async function postNewNoteFunc() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/sector_detail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indexcode: filterSelected,
          period: "",
        }),
      }
    );
    const data1 = await res.json();
    setData(data1?.data?.Table);
  }

  useEffect(() => {
    setData(null);
    postNewNoteFunc();
  }, [filterSelected]);

  return (
    <div className="px-2">
      <div className="overflow-y-auto scrollbar-thin">
        {/* Filtered Fetch */}
        {data != null && filterSelected != null ? (
          <PerformanceTable columns={column} data={data} />
        ) : (
          // : filterSelected == null ? (
          //   <Default />
          // )
          <div className="flex justify-center">
            <div className="text-[#1d3763] font-bold text-2xl animate-pulse h-full">
              Loading...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Price;
