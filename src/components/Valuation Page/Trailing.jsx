'use client'

import React, { useEffect, useState } from 'react'
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

const Trailing = ({ mode,graph,data,sector,isLoading }) => {

    const [ maxLatestPB,SetMaxLatestPB ] = useState(-10000000)
    const [ minLatestPB,SetMinLatestPB ] = useState(10000000)
    const [ maxLatestPE,SetMaxLatestPE ] = useState(-10000000)
    const [ minLatestPE,SetMinLatestPE ] = useState(10000000)
    const [ maxLatestPrice,SetMaxLatestPrice ] = useState(-10000000)
    const [ minLatestPrice,SetMinLatestPrice ] = useState(10000000)
    const [ maxLatestEVEBITDA,SetMaxLatestEVEBITDA ] = useState(-10000000)
    const [ minLatestEVEBITDA,SetMinLatestEVEBITDA ] = useState(10000000)

    const graphLen = (graph.length-10);

    const reduceCategoryData = (graph, categoryData) => {
        return graph?.reduce(
          (result, entry,index) => {
            const date = new Date(entry.Date);
      
            result.VAL.push({ x: date, y: entry[categoryData.key] });
            result.Avg.push({ x: date, y: categoryData.avg });
            result.MA1SD.push({ x: date, y: categoryData.add_1sd });
            result.MM1SD.push({ x: date, y: categoryData.minus_1sd });

            if(categoryData.key === 'pb'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestPB){
                    SetMaxLatestPB(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestPB){
                    SetMinLatestPB(entry[categoryData.key]);
                }
            }
            if(categoryData.key === 'pe'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestPE){
                    SetMaxLatestPE(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestPE){
                    SetMinLatestPE(entry[categoryData.key]);
                }
            }
            if(categoryData.key === 'ev_ebitda'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestEVEBITDA){
                    SetMaxLatestEVEBITDA(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestEVEBITDA){
                    SetMinLatestEVEBITDA(entry[categoryData.key]);
                }
            }
            if(categoryData.key === 'price'){
                
                if((index > graphLen) && entry[categoryData.key] > maxLatestPrice){
                    SetMaxLatestPrice(entry[categoryData.key]);
                }
                if((index > graphLen) && entry[categoryData.key] < minLatestPrice){
                    SetMinLatestPrice(entry[categoryData.key]);
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
      
      const PE = reduceCategoryData(graph, {
        key: 'pe',
        avg: data.avg_pe,
        add_1sd: data.pe_add_1sd,
        minus_1sd: data.pe_minus_1sd,
      });
      
      const PB = reduceCategoryData(graph, {
        key: 'pb',
        avg: data.avg_pb,
        add_1sd: data.pb_add_1sd,
        minus_1sd: data.pb_minus_1sd,
      });

      const EVEBITDA = reduceCategoryData(graph, {
        key: 'ev_ebitda',
        avg: data.avg_evebitda,
        add_1sd: data.evebitda_add_1sd,
        minus_1sd: data.evebitda_minus_1sd,
      });

      const Price = reduceCategoryData(graph, {
        key: 'price',
        avg: data.price,
        add_1sd: data.price_add_1sd,
        minus_1sd: data.price_minus_1sd,
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
                        data.pe_add_1sd - data.avg_pe === 0 && data.pb_add_1sd - data.avg_pb === 0 && data.evebitda_add_1sd - data.avg_evebitda === 0 && data.price_add_1sd - data.avg_price === 0 &&
                        <div className='flex items-center justify-center font-bold text-2xl h-[40vh]'>
                            {"No Trailing data available."}
                        </div>
                    }

                    <div className={`col-span-1 h-[45vh] md:h-[38vh] border shadow-md p-2 pb-10 rounded-md
                        ${
                            data.pe_add_1sd - data.avg_pe === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-xl font-semibold gap-2'>
                            {"PE(X)"}
                        </div>
                        <Line
                            
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'P/E(X)',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.pe })),
                                            data : PE.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_pe })),
                                            data : PE.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pe_add_1sd })),
                                            data : PE.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pe_minus_1sd })),
                                            data : PE.MM1SD,
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
                                    // min: Math.floor(data.pe_minus_1sd - (data.avg_pe - data.pe_minus_1sd)) !== 0 ? (data.pe_minus_1sd - (data.avg_pe - data.pe_minus_1sd)) : undefined,
                                    
                                    // max: Math.ceil(data.pe_add_1sd + (data.pe_add_1sd - data.avg_pe)) !== 0 ? (data.pe_add_1sd + (data.pe_add_1sd - data.avg_pe)) : undefined,

                                    min: Math.min((data.avg_pe - ((data.pe_add_1sd - data.avg_pe)*2)),minLatestPE),
                                    
                                    max: Math.max((data.avg_pe + ((data.pe_add_1sd - data.avg_pe)*2)),maxLatestPE),

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
                            data.pb_add_1sd - data.avg_pb === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-xl font-semibold gap-2'>
                            {"PB(X)"}
                        </div>
                        <Line
                            
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'P/B(X)',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.pb })),
                                            data : PB.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_pb })),
                                            data : PB.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pb_add_1sd })),
                                            data : PB.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.pb_minus_1sd })),
                                            data : PB.MM1SD,
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
                                    // min: Math.floor(data.pb_minus_1sd - (data.avg_pb - data.pb_minus_1sd)) !== 0 ? (data.pb_minus_1sd - (data.avg_pb - data.pb_minus_1sd)) : undefined,
                                    
                                    // max: Math.ceil(data.pb_add_1sd + (data.pb_add_1sd - data.avg_pb)) !== 0 ? (data.pb_add_1sd + (data.pb_add_1sd - data.avg_pb)) : undefined,

                                    min: Math.min((data.avg_pb - ((data.pb_add_1sd - data.avg_pb)*2)),minLatestPB),

                                    max: Math.max((data.avg_pb + ((data.pb_add_1sd - data.avg_pb)*2)),maxLatestPB),
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
                    col-span-1 h-[45vh] md:h-[38vh] border shadow-md p-2 pb-10 rounded-md
                        ${
                            data.evebitda_add_1sd - data.avg_evebitda === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-xl font-semibold gap-2'>
                            {"EV/EBITDA(X)"}
                        </div>
                        <Line
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'EV/EBITDA(X)',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.ev_ebitda })),
                                            data : EVEBITDA.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_evebitda })),
                                            data : EVEBITDA.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.evebitda_add_1sd })),
                                            data : EVEBITDA.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.evebitda_minus_1sd })),
                                            data : EVEBITDA.MM1SD,
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
                                    // min: Math.floor(data.evebitda_minus_1sd - (data.avg_evebitda - data.evebitda_minus_1sd)) !== 0 ? (data.evebitda_minus_1sd - (data.avg_evebitda - data.evebitda_minus_1sd)) : undefined,
                                    
                                    // max: Math.ceil(data.evebitda_add_1sd + (data.evebitda_add_1sd - data.avg_evebitda)) !== 0 ? (data.evebitda_add_1sd + (data.evebitda_add_1sd - data.avg_evebitda)) : undefined,

                                    min: Math.min((data.avg_evebitda - ((data.evebitda_add_1sd - data.avg_evebitda)*2)),minLatestEVEBITDA),
                                    
                                    max: Math.max((data.avg_evebitda + ((data.evebitda_add_1sd - data.avg_evebitda)*2)),maxLatestEVEBITDA),

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
                            data.price_add_1sd - data.avg_price === 0 ? ('hidden') : ('')
                        }
                    `}>
                        <div className='flex justify-center text-xs md:text-xl font-semibold gap-2'>
                            {"Price"}
                        </div>
                        <Line
                            
                            data={
                                {
                                    datasets: [
                                        {
                                            label: 'Price',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: entry.price })),
                                            data : Price.VAL,
                                            borderColor: 'rgba(216, 47, 68, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Avg',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.avg_price })),
                                            data : Price.Avg,
                                            borderColor: 'rgba(0, 0, 0, 1)', 
                                            fill: false,
                                        },
                                        {
                                            label: 'Mean+1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.price_add_1sd })),
                                            data : Price.MA1SD,
                                            borderColor: 'rgba(0, 0, 0, 0.2)', 
                                            fill: false,
                                            borderDash: [10,5],
                                        },
                                        {
                                            label: 'Mean-1SD',
                                            // data: graph?.map(entry => ({ x: new Date(entry.Date), y: data.price_minus_1sd })),
                                            data : Price.MM1SD,
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

                                    // min: Math.floor(data.price_minus_1sd - (data.avg_price - data.price_minus_1sd)) !== 0 ? (data.price_minus_1sd - (data.avg_price - data.price_minus_1sd)) : undefined,
                                    
                                    // max: Math.ceil(data.price_add_1sd + (data.price_add_1sd - data.avg_price)) !== 0 ? (data.price_add_1sd + (data.price_add_1sd - data.avg_price)) : undefined,

                                    min: Math.min((data.avg_price - ((data.price_add_1sd - data.avg_price)*2)),minLatestPrice),
                                    
                                    max: Math.max((data.avg_price + ((data.price_add_1sd - data.avg_price)*2)),maxLatestPrice),

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

export default Trailing
