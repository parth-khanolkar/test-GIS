import React from "react";
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
} from "recharts";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { BiDownload } from "react-icons/bi";
const TSR = ({ data }) => {
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

  // Download Chart
  const handleDownload = async (id, name) => {
    htmlToImage
      .toPng(document.getElementById(id), { quality: 1 })
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
      <div className="absolute">
        <BiDownload
          onClick={() => handleDownload("tsr", "ReturnAnalysis")}
          className="flex items-center gap-2 text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm"
          size={30}
        />
      </div>
      {/* Chart */}
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={440}
        minHeight={440}
        id="tsr"
      >
        <ComposedChart data={data} stackOffset="sign">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" tick={{ fontWeight: "bold", fontSize: 12 }} />
          <YAxis
            yAxisId="left-axis"
            tick={{ fontWeight: "bold", fontSize: 12 }}
          />
          <YAxis
            yAxisId="right-axis"
            orientation="right"
            tick={{ fontWeight: "bold", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            name="Return due to Earnings(%)(LHS)"
            yAxisId="left-axis"
            dataKey="RDE"
            stackId="stack"
            fill="#1f3a61"
            barSize={27}
          />
          <Bar
            name="Return due to PE Rerating(%)(LHS)"
            yAxisId="left-axis"
            dataKey="RDPE"
            stackId="stack"
            fill="#bd3735"
            barSize={27}
          />
          <Bar
            name="Return due to Dividends(%)(LHS)"
            yAxisId="left-axis"
            dataKey="RDTD"
            stackId="stack"
            fill="#a7a5a5"
            barSize={27}
          />
          <Line
            yAxisId="right-axis"
            name="TSR(%)(RHS)"
            dataKey="TSR"
            stackId="a"
            fill="#b1cadf"
            type="monotone"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TSR;
