'use client'

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useBulkBlockContext } from '@/context/BulkBlockContext';
import axios from 'axios';
import Select from 'react-select';

import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import Moment from 'react-moment';

const EconomyGraphModal = () => {
    const { indicatorId,setIndicatorId,indicatorDatasetId,setIndicatorDatasetId,isEconomyGraphModalOpen,setIsEconomyGraphModalOpen,openEconomyGraphModal,closeEconomyGraphModal } = useBulkBlockContext();

    const [isMobile, setIsMobile] = useState(false);    
    const [ data,setData ] = useState([]);
    const [ graph,setGraph ] = useState([]);

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        // Set end date to a year before today
        today.setFullYear(today.getFullYear() - 1);
        return today;
    });
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '95%' : '90%',
                maxHeight: isMobile ? '95%' : '90%',
                width: isMobile ? '90%' : '90%',
                maxWidth: isMobile ? '90%' : '90%',
                margin: 'auto',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: isMobile ? -40 : 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.60)',
              zIndex: 999,
            },
        };
    }

    const dropdownStyles = {
        indicatorSeparator: (provided, state) => ({
            ...provided,
            display: 'none', // Remove the vertical line
          }),
      };

    const getGraph = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gis/indicator_detail`,{
                start_date: "02/09/2023",
                end_date: "02/09/2024",
                id : indicatorId,
                datasetid : indicatorDatasetId,
                mode : "YoY",
                timeperiod : "M"
            });

            setData(response.data?.Data[0]);
            
        } catch (error) {
            console.log("Error in getGraph: ",error);
        }
    }

    useEffect(()=>{
        if(indicatorId && indicatorDatasetId)
        {
            getGraph();
        }
    },[indicatorId,indicatorDatasetId]);
    
    const closeModal = () => {
        closeEconomyGraphModal();
    }

    const arrangeGraphData = () => {
        setGraph(()=>{
            
            const reducedData = data.ObjList.reduce(
                (acc, { item_date, India, MOM_Growth }) => {
                  
            
                  acc.Dates.push(item_date);
                  acc.India.push(India);
                  acc.MOM.push(MOM_Growth);
            
                  return acc;
                },
                { Dates: [], India: [], MOM: [] }
              );
            
              return reducedData;
        })
    }

    useEffect(()=>{
        if(data.ObjList){
            arrangeGraphData();
        }
    },[data]);
    useEffect(()=>{
        console.log(graph);
    },[graph]);


  return (
    <>
        <ReactModal
            isOpen={isEconomyGraphModalOpen}
            onRequestClose={closeModal}
            contentLabel="Economy Graph Modal"
            style={getModalStyle()}
        >
            <div id='EconoMyGraph' className='h-full w-full'>
                <div className='flex items-center justify-center w-full border-b-2 border-gray-400'>
                    <div className='md:text-xl font font-semibold ml-auto'>
                        {data.SubCategory}
                    </div>
                    <button className='flex items-center ml-auto'
                        onClick={()=>{closeEconomyGraphModal();}}
                    >
                        <AiOutlineCloseCircle size={20}/>
                    </button>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 md:gap-3 mt-2 md:mt-3'>
                    <div className="flex flex-col col-span-1">
                        <label className="text-xs md:text-sm mb-1">{"Start Date:"}</label>
                        <input 
                        type="date"  
                        value={startDate.toISOString().split('T')[0]}
                        onChange={(e)=>{setStartDate(new Date(e.target.value));}}
                        className='text-sm p-1 py-1.5 lg:py-2 border border-gray-300 rounded-[3.5px] w-full'
                        />
                    </div>
                    <div className="flex flex-col col-span-1">
                        <label className="text-xs md:text-sm mb-1">{"End Date:"}</label>
                        <input 
                        type="date"  
                        value={endDate.toISOString().split('T')[0]}
                        onChange={(e)=>{setEndDate(new Date(e.target.value));}}
                        className='text-sm p-1 py-1.5 lg:py-2 border border-gray-300 rounded-[3.5px] w-full'
                        />
                    </div>
                    <div className="flex flex-col col-span-1">
                        <label className="text-xs md:text-sm mb-1">{"Time Period:"}</label>
                        <Select 
                            className="text-xs md:text-sm" 
                            styles={dropdownStyles}
                        />
                    </div>
                    <div className="flex flex-col col-span-1">
                        <label className="text-xs md:text-sm mb-1">{"Change %:"}</label>
                        <Select 
                            className="text-xs md:text-sm" 
                            styles={dropdownStyles}
                        />
                    </div>
                    <div className="flex flex-col col-span-1">
                        <label className="text-xs md:text-sm mb-1">{"Period:"}</label>
                        <Select 
                            className="text-xs md:text-sm" 
                            styles={dropdownStyles}
                        />
                    </div>
                    
                    <div className='col-span-1 flex items-end justify-center'>
                        <button className='col-span-1 text-white bg-[#143B64] rounded-[3.5px] text-xs md:text-sm w-full py-2.5 md:py-2'>
                            {"Submit"}
                        </button>
                    </div>
                </div>

                <div className='mt-2 md:mt-4'>
                    <Line
                        datasetIdKey='id'
                        data={{
                            labels: graph.Date,
                            datasets: [
                                {
                                    id: 1,
                                    label: 'ROE %',
                                    data: graph.India,
                                    backgroundColor: "rgba(128, 128, 128, 0.3)",
                                    borderColor: "rgba(128, 128, 128, 0.3)",
                                    yAxisID: 'LHS',
                                    type: 'bar',
                                    barThickness: 45
                                },
                                {
                                    id: 2,
                                    label: 'ROA %',
                                    data: graph.MOM,
                                    borderDash: [0, 0],
                                    backgroundColor: "transparent",
                                    borderColor: "#7cb5d0",
                                    yAxisID: 'LHS',
                                    type: 'line',
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
                                    ticks: {
                                        callback: (value, index, values) => {
                                            return `${value} %`;
                                        },
                                    },
                                },
                                RHS: {
                                    type: 'linear',
                                    display: false, // You can set this to true if you want to display the right-axis
                                    position: 'right',
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />


                </div>

            </div>
        </ReactModal>
      
    </>
  )
}

export default EconomyGraphModal
