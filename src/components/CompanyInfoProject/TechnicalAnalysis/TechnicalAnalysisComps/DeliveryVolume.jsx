"use client"

import React, { useEffect, useState,useCallback } from 'react';
import moment from 'moment/moment';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import axios from 'axios';
import { useInfoContext } from '@/context/info';
import { BiDownload } from 'react-icons/bi';

import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useRouter } from 'next/router';

const DeliveryVolume = () => {
  const { initData } = useInfoContext();

  const router = useRouter();
  const { fincodeLink } = router.query;

  const [deliveryVolBarThickness, setDelVolBarThickness] = useState(7);
  const [totalVolBarThickness, setTotalVolBarThickness] = useState(7);
  const [stockExchange,setStockExchange] = useState("Combine")

  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");

  const [Dates,setDates] = useState(null);
  const [DeliveryVolume,setDeliveryVolume] = useState(null);
  const [TotalVolume,setTotalVolume] = useState(null);

  const [DeliveryVolumeSum,setDeliveryVolumeSum] = useState("");
  const [TotalVolumeSum,setTotalVolumeSum] = useState("");

  const [selectedPeriod,setSelectedPeriod] = useState({});
  const [periodOptions,setPeriodOptions] = useState({});

  const [isLoading,setIsLoading] = useState(true);
  const [isDataAvailable,setIsDataAvailable] = useState(true);
  const [isMainLoading,setIsMainLoading] = useState(true);

  const fetchPeriodData = async (period) => {
    if(Dates){
      setIsLoading(true);
    try {
      const response = await axios.post(`https://transcriptanalyser.com/goindiastock/delivery_volume`,{
        fincode: fincodeLink, 
        period: period,
        startdate: "",
        enddate: "",
        exchange: stockExchange
      });
      setDates(response.data.Date);
      setPeriodOptions(response.data.PeriodFilter);
      setTotalVolume(response.data.TotalVolume);
      setDeliveryVolume(response.data.DeliveryVolume);
      setStartDate(moment(response.data.startdate).format('YYYY-MM-DD'));
      setEndDate(moment(response.data.enddate).format('YYYY-MM-DD'));
      setDeliveryVolumeSum(response.data.volume_sum)
      setTotalVolumeSum(response.data.delivery_sum)
    } catch (error) {
      console.error("Error fetching data:", error);
    }}
    setIsLoading(false);
  };
  
  const fetchInitialData = async () => {
    setIsDataAvailable(true);
    setIsMainLoading(true);
    try {
      const response = await axios.post(`https://transcriptanalyser.com/goindiastock/delivery_volume`,{
        fincode: fincodeLink, //From Context @RISHABH
        period: "",
        startdate: "",
        enddate: "",
        exchange: stockExchange
      });
      setDates(response.data.Date);
      setSelectedPeriod(response.data.selectedperiod);
      setPeriodOptions(response.data.PeriodFilter);
      setTotalVolume(response.data.TotalVolume);
      setDeliveryVolume(response.data.DeliveryVolume);
      setStartDate(moment(response.data.startdate).format('YYYY-MM-DD'));
      setEndDate(moment(response.data.enddate).format('YYYY-MM-DD'));
      setDeliveryVolumeSum(response.data.volume_sum)
      setTotalVolumeSum(response.data.delivery_sum)
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsDataAvailable(false);
    }
    setIsLoading(false);
    setIsMainLoading(false);
  };
  
  useEffect(() => {
    fetchInitialData();
  },[fincodeLink])
  
  const fetchCustomData = async (exchange) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://transcriptanalyser.com/goindiastock/delivery_volume`,{
        fincode: fincodeLink,
        period: "Custom",
        startdate: moment(startDate).format('DD/MM/YYYY'),
        enddate: moment(endDate).format('DD/MM/YYYY'),
        exchange: exchange
      });
      setDates(response.data.Date);
      setSelectedPeriod(response.data.selectedperiod);
      setPeriodOptions(response.data.PeriodFilter);
      setTotalVolume(response.data.TotalVolume);
      setDeliveryVolume(response.data.DeliveryVolume);
      setStartDate(moment(response.data.startdate).format('YYYY-MM-DD'));
      setEndDate(moment(response.data.enddate).format('YYYY-MM-DD'));
      setDeliveryVolumeSum(response.data.volume_sum)
      setTotalVolumeSum(response.data.delivery_sum)
    } catch (error) {
      console.error("Error fetching data:", error);
      
    }
    setIsLoading(false);
  };  

  const setBarThicknessByScreenSize = useCallback(() => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      setDelVolBarThickness(1);
      setTotalVolBarThickness(2.5);
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      setDelVolBarThickness(3.5);
      setTotalVolBarThickness(7.5); 
    } else {
      setDelVolBarThickness(7);
      setTotalVolBarThickness(15); 
    }
  }, [selectedPeriod]);
  useEffect(() => {
    setBarThicknessByScreenSize();

    window.addEventListener('resize', setBarThicknessByScreenSize);
    return () => {
      window.removeEventListener('resize', setBarThicknessByScreenSize);
    };
  }, [setBarThicknessByScreenSize]);
  
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

  const data = {
    labels: Dates?.map((item) => moment(item).format('D MMM YYYY')),

    datasets: [
      
      {
        label: 'Delivery Volume',
        data: DeliveryVolume,
        backgroundColor: 'rgba(1, 26, 81, 0.8)',
        barPercentage: 0.5
      },
      {
        label: 'Total Volume',
        data: TotalVolume,
        backgroundColor: 'rgba(100, 161, 198, 0.8)',
      },
    ],
  };

  const formatNumberToIndianSystem = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const formatToIndianAbbreviation = (number) => {
    if (number >= 10000000) {
      return (number / 10000000).toFixed(2) + ' Cr';
    } else if (number >= 100000) {
      return (number / 100000).toFixed(2) + ' L';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + ' K';
    } else {
      return number.toFixed(2);
    }
  };
  

  return (
    <>
      {
        isMainLoading ? (<>
        <div className="w-full overflow-x-auto rounded-lg">
              <div
                className={`flex justify-center items-center h-[32vh] md:h-[25vh] lg:h-[50vh]`}
              >
                <span className="relative flex h-[80px] w-[80px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
          </div>
        </>):(
        <>
          {
            isDataAvailable ? (<>
              <div className='flex'>
                <div className='grid grid-cols-2 gap-1 md:flex md:gap-3 md:mx-2 md:my-3' >
                  <div className='col-span-1 flex flex-col'>
                      <label htmlFor="start date" className='text-sm md:text-base font-semibold pb-1'>Start Date  :</label>
                      <input type="date" id='start date'  className='text-sm md:text-lg border border-gray-300 px-3 py-0.5 '
                        value={startDate}
                        onChange={(e)=>{setStartDate(e.target.value);}}
                      />
                  </div>
                  <div className='col-span-1 flex flex-col'>
                      <label htmlFor="end date" className='text-sm md:text-base font-semibold pb-1'>End Date  :</label>
                      <input type="date" id='end date'  className='text-sm md:text-lg border border-gray-300 px-3 py-0.5 '
                        value={endDate}
                        onChange={(e)=>{setEndDate(e.target.value)}}
                      />
                  </div>
                  
                  <button className='col-span-1 text-base text-white border border-black bg-[#153a64] hover:bg-[#1b508c] rounded md:px-10 mt-1.5 md:mt-6 hover:shadow-md'
                    onClick={()=>{fetchCustomData(stockExchange)}}
                  >
                      Submit
                  </button>
                </div>
                <div className='flex items-center justify-center ml-auto text-3xl'>
                  <BiDownload
                    onClick={() => handleDownload("DV", `Del-Vol_${initData?.CompName?.value}`)}
                    className="flex items-center gap-2  text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer ml-auto"
                  />
                </div>
              </div>
          
            <div id='DV' className='pb-5 overflow-auto md:overflow-hidden'>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-6 mb-5 md:mx-2 '>
                <div className='col-span-1 flex-col'>
                  <div className='text-sm md:text-base font-semibold'>
                      Period:
                  </div>
                  <Select
                      options={periodOptions}
                      value={selectedPeriod}
                      onChange={(selectedOption) => {setSelectedPeriod(selectedOption);fetchPeriodData(selectedOption?.value)}}
                      className='text-[10px] md:text-base w-[35vw] md:w-44 lg:w-44 z-50'
                      placeholder="Period"
                  />
                </div>
        
                <div className='col-span-1 md:col-span-2 lg:col-span-1 flex-col'>
                  <div className='text-sm md:text-base font-semibold'>
                      Stock Exchange:
                  </div>
                  <div className='flex-row items-center mt-1.5 md:mt-1 lg:mt-0'>
                    <button className={`w-1/3 py-1 px-1.5 border rounded-l-md text-white border-cyan-900 text-[9px] md:text-sm lg:text-sm
                      ${
                        stockExchange === "Combine" ? ("bg-cyan-900 "):(" bg-gray-400")
                      }
                    `} onClick={()=>{setStockExchange("Combine"); fetchCustomData("Combine")}}>
                      {"Combined"}
                    </button>
                    <button className={`w-1/3 py-1 px-1.5 border  text-white border-cyan-900 text-[9px] md:text-sm lg:text-sm
                      ${
                        stockExchange === "BSE" ? ("bg-cyan-900 "):(" bg-gray-400")
                      }
                    `} onClick={()=>{setStockExchange("BSE"); fetchCustomData("BSE")}}>
                      {"BSE"}
                    </button>
                    <button className={`w-1/3 py-1 px-1.5 border rounded-r-md text-white border-cyan-900 text-[9px] md:text-sm lg:text-sm
                      ${
                        stockExchange === "NSE" ? ("bg-cyan-900 "):(" bg-gray-400")
                      }
                    `} onClick={()=>{setStockExchange("NSE"); fetchCustomData("NSE")}}>
                      {"NSE"}
                    </button>
                  </div>
                </div>
                <div className='col-span-1 md:mt-8'>
                  <div className='flex justify-center'>
                    <div><span className='text-blue-900 font-semibold text-xs  lg:text-base'>{"Total Delivery %"}</span><span className='font-semibold text-xs  lg:text-sm'> : {((DeliveryVolumeSum/TotalVolumeSum)*100).toFixed(2)} %</span></div>
                  </div>
                </div>
                
                <div className='col-span-1 md:mt-8'>
                  <div className='flex justify-center'>
                    <div><span className='text-blue-900 font-semibold text-xs  lg:text-base'>{"Total Volume"}</span><span className='font-semibold text-xs  lg:text-sm'> : {formatNumberToIndianSystem(TotalVolumeSum)}</span></div>
                  </div>
                </div>
                <div className='col-span-2 md:col-span-1 md:mt-8'>
                  <div className='flex justify-center'>
                    <div><span className='text-blue-900 font-semibold text-xs  lg:text-base'>{"Total Delivery Volume"}</span><span className='font-semibold text-xs  lg:text-sm'> : {formatNumberToIndianSystem(DeliveryVolumeSum)}</span></div>
                  </div>
                </div>
              </div>
            
            <hr className='mb-6'/>
            {
              isLoading ? (<>
                <div className="w-full overflow-x-auto rounded-lg">
                      <div
                        className={`flex justify-center items-center h-[32vh] md:h-[25vh] lg:h-[41vh]`}
                      >
                        <span className="relative flex h-[80px] w-[80px]">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-"></span>
                        </span>
                      </div>
                  </div>
              </>):(<>
                <div className='h-[50vh] w-full ' >
                  <Bar
                    data={data}
                    options={{
                      scales: {
                          x: {
                            stacked: true,
                            ticks: {
                              maxTicksLimit:10,
                              font:{
                                size:deliveryVolBarThickness <= 3.5 ? 7 : 10,
                              }
                            },
                            grid: {
                              display: false, // Remove x-axis grid
                            },
                          },
                          y: {
                            ticks: {
                              callback: (value) => formatToIndianAbbreviation(value),
                              font:{
                                size:deliveryVolBarThickness <= 3.5 ? 7 : 10,
                              }
                            },
                            grid: {
                              display: false, // Remove y-axis grid
                            },
                          },
                        },
                      interaction:{
                          mode:'index',
                          axis: 'x',
                          intersect: false,
                      },
                      responsive: true,  
                      maintainAspectRatio: false, 
                      plugins: {
                        legend: {
                            position: 'bottom', 
                        },
                        datalabels: {
                          display: false,
                      },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              label += formatNumberToIndianSystem(context.parsed.y);
                              return label;
                            },
                            beforeBody: (context) => {
                              const deliveryPercentage = (((parseInt(context[0].raw) / parseInt(context[1].raw)) * 100).toFixed(2));
                              return `Delivery % : ${deliveryPercentage} %`;
                            },
                          },
                        },
                      }, 
                  }}
                  />
                </div>
              </>)
            }
            
            </div>
            </>):(<>
              <div className='flex items-center justify-center'>
                  <span className='font-bold text-gray-400 text-xl'>{"No Data Available"}</span>
              </div>
            </>)
          }
      
         </>)
      }
    </>
    
  );
};

export default DeliveryVolume;
