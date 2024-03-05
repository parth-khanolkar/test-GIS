'use client'

import { useInfoContext } from '@/context/info'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import QuarterlyTable from './QuarterlyResults/QuarterlyTable'
import Select from 'react-select'
import { BiDownload, BiSearchAlt } from 'react-icons/bi'
import { RxCross2 } from 'react-icons/rx'

const QuarterlyResults = () => {

    const { uid } = useInfoContext();

    const dropdownStyles = {
        indicatorSeparator: (provided, state) => ({
            ...provided,
            display: 'none', // Remove the vertical line
          }),
      };

    const [ isLoading,setisLoading ] = useState(true);

    const [ filtering,setFiltering ] = useState('');
    const [ triggerDownload,setTriggerDownload ] = useState(0);

    const [ tableData,setTableData ] = useState([]);
    const [ indexDropdown,setIndexDropdown ] = useState([]);
    const [ watchlistDropdown,setWatchlistDropdown ] = useState([]);
    const [ quarterDropdown,setQuarterDropdown ] = useState([]);

    const [ selectedIndex,setSelectedIndex ] = useState({
        label: "Nifty 50",
        value: "123",
        index: "NSE"
    });
    const [ selectedWatchlist,setSelectedWatchlist ] = useState(null);
    const [ selectedPeriod,setSelectedPeriod ] = useState(null);

    const getQuarterlyResults = async () => {
        setisLoading(true);
        try {
            const response = await axios.post(`https://transcriptanalyser.com/techanalysis/result_first`,{
                index: 123, //0
                exchange: "NSE", //""
                user_id : uid,
                watchlist : 0,
                period : 0 
            });

            if(response.status === 200){
                setTableData(response.data.data);
                setIndexDropdown(response.data.index_dropdown);
                setWatchlistDropdown(response.data.watchlist_dropdown);
                setQuarterDropdown(response.data.quarter_dropdown);

                setSelectedPeriod(response.data.quarter_dropdown[0]);

                setisLoading(false);
            } else {
                toast.error('Error! Try again later.', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            }

        } catch (error) {
            console.log("Error in getQuarterlyResults: ",error);
        }
    }
    useEffect(()=>{
        getQuarterlyResults();
    },[]);

    const getFilteredQuarterlyResults = async (index,period,watchlist) => {
        setisLoading(true);
        try {
            const response = await axios.post(`https://transcriptanalyser.com/techanalysis/result_first`,{
                index: index?.value ? (index.value):(0), //0
                exchange: index?.index ? (index.index):("") , //""
                user_id : uid,
                watchlist : watchlist ? (watchlist):(0),
                period : period 
            });

            if(response.status === 200){
                setTableData(response.data.data);
                setIndexDropdown(response.data.index_dropdown);
                setWatchlistDropdown(response.data.watchlist_dropdown);
                setQuarterDropdown(response.data.quarter_dropdown);

                setisLoading(false);
            } else {
                toast.error('Error! Try again later.', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            }

        } catch (error) {
            console.log("Error in getFilteredQuarterlyResults: ",error);
        }
    }

  return (
    <>
        <div className='lg:text-2xl text-[#143b64] font-semibold '>
            <div>{"Quarterly Results"}</div>
        </div>

        <div className='flex flex-row gap-0.5 md:gap-3 mt-2 md:mt-4'>
            <Select 
                placeholder={`Index`}
                value={selectedIndex}
                options={indexDropdown}
                className='text-[10px] md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-30'
                onChange={(option)=>{
                    setSelectedIndex(option);
                    setSelectedWatchlist(null);
                    getFilteredQuarterlyResults(option,selectedPeriod?.value,0);
                }}
                styles={dropdownStyles}
            />
            <Select 
                placeholder={`Period`}
                value={selectedPeriod}
                options={quarterDropdown}
                className='text-[10px] md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-30'
                onChange={(option)=>{
                    setSelectedPeriod(option);
                    getFilteredQuarterlyResults(selectedIndex,option.value,selectedWatchlist?.value);
                }}
                styles={dropdownStyles}
            />
            {
                uid !== -1 && 
                <Select 
                    placeholder={`Watchlist`}
                    value={selectedWatchlist}
                    options={watchlistDropdown}
                    className='text-[10px] md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-30'
                    onChange={(option)=>{
                        setSelectedWatchlist(option);
                        setSelectedIndex(null);
                        getFilteredQuarterlyResults(null,selectedPeriod?.value,option.value);
                    }}
                    styles={dropdownStyles}
                />
            }
        </div>

        <div className='flex flex-row justify-between mr-2 mt-2 md:mt-4'>
            <div className="flex-none sm:flex gap-2 items-center">
                <div className="flex justify-between gap-1 items-center border rounded-sm border-[#083966] px-2 py-1 mb-2">
                    <input
                        type="type"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        placeholder="Company..."
                        className="text-xs md:text-base outline-none bg-transparent w-[35vw] md:w-[32vw] lg:w-[18vw]"
                    />
                    {filtering.length>0 ? (<button onClick={()=>setFiltering("")}><RxCross2 size={18} className="text-[#083966]"/></button>):(<button className='invisible'><RxCross2 size={18} className="text-[#083966]"/></button>)}
                    <BiSearchAlt size={18} className="text-[#083966]" />
                </div>
            </div>

            <button
                className="flex items-center justify-center text-[#093967]"
                onClick={() => {
                    setTriggerDownload(prev => prev+1);
                }}
            >
                <BiDownload size={25} />
            </button>
        </div>

        <div className='mt-2'>
            <QuarterlyTable data={tableData} isLoading={isLoading} filtering={filtering} setFiltering={setFiltering} triggerDownload={triggerDownload} />
        </div>
    </>
  )
}

export default QuarterlyResults
