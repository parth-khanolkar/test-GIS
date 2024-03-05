import React, { useEffect, useState } from "react";
import MovingAverageTable from "./MovingAverageTable";
import Select from "react-select";
import { useInfoContext } from "@/context/info";

const TechnicalAnalysis = () => {
  const {
    indicesDrop,
    setIndicesDrop,
    watchlistDrop,
    setWatchlistDrop,
    uid,
    periodTS,
    setPeriodTS,
  } = useInfoContext();
  const [data, setData] = useState(null);
  const [indexFilter, setIndexFilter] = useState({
    INDICES: "Nifty 50",
    Val: "123",
  });
  const [watchlistFilter, setWatchlistFilter] = useState(null);

  const column = [
    {
      header: "Company",
      accessorKey: "s_name",
    },
    {
      header: "Price",
      accessorKey: "Price",
    },
    {
      header: "50 Days",
      accessorKey: "Avg50DaysValue",
    },
    {
      header: "200 Days",
      accessorKey: "Avg200DaysValue",
    },
    {
      header: "263 Days",
      accessorKey: "Avg7_263_DaysValue",
    },
    {
      header: "445 Days",
      accessorKey: "Avg5_445_DaysValue",
    },
  ];

  async function fetchDataIndices(filter) {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/techanalysis/moving_avg`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: filter.Val,
            exchange: "NSE",
            UserId: String(uid),
            WatchListGroupId: "0",
          }),
        }
      );
      const data1 = await res.json();
      setData(data1?.Data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataWatchlist(filter) {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/techanalysis/moving_avg`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: "0",
            exchange: "NSE",
            UserId: String(uid),
            WatchListGroupId: filter.WatchListGroupId,
          }),
        }
      );
      const data1 = await res.json();
      setData(data1?.Data);
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

  return (
    <div className="px-2">
      <div className="overflow-y-auto scrollbar-thin">
        {/* Filtered Fetch */}
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
                        ? (setIndexFilter(values), setWatchlistFilter(null))
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
                        ? (setWatchlistFilter(values), setIndexFilter(null))
                        : setWatchlistFilter(null);
                    }}
                    value={watchlistFilter}
                  />
                )}
              </div>
            </div>
            <MovingAverageTable columns={column} data={data} />
          </div>
        ) : (
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

export default TechnicalAnalysis;
