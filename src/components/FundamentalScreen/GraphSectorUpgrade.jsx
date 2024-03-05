'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const GraphSectorUpgrade = () => {
    
  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    return currentDate.toISOString().split('T')[0];
  });
  
  const [ selectedIndex,setSelectedIndex ] = useState({ INDICES: "Nifty 50", Val: "123" });
  const [ indexList,setIndexList ] = useState([]);
  
  const [ graphData,setGraphData ] = useState([]);
  
  const [ isLoading,setIsLoading ] = useState(true);

  const getGraphData = async () => {
    setIsLoading(true);
    try {
        const response = await axios.post(`https://transcriptanalyser.com/techanalysis/sector_updowngrade`,{
            index: selectedIndex?.Val,
            start_date: startDate,
        });

        
        if(response.status === 200){
            setGraphData(response.data.Data);
            setIsLoading(false);
        }

    } catch (error) {
        console.log("Error in getGraphData: ",error);
    }
  }
  useEffect(()=>{
    getGraphData();
  },[startDate,selectedIndex]);
  
    const getIndicesList = async () => {
      try {
          const response = await axios.get('https://transcriptanalyser.com/market/indecies_list');
          
          setIndexList([...(response.data.nse ?? []), ...(response.data.bse ?? [])]);
          
        } catch (error) {
            console.log("Error in getIndicesList: ",error);
        }
    }
    useEffect(()=>{
        getIndicesList();
    },[]);


  return (
    <>
        <div className='lg:text-2xl text-[#143b64] font-semibold flex flex-col md:flex-row'>
            <div>{"Sector Upgrade-Downgrade Screen"}</div>
            <div>{" (% change in consensus EPS)"}</div>
        </div>

        <div className='mt-3 flex flex-row justify-between md:justify-normal space-x-10 md:mx-8'>
            <div className=''>
              <Select 
                value={selectedIndex}
                options={indexList}
                getOptionLabel={(item)=>item?.INDICES}
                getOptionValue={(item)=>item?.Val}
                onChange={(option)=>{
                    setSelectedIndex(option);
                }}
                className='text-xs md:text-base w-[40vw] md:w-[32vw] lg:w-[18vw]'
              />
            </div>
            <div className='flex items-center justify-center'>
                <input
                type="date"
                value={startDate}
                onChange={(e)=>{
                    setStartDate(e.target.value);
                }}
                className='border border-gray-400 px-3 py-1.5 rounded-md text-sm md:text-base'
                />
            </div>
        </div>

        <div className='mt-3 flex items-center justify-center h-[70vh]'>
            {
                isLoading ? (
                    <div className='flex items-center justify-center'>
                        <div className="flex justify-center items-center ">
                            <span className="relative flex h-[80px] w-[80px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                    </div>
                ):(
                    <Bar 
                        data={{
                            labels : graphData?.map((item)=>item.sector),
                            datasets: [
                                {
                                    label: "Upgrades",
                                    data: graphData?.map((item) => parseFloat(item.PerUp).toFixed(1)),
                                    backgroundColor: 'rgb(131, 235, 173)',
                                },
                                {
                                    label: "Downgrades",
                                    data: graphData?.map((item) => parseFloat(item.PerDwn).toFixed(1)),
                                    backgroundColor: 'rgb(255, 139, 139)',
                                },
                            ]
                        }}
                        
                        options={{
                            interaction: {
                                mode: 'index',
                                axis: 'x',
                                intersect: false,
                            },
                            responsive: true,
                            scales: {
                            x: {
                                grid:{
                                    drawOnChartArea:false,
                                },
                                stacked: true,
                                ticks:{
                                    minRotation:90,
                                    maxRotation:90,
                                }
                            },
                            y: {
                                grid:{
                                    color:'rgb(182, 182, 182)'
                                },
                                stacked: true,
                                beginAtZero:true,
                                ticks: {
                                    callback: (value, index, values) => {
                                        return `${value} %`
                                    }
                                },
                            },
                            },
                            plugins:{
                                legend: {
                                    position: 'bottom', 
                                },
                                tooltip:{
                                    callbacks:{
                                        label: (context) => {
                                            if(context.dataset.label === 'Upgrades'){
                                                return `${context.dataset.label}: ${graphData[context.dataIndex]?.Upgrade_val}`
                                            } 
                                            return `${context.dataset.label}: ${graphData[context.dataIndex]?.Downgrade_val}`

                                        }
                                    }
                                },
                            }
                        }}
                    />
                )
            }
        </div>
    </>
  )
}

export default GraphSectorUpgrade
