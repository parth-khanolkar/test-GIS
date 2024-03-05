import React, { useEffect, useState } from "react";
import { useInfoContext } from "@/context/info";
import TableTA from "./TableTA";
import Select from "react-select";

const TechnicalAnalysis = () => {
  const { indicesDrop, setIndicesDrop, watchlistDrop, setWatchlistDrop, uid } =
    useInfoContext();

  const [data, setData] = useState(null);
  const [indexFilter, setIndexFilter] = useState({
    INDICES: "Nifty 50",
    Val: "123",
  });
  const [watchlistFilter, setWatchlistFilter] = useState(null);

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

  async function fetchDataIndices(filter) {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/market/market_analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: uid,
            WatchListGroupId: filter.Val,
            isindex: "yes", //yes
          }),
        }
      );
      const data1 = await res.json();
      setData(data1?.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataWatchlist(filter) {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/market/market_analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: uid,
            WatchListGroupId: filter.WatchListGroupId,
            isindex: "no", //yes
          }),
        }
      );
      const data1 = await res.json();
      setData(data1?.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    indexFilter != 0 && indexFilter != null && fetchDataIndices(indexFilter);
  }, [indexFilter]);

  useEffect(() => {
    watchlistFilter != 0 &&
      watchlistFilter != null &&
      fetchDataWatchlist(watchlistFilter);
  }, [watchlistFilter]);

  useEffect(() => {
    console.log(watchlistDrop);
  }, [watchlistDrop]);

  return (
    <div>
      {data != null ? (
        <div>
          <div className="flex gap-4">
            <div className="pb-3 w-[250px]">
              {indicesDrop && (
                <Select
                  className="font-bold text-sm z-40"
                  options={[...indicesDrop?.nse, ...indicesDrop?.bse]}
                  placeholder="Indices"
                  getOptionLabel={(option) => option.INDICES}
                  getOptionValue={(option) => option.Val}
                  onChange={(values) => {
                    values
                      ? (setIndexFilter(values),
                        setWatchlistFilter(null),
                        setData(null))
                      : setIndexFilter(null);
                  }}
                  value={indexFilter}
                />
              )}
            </div>
            <div className="pb-3 w-[250px]">
              {watchlistDrop && (
                <Select
                  className="font-bold text-sm z-40"
                  options={watchlistDrop.data}
                  placeholder="Watchlist"
                  getOptionLabel={(option) => option.WatchGroupName}
                  getOptionValue={(option) => option.WatchListGroupId}
                  onChange={(values) => {
                    values
                      ? (setWatchlistFilter(values),
                        setIndexFilter(null),
                        setData(null))
                      : setWatchlistFilter(null);
                  }}
                  value={watchlistFilter}
                />
              )}
            </div>
          </div>
          <TableTA columns={column} data={data} />
        </div>
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
