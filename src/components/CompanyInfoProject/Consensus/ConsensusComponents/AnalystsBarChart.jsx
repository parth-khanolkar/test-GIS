import React from "react";
import moment from "moment/moment";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  LabelList,
} from "recharts";
import { BiDownload } from "react-icons/bi";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

const AnalystsBarChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Customize the tooltip content here based on your needs
      return (
        <div className="bg-white bg-opacity-90 text-xs p-3 rounded-md flex-col">
          <p className="font-bold">{`Date: ${moment(label).format(
            "D MMM 'YY"
          )}`}</p>
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

  const handleDownload = async (name) => {
    htmlToImage
      .toPng(document.getElementById("analystBar"), { quality: 1 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name.jpeg";
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(name);
      });
  };
  return (
    <div className="relative">
      {/* <div className="absolute"> */}
      <BiDownload
        onClick={() => handleDownload("AnalystsBarChart")}
        className="absolute top-9 text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm mb-[-50px] z-40"
        size={30}
      />
      {/* </div> */}
      {/* Chart */}
      <ResponsiveContainer
        id="analystBar"
        width="100%"
        height="100%"
        minWidth={300}
        minHeight={470}
      >
        <ComposedChart
          id="analystBarID"
          data={data}
          stackOffset="sign"
          margin={{ bottom: 10, top: 70, left: -30 }}
        >
          <XAxis
            dataKey={"MonthEndDate"}
            tickFormatter={(MonthEndDate) =>
              moment(MonthEndDate).format("MMM YY")
            }
            angle={-40}
            textAnchor="end"
            interval={0}
            tick={{ margin: 10, fontSize: 12 }}
          />
          <YAxis
            tick={{ margin: 10, fontSize: 12 }}
            domain={["dataMin", "dataMax+1"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar
            name="Buy"
            dataKey="Buy_Outperform"
            stackId="a"
            fill="#1f3a61"
            barSize={27}
          />
          <Bar
            name="Neutral"
            dataKey="Neutral"
            stackId="a"
            fill="#a7a5a5"
            barSize={27}
          ></Bar>
          <Bar
            name="Sell"
            dataKey="Sell_Underperform"
            stackId="a"
            fill="#bd3735"
            barSize={27}
          >
            <LabelList
              className="text-xs md:text-sm font-bold text-black"
              dataKey="Buy_Perc"
              position="top"
              formatter={(Buy_Perc) => Buy_Perc + "%"}
              color="black"
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalystsBarChart;
