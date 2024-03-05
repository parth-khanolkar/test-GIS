'ues client'

import { useInfoContext } from '@/context/info'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment';
import Select from "react-select";
import InterviewDetailModal from '@/components/News & Interviews/Interviews/InterviewDetailModal.jsx';
import { GoDotFill } from 'react-icons/go';
import { useWatchlistContext } from '@/context/WatchlistContext';

const Interviews = () => {
    const {uid,setUid} = useInfoContext();
    const { watchlistArray,setWatchlistArray,companyGraphModalRef,notificationCount,setNotificationCount } = useWatchlistContext();

    const [ selectedFilter,setSelectedFilter ] = useState({ value: 'LatestNews', label: 'Latest News' });
    const [ selectedCompany,setSelectedCompany ] = useState(null);
    const [ selectedWatchlist,setSelectedWatchlist ] = useState(null);

    const [searchInput, setSearchInput] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);

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
    
    const filterOptions = [
        { value: 'LatestNews', label: 'Latest News' },
        { value: 'WatchList', label: 'Watch List' },
        { value: 'CompanyNews', label: 'Company News' },
    ]

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

    const getInitialNews = async () => {
        try {
            const response = await axios.get('https://www.goindiastocks.in/api/service/GetManagementNewsList',{
                params: {
                    FilterType: 'LatestNews',
                    fincode: '',
                    ViewType: 'All',
                    Sector: '',
                    WatchListGroupId: 0,
                    count: 0,
                    interview_date: 0,
                    id: 0,
                    UserId: 0,
                },
            })
            
            setData(response.data.Data);
        } catch (error) {
            console.log("Error in getInitialNews:",error);
        }
    }
    useEffect(()=>{
        getInitialNews();
    },[])

    const getFilteredNews = async (FilterType,fincode,WatchListGroupId) => {
        try {
            const response = await axios.get('https://www.goindiastocks.in/api/service/GetManagementNewsList',{
                params: {
                    FilterType: FilterType,
                    fincode: fincode,
                    ViewType: 'All',
                    Sector: '',
                    WatchListGroupId: WatchListGroupId,
                    count: 0,
                    interview_date: 0,
                    id: 0,
                    UserId: uid === -1 ? (0):(uid),
                },
            })
            console.log("Response ===>",response.data);
            setData(response.data.Data);
        } catch (error) {
            console.log("Error in getInitialNews:",error);
        }
    }
    


  return (
    <>
        {/* FILTERS */}
        <div className='bg-white mb-5 py-2 px-2 lg:px-10 flex flex-col md:flex-row gap-2 md:space-x-5 '>
            {/* FILTER TYPE */}
            <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={(values) => {
                if(values.value === 'LatestNews'){
                    setSelectedCompany(null);
                    setSelectedWatchlist(null);
                    setSelectedFilter(values);
                    getInitialNews();
                } else {
                    setSelectedFilter(values);
                }
            }}
            className="text-xs md:text-base w-56 md:w-64"
            isSearchable={false}
            placeholder={'Select Company...'}
            />

            <div className='flex flex-row gap-2'>
                {/* COMPANY */}
                {
                    selectedFilter.value === 'CompanyNews' && 
                    <Select 
                        className="text-xs md:text-base w-44 md:w-64"
                        options={searchOptions}
                        onInputChange={(inp)=>{
                            setSearchInput(inp);
                        }}
                        placeholder='Search a Company...'
                        onChange={(values) => {
                            setSelectedFilter({ value: 'CompanyNews', label: 'Company News' });
                            setSelectedCompany(values);
                            setSelectedWatchlist(null);
                            getFilteredNews('CompanyNews',values.value,0);
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
                                getFilteredNews('WatchList','',option.WatchListGroupId);
                            }}
                            className="text-xs md:text-base w-44 md:w-64"
                            isSearchable={true}
                            placeholder={'Select Watchlist...'}
                        />
                    </>):(<></>)
                }
            </div>

        </div>
        
        {/* MAPPING DATA */}
        <div className='flex flex-col mx-2 md:mx-5 lg:mx-10 '>
            {
                data.map((item,index)=>(
                <div target='_blank' key={index} className='my-2 p-2 border border-gray-300 shadow-md hover:shadow-lg rounded-lg cursor-pointer'
                    onClick={()=>{
                        setVideoLink(item.news_link);
                        setTitle(item.description);
                        setInterviewId(item.id);
                        openModal();
                    }}
                >
                    <div className=' flex flex-row  space-x-3'>
                        <div className='w-[130px] h-[130px] flex items-center justify-center overflow-hidden'>
                            <img 
                            src={item.image_link}
                            alt={item.person}
                            className='object-cover  h-full bg-[#a99f95] rounded-md'
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
                            <div className='line-clamp-3 text-sm md:text-base mt-3 font-semibold'>
                                {item.description}
                            </div>
                        </div>
                    </div>
                </div>
                ))
            }
        </div>



        <InterviewDetailModal isOpen={isModalOpen} closeModal={closeModal} videoLink={videoLink} title={title} interviewId={interviewId}/>
    </>
  )
}

export default Interviews
