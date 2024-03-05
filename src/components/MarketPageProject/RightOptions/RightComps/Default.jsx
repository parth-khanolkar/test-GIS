import React, { useEffect, useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
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
} from "recharts";
import addWatchlist from "@/assets/images/addWatchlist.png";

const Default = () => {
  const [data, setData] = useState(null);
  const graph = [
    {
      Date: "11/25/2022 12:00:00 AM",
      price: "112.133333333333",
    },
    {
      Date: "11/28/2022 12:00:00 AM",
      price: "108.7",
    },
    {
      Date: "11/29/2022 12:00:00 AM",
      price: "106.983333333333",
    },
    {
      Date: "11/30/2022 12:00:00 AM",
      price: "105.25",
    },
    {
      Date: "12/1/2022 12:00:00 AM",
      price: "105.85",
    },
    {
      Date: "12/2/2022 12:00:00 AM",
      price: "107.8",
    },
    {
      Date: "12/5/2022 12:00:00 AM",
      price: "106.983333333333",
    },
    {
      Date: "12/6/2022 12:00:00 AM",
      price: "108",
    },
    {
      Date: "12/7/2022 12:00:00 AM",
      price: "106.933333333333",
    },
    {
      Date: "12/8/2022 12:00:00 AM",
      price: "106.8",
    },
    {
      Date: "12/9/2022 12:00:00 AM",
      price: "106.716666666667",
    },
    {
      Date: "12/12/2022 12:00:00 AM",
      price: "110.5",
    },
    {
      Date: "12/13/2022 12:00:00 AM",
      price: "115.433333333333",
    },
    {
      Date: "12/14/2022 12:00:00 AM",
      price: "116.766666666667",
    },
    {
      Date: "12/15/2022 12:00:00 AM",
      price: "114.05",
    },
    {
      Date: "12/16/2022 12:00:00 AM",
      price: "118.45",
    },
    {
      Date: "12/19/2022 12:00:00 AM",
      price: "113.8",
    },
    {
      Date: "12/20/2022 12:00:00 AM",
      price: "113.466666666667",
    },
    {
      Date: "12/21/2022 12:00:00 AM",
      price: "110.6",
    },
    {
      Date: "12/22/2022 12:00:00 AM",
      price: "116.05",
    },
    {
      Date: "12/23/2022 12:00:00 AM",
      price: "110.25",
    },
    {
      Date: "12/26/2022 12:00:00 AM",
      price: "105.8",
    },
    {
      Date: "12/27/2022 12:00:00 AM",
      price: "103.55",
    },
    {
      Date: "12/28/2022 12:00:00 AM",
      price: "105.5",
    },
    {
      Date: "12/29/2022 12:00:00 AM",
      price: "102.25",
    },
    {
      Date: "12/30/2022 12:00:00 AM",
      price: "97.2",
    },
    {
      Date: "1/2/2023 12:00:00 AM",
      price: "98.85",
    },
    {
      Date: "1/3/2023 12:00:00 AM",
      price: "98.65",
    },
    {
      Date: "1/4/2023 12:00:00 AM",
      price: "97.45",
    },
    {
      Date: "1/5/2023 12:00:00 AM",
      price: "94.8",
    },
    {
      Date: "1/6/2023 12:00:00 AM",
      price: "94.8",
    },
    {
      Date: "1/9/2023 12:00:00 AM",
      price: "91.25",
    },
    {
      Date: "1/10/2023 12:00:00 AM",
      price: "89.85",
    },
    {
      Date: "1/11/2023 12:00:00 AM",
      price: "92.95",
    },
    {
      Date: "1/12/2023 12:00:00 AM",
      price: "94.4",
    },
    {
      Date: "1/13/2023 12:00:00 AM",
      price: "91.85",
    },
    {
      Date: "1/16/2023 12:00:00 AM",
      price: "91",
    },
    {
      Date: "1/17/2023 12:00:00 AM",
      price: "89.3",
    },
    {
      Date: "1/18/2023 12:00:00 AM",
      price: "88",
    },
    {
      Date: "1/19/2023 12:00:00 AM",
      price: "86.6",
    },
    {
      Date: "1/20/2023 12:00:00 AM",
      price: "87.85",
    },
    {
      Date: "1/23/2023 12:00:00 AM",
      price: "89.1",
    },
    {
      Date: "1/24/2023 12:00:00 AM",
      price: "87.5",
    },
    {
      Date: "1/25/2023 12:00:00 AM",
      price: "84.8",
    },
    {
      Date: "1/27/2023 12:00:00 AM",
      price: "83.2",
    },
    {
      Date: "1/30/2023 12:00:00 AM",
      price: "81.6",
    },
    {
      Date: "1/31/2023 12:00:00 AM",
      price: "83.4",
    },
    {
      Date: "2/1/2023 12:00:00 AM",
      price: "84.45",
    },
    {
      Date: "2/2/2023 12:00:00 AM",
      price: "81.45",
    },
    {
      Date: "2/3/2023 12:00:00 AM",
      price: "82.55",
    },
    {
      Date: "2/6/2023 12:00:00 AM",
      price: "83.3",
    },
    {
      Date: "2/7/2023 12:00:00 AM",
      price: "80.45",
    },
    {
      Date: "2/8/2023 12:00:00 AM",
      price: "82",
    },
    {
      Date: "2/9/2023 12:00:00 AM",
      price: "80.2",
    },
    {
      Date: "2/10/2023 12:00:00 AM",
      price: "79.75",
    },
    {
      Date: "2/13/2023 12:00:00 AM",
      price: "79.5",
    },
    {
      Date: "2/14/2023 12:00:00 AM",
      price: "81.1",
    },
    {
      Date: "2/15/2023 12:00:00 AM",
      price: "81.55",
    },
    {
      Date: "2/16/2023 12:00:00 AM",
      price: "78.35",
    },
    {
      Date: "2/17/2023 12:00:00 AM",
      price: "76.45",
    },
    {
      Date: "2/20/2023 12:00:00 AM",
      price: "73.65",
    },
    {
      Date: "2/21/2023 12:00:00 AM",
      price: "75.2",
    },
    {
      Date: "2/22/2023 12:00:00 AM",
      price: "73.05",
    },
    {
      Date: "2/23/2023 12:00:00 AM",
      price: "74.2",
    },
    {
      Date: "2/24/2023 12:00:00 AM",
      price: "77.5",
    },
    {
      Date: "2/27/2023 12:00:00 AM",
      price: "75",
    },
    {
      Date: "2/28/2023 12:00:00 AM",
      price: "78.75",
    },
    {
      Date: "3/1/2023 12:00:00 AM",
      price: "81.4",
    },
    {
      Date: "3/2/2023 12:00:00 AM",
      price: "81.75",
    },
    {
      Date: "3/3/2023 12:00:00 AM",
      price: "83.95",
    },
    {
      Date: "3/6/2023 12:00:00 AM",
      price: "83.8",
    },
    {
      Date: "3/8/2023 12:00:00 AM",
      price: "85.15",
    },
    {
      Date: "3/9/2023 12:00:00 AM",
      price: "86.1",
    },
    {
      Date: "3/10/2023 12:00:00 AM",
      price: "84.65",
    },
    {
      Date: "3/13/2023 12:00:00 AM",
      price: "80.45",
    },
    {
      Date: "3/14/2023 12:00:00 AM",
      price: "78.25",
    },
    {
      Date: "3/15/2023 12:00:00 AM",
      price: "77.9",
    },
    {
      Date: "3/16/2023 12:00:00 AM",
      price: "76.5",
    },
    {
      Date: "3/17/2023 12:00:00 AM",
      price: "80.15",
    },
    {
      Date: "3/20/2023 12:00:00 AM",
      price: "78.4",
    },
    {
      Date: "3/21/2023 12:00:00 AM",
      price: "78.15",
    },
    {
      Date: "3/22/2023 12:00:00 AM",
      price: "78.2",
    },
    {
      Date: "3/23/2023 12:00:00 AM",
      price: "77.8",
    },
    {
      Date: "3/24/2023 12:00:00 AM",
      price: "74.95",
    },
    {
      Date: "3/27/2023 12:00:00 AM",
      price: "73.15",
    },
    {
      Date: "3/28/2023 12:00:00 AM",
      price: "71.2",
    },
    {
      Date: "3/29/2023 12:00:00 AM",
      price: "68.9",
    },
    {
      Date: "3/31/2023 12:00:00 AM",
      price: "72.25",
    },
    {
      Date: "4/3/2023 12:00:00 AM",
      price: "75.15",
    },
    {
      Date: "4/5/2023 12:00:00 AM",
      price: "76.9",
    },
    {
      Date: "4/6/2023 12:00:00 AM",
      price: "76.35",
    },
    {
      Date: "4/10/2023 12:00:00 AM",
      price: "79.15",
    },
    {
      Date: "4/11/2023 12:00:00 AM",
      price: "77.9",
    },
    {
      Date: "4/12/2023 12:00:00 AM",
      price: "76.7",
    },
    {
      Date: "4/13/2023 12:00:00 AM",
      price: "77.6",
    },
    {
      Date: "4/17/2023 12:00:00 AM",
      price: "79.25",
    },
    {
      Date: "4/18/2023 12:00:00 AM",
      price: "81.3",
    },
    {
      Date: "4/19/2023 12:00:00 AM",
      price: "82.4",
    },
    {
      Date: "4/20/2023 12:00:00 AM",
      price: "85.45",
    },
    {
      Date: "4/21/2023 12:00:00 AM",
      price: "85.1",
    },
    {
      Date: "4/24/2023 12:00:00 AM",
      price: "77.65",
    },
    {
      Date: "4/25/2023 12:00:00 AM",
      price: "77.7",
    },
    {
      Date: "4/26/2023 12:00:00 AM",
      price: "79.45",
    },
    {
      Date: "4/27/2023 12:00:00 AM",
      price: "79.55",
    },
    {
      Date: "4/28/2023 12:00:00 AM",
      price: "78.8",
    },
    {
      Date: "5/2/2023 12:00:00 AM",
      price: "80.05",
    },
    {
      Date: "5/3/2023 12:00:00 AM",
      price: "79.6",
    },
    {
      Date: "5/4/2023 12:00:00 AM",
      price: "80.85",
    },
    {
      Date: "5/5/2023 12:00:00 AM",
      price: "78.2",
    },
    {
      Date: "5/8/2023 12:00:00 AM",
      price: "78.35",
    },
    {
      Date: "5/9/2023 12:00:00 AM",
      price: "76.45",
    },
    {
      Date: "5/10/2023 12:00:00 AM",
      price: "75.15",
    },
    {
      Date: "5/11/2023 12:00:00 AM",
      price: "82",
    },
    {
      Date: "5/12/2023 12:00:00 AM",
      price: "90.2",
    },
    {
      Date: "5/15/2023 12:00:00 AM",
      price: "99.2",
    },
    {
      Date: "5/16/2023 12:00:00 AM",
      price: "104.15",
    },
    {
      Date: "5/17/2023 12:00:00 AM",
      price: "103.75",
    },
    {
      Date: "5/18/2023 12:00:00 AM",
      price: "100.2",
    },
    {
      Date: "5/19/2023 12:00:00 AM",
      price: "102.45",
    },
    {
      Date: "5/22/2023 12:00:00 AM",
      price: "97.35",
    },
    {
      Date: "5/23/2023 12:00:00 AM",
      price: "92.5",
    },
    {
      Date: "5/24/2023 12:00:00 AM",
      price: "91.4",
    },
    {
      Date: "5/25/2023 12:00:00 AM",
      price: "95.95",
    },
    {
      Date: "5/26/2023 12:00:00 AM",
      price: "98.05",
    },
    {
      Date: "5/29/2023 12:00:00 AM",
      price: "98.25",
    },
    {
      Date: "5/30/2023 12:00:00 AM",
      price: "100.75",
    },
    {
      Date: "5/31/2023 12:00:00 AM",
      price: "97.4",
    },
    {
      Date: "6/1/2023 12:00:00 AM",
      price: "102.25",
    },
    {
      Date: "6/2/2023 12:00:00 AM",
      price: "107.1",
    },
    {
      Date: "6/5/2023 12:00:00 AM",
      price: "110.9",
    },
    {
      Date: "6/6/2023 12:00:00 AM",
      price: "106",
    },
    {
      Date: "6/7/2023 12:00:00 AM",
      price: "111.4",
    },
    {
      Date: "6/8/2023 12:00:00 AM",
      price: "102",
    },
    {
      Date: "6/9/2023 12:00:00 AM",
      price: "112.25",
    },
    {
      Date: "6/12/2023 12:00:00 AM",
      price: "117.15",
    },
    {
      Date: "6/13/2023 12:00:00 AM",
      price: "115.2",
    },
    {
      Date: "6/14/2023 12:00:00 AM",
      price: "119.05",
    },
    {
      Date: "6/15/2023 12:00:00 AM",
      price: "114.75",
    },
    {
      Date: "6/16/2023 12:00:00 AM",
      price: "117.35",
    },
    {
      Date: "6/19/2023 12:00:00 AM",
      price: "114.4",
    },
    {
      Date: "6/20/2023 12:00:00 AM",
      price: "113.4",
    },
    {
      Date: "6/21/2023 12:00:00 AM",
      price: "108.3",
    },
    {
      Date: "6/22/2023 12:00:00 AM",
      price: "109.6",
    },
    {
      Date: "6/23/2023 12:00:00 AM",
      price: "105.35",
    },
    {
      Date: "6/26/2023 12:00:00 AM",
      price: "112.75",
    },
    {
      Date: "6/27/2023 12:00:00 AM",
      price: "113.1",
    },
    {
      Date: "6/28/2023 12:00:00 AM",
      price: "109.2",
    },
    {
      Date: "6/30/2023 12:00:00 AM",
      price: "111.85",
    },
    {
      Date: "7/3/2023 12:00:00 AM",
      price: "113.95",
    },
    {
      Date: "7/4/2023 12:00:00 AM",
      price: "110.6",
    },
    {
      Date: "7/5/2023 12:00:00 AM",
      price: "107.4",
    },
    {
      Date: "7/6/2023 12:00:00 AM",
      price: "106.55",
    },
    {
      Date: "7/7/2023 12:00:00 AM",
      price: "105.75",
    },
    {
      Date: "7/10/2023 12:00:00 AM",
      price: "103.35",
    },
    {
      Date: "7/11/2023 12:00:00 AM",
      price: "103",
    },
    {
      Date: "7/12/2023 12:00:00 AM",
      price: "103",
    },
    {
      Date: "7/13/2023 12:00:00 AM",
      price: "109.45",
    },
    {
      Date: "7/14/2023 12:00:00 AM",
      price: "114.7",
    },
    {
      Date: "7/17/2023 12:00:00 AM",
      price: "120.6",
    },
    {
      Date: "7/18/2023 12:00:00 AM",
      price: "122.95",
    },
    {
      Date: "7/19/2023 12:00:00 AM",
      price: "122.05",
    },
    {
      Date: "7/20/2023 12:00:00 AM",
      price: "118.95",
    },
    {
      Date: "7/21/2023 12:00:00 AM",
      price: "120.3",
    },
    {
      Date: "7/24/2023 12:00:00 AM",
      price: "118.9",
    },
    {
      Date: "7/25/2023 12:00:00 AM",
      price: "115.4",
    },
    {
      Date: "7/26/2023 12:00:00 AM",
      price: "113.3",
    },
    {
      Date: "7/27/2023 12:00:00 AM",
      price: "121.25",
    },
    {
      Date: "7/28/2023 12:00:00 AM",
      price: "132.9",
    },
    {
      Date: "7/31/2023 12:00:00 AM",
      price: "138.4",
    },
    {
      Date: "8/1/2023 12:00:00 AM",
      price: "133.9",
    },
    {
      Date: "8/2/2023 12:00:00 AM",
      price: "134.5",
    },
    {
      Date: "8/3/2023 12:00:00 AM",
      price: "149",
    },
    {
      Date: "8/4/2023 12:00:00 AM",
      price: "138.1",
    },
    {
      Date: "8/7/2023 12:00:00 AM",
      price: "135",
    },
    {
      Date: "8/8/2023 12:00:00 AM",
      price: "134.1",
    },
    {
      Date: "8/9/2023 12:00:00 AM",
      price: "129.25",
    },
    {
      Date: "8/10/2023 12:00:00 AM",
      price: "130.45",
    },
    {
      Date: "8/11/2023 12:00:00 AM",
      price: "128.5",
    },
    {
      Date: "8/14/2023 12:00:00 AM",
      price: "123.7",
    },
    {
      Date: "8/16/2023 12:00:00 AM",
      price: "115.6",
    },
    {
      Date: "8/17/2023 12:00:00 AM",
      price: "114.4",
    },
    {
      Date: "8/18/2023 12:00:00 AM",
      price: "115.95",
    },
    {
      Date: "8/21/2023 12:00:00 AM",
      price: "114.95",
    },
    {
      Date: "8/22/2023 12:00:00 AM",
      price: "117.25",
    },
    {
      Date: "8/23/2023 12:00:00 AM",
      price: "126.4",
    },
    {
      Date: "8/24/2023 12:00:00 AM",
      price: "123.8",
    },
    {
      Date: "8/25/2023 12:00:00 AM",
      price: "123.55",
    },
    {
      Date: "8/28/2023 12:00:00 AM",
      price: "128.35",
    },
    {
      Date: "8/29/2023 12:00:00 AM",
      price: "125.4",
    },
    {
      Date: "8/30/2023 12:00:00 AM",
      price: "131.65",
    },
    {
      Date: "8/31/2023 12:00:00 AM",
      price: "132.55",
    },
    {
      Date: "9/1/2023 12:00:00 AM",
      price: "129.35",
    },
    {
      Date: "9/4/2023 12:00:00 AM",
      price: "128.25",
    },
    {
      Date: "9/5/2023 12:00:00 AM",
      price: "128.4",
    },
    {
      Date: "9/6/2023 12:00:00 AM",
      price: "127.1",
    },
    {
      Date: "9/7/2023 12:00:00 AM",
      price: "126.5",
    },
    {
      Date: "9/8/2023 12:00:00 AM",
      price: "124.5",
    },
    {
      Date: "9/11/2023 12:00:00 AM",
      price: "121.15",
    },
    {
      Date: "9/12/2023 12:00:00 AM",
      price: "118.7",
    },
    {
      Date: "9/13/2023 12:00:00 AM",
      price: "117.9",
    },
    {
      Date: "9/14/2023 12:00:00 AM",
      price: "119.8",
    },
    {
      Date: "9/15/2023 12:00:00 AM",
      price: "117.9",
    },
    {
      Date: "9/18/2023 12:00:00 AM",
      price: "121.35",
    },
    {
      Date: "9/20/2023 12:00:00 AM",
      price: "118.9",
    },
    {
      Date: "9/21/2023 12:00:00 AM",
      price: "118.35",
    },
    {
      Date: "9/22/2023 12:00:00 AM",
      price: "119.3",
    },
    {
      Date: "9/25/2023 12:00:00 AM",
      price: "124.2",
    },
    {
      Date: "9/26/2023 12:00:00 AM",
      price: "124.05",
    },
    {
      Date: "9/27/2023 12:00:00 AM",
      price: "123.35",
    },
    {
      Date: "9/28/2023 12:00:00 AM",
      price: "119.75",
    },
    {
      Date: "9/29/2023 12:00:00 AM",
      price: "120.5",
    },
    {
      Date: "10/3/2023 12:00:00 AM",
      price: "119.4",
    },
    {
      Date: "10/4/2023 12:00:00 AM",
      price: "118.2",
    },
    {
      Date: "10/5/2023 12:00:00 AM",
      price: "118.7",
    },
    {
      Date: "10/6/2023 12:00:00 AM",
      price: "118.95",
    },
    {
      Date: "10/9/2023 12:00:00 AM",
      price: "114.9",
    },
    {
      Date: "10/10/2023 12:00:00 AM",
      price: "117.95",
    },
    {
      Date: "10/11/2023 12:00:00 AM",
      price: "118.2",
    },
    {
      Date: "10/12/2023 12:00:00 AM",
      price: "117.05",
    },
    {
      Date: "10/13/2023 12:00:00 AM",
      price: "116.2",
    },
  ];

  async function firstFetch() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/price_default`
    );
    const data1 = await res.json();
    setData(data1);
  }
  useEffect(() => {
    firstFetch();
  }, []);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Customize the tooltip content here based on your needs
      return (
        <div className="bg-white bg-opacity-90 text-xs  p-3 rounded-md flex-col">
          <p className="font-bold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`}>
              <span style={{ color: entry.color }}>{entry.name}</span>
              {`: ${Number(entry.value).toLocaleString("en-IN")}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div>
      {" "}
      {/* Default Fetch */}
      {data != null ? (
        <div>
          {/* Top Gainers */}
          <div>
            <div className="px-2">
              <h1 className="text-red-500 font-semibold w-full border-b-2 border-[#A5A5A5]">
                Top Gainers
              </h1>
            </div>
            <div className="py-3 px-6">
              {data?.gainers?.map((item) => (
                <div
                  key={item?.FINCODE}
                  className="flex justify-between items-center gap-4 border-b-2 border-[#A5A5A5]"
                >
                  <h1 className="flex-[0.3]">{item?.COMPNAME}</h1>
                  <div className="overflow-x-auto scrollbar-thin flex-[0.4]">
                    <ResponsiveContainer width="99%" height={70} minWidth={90}>
                      <LineChart
                        data={graph?.map((d) => ({ ...d, price: +d.price }))}
                      >
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#6bac84"
                          dot={false}
                          name="Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm flex-[0.3]">
                    <div className="flex justify-end">
                      <p className="text-end bg-green-500/20 text-green-700 px-3 rounded-md font-semibold ">
                        {item?.CLOSE_PRICE}
                      </p>
                    </div>
                    <div className="flex gap-2 text-gray-500 justify-end">
                      <p>{item?.NETCHG}</p>
                      <p>({item?.PERCHG}%)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div>
            <div className="px-2 pt-6">
              <h1 className="text-red-500 font-semibold w-full border-b-2 border-[#A5A5A5]">
                Top Losers
              </h1>
            </div>
            <div className="py-3 px-6">
              {data?.Losers?.map((item) => (
                <div
                  key={item?.FINCODE}
                  className="flex justify-between items-center gap-4 border-b-2 border-[#A5A5A5]"
                >
                  <h1 className="flex-[0.3]">{item?.COMPNAME}</h1>
                  <div className="overflow-x-auto scrollbar-thin flex-[0.4]">
                    <ResponsiveContainer width="99%" height={70} minWidth={90}>
                      <LineChart
                        data={graph?.map((d) => ({ ...d, price: +d.price }))}
                      >
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#6bac84"
                          dot={false}
                          name="Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm flex-[0.3]">
                    <div className="flex justify-end">
                      <p className="text-end bg-red-500/20 text-red-700 px-3 rounded-md font-semibold ">
                        {item?.CLOSE_PRICE}
                      </p>
                    </div>
                    <div className="flex gap-2 text-gray-500 justify-end">
                      <p>{item?.NETCHG}</p>
                      <p>({item?.PERCHG}%)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default Default;
