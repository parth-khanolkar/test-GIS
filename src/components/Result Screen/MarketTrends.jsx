'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import MarketTable from './MarketTrends/MarketTable';
import { useInfoContext } from '@/context/info';
import Select from 'react-select';
import { BiDownload, BiSearchAlt } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { useWatchlistContext } from '@/context/WatchlistContext';

const MarketTrends = () => {
  const { uid } = useInfoContext();
  const { watchlistArray } = useWatchlistContext();

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
  const [ columns,setColumns ] = useState([]);
  const [ indexDropdown,setIndexDropdown ] = useState([]);
  const [ watchlistDropdown,setWatchlistDropdown ] = useState([]);
  const [ parameterDropdown,setParameterDropdown ] = useState([]);

  const [ selectedIndex,setSelectedIndex ] = useState({
    INDICES: "Nifty 50",
    Val: "123"
  });
  const [ selectedWatchlist,setSelectedWatchlist ] = useState(null);
  const [ selectedParameter,setSelectedParameter ] = useState({
    "value": "Revenue",
    "label": "Revenue"
});
  const [ isTypeQuarter,setIsTypeQuarter ] = useState(true);

  const getIndicesList = async () => {
    try {
      const response = await axios.get(
        "https://transcriptanalyser.com/market/indecies_list"
      );

      setIndexDropdown([
        ...(response.data.nse ?? []),
        ...(response.data.bse ?? []),
      ]);
    } catch (error) {
      console.log("Error in getIndicesList: ", error);
    }
  };
  useEffect(() => {
    getIndicesList();
  }, []);
  useEffect(() => {
    setWatchlistDropdown(watchlistArray);
  }, [watchlistArray]);

  const getMarketTrends = async () => {
    setisLoading(true);
    try {
        const response = await axios.post(`https://transcriptanalyser.com/techanalysis/newresult_second`,{
          indexid: 123,
          // exchange: "NSE",
          // user_id : uid,
          WatchListGroupId : 0,
          key : "Revenue",
          period_type:"quarter"
      });

      if(response.status === 200){
        setTableData(response.data.data);
        setParameterDropdown(response.data.parameter_dropdown.map(parameter => ({
          label: parameter,
          value: parameter
        })));
        
        const columnKeys = Object.keys(response.data.data[0]).filter(key => key !== "Fincode" && key !== "Mode");
        setColumns(columnKeys.map((key) => {
          if (key === "Company") {
            return {
              header: key,
              accessorKey: key,
              cell: (info) => (
                info.getValue().length > 15 ? (
                  <span className="line-clamp-1 truncate">
                    {info.getValue().slice(0, 15) + "..."}
                  </span>
                ) : (
                  <span className="line-clamp-1 truncate">{info.getValue()}</span>
                )
              ),
            };
          } else {
            return {
              header: key,
              accessorKey: key,
              cell: (info) => info.getValue() === 0 ? (<span className='font-medium'>{"NA"}</span>) : (<span className='font-medium'>{convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1))}</span>),
            };
          }
        }));


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
      console.log("Error in getMarketTrends: ",error);
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
  }
  useEffect(() => {
    getMarketTrends();
  },[]);

  const convertToIndianNumberFormat = (number) => {
    if (isNaN(number)) {
      console.error('Invalid input. Please provide a valid number.');
      return null;
    }
  
    const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
  
    return formattedNumber;
  };

  const getFilteredMarketTrends = async (index,parameter,watchlist) => {
    setisLoading(true);
    try {
        const response = await axios.post(`https://transcriptanalyser.com/techanalysis/newresult_second`,{
          indexid: index?.Val ? (index.Val):(0),
          // exchange: index?.index ? (index.index):("") ,
          // user_id : uid,
          WatchListGroupId : watchlist ? (watchlist):(0),
          key : parameter,
          period_type: isTypeQuarter ? ('quarter'):('year')
      });

      if(response.status === 200){
        console.log("newresult Filtered");
        setTableData(response.data.data);
        setParameterDropdown(response.data.parameter_dropdown.map(parameter => ({
          label: parameter,
          value: parameter
        })));

        const columnKeys = Object.keys(response.data.data[0]).filter(key => key !== "Fincode" && key !== "Mode");
        setColumns(columnKeys.map((key) => {
          if (key === "Company") {
            return {
              header: key,
              accessorKey: key,
              cell: (info) => (
                info.getValue().length > 15 ? (
                  <span className="line-clamp-1 truncate">
                    {info.getValue().slice(0, 15) + "..."}
                  </span>
                ) : (
                  <span className="line-clamp-1 truncate">{info.getValue()}</span>
                )
              ),
            };
          } else {
            return {
              header: key,
              accessorKey: key,
              cell: (info) => info.getValue() === 0 ? (<span className='font-medium'>{"NA"}</span>) : (<span className='font-medium'>{convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1))}</span>),
            };
          }
        }));

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
      console.log("Error in getFilteredMarketTrends: ",error);
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
  }
  useEffect(() => {
    getFilteredMarketTrends(selectedIndex,selectedParameter?.value,selectedWatchlist?.WatchListGroupId);
  },[isTypeQuarter]);

  return (
    <>
        <div className='lg:text-2xl text-[#143b64] font-semibold '>
            <div>{"Market Trends"}</div>
        </div>

        <div className='flex flex-col md:flex-row md:justify-between  mt-2 md:mt-4'>
          <div className='flex flex-row gap-0.5 md:gap-3'>
              <Select 
                  placeholder={`Index`}
                  value={selectedIndex}
                  options={indexDropdown}
                  getOptionLabel={(item) => item?.INDICES}
                  getOptionValue={(item) => item?.Val}
                  className='text-[10px] md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-50'
                  onChange={(option)=>{
                    setSelectedIndex(option);
                    setSelectedWatchlist(null);
                    getFilteredMarketTrends(option,selectedParameter.value,0);
                  }}
                  styles={dropdownStyles}
              />
              <Select 
                  placeholder={`Period`}
                  value={selectedParameter}
                  options={parameterDropdown}
                  className='text-[10px] md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-50'
                  onChange={(option)=>{
                    setSelectedParameter(option);
                    getFilteredMarketTrends(selectedIndex,option.value,selectedWatchlist?.WatchListGroupId);
                  }}
                  styles={dropdownStyles}
              />
              {
                uid !== -1 && 
                <Select 
                  placeholder={`Watchlist`}
                  value={selectedWatchlist}
                  options={watchlistDropdown}
                  getOptionLabel={(option) => option.WatchGroupName}
                  getOptionValue={(option) => option.WatchListGroupId}
                  className='text-[10px] md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-50'
                  onChange={(option)=>{
                    setSelectedWatchlist(option);
                    setSelectedIndex(null);
                    getFilteredMarketTrends(null,selectedParameter?.value,option?.WatchListGroupId);
                  }}
                  styles={dropdownStyles}
                />
              }
          </div>

          <div className='flex flex-row space-x-2 items-center md:mr-2 ml-auto md:ml-0 mt-2 md:mt-0'>
              <button
                className={`
                  ${
                    isTypeQuarter ? ('underline underline-offset-2 text-[#143B64]'):('text-gray-400')
                  }
                `}
                onClick={()=>{setIsTypeQuarter(true);}}
              >
                {"Quarterly"}
              </button>
              <div>{"/"}</div>
              <button
                className={`
                  ${
                    isTypeQuarter ? ('text-gray-400'):('underline underline-offset-2 text-[#143B64]')
                  }
                `}
                onClick={()=>{setIsTypeQuarter(false);}}
              >
                {"Yearly"}
              </button>
          </div>

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

        <div className='mt-2 mb-2'>
          <MarketTable data={tableData} columns={columns} isLoading={isLoading} filtering={filtering} setFiltering={setFiltering} triggerDownload={triggerDownload}/>
        </div>
    </>
  )
}

export default MarketTrends
