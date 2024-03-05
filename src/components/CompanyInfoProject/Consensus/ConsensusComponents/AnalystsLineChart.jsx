import React, { useEffect, useState } from "react";
import { useInfoContext } from "@/context/info";
import axios from "axios";
import Select from "react-select";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import moment from "moment/moment";

import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import { BiDownload, BiErrorCircle } from "react-icons/bi";

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const AnalystsLineChart = ({ data }) => {
  const min = 1000;
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

  const data1 = {
    labels: data?.map((item) => moment(item.MonthEndDate).format("MMM YY")),
    datasets: [
      {
        label: "HIGH",
        data: data?.map((item) => item.HIGH),
        borderColor: "#143b64",
        backgroundColor: "#143b64",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: "MED",
        data: data?.map((item) => item.MED),
        borderColor: "#808080",
        backgroundColor: "#808080",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: "LOW",
        data: data?.map((item) => item.LOW),
        borderColor: "#d6464e",
        backgroundColor: "#d6464e",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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

  // Download Chart
  const handleDownload = async (name) => {
    htmlToImage
      .toPng(document.getElementById("analystLine"), { quality: 1 })
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
    <div className="h-[56vh]">
      <div>
        <BiDownload
          onClick={() => handleDownload("AnalystsLineChart")}
          className="flex items-center gap-2 text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm"
          size={30}
        />
      </div>
      <Line id="analystLine" data={data1} options={options} />
    </div>
  );
};

export default AnalystsLineChart;
