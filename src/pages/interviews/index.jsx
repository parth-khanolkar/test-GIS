'ues client'

import { useInfoContext } from '@/context/info'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment';
import Select from "react-select";
import InterviewDetailModal from '@/components/News & Interviews/Interviews/InterviewDetailModal.jsx';
import { GoDotFill } from 'react-icons/go';
import { useWatchlistContext } from '@/context/WatchlistContext';
import { useInView } from 'react-intersection-observer';
import { IoIosArrowDropup } from "react-icons/io";
import Link from 'next/link';


const Interviews = () => {
    const {uid,setUid} = useInfoContext();
    const { watchlistArray,setWatchlistArray,companyGraphModalRef,notificationCount,setNotificationCount } = useWatchlistContext();

    const { ref:loading, inView:fetchLoader } = useInView(1);

    const [ selectedFilter,setSelectedFilter ] = useState({ value: 'LatestInterviews', label: 'Latest Interviews' });
    const [ selectedCompany,setSelectedCompany ] = useState(null);
    const [ selectedWatchlist,setSelectedWatchlist ] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);

    const [counter,setCounter] = useState(1);
    const [data,setData] = useState([]);

    const [interviewId,setInterviewId] = useState(0);
    const [videoLink,setVideoLink] = useState('');
    const [title,setTitle] = useState('');
    const [isModalOpen,setIsModalOpen] = useState(false);

    const fetchWatchlistDropdown = async () => {
        try {
            const response = await fetch('https://transcriptanalyser.com/watchlists/user_watchlist', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data[0]) {
                    // setWatchlist(data.data[0]);
                } 
                setWatchlistArray(data.data);
                setNotificationCount(data.notification_count);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if(uid !== -1 && watchlistArray.length === 0){
            fetchWatchlistDropdown();
        }
    }, [uid]);
    
    const [ filterOptions,setFilterOptions ] = useState([
        { value: 'LatestInterviews', label: 'Latest Interviews' },
        { value: 'CompanyInterviews', label: 'Company Interviews' },
    ]);
    useEffect(()=>{
        if(uid !== -1){
            setFilterOptions([
                { value: 'LatestInterviews', label: 'Latest Interviews' },
                { value: 'CompanyInterviews', label: 'Company Interviews' },
                { value: 'WatchList', label: 'Watch List' },
            ])
        }
    },[uid]);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }
    
    const fetchCompanyDropdown = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/goindiastock/company_search`,{
          searchtxt: searchInput,
      });
  
            setSearchOptions(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };
      useEffect(() => {
        fetchCompanyDropdown();
      }, [searchInput]);

    const getInitialInterviews = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/interview/interview_home',{
                fincode : 0,
                watchlist_id : 0,
                user_id : 0,
                counter : counter
            })
            
            if(counter === 1 && response.status === 200){
                setData(response.data.Data);
            }   else if (counter > 1 && response.status === 200){
                setData(prev => [...prev,...response.data.Data]);
            }
            
            if(response.status === 200){
                setCounter(prev => prev+1);
            }

        } catch (error) {
            console.log("Error in getInitialInterviews:",error);
        }
    }
    useEffect(()=>{
        getInitialInterviews();
    },[])

    useEffect(()=>{
        fetchLoader && getInitialInterviews();
    },[fetchLoader]);

    const getFilteredInterviews = async (FilterType,fincode,WatchListGroupId) => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/interview/interview_home',{
                fincode : fincode,
                watchlist_id : WatchListGroupId,
                user_id : uid === -1 ? (0):(uid),
                counter : 1
            })
            
            setData(response.data.Data);
        } catch (error) {
            console.log("Error in getInitialInterviews:",error);
        }
    }
    


  return (
    <>
        <div className='h-[calc(100vh-80px)] bg-white  overflow-y-auto scrollbar-none lg:scrollbar'>
            <div id='top'></div>
            
            {/* FILTERS */}
            <div className='pt-2 md:pb-1 px-2 lg:px-10 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5 sticky top-0 bg-white'>
                {/* FILTER TYPE */}
                <Select
                options={filterOptions}
                value={selectedFilter}
                onChange={(values) => {
                    if(values.value === 'LatestInterviews'){
                        setSelectedCompany(null);
                        setSelectedWatchlist(null);
                        setSelectedFilter(values);
                        getInitialInterviews();
                    } else {
                        setCounter(1);
                        setSelectedFilter(values);
                    }
                }}
                className="text-xs md:text-base w-56 md:w-64"
                isSearchable={false}
                placeholder={'Select Company...'}
                />

                <div className='pb-1'>
                    {/* COMPANY */}
                    {
                        selectedFilter.value === 'CompanyInterviews' && 
                        <Select 
                            className="text-xs md:text-base w-52 md:w-64"
                            options={searchOptions}
                            onInputChange={(inp)=>{
                                setSearchInput(inp);
                            }}
                            placeholder='Search a Company...'
                            onChange={(values) => {
                                setSelectedFilter({ value: 'CompanyInterviews', label: 'Company Interviews' });
                                setSelectedCompany(values);
                                setSelectedWatchlist(null);
                                getFilteredInterviews('CompanyInterviews',values.value,0);
                                var id1 = document.getElementById('top');
                                if (id1) {
                                    id1.scrollIntoView({
                                        behavior: 'smooth',
                                        inline: 'nearest',
                                    });
                                }
                            }}
                        />
                    }

                    {/* WATCHLIST */}
                    {
                        (uid !== -1 && selectedFilter.value === 'WatchList') ? (<>
                            <Select
                                options={watchlistArray}
                                value={selectedWatchlist}
                                getOptionLabel={(option) => option.WatchGroupName}
                                getOptionValue={(option) => option.WatchListGroupId}
                                onChange={(option) => {
                                    setSelectedFilter({ value: 'WatchList', label: 'Watch List' });
                                    setSelectedCompany(null);
                                    setSelectedWatchlist(option);
                                    getFilteredInterviews('WatchList',0,option.WatchListGroupId);
                                    var id1 = document.getElementById('top');
                                    if (id1) {
                                        id1.scrollIntoView({
                                            behavior: 'smooth',
                                            inline: 'nearest',
                                        });
                                    }
                                }}
                                className="text-xs md:text-base w-52 md:w-64"
                                isSearchable={true}
                                placeholder={'Select Watchlist...'}
                            />
                        </>):(<></>)
                    }
                </div>

            </div>
            

            {/* MAPPING DATA */}
            <div className='flex flex-col mx-2 md:mx-5 lg:mx-10 mt-5'>
                {
                    data.map((item,index)=>(
                        <Link href={`/interviews/${item.id}`} key={index} className='my-2 p-2 border border-gray-300 shadow-md hover:shadow-lg rounded-lg cursor-pointer'
                            // onClick={()=>{
                            //     setVideoLink(item.news_link);
                            //     setTitle(item.description);
                            //     setInterviewId(item.id);
                            //     openModal();
                            // }}
                        >
                            <div className='flex flex-col lg:flex-row gap-1'>
                                <div className='lg:w-1/2 flex flex-col '>
                                    <div className='flex flex-row space-x-3'>
                                        <div className='lg:w-[90px] h-[70px] lg:h-[90px] flex items-center justify-center overflow-hidden'>
                                            <img 
                                            src={item.image_link}
                                            alt={item.person}
                                            className='object-cover w-auto h-full bg-[#a99f95] rounded-md'
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className=' text-cyan-900 font-semibold text-[16px] md:text-xl whitespace-normal '>
                                                {item.person}
                                            </div>
                                            <div className=' flex flex-row gap-2 whitespace-normal'>
                                                <div className='text-rose-600  font-semibold text-[16px] md:text-xl'>
                                                    {item.company}
                                                </div>
                                                <div className='flex items-center justify-center'>
                                                    <GoDotFill className='text-gray-400 text-[7px]'/>
                                                </div>
                                                <div className='text-gray-500 flex items-center justify-center text-sm'>
                                                    <Moment format="DD MMM 'YY">{item.interview_date}</Moment>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='line-clamp-3 text-sm md:text-base mt-3 font-semibold'>
                                        {item.description}
                                    </div>
                                </div>
                                <div className='lg:w-1/2 bg-[#EAF4FF] p-2 lg:p-6'>
                                    <div className=' overflow-hidden'>
                                        {
                                            item?.summary.slice(0, 3).map((para, index) => (
                                                <div key={index} className='mb-0.5 text-xs text-justify'>
                                                    {para}
                                                </div>
                                            ))
                                        }

                                        <div className='mb-0.5 text-xs text-justify'>
                                            {"...more"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
                    {
                        selectedFilter.value === 'LatestInterviews' && <div ref={loading} className="flex justify-center items-center  md:mt-4">
                        <span className="relative flex h-[40px] w-[40px] md:h-[60px]  md:w-[60px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75" style={{ animationDuration: '1.2s' }}></span>
                        <span className="relative inline-flex rounded-full h-3 w-"></span>
                        </span>
                    </div>
                    }
            </div>

            <button className='fixed bottom-5 lg:bottom-0 right-0 z-50 p-2 text-cyan-900'
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
                <IoIosArrowDropup size={40} />
            </button>
        </div>

        {/* <InterviewDetailModal isOpen={isModalOpen} closeModal={closeModal} videoLink={videoLink} title={title} interviewId={interviewId}/> */}
    </>
  )
}

export default Interviews
