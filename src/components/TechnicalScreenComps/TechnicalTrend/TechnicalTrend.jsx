import React, { useEffect, useState } from "react";
import TableTT from "./TableTT";
import Select from "react-select";
import { useInfoContext } from "@/context/info";
import moment from "moment";

const TechnicalTrend = () => {
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
  const [column, setColumn] = useState([
    {
      header: "Stock Name",
      accessorKey: "s_name",
    },
    {
      header: "1D(%)",
      accessorKey: "Day1",
    },
    {
      header: "1W(%)",
      accessorKey: "Week1",
    },
    {
      header: "1M(%)",
      accessorKey: "Month1",
    },
  ]);

  async function fetchDataIndices(filter) {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/techanalysis/newweek_on_week`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: filter.Val,
            WatchListGroupId: "0",
            period: periodTS,
          }),
        }
      );
      const data1 = await res.json();
      setData(data1);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataWatchlist(filter) {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/techanalysis/newweek_on_week`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: "0",
            WatchListGroupId: String(filter.WatchListGroupId),
            period: periodTS,
          }),
        }
      );
      const data1 = await res.json();
      setData(data1);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setData(null);
    indexFilter != 0 && indexFilter != null && fetchDataIndices(indexFilter);
  }, [indexFilter, periodTS]);

  useEffect(() => {
    setData(null);
    watchlistFilter != 0 &&
      watchlistFilter != null &&
      fetchDataWatchlist(watchlistFilter);
  }, [watchlistFilter, periodTS]);

  useEffect(() => {
    // data &&
    //   data?.data?.DataHeader[0] &&
    //   setColumn([
    //     {
    //       header: "Stock Name",
    //       accessorKey: "s_name",
    //     },
    //     {
    //       header: "1D(%)",
    //       accessorKey: "Day1",
    //     },
    //     {
    //       header: "1W(%)",
    //       accessorKey: "Week1",
    //     },
    //     {
    //       header: "1M(%)",
    //       accessorKey: "Month1",
    //     },
    //     {
    //       header: moment(data?.data.DataHeader[0]?.update_date).format(
    //         "Do MMM "
    //       ),
    //       accessorKey: data?.data.DataHeader[0]?.update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     // {
    //     //   header: moment(data.data.DataHeader[1].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[1].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[2].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[2].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[3].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[3].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[4].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[4].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[5].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[5].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[6].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[6].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     ,
    //   ]);

    // data &&
    //   data?.data?.DataHeader[1] &&
    //   setColumn([
    //     {
    //       header: "Stock Name",
    //       accessorKey: "s_name",
    //     },
    //     {
    //       header: "1D(%)",
    //       accessorKey: "Day1",
    //     },
    //     {
    //       header: "1W(%)",
    //       accessorKey: "Week1",
    //     },
    //     {
    //       header: "1M(%)",
    //       accessorKey: "Month1",
    //     },
    //     {
    //       header: moment(data?.data.DataHeader[0]?.update_date).format(
    //         "Do MMM "
    //       ),
    //       accessorKey: data?.data.DataHeader[0]?.update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[1].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[1].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     // {
    //     //   header: moment(data.data.DataHeader[2].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[2].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[3].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[3].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[4].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[4].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[5].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[5].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[6].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[6].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     ,
    //   ]);

    // data &&
    //   data?.data?.DataHeader[2] &&
    //   setColumn([
    //     {
    //       header: "Stock Name",
    //       accessorKey: "s_name",
    //     },
    //     {
    //       header: "1D(%)",
    //       accessorKey: "Day1",
    //     },
    //     {
    //       header: "1W(%)",
    //       accessorKey: "Week1",
    //     },
    //     {
    //       header: "1M(%)",
    //       accessorKey: "Month1",
    //     },
    //     {
    //       header: moment(data?.data.DataHeader[0]?.update_date).format(
    //         "Do MMM "
    //       ),
    //       accessorKey: data?.data.DataHeader[0]?.update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[1].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[1].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[2].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[2].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     // {
    //     //   header: moment(data.data.DataHeader[3].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[3].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[4].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[4].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[5].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[5].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[6].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[6].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     ,
    //   ]);

    // data &&
    //   data?.data?.DataHeader[3] &&
    //   setColumn([
    //     {
    //       header: "Stock Name",
    //       accessorKey: "s_name",
    //     },
    //     {
    //       header: "1D(%)",
    //       accessorKey: "Day1",
    //     },
    //     {
    //       header: "1W(%)",
    //       accessorKey: "Week1",
    //     },
    //     {
    //       header: "1M(%)",
    //       accessorKey: "Month1",
    //     },
    //     {
    //       header: moment(data?.data.DataHeader[0]?.update_date).format(
    //         "Do MMM "
    //       ),
    //       accessorKey: data?.data.DataHeader[0]?.update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[1].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[1].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[2].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[2].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[3].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[3].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     // {
    //     //   header: moment(data.data.DataHeader[4].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[4].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[5].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[5].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[6].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[6].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     ,
    //   ]);

    // data &&
    //   data?.data?.DataHeader[4] &&
    //   setColumn([
    //     {
    //       header: "Stock Name",
    //       accessorKey: "s_name",
    //     },
    //     {
    //       header: "1D(%)",
    //       accessorKey: "Day1",
    //     },
    //     {
    //       header: "1W(%)",
    //       accessorKey: "Week1",
    //     },
    //     {
    //       header: "1M(%)",
    //       accessorKey: "Month1",
    //     },
    //     {
    //       header: moment(data?.data.DataHeader[0]?.update_date).format(
    //         "Do MMM "
    //       ),
    //       accessorKey: data?.data.DataHeader[0]?.update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[1].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[1].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[2].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[2].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[3].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[3].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     {
    //       header: moment(data.data.DataHeader[4].update_date).format("Do MMM "),
    //       accessorKey: data.data.DataHeader[4].update_date,
    //       cell: (info) =>
    //         info.getValue() == -2
    //           ? "Strong Sell"
    //           : info.getValue() == -1
    //           ? "Sell"
    //           : info.getValue() == 0
    //           ? "Neutral"
    //           : info.getValue() == 1
    //           ? "Buy"
    //           : info.getValue() == 2 && "Strong Buy",
    //     },
    //     // {
    //     //   header: moment(data.data.DataHeader[5].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[5].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     // {
    //     //   header: moment(data.data.DataHeader[6].update_date).format("Do MMM "),
    //     //   accessorKey: data.data.DataHeader[6].update_date,
    //     //   cell: (info) =>
    //     //     info.getValue() == -2
    //     //       ? "Strong Sell"
    //     //       : info.getValue() == -1
    //     //       ? "Sell"
    //     //       : info.getValue() == 0
    //     //       ? "Neutral"
    //     //       : info.getValue() == 1
    //     //       ? "Buy"
    //     //       : info.getValue() == 2 && "Strong Buy",
    //     // },
    //     ,
    //   ]);

    data &&
      data?.DataHeader[5] &&
      setColumn([
        {
          header: "Stock Name",
          accessorKey: "s_name",
        },
        {
          header: "1D(%)",
          accessorKey: "Day1",
        },
        {
          header: "1W(%)",
          accessorKey: "Week1",
        },
        {
          header: "1M(%)",
          accessorKey: "Month1",
        },
        {
          header: moment(data?.DataHeader[0]?.update_date).format("Do MMM "),
          accessorKey: data?.DataHeader[0]?.update_date,
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
          header: moment(data.DataHeader[1].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[1].update_date,
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
          header: moment(data.DataHeader[2].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[2].update_date,
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
          header: moment(data.DataHeader[3].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[3].update_date,
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
          header: moment(data.DataHeader[4].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[4].update_date,
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
          header: moment(data.DataHeader[5].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[5].update_date,
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
        // {
        //   header: moment(data.data.DataHeader[6].update_date).format("Do MMM "),
        //   accessorKey: data.data.DataHeader[6].update_date,
        //   cell: (info) =>
        //     info.getValue() == -2
        //       ? "Strong Sell"
        //       : info.getValue() == -1
        //       ? "Sell"
        //       : info.getValue() == 0
        //       ? "Neutral"
        //       : info.getValue() == 1
        //       ? "Buy"
        //       : info.getValue() == 2 && "Strong Buy",
        // },
        ,
      ]);

    data &&
      data?.DataHeader[6] &&
      setColumn([
        {
          header: "Stock Name",
          accessorKey: "s_name",
        },
        {
          header: "1D(%)",
          accessorKey: "Day1",
        },
        {
          header: "1W(%)",
          accessorKey: "Week1",
        },
        {
          header: "1M(%)",
          accessorKey: "Month1",
        },
        {
          header: moment(data?.DataHeader[0]?.update_date).format("Do MMM "),
          accessorKey: data?.DataHeader[0]?.update_date,
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
          header: moment(data.DataHeader[1].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[1].update_date,
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
          header: moment(data.DataHeader[2].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[2].update_date,
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
          header: moment(data.DataHeader[3].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[3].update_date,
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
          header: moment(data.DataHeader[4].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[4].update_date,
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
          header: moment(data.DataHeader[5].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[5].update_date,
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
          header: moment(data.DataHeader[6].update_date).format("Do MMM "),
          accessorKey: data.DataHeader[6].update_date,
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
        ,
      ]);
  }, [data]);

  return (
    <div className="px-2">
      <div className="overflow-y-auto scrollbar-thin">
        {data != null && column[0] != null ? (
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
            <TableTT columns={column} data={data?.Data} />
          </div>
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

export default TechnicalTrend;
