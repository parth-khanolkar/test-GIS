import React, { useEffect, useState } from "react";
import { BiDownload } from "react-icons/bi";
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
  Label,
  ReferenceLine,
} from "recharts";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

const CashFlowChart = ({ data }) => {
  const [data1, setData1] = useState(null);

  useEffect(() => {
    const chartData = data?.map((item, index) => {
      if (
        index > 0 &&
        item.Name != "Cash From Operation" &&
        item.Name != "Net Cash for Capex" &&
        item.Name != "FCFE" &&
        item.Name != "Net Cash"
      ) {
        const Value2 = data
          .slice(0, index)
          .reduce(
            (prev, curr) =>
              curr.Name != "Cash From Operation" &&
              curr.Name != "Net Cash for Capex" &&
              curr.Name != "FCFE" &&
              curr.Name != "Net Cash"
                ? prev + curr.Value
                : prev,
            0
          );
        return {
          ...item,
          Value2,
        };
      } else if (
        index == 0 ||
        item.Name == "Cash From Operation" ||
        item.Name == "Net Cash for Capex" ||
        item.Name == "FCFE" ||
        item.Name == "Net Cash"
      ) {
        const Value2 = 0;
        return {
          ...item,
          Value2,
        };
      }
    });
    setData1(chartData);
  }, [data]);

  useEffect(() => {
    console.log(data1);
  }, [data1]);

  const customPayload = [
    { value: "Increase", type: "circle", color: "#1f3a61" },
    { value: "Decrease", type: "circle", color: "#bd3735" },
    { value: "Total", type: "circle", color: "#808080" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Customize the tooltip content here based on your needs
      return (
        <div className="bg-black opacity-90 text-white bg-opacity-90 text-xs  p-3 rounded-md flex-col">
          <p className="font-bold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className={`${index == 0 && "hidden"}`}>
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
    <div className="overflow-x-auto w-full relative ">
      <div className="pt-2">
        <BiDownload
          onClick={() => handleDownload("cashID", "Cashflow Waterfall Chart")}
          className="flex items-center text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm"
          size={30}
        />
      </div>
      {/* Chart */}
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={350}
        minHeight={500}
        id="cashID"
      >
        <ComposedChart
          data={data1}
          margin={{
            bottom: 130,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Name"
            angle={-90}
            textAnchor="end"
            interval={0}
            tick={{ margin: 10, fontWeight: "bold", fontSize: 12 }}
          />
          <YAxis tick={{ fontWeight: "bold", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" payload={customPayload} />
          <Bar dataKey="Value2" stackId="stack" fill="transparent" />
          <Bar dataKey="Value" stackId="stack">
            <LabelList
              dataKey="Value"
              position="top"
              fontWeight="bold"
              className="text-xs md:text-sm"
            />
            {data.map((item, index) => {
              if (
                item.Value < 0 &&
                item.Name != "Cash From Operation" &&
                item.Name != "Net Cash for Capex" &&
                item.Name != "FCFE" &&
                item.Name != "Net Cash"
              )
                return <Cell key={index} fill="#bd3735" id="decrease" />;
              if (
                item.Name == "Cash From Operation" ||
                item.Name == "Net Cash for Capex" ||
                item.Name == "FCFE" ||
                item.Name == "Net Cash"
              )
                return <Cell key={index} fill="#808080" />;
              return <Cell key={index} fill="#1f3a61" />;
            })}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;
