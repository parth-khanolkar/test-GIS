'use client'

import PDFModal from '@/components/Broker Report/PDFModal'
import { useInfoContext } from '@/context/info'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { FaCompressAlt, FaExpandAlt, FaFileDownload, FaFilter } from 'react-icons/fa'
import { IoDocumentText, IoShareSocial } from 'react-icons/io5'
import Moment from 'react-moment'
import Select from 'react-select'
import { IoIosArrowDropup } from "react-icons/io";
import { useInView } from 'react-intersection-observer'
import FilterModal from '@/components/Broker Report/FilterModal'
import { toast } from 'react-toastify'

const BrokerReportPage = () => {
  const { uid } = useInfoContext();
  const { ref:loading, inView:fetchLoader } = useInView(1);
  const [ reports,setReports ] = useState([]);

  const [ isLoading,setIsLoading ] = useState(true);
  const [ counter,setCounter ] = useState(1);
  
  const [ isPDFFullscreen,setIsPDFFullscreen ] = useState(false);
  
  const [ selectedFilter,setSelectedFilter ] = useState({label:"Latest Reports",value:"LatestReports"});
  
  const [ companyDropdown,setCompanyDropdown ] = useState([]);
  const [ watchlistDropdown,setWatchlistDropdown ] = useState([]);
  const [ sectorDropdown,setSectorDropdown ] = useState([]);
  
  const [ selectedReportId,setSelectedReportId ] = useState(null);
  const [ pdfHeader,setPDFHeader ] = useState('');
  const [ pfdLink,setPDFLink ] = useState('');
  
  const [ filterOptions,setFilterOptions ] =useState([
    {label:"Latest Reports",value:"LatestReports"},
    {label:"Company Reports",value:"CompanyReports"},
    {label:"Sector Reports",value:"SectorReports"}
  ]);

  useEffect(()=>{
    if(uid !== -1){
      setFilterOptions([
        {label:"Latest Reports",value:"LatestReports"},
        {label:"Company Reports",value:"CompanyReports"},
        {label:"Sector Reports",value:"SectorReports"},
        {label:"Watchlist Reports",value:"WatchlistReports"}
      ])
    }
  },[uid]);
    
  const getBrokerReports = async () => {
    try {
      const response = await axios.post(`https://transcriptanalyser.com/interview/broker_report`,{
        sector :  "All",
        fincode : 0,
        watchlist_id  : 0,
        user_id :uid,
        counter : counter
      });

      if(response.status === 200){
        
        setWatchlistDropdown(response.data?.watchlist_dropdown);
        setCompanyDropdown(response.data?.comp_dropdown);
        setSectorDropdown(response.data?.sector_dropdown);

        setIsLoading(false);
        setCounter(prev => prev+1);

        if(counter === 1){
          setReports(response.data?.reports);
          setSelectedReportId(response.data?.reports[0]?.report_id);
          setPDFHeader(response.data?.reports[0]?.heading);
          setPDFLink(response.data?.reports[0]?.s3_link);
        } else {
          setReports(prev => [...prev,...response.data?.reports]);
        }
      }
      
    } catch (error) {
      console.log("Error in getBrokerReports: ",error);
    }
  }
  useEffect(()=>{
    getBrokerReports();
  },[uid]);

  useEffect(()=>{
    fetchLoader && getBrokerReports();
  },[fetchLoader]);

  const getFilteredBrokerReports = async (Sector,Fincode,Watchlist) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://transcriptanalyser.com/interview/broker_report`,{
        sector :  Sector,
        fincode : Fincode,
        watchlist_id  : Watchlist,
        user_id :uid,
        counter : 1
      });

      if(response.status === 200){
        setReports(response.data?.reports);
        setIsLoading(false);
      }

    } catch (error) {
      console.log('Error in getFilteredBrokerReports: ',error);
    }
  }


  return (
    <>
        <div className='bg-white h-[calc(100vh-82px)] md:h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide md:scrollbar'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mx-2'>
            <div className={`col-span-1
              ${
                isPDFFullscreen && 'hidden'
              }
            `}>

              <div className='flex flex-row gap-3 py-2 sticky top-0 bg-white z-10 mb-3'>
                <Select 
                  value={selectedFilter}
                  options={filterOptions}
                  onChange={(option)=>{
                    if(option.value === 'LatestReports'){
                      setSelectedFilter(option);
                      setIsLoading(true);
                      getBrokerReports();
                    } else {
                      setCounter(1);
                      setSelectedFilter(option);
                    }                      
                  }}
                  className='w-1/2 text-xs md:text-xs lg:text-base'
                />

                {
                  selectedFilter.value === 'CompanyReports' && 
                  <Select 
                    options={companyDropdown}
                    placeholder={`Select Company...`}
                    onChange={(option)=>{
                      getFilteredBrokerReports("All",option.value,0);
                    }}
                    className='w-1/2 text-xs md:text-xs lg:text-base'
                  />
                }
                {
                  selectedFilter.value === 'SectorReports' && 
                  <Select 
                    options={sectorDropdown}
                    placeholder={`Select Sector...`}
                    onChange={(option)=>{
                      getFilteredBrokerReports(option.value,0,0);
                    }}
                    className='w-1/2 text-xs md:text-xs lg:text-base'
                  />
                }
                {
                  selectedFilter.value === 'WatchlistReports' && 
                  <Select 
                    options={watchlistDropdown}
                    placeholder={`Select Watchlist...`}
                    onChange={(option)=>{
                      getFilteredBrokerReports("All",0,option.value);
                    }}
                    className='w-1/2 text-xs md:text-xs lg:text-base'
                  />
                }

              </div>

              <div className='px-2 md:h-[85vh] lg:h-[77vh] md:overflow-y-auto'>
                {
                  isLoading ? (
                    <div className='flex items-center mt-[65%] lg:mt-[10%] justify-center'>
                      <div className="flex justify-center items-center ">
                        <span className="relative flex h-[80px] w-[80px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-"></span>
                        </span>
                      </div>
                    </div>
                  ) : (<>
                    <div id='top'></div>
                    {
                      reports.map((item,index)=>(
                        <div
                          key={index}
                          className={`w-full hover:shadow-lg border border-b-4 border-[#143B64] grid grid-cols-12 gap-1 items-center justify-between px-2 mb-3 md:mb-6 rounded-sm 
                            ${
                              item.report_id === selectedReportId ? ('md:bg-[#143B64] md:text-white'):('group')
                            }
                          `}
                        >
                          <button className='col-span-2 flex items-center justify-center text-[13px] md:text-xs lg:text-base font-semibold italic  my-5'
                            onClick={() => {
                              setSelectedReportId(item.report_id);
                              setPDFHeader(item.heading);
                              setPDFLink(item.s3_link);
                            }}
                          >
                            <Moment format="DD MMM' YYYY" className='lg:max-w-[5vw]'>
                              {item.report_date}
                            </Moment>
                          </button>
    
                          <button className='col-span-8 flex items-center justify-center font-semibold text-xs lg:text-base group-hover:underline underline-offset-2  my-5'
                            onClick={() => {
                              setSelectedReportId(item.report_id);
                              setPDFHeader(item.heading);
                              setPDFLink(item.s3_link);
                            }}
                          >
                            {item.heading}
                          </button>
    
                          <div className='col-span-2 flex flex-row items-center justify-between md:justify-center md:gap-3'>
                            <button className='flex items-center justify-center text-lg md:text-xl lg:text-2xl'
                              onClick={()=>{
                                const pdfUrl = item.s3_link;

                                // Open the link in a new tab
                                window.open(pdfUrl, '_blank');
                              }}
                            >
                              <FaFileDownload />
                            </button>
                            <button className='flex items-center justify-center text-lg md:text-xl lg:text-2xl'
                              onClick={()=>{
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(`${item.s3_link}`)
                                      .then(() => {
                                      toast.success('Link copied to clipboard', {
                                          position: "bottom-center",
                                          autoClose: 1500,
                                          hideProgressBar: true,
                                          closeOnClick: true,
                                          pauseOnHover: false,
                                          draggable: false,
                                          progress: undefined,
                                          theme: "light",
                                      });
                                      })
                                      .catch((err) => {
                                      console.error('Unable to copy to clipboard', err);
                                      });
                                  } else {
                                  const tempInput = document.createElement('input');
                                  tempInput.value = `${item.s3_link}`;
                                  document.body.appendChild(tempInput);
                                  tempInput.select();
                                  document.execCommand('copy');
                                  document.body.removeChild(tempInput);
      
                                  toast.success('Link copied to clipboard', {
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
                              }}
                            >
                              <IoShareSocial />
                            </button>
                          </div>
                        </div>
                      ))
                    }
    
                    {
                      selectedFilter.value === "LatestReports"  && 
                      <div ref={loading} className="flex justify-center items-center  md:mt-4">
                        <span className="relative flex h-[40px] w-[40px] md:h-[60px]  md:w-[60px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75" style={{ animationDuration: '1.2s' }}></span>
                        <span className="relative inline-flex rounded-full h-3 w-"></span>
                        </span>
                      </div>
                    }

                    <div className={`flex items-center justify-center text-lg font-bold text-gray-600
                      ${
                        reports.length > 0 && 'hidden'
                      }
                    `}>
                      {"No Reports Available."}
                    </div>
                      
                    <button className={`sticky bottom-14 lg:bottom-0 left-0 z-50 p-2 text-cyan-900
                      ${
                        reports.length === 0 && 'hidden'
                      }
                    `}
                      onClick={() => { 
                        var id1 = document.getElementById('top');
                            if (id1) {
                                id1.scrollIntoView({
                                    behavior: 'smooth',
                                    inline: 'nearest',
                                });
                            }
                        }}
                    >
                        <IoIosArrowDropup size={40}/>
                    </button>
                    </>)
                }
              </div>

            </div>

            <div className={`hidden md:flex flex-col gap-2
              ${
                isPDFFullscreen ? ('md:col-span-2 md:h-[85vh] lg:h-[88vh]'):('md:col-span-1')
              }
            `}>
              <div className='flex flex-row justify-between'>
                <div className='lg:text-lg mx-1 text-left font-semibold '>{pdfHeader}</div>
                <div className='flex items-center'>
                  <button className='flex items-center justify-center p-1 bg-[#133965] text-white rounded-md m-1'
                    onClick={()=>{
                      setIsPDFFullscreen(prev => !prev);
                    }}
                  >
                    {
                      isPDFFullscreen ? (<FaCompressAlt />):(<FaExpandAlt />)
                    }
                  </button>
                </div>
              </div>
              <iframe src={pfdLink} className='h-full w-full'></iframe>
            </div>

          </div>
        </div>
    </>
  )
}

export default BrokerReportPage
