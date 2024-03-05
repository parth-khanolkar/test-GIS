"use client";

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
import { useRouter } from "next/router";

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ConsensusEstimateTrend = () => {
  const {
    fincode,
    setFincode,
    initData,
    consensusFlag,
    setConsensusFlag,
    graphData,
    setGraphData,
    selectedParameter,
    setSelectedParameter,
    parameterOptions,
    setParameterOptions,
    isLoading,
    setIsLoading,
    isDataAvailable,
    setIsDataAvailable,
    isStandalone,
    setIsStandalone,
  } = useInfoContext();

  const router = useRouter();
  const { fincodeLink } = router.query;

  const lineColors = [
    "#D82F44",
    "#008000",
    "#143B64",
    "#FF9F9F",
    "#827717",
    "#ff5733",
    "#a07a33",
    "#b74a94",
    "#4a94b7",
    "#8b4ab7",
    "#33a07a",
    "#33b74a",
    "#337ab7",
  ];

  const fetchInitialData = async () => {
    setIsLoading(true);
    setIsDataAvailable(true);
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/consensus_estimate`,
        {
          // fincode: 282626,
          fincode: fincodeLink,
          estimate: "",
          mode: isStandalone ? "S" : "C",
        }
      );

      setGraphData(
        response.data.Data.map((fyData, index) => ({
          label: fyData.FYName,
          data: fyData.objlist,
          borderColor: lineColors[index],
          backgroundColor: lineColors[index],
          fill: false,
        }))
      );
      setSelectedParameter(response.data.selected_para);
      setParameterOptions(response.data.ParameterFilter);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsDataAvailable(false);
    }
  };
  useEffect(() => {
    if (fincodeLink) {
      fetchInitialData();
    }
  }, [fincodeLink, isStandalone]);

  const fetchParameterData = async (paramter) => {
    setIsLoading(true);
    setIsDataAvailable(true);
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/consensus_estimate`,
        {
          fincode: fincodeLink,
          estimate: paramter,
          mode: isStandalone ? "S" : "C",
        }
      );

      setGraphData(
        response.data.Data.map((fyData, index) => ({
          label: fyData.FYName,
          data: fyData.objlist,
          borderColor: lineColors[index],
          backgroundColor: lineColors[index],
          fill: false,
        }))
      );
      setParameterOptions(response.data.ParameterFilter);
      setSelectedParameter(response.data.Selected_Parameter);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsDataAvailable(false);
    }
  };
  useEffect(() => {
    if (selectedParameter) {
      fetchParameterData(selectedParameter.value);
    }
  }, [isStandalone]);

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
    <>
      <div id="CET">
        <div className="flex flex-row justify-between md:mx-8 gap-2">
          <div className="flex flex-col">
            <div className="text-xs md:text-base font-semibold">Parameter:</div>
            <Select
              options={parameterOptions}
              value={selectedParameter}
              onChange={(values) => {
                setSelectedParameter(values);
                fetchParameterData(values.value);
              }}
              className="text-xs md:text-base w-44 md:w-64"
              isSearchable={false}
            />
          </div>
          <div className="flex items-center md:items-end md:justify-end">
            <div className="flex flex-col md:flex-row text-sm md:text-base font-semibold">
              {isStandalone ? (
                <>
                  <span className="text-[#083966] underline underline-offset-2 mr-0.5 md:mr-1.5">
                    Standalone Figures
                  </span>
                  <span className="hidden md:block">{"/"}</span>
                  <button
                    className="text-gray-500 cursor-pointer hover:text-[#2f70ac] italic ml-0.5 md:ml-1.5"
                    onClick={() => {
                      setIsStandalone(false);
                    }}
                  >
                    View Consolidated
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[#083966] underline underline-offset-2 mr-0.5 md:mr-1.5">
                    Consolidated Figures
                  </span>
                  <span className="hidden md:block">{"/"}</span>
                  <button
                    className="text-gray-500 cursor-pointer hover:text-[#2f70ac] italic ml-0.5 md:ml-1.5"
                    onClick={() => {
                      setIsStandalone(true);
                    }}
                  >
                    View Standalone
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="justify-end md:mx-8 mt-1">
          <BiDownload
            onClick={() =>
              handleDownload("CET", `Cons-Est_${initData?.CompName?.value}`)
            }
            className="flex items-center gap-2  text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer  ml-auto"
            size={30}
          />
        </div>

        <hr className="mb-6 mt-2" />
        {isLoading ? (
          <>
            <div className="flex justify-center items-center h-[60vh]">
              <span className="relative flex h-[80px] w-[80px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-"></span>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="h-[60vh]">
              <Line
                datasetIdKey="consest"
                data={{ datasets: graphData }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                    tooltip: {
                      intersect: false,
                    },
                    datalabels: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      type: "time",
                      time: {
                        unit: "month",
                        parser: "MM/dd/yyyy",
                      },
                      ticks: {
                        maxTicksLimit:20,
                        font: {
                          size: 10,
                        },
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                  elements: {
                      point: {
                      radius: 0,
                      },
                      line:{
                          tension:0.5,
                          borderWidth:2,
                      }
                  },
                }}
              ></Line>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ConsensusEstimateTrend;
