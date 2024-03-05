import React, { useEffect, useState } from "react";
import { useInfoContext } from "@/context/info";
import Default from "./Default";
import PerformanceTable from "../../Table/PerformanceTable";

const WatchPerform = () => {
  const {
    marketDropdown,
    setMarketDropdown,
    filterSelected,
    setFilterSelected,
    // watchlistData,
    // setWatchlistData,
  } = useInfoContext();
  const [data, setData] = useState(null);
  const [actualData, setActualData] = useState(null);
  // const [fetchCount, setFetchCount] = useState(1);

  async function fetchPrice0() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/index_performence`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indexid: filterSelected,
          page: 1,
        }),
      }
    );
    const data1 = await res.json();
    setData(data1);
    setActualData(data1?.data);
  }

  async function fetchPrice1() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/index_performence`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indexid: filterSelected,
          page: data?.selectedpage + 1,
        }),
      }
    );
    const data1 = await res.json();
    setData(data1);
    setActualData([...actualData, ...data1?.data]);
  }

  useEffect(() => {
    setData(null);
    setActualData(null);
    filterSelected && fetchPrice0();
  }, [filterSelected]);

  useEffect(() => {
    data != null && data?.selectedpage < data?.totalpage && fetchPrice1();
  }, [data]);

  const column = [
    {
      header: "Stock Name",
      accessorKey: "company_name",
    },
    {
      header: "1 Day",
      accessorKey: "1D",
      cell: (info) => info.getValue().toFixed(1),
    },
    {
      header: "1 Week",
      accessorKey: "1W",
      cell: (info) => info.getValue().toFixed(1),
    },
    {
      header: "1 Month",
      accessorKey: "1M",
      cell: (info) => info.getValue().toFixed(1),
    },
    {
      header: "1 Year",
      accessorKey: "1Y",
      cell: (info) => info.getValue().toFixed(1),
    },
    {
      header: "YTD",
      accessorKey: "YTD",
      cell: (info) => info.getValue().toFixed(1),
    },
  ];
  return (
    <div>
      {actualData != null && filterSelected != null ? (
        <PerformanceTable columns={column} data={actualData} />
      ) : (
        <div className="flex justify-center">
          <div className="text-[#1d3763] font-bold text-2xl animate-pulse h-full">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPerform;
