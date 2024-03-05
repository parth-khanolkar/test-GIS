'use client'

import React, { useState } from 'react'
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

ChartJS.register(
    LineElement,
    TimeScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
  );

const Forward = ({ mode,graph,data,sector,isLoading }) => {
    const [ maxLatestPB_EST,SetMaxLatestPB_EST ] = useState(-10000000)
    const [ minLatestPB_EST,SetMinLatestPB_EST ] = useState(10000000)
    const [ maxLatestPE_EST,SetMaxLatestPE_EST ] = useState(-10000000)
    const [ minLatestPE_EST,SetMinLatestPE_EST ] = useState(10000000)
    const [ maxLatestEVEBITDA_EST,SetMaxLatestEVEBITDA_EST ] = useState(-10000000)
    const [ minLatestEVEBITDA_EST,SetMinLatestEVEBITDA_EST ] = useState(10000000)

    const graphLen = (graph.length-10);

    const reduceCategoryData = (graph, categoryData) => {
        return graph?.reduce(
          (result, entry, index) => {
            const date = new Date(entry.Date);
      
            result.VAL.push({ x: date, y: entry[categoryData.key] });
            result.Avg.push({ x: date, y: categoryData.avg });
            result.MA1SD.push({ x: date, y: categoryData.add_1sd });
            result.MM1SD.push({ x: date, y: categoryData.minus_1sd });

            if(categoryData.key === 'pe_est'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestPE_EST){
                    SetMaxLatestPE_EST(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestPE_EST){
                    SetMinLatestPE_EST(entry[categoryData.key]);
                }
            }
            if(categoryData.key === 'pb_est'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestPB_EST){
                    SetMaxLatestPB_EST(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestPB_EST){
                    SetMinLatestPB_EST(entry[categoryData.key]);
                }
            }
            if(categoryData.key === 'ev_ebitda_est'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestEVEBITDA_EST){
                    SetMaxLatestEVEBITDA_EST(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestEVEBITDA_EST){
                    SetMinLatestEVEBITDA_EST(entry[categoryData.key]);
                }
            }
      
            return result;
          },
          {
            VAL: [],
            Avg: [],
            MA1SD: [],
            MM1SD: [],
          }
        );
      };
      
      const PE_EST = reduceCategoryData(graph, {
        key: 'pe_est',
        avg: data.avg_pe_est,
        add_1sd: data.pe_est_add_1sd,
        minus_1sd: data.pe_est_minus_1sd,
      });

      const PB_EST = reduceCategoryData(graph, {
        key: 'pb_est',
        avg: data.avg_pb_est,
        add_1sd: data.pb_est_add_1sd,
        minus_1sd: data.pb_est_minus_1sd,
      });

      const EVEBITDA_EST = reduceCategoryData(graph, {
        key: 'ev_ebitda_est',
        avg: data.avg_evebitda_est,
        add_1sd: data.evebitda_est_add_1sd,
        minus_1sd: data.evebitda_est_minus_1sd,
      });

  return (
    <>
        {
            isLoading ? (
                <div className='flex items-center mt-[10%] lg:mt-[10%] mb-[10%] lg:mb-[10%] justify-center'>
                    <div className="flex justify-center items-center ">
                        <span className="relative flex h-[80px] w-[80px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-"></span>
                        </span>
                    </div>
                </div>
            ):(
                <div className='grid grid-cols-1 gap-4 md:mx-4 mt-2'>

                    {
                        data.pe_est_add_1sd - data.avg_pe_est === 0 && data.pb_est_add_1sd - data.avg_pb_est === 0 && data.evebitda_est_add_1sd - data.avg_evebitda_est === 0 && 
                        <div className='flex items-center justify-center font-bold text-2xl h-[40vh]'>
                            {"No Forward data available."}
                        </div>
                    }

                    <div className={`col-span-1 h-[45vh] md:h-[38vh] border shadow-md p-2 pb-10 rounded-md
                        ${
                            data.pe_est_add_1sd - data.avg_pe_est === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-lg gap-2'>
                            {"PE(X)"}
                        </div>
                        <Line
                            
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'P/E(X)',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.pe_est })),
                                            data : PE_EST.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_pe_est })),
                                            data : PE_EST.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pe_est_add_1sd })),
                                            data : PE_EST.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pe_est_minus_1sd })),
                                            data : PE_EST.MM1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.5)', 
                                            fill: false,
                                            borderDash: [5, 5],
                                        },
                                    ],
                                }
                            }
                            options={{
                                interaction: {
                                    mode: 'index',
                                    axis: 'x',
                                    intersect: false,
                                },
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
                                        maxTicksLimit:10,
                                        font: {
                                        size: 10,
                                        },
                                    },
                                    },
                                    y: {
                                    // min: Math.floor(data.pe_est_minus_1sd - (data.avg_pe_est - data.pe_est_minus_1sd)) !== 0 ? (data.pe_est_minus_1sd - (data.avg_pe_est - data.pe_est_minus_1sd)) : undefined,

                                    // max: Math.ceil(data.pe_est_add_1sd + (data.pe_est_add_1sd - data.avg_pe_est)) !== 0 ? (data.pe_est_add_1sd + (data.pe_est_add_1sd - data.avg_pe_est)) : undefined,

                                    min: Math.min((data.avg_pe_est - ((data.pe_est_add_1sd - data.avg_pe_est)*2)),minLatestPE_EST),
                                    
                                    max: Math.max((data.avg_pe_est + ((data.pe_est_add_1sd - data.avg_pe_est)*2)),maxLatestPE_EST),


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
                    <div className={`col-span-1 h-[45vh] md:h-[38vh] border shadow-md p-2 pb-10 rounded-md
                        ${
                            data.pb_est_add_1sd - data.avg_pb_est === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-lg gap-2'>
                            {"PB(X)"}
                        </div>
                        <Line
                            
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'P/B(X)',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.pb_est })),
                                            data : PB_EST.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_pb_est })),
                                            data : PB_EST.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pb_est_add_1sd })),
                                            data : PB_EST.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pb_est_minus_1sd })),
                                            data : PB_EST.MM1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.5)', 
                                            fill: false,
                                            borderDash: [5, 5],
                                        },
                                    ],
                                }
                            }
                            options={{
                                interaction: {
                                    mode: 'index',
                                    axis: 'x',
                                    intersect: false,
                                },
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
                                        maxTicksLimit:10,
                                        font: {
                                        size: 10,
                                        },
                                    },
                                    },
                                    y: {
                                    // min: Math.floor(data.pb_est_minus_1sd - (data.avg_pb_est - data.pb_est_minus_1sd)) !== 0 ? (data.pb_est_minus_1sd - (data.avg_pb_est - data.pb_est_minus_1sd)) : undefined,
                                    
                                    // max: Math.ceil(data.pb_est_add_1sd + (data.pb_est_add_1sd - data.avg_pb_est)) !== 0 ? (data.pb_est_add_1sd + (data.pb_est_add_1sd - data.avg_pb_est)) : undefined,

                                    min: Math.min((data.avg_pb_est - ((data.pb_est_add_1sd - data.avg_pb_est)*2)),minLatestPB_EST),
                                    
                                    max: Math.max((data.avg_pb_est + ((data.pb_est_add_1sd - data.avg_pb_est)*2)),maxLatestPB_EST),

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
                    <div className={`
                        ${
                            (sector !== 'Bank' && sector !=='Finance') ? ('col-span-1') : ('hidden') 
                        }
                    h-[45vh] md:h-[38vh] border shadow-md p-2 pb-10 rounded-md
                        ${
                            data.evebitda_est_add_1sd - data.avg_evebitda_est === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-lg gap-2'>
                            {"EV/EBIDA(X)"}
                        </div>
                        <Line
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'EV/EBITDA(X)',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.ev_ebitda_est })),
                                            data : EVEBITDA_EST.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_evebitda_est })),
                                            data : EVEBITDA_EST.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.evebitda_est_add_1sd })),
                                            data : EVEBITDA_EST.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.evebitda_est_minus_1sd })),
                                            data : EVEBITDA_EST.MM1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.5)', 
                                            fill: false,
                                            borderDash: [5, 5],
                                        },
                                    ],
                                }
                            }
                            options={{
                                interaction: {
                                    mode: 'index',
                                    axis: 'x',
                                    intersect: false,
                                },
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
                                        maxTicksLimit:10,
                                        font: {
                                        size: 10,
                                        },
                                    },
                                    },
                                    y: {
                                    // min: Math.floor(data.evebitda_est_minus_1sd - (data.avg_evebitda_est - data.evebitda_est_minus_1sd)) !== 0 ? (data.evebitda_est_minus_1sd - (data.avg_evebitda_est - data.evebitda_est_minus_1sd)) : undefined,
                                    
                                    // max: Math.ceil(data.evebitda_est_add_1sd + (data.evebitda_est_add_1sd - data.avg_evebitda_est)) !== 0 ? (data.evebitda_est_add_1sd + (data.evebitda_est_add_1sd - data.avg_evebitda_est)) : undefined,

                                    min: Math.min((data.avg_evebitda_est - ((data.evebitda_est_add_1sd - data.avg_evebitda_est)*2)),minLatestEVEBITDA_EST),
                                    
                                    max: Math.max((data.avg_evebitda_est + ((data.evebitda_est_add_1sd - data.avg_evebitda_est)*2)),maxLatestEVEBITDA_EST),

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
                </div>
            )
        }

    </>
  )
}

export default Forward
