import React, { useEffect, useState } from "react";
import Table from "../../Table/Table";
import AnalysisTable from "../../Table/AnalysisTable";
import Default from "./Default";
import { useInfoContext } from "@/context/info";

const TechnicalAnalysis = () => {
  const {
    marketDropdown,
    setMarketDropdown,
    filterSelected,
    setFilterSelected,
  } = useInfoContext();

  const [data, setData] = useState(null);
  const column = [
    {
      header: "Name",
      accessorKey: "s_name",
    },
    {
      header: "Daily",
      accessorKey: "ta_daily",
      cell: (info) =>
        info.getValue() == -2
          ? "Strong Sell"
          : info.getValue() == -1
          ? "Sell"
          : info.getValue() == 0
          ? "Neutral"
          : info.getValue() == 1
          ? "Buy"
          : info.getValue() == 2 && "Strong Buy",
    },
    {
      header: "Weekly",
      accessorKey: "ta_weekly",
      cell: (info) =>
        info.getValue() == -2
          ? "Strong Sell"
          : info.getValue() == -1
          ? "Sell"
          : info.getValue() == 0
          ? "Neutral"
          : info.getValue() == 1
          ? "Buy"
          : info.getValue() == 2 && "Strong Buy",
    },
    {
      header: "Monthly",
      accessorKey: "ta_month",
      cell: (info) =>
        info.getValue() == -2
          ? "Strong Sell"
          : info.getValue() == -1
          ? "Sell"
          : info.getValue() == 0
          ? "Neutral"
          : info.getValue() == 1
          ? "Buy"
          : info.getValue() == 2 && "Strong Buy",
    },
  ];
  async function fetchAnalysis() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/market_analysis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: 1,
          WatchListGroupId: filterSelected,
          isindex: "yes", //yes
        }),
      }
    );
    const data1 = await res.json();
    setData(data1?.data);
  }

  useEffect(() => {
    fetchAnalysis();
  }, [filterSelected]);

  return (
    <div>
      {data != null && filterSelected != null ? (
        <AnalysisTable columns={column} data={data} />
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

export default TechnicalAnalysis;
