"use client"

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { CgCloseO } from 'react-icons/cg';
import { useInfoContext } from '@/context/info';
import { BiDownload } from 'react-icons/bi';

import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useRouter } from 'next/router';


const DUPointChart = ({ mode }) => {
  const { fincode,setFincode,initData, setInitData } = useInfoContext();

  const router = useRouter();
  const { fincodeLink } = router.query;

    const [companyOptions,setCompanyOptions] = useState([]);
    const [ searchInput,setSearchInput ] = useState('');

    const [selectedCompany,setSelectedCompany] = useState({});
    const [jsonData,setJsonData] = useState({});
    const [jsonCompareData,setJsonCompareData] = useState({});
    const [fincodeCompare,setFincodeCompare] = useState("");
    
    const [isLoading,setIsLoading] = useState(true)
    
    const fetchData = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/goindiastock/du_point_chart`,{
                fincode: fincodeLink,
                sector: initData?.sector_type.value,
                mode: mode
            });
            const filteredData = Object.keys(response.data).reduce((acc, key) => {
                acc[key] = response.data[key].filter((value, index) => response.data["XAxis"][index] !== "");
                return acc;
              }, {});
            setJsonData(filteredData);
        } catch (error) {
          console.error("Error fetching data");
        }
    };

    const fetchCompareData = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`https://transcriptanalyser.com/goindiastock/du_point_chart`,{
                fincode: fincodeCompare,
                sector: initData?.sector_type.value,
                mode: mode
            });
            const filteredData = Object.keys(response.data).reduce((acc, key) => {
                acc[key] = response.data[key].filter((value, index) => response.data["XAxis"][index] !== "");
                return acc; 
              }, {});
            setJsonCompareData(filteredData);
            setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data");
        }
    };
    
    useEffect(() => {
        fetchData();
    },[fincodeLink,mode,initData])
    

    useEffect(() => {
      if(fincodeCompare){
        fetchCompareData();
      }
    },[selectedCompany,mode])

    const fetchCompanyNames = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/goindiastock/company_search`,{
                searchtxt: searchInput,
            });
            const newData = response.data.data;
            setCompanyOptions(newData);
          } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
          }
    }

    useEffect(() => {
        fetchCompanyNames();
    },[searchInput])

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
    
        <div className="flex">
            <div className='w-full flex-col mb-5 ml-2 md:mx-8'>
                <div className='text-sm md:text-base font-semibold pb-1.5'>
                    Compare:
                </div>
                <Select
                    // values={searchInput}
                    className="text-[#0d2843] font-bold text-sm"
                    options={companyOptions}
                    placeholder="Select any Company"
                    onInputChange={(inp)=>{
                        setSearchInput(inp);
                        console.log(inp);
                    }}
                    onChange={(option) => {
                        // setCompanyName(values[0]?.label);
                        // setCompanySymbol(values[0]?.symbol);
                        // values[0] && router.push(`/companyinfo/${values[0].value}`);
                        if(option){
                            setSelectedCompany(option);
                            setFincodeCompare(option.value)
                        }
                    }}
                    // clearable="true"
                    searchable='false'
                />
            </div>
            <div className='flex items-center'>
                <BiDownload
                    onClick={() => handleDownload("DUPONT", `DUPont_${initData?.CompName?.value}`)}
                    className="flex items-center gap-2 text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm ml-auto"
                    size={30}
                />
            </div>
        </div>
        <hr className='mb-6'/>

        {/* Charts */}
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-2 pb-5 ' id="DUPONT">
            {/* Current Company Chart */}
            <div className='col-span-1 max-h-max h-[60vh]'>
                <div className='w-full flex justify-center text-lg font-semibold'>{initData?.CompName?.value}</div>
                {
                    initData?.sector_type.value === "BNK" ? (<> {/* BANKING SECTOR */}
                        <Line
                            datasetIdKey='id'
                            data={{
                                labels: jsonData.XAxis,
                                datasets: [
                                    {
                                        id: 1,
                                        label: ' ROE %',
                                        data: jsonData.ROE,
                                        backgroundColor : "rgba(128, 128, 128, 0.3)",
                                        borderColor:"rgba(128, 128, 128, 0.3)",
                                        yAxisID: 'LHS',
                                        type:'bar',
                                        barThickness: 45
                                    },
                                    {
                                        id: 2,
                                        label: ' ROA %',
                                        data: jsonData.ROA,
                                        borderDash: [0, 0],
                                        backgroundColor : "#7cb5d0",
                                        borderColor:"#0000cc",
                                        yAxisID: 'LHS',
                                    },
                                    {
                                        id: 3,
                                        label: '(RHS) Financial Leverage',
                                        data: jsonData.Fin_Lav,
                                        borderDash: [5, 5],
                                        backgroundColor : "#b3b3b3",
                                        borderColor:"#404040",
                                        yAxisID: 'RHS',
                                    },
                                    {
                                        id: 4,
                                        label: ' Net Interest Income %',
                                        data: jsonData.NetInterestIncome,
                                        backgroundColor : "#ff6633",
                                        borderColor:"#cc3300",
                                        yAxisID: 'LHS',
                                    },
                                    {
                                        id: 5,
                                        label: ' Non Interest Income %',
                                        data: jsonData.NonInterestIncome,
                                        backgroundColor : "#d9d9d9",
                                        borderColor:"#999999",
                                        yAxisID: 'LHS',
                                    },
                                    {
                                        id: 6,
                                        label: ' Loan Loss Provissions %',
                                        data: jsonData.LoanLossProvissions,                        
                                        backgroundColor : "#9933ff",
                                        borderColor:"#6600cc",
                                        yAxisID: 'LHS',
                                    },
                                    {
                                        id: 7,
                                        label: ' Operating Expenses %',
                                        data: jsonData.OperatingExpenses,
                                        backgroundColor : "#3333ff",
                                        borderColor:"#000066",
                                        yAxisID: 'LHS',
                                    },
                                    {
                                        id: 8,
                                        label: ' Tax Rate %',
                                        data: jsonData.TaxRate,
                                        backgroundColor : "#d9b38c",
                                        borderColor:"#bf8040",
                                        yAxisID: 'LHS',
                                    },
                                ],
                            }}
                            options={{
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
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false, 
                                        },
                                    },
                                    LHS: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    grid: {
                                        display: false, 
                                    },
                                    ticks:{
                                        callback: (value,index,values) => {
                                            return `${value} %`
                                        }
                                    },
                                    },
                                    RHS: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    grid: {
                                        display: false, 
                                    },
                                    },
                                }
                            }}
                        />
                    </>):(<> {/* NON BANKING SECTOR */}
                        <Line
                            datasetIdKey='id'
                            data={{
                                labels: jsonData.XAxis,
                                datasets: [
                                {
                                    id: 1,
                                    label: '(RHS) ROE %',
                                    data: jsonData.ROE,
                                    backgroundColor : "rgba(128, 128, 128, 0.3)",
                                    borderColor:"rgba(128, 128, 128, 0.3)",
                                    yAxisID: 'RHS',
                                    type:'bar',
                                    barThickness: 45
                                },
                                {
                                    id: 2,
                                    label: '(RHS) PBIT Margin %',
                                    data: jsonData.PBITMargn,
                                    backgroundColor : "#7cb5d0",
                                    borderColor:"#0000cc",
                                    yAxisID: 'RHS',
                                },
                                {
                                    id: 3,
                                    label: 'Financial Leverage',
                                    data: jsonData.Fin_Lav,
                                    backgroundColor : "#b3b3b3",
                                    borderColor:"#404040",
                                    yAxisID: 'LHS',
                                },
                                {
                                    id: 4,
                                    label: 'Interest Burden',
                                    data: jsonData.InterestBurden,
                                    backgroundColor : "#ff6633",
                                    borderColor:"#cc3300",
                                    yAxisID: 'LHS',
                                },
                                {
                                    id: 5,
                                    label: 'Tax Efficiency',
                                    data: jsonData.Tax_Efficiency,
                                    backgroundColor : "#d9d9d9",
                                    borderColor:"#999999",
                                    yAxisID: 'LHS',
                                },
                                {
                                    id: 6,
                                    label: 'Assets Turnover',
                                    data: jsonData.AssetsTurnOver,
                                    borderDash:[8,8],
                                    backgroundColor : "#9933ff",
                                    borderColor:"#6600cc",
                                    yAxisID: 'LHS',
                                },
                                
                                ],
                            }}
                            options={{
                                interaction: {
                                    mode: 'index',
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
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false, 
                                        },
                                    },
                                    LHS: {
                                        type: 'linear',
                                        display: true,
                                        position: 'left',
                                        grid: {
                                            display: false, 
                                        },
                                    },
                                    RHS: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',
                                        grid: {
                                            display: false, 
                                        },
                                        ticks: {
                                            callback: (value, index, values) => {
                                                return `${value} %`
                                            }
                                        },
                                    },
                                }
                            }}
                        />
                    </>)
                }
            </div>

            {/* Compared Company Chart */}
            {
                Object.keys(selectedCompany).length !== 0 ? (
                    <>
                    {
                        isLoading ? (<>
                            <div className="flex justify-center items-center h-[60vh]">
                                <span className="relative flex h-[80px] w-[80px]">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-"></span>
                                </span>
                            </div>
                        </>):(<>
                        <div className='col-span-1 max-h-max h-[60vh] border-t md:border-t-0 md:border-l border-gray-300 mt-5 pt-1.5 md:pt-0  md:mt-0 md:pl-1'>
                            <div className="w-full flex justify-center">
                                <div className=' text-lg font-semibold'>{selectedCompany?.label}</div>
                                <button className='flex items-center justify-center mx-2 text-red-600'
                                    onClick={()=>setSelectedCompany({})}
                                ><CgCloseO/></button>
                            </div>

                            {
                                initData?.sector_type.value === "BNK"  ? (<> {/* BANKING SECTOR */}
                                    <Line
                                        datasetIdKey='id'
                                        data={{
                                            labels: jsonCompareData.XAxis,
                                            datasets: [
                                                {
                                                    id: 1,
                                                    label: ' ROE %',
                                                    data: jsonCompareData.ROE,
                                                    backgroundColor : "rgba(128, 128, 128, 0.3)",
                                                    borderColor:"rgba(128, 128, 128, 0.3)",
                                                    yAxisID: 'LHS',
                                                    type:'bar',
                                                    barThickness: 45
                                                },
                                                {
                                                    id: 2,
                                                    label: ' ROA %',
                                                    data: jsonCompareData.ROA,
                                                    borderDash: [0, 0],
                                                    backgroundColor : "#7cb5d0",
                                                    borderColor:"#0000cc",
                                                    yAxisID: 'LHS',
                                                },
                                                {
                                                    id: 3,
                                                    label: '(RHS) Financial Leverage',
                                                    data: jsonCompareData.Fin_Lav,
                                                    borderDash: [5, 5],
                                                    backgroundColor : "#b3b3b3",
                                                    borderColor:"#404040",
                                                    yAxisID: 'RHS',
                                                },
                                                {
                                                    id: 4,
                                                    label: ' Net Interest Income %',
                                                    data: jsonCompareData.NetInterestIncome,
                                                    backgroundColor : "#ff6633",
                                                    borderColor:"#cc3300",
                                                    yAxisID: 'LHS',
                                                },
                                                {
                                                    id: 5,
                                                    label: ' Non Interest Income %',
                                                    data: jsonCompareData.NonInterestIncome,
                                                    backgroundColor : "#d9d9d9",
                                                    borderColor:"#999999",
                                                    yAxisID: 'LHS',
                                                },
                                                {
                                                    id: 6,
                                                    label: ' Loan Loss Provissions %',
                                                    data: jsonCompareData.LoanLossProvissions,                        
                                                    backgroundColor : "#9933ff",
                                                    borderColor:"#6600cc",
                                                    yAxisID: 'LHS',
                                                },
                                                {
                                                    id: 7,
                                                    label: ' Operating Expenses %',
                                                    data: jsonCompareData.OperatingExpenses,
                                                    backgroundColor : "#3333ff",
                                                    borderColor:"#000066",
                                                    yAxisID: 'LHS',
                                                },
                                                {
                                                    id: 8,
                                                    label: ' Tax Rate %',
                                                    data: jsonCompareData.TaxRate,
                                                    backgroundColor : "#d9b38c",
                                                    borderColor:"#bf8040",
                                                    yAxisID: 'LHS',
                                                },
                                            ],
                                        }}
                                        options={{
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
                                            },
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false, 
                                                    },
                                                },
                                                LHS: {
                                                type: 'linear',
                                                display: true,
                                                position: 'left',
                                                grid: {
                                                    display: false, 
                                                },
                                                ticks:{
                                                    callback: (value,index,values) => {
                                                        return `${value} %`
                                                    }
                                                },
                                                },
                                                RHS: {
                                                type: 'linear',
                                                display: true,
                                                position: 'right',
                                                grid: {
                                                    display: false, 
                                                },
                                                },
                                            }
                                        }}
                                    />
                                </>):(<> {/* NON BANKING SECTOR */}
                                    <Line
                                        datasetIdKey='id'
                                        data={{
                                            labels: jsonCompareData.XAxis,
                                            datasets: [
                                            {
                                                id: 1,
                                                label: '(RHS) ROE %',
                                                data: jsonCompareData.ROE,
                                                backgroundColor : "rgba(128, 128, 128, 0.3)",
                                                borderColor:"rgba(128, 128, 128, 0.3)",
                                                yAxisID: 'RHS',
                                                type:'bar',
                                                barThickness: 45
                                            },
                                            {
                                                id: 2,
                                                label: '(RHS) PBIT Margin %',
                                                data: jsonCompareData.PBITMargn,
                                                backgroundColor : "#7cb5d0",
                                                borderColor:"#0000cc",
                                                yAxisID: 'RHS',
                                            },
                                            {
                                                id: 3,
                                                label: 'Financial Leverage',
                                                data: jsonCompareData.Fin_Lav,
                                                backgroundColor : "#b3b3b3",
                                                borderColor:"#404040",
                                                yAxisID: 'LHS',
                                            },
                                            {
                                                id: 4,
                                                label: 'Interest Burden',
                                                data: jsonCompareData.InterestBurden,
                                                backgroundColor : "#ff6633",
                                                borderColor:"#cc3300",
                                                yAxisID: 'LHS',
                                            },
                                            {
                                                id: 5,
                                                label: 'Tax Efficiency',
                                                data: jsonCompareData.Tax_Efficiency,
                                                backgroundColor : "#d9d9d9",
                                                borderColor:"#999999",
                                                yAxisID: 'LHS',
                                            },
                                            {
                                                id: 6,
                                                label: 'Assets Turnover',
                                                data: jsonCompareData.AssetsTurnOver,
                                                borderDash:[8,8],
                                                backgroundColor : "#9933ff",
                                                borderColor:"#6600cc",
                                                yAxisID: 'LHS',
                                            },
                                            
                                            ],
                                        }}
                                        options={{
                                            interaction: {
                                                mode: 'index',
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
                                            },
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false, 
                                                    },
                                                },
                                                LHS: {
                                                    type: 'linear',
                                                    display: true,
                                                    position: 'left',
                                                    grid: {
                                                        display: false, 
                                                    },
                                                },
                                                RHS: {
                                                    type: 'linear',
                                                    display: true,
                                                    position: 'right',
                                                    grid: {
                                                        display: false, 
                                                    },
                                                    ticks: {
                                                        callback: (value, index, values) => {
                                                            return `${value} %`
                                                        }
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                </>)
                            }
                        </div>
                        </>)
                    }
                        
                    </>
                ) : (<></>)
            }
            
            
        </div>
    </>
  );
};

export default DUPointChart;
