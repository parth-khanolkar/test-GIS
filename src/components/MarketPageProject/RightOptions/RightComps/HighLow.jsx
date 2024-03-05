import React, { useEffect, useState } from "react";
// import {
//   ScatterChart,
//   Scatter,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Label,
//   LabelList,
// } from "recharts";
import Default from "./Default";
import { useInfoContext } from "@/context/info";

import {
  Chart,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  // ChartDataLabels,
} from "chart.js";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
import { Scatter } from "react-chartjs-2";
Chart.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
  // ChartDataLabels
);

const HighLow = () => {
  const {
    marketDropdown,
    setMarketDropdown,
    filterSelected,
    setFilterSelected,
    // watchlistData,
    // setWatchlistData,
  } = useInfoContext();
  const [data, setData] = useState(null);
  const [labelFlag, setLabelFlag] = useState(false);

  async function fetchAnalysis() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/week_highlow`,
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
    setData(data1?.data?.Data);
  }

  useEffect(() => {
    fetchAnalysis();
  }, [filterSelected]);

  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     const { Name } = payload[0].payload;
  //     // Customize the tooltip content here based on your needs
  //     return (
  //       <div className="bg-black text-white bg-opacity-90 text-xs p-3 rounded-md flex-col">
  //         <p className="font-bold">{Name}</p>
  //         {payload.map((entry, index) => (
  //           <div key={`item-${index}`}>
  //             <p>
  //               <span style={{ color: entry.color }}>{entry.name}</span>
  //               {`: ${Number(entry.value).toLocaleString("en-IN")}`}
  //             </p>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const data1 = {
    labels: data?.map((item) => item?.company),
    datasets: [
      {
        data: data?.map((item) => ({
          x: item?.WeekLow52,
          y: item?.WeekHigh52,
          z: item?.company,
        })),
        backgroundColor: "#1f3a61",
        labels: data?.map((item) => item?.company),
      },
    ],
  };

  const optionsWithDatalabels = {
    scales: {
      x: {
        title: {
          display: true,
          text: "52 Week Low %",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "52 Week High %",
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "black",
        font: "bold",
        anchor: "start",
        align: "end",
        formatter: function (value) {
          return value.z;
        },
      },
    },
    interaction: {
      mode: "index",
      axis: "x",
      intersect: false,
    },
    bezierCurve: true,
  };

  const optionsWithOutDatalabels = {
    scales: {
      x: {
        title: {
          display: true,
          text: "52 Week Low %",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "52 Week High %",
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    interaction: {
      mode: "index",
      axis: "x",
      intersect: false,
    },
    bezierCurve: true,
  };
  return (
    <div className="p-2 bg-white shadow-md rounded-md w-full">
      {/* Heat Maps */}
      {/* <div className="flex gap-3 flex-wrap justify-center overflow-x-auto scrollbar-thin">
        {watchlistData != null && filterSelected != null ? (
          <ResponsiveContainer width="100%" minHeight={300} minWidth={300}>
            <ScatterChart
              // data={watchlistData}
              data={watchlistData?.map((d) => ({
                ...d,
                week52Low: +d.week52Low,
                week52High: +d.week52High,
              }))}
              margin={{ left: -10 }}
            >
              <CartesianGrid />
              <XAxis
                tick={{ fontWeight: "bold", fontSize: 12 }}
                dataKey={"week52Low"}
              >
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "12",
                    fontWeight: "bold",
                  }}
                  value={"% Above 52 Week Low"}
                  offset={0}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis
                tick={{ fontWeight: "bold", fontSize: 12 }}
                dataKey={"week52High"}
              >
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "12",
                    fontWeight: "bold",
                  }}
                  angle={-90}
                  value={"% Above 52 Week Low"}
                  offset={20}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="A school" data={data?.Data} fill="#193a64">
                <LabelList
                  dataKey={"Name"}
                  className="text-xs font-bold"
                  position="top"
                />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : filterSelected == null ? (
          <Default />
        ) : (
          <div className="flex justify-center">
            <div className="text-[#1d3763] font-bold text-2xl animate-pulse h-full">
              Loading...
            </div>
          </div>
        )}
      </div> */}
      <div className="flex items-center">
        <input
          type="checkbox"
          onClick={() => setLabelFlag(!labelFlag)}
          className="w-4 h-4 text-[#143b65] bg-gray-100 border-gray-300 rounded"
        />
        <label
          for="checked-checkbox"
          className="ms-2 text-sm font-semibold text-gray-900"
        >
          Show Labels
        </label>
      </div>
      <div className="h-[60vh]">
        <Scatter
          options={
            !labelFlag ? optionsWithOutDatalabels : optionsWithDatalabels
          }
          data={data1}
        />
      </div>
    </div>
  );
};

export default HighLow;
