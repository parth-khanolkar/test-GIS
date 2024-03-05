'use client'

import InfoModal from '@/components/Blogs/InfoModal';
import { useInfoContext } from '@/context/info';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

import { AiOutlineEye, AiOutlineRead } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { GoDotFill } from 'react-icons/go';
import Moment from 'react-moment';
import { FaRegComment } from 'react-icons/fa';
import { IoShareSocial } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useInView } from 'react-intersection-observer';
import { IoIosArrowDropup } from "react-icons/io";
import Head from 'next/head';


const BlogsPage = () => {
    const { uid,setUid } = useInfoContext();
    const mainDiv = useRef();

    const [ isLoading,setIsLoading ] = useState(true);
    const [ isInfoModalOpen,setIsInfoModalOpen ] = useState(false);
    const [ selectedCompany,setSelectedCompany ] = useState({ value: 0 ,label: "All" })
    const [ dropdownOptions,setDropdownOptions ] = useState([])
    
    const [storiesSort,setStoriesSort] = useState("Notes");
    const [latestList,setLatestList] = useState([]);
    const [filteredList,setFilteredList] = useState([]);

    const { ref:loading, inView:fetchLoader } = useInView(1);
    
    const [ counter,setCounter ] = useState(0);
    const [ sectorCreatedOn,setSectorCreatedOn ] = useState("");
    const [ isInfinteLoading,setIsInfinteLoading ] = useState(true);

    const openModal = () => {
        setIsInfoModalOpen(true);
      };
    
      const closeModal = () => {
        setIsInfoModalOpen(false);
      };


    function formatNumber(number) {
        if (number >= 10000000) {
          return (number / 10000000).toFixed(1) + ' Cr';
        } else if (number >= 100000) {
          return (number / 100000).toFixed(1) + ' L';
        } else if (number >= 1000) {
          return (number / 1000).toFixed(1) + ' K';
        } else {
          return number.toString();
        }
      }

    const sortListType = () => {
        setFilteredList(latestList.filter((item) => {
            if (storiesSort === "All") {
                return true; 
            } else if (storiesSort === "Notes") {
                return item.note_type === "Article"; 
            }
            return false;
        }));
    }
    useEffect(()=>{
        if(latestList){
            sortListType();
        }
    },[storiesSort,latestList])


      const getArticles = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gislanding/article-home`,{
                fincode:selectedCompany.value,
                counter:1,
                sector_created_on:""
            });

            setLatestList(response.data.latest_list);

            setFilteredList(response.data.latest_list.filter((item) => {
                if (storiesSort === "All") {
                    return true; 
                } else if (storiesSort === "Notes") {
                    return item.note_type === "Article"; 
                }
                return false;
            }));

            setDropdownOptions(response.data.dropdown_list);
            setIsLoading(false);
            setSectorCreatedOn(response.data.sector_created_on);

            setCounter(response.data.counter);
        } catch (error) {
            console.log("Error in getArticles:",error);
        }
    }
    useEffect(() => {
        getArticles();
    },[selectedCompany])


    const getNewArticles = async () => {
            try {
                const response = await axios.post(`https://transcriptanalyser.com/gislanding/article-home`,{
                    fincode:0,
                    counter:counter,
                    sector_created_on:sectorCreatedOn
                });
    
                setDropdownOptions(response.data.dropdown_list);
                setSectorCreatedOn(response.data.sector_created_on);
                setLatestList(prev => [...prev,...response.data.latest_list]);

                setCounter(response.data.counter);
            } catch (error) {
                console.log("Error in getNewArticles:",error);
            }

    }

    useEffect(()=>{
        fetchLoader && getNewArticles();
    },[fetchLoader]);

    

  return (
    <>
        <Head>
            <title>{"Blogs"}</title>
        </Head>
        <div ref={mainDiv} className='h-[calc(100vh-56px)] overflow-y-auto scrollbar-none'>

            <div className="hidden md:block mb-1 md:pl-8 py-4 text-red-700 text-4xl font-semibold">
                MARKET STORIES
            </div>
            <hr className="border-gray-600 mb-6 mx-8 hidden md:block" />

            {/* Mobile view */}
            <div className="flex items-center justify-center font-semibold py-1 mb-3 md:hidden border-b-4 border-red-700 bg-[#132842] text-white sticky top-0 z-10">
                MARKET STORIES
            </div>

            <div className='mx-4 md:mx-14 lg:mx-20 flex flex-row justify-between'>
                <div>
                    <Select
                        options={dropdownOptions}
                        value={selectedCompany}
                        onChange={(option) => {setSelectedCompany(option)}}
                        className='text-xs md:text-base w-44 md:w-80'
                        placeholder= "Select company..."
                    />
                </div>
                {/* <div className='flex flex-row '>
                    <button >
                        <Link  href={`/blogs/create-article/0`} className='flex flex-row bg-blue-900 hover:bg-blue-950 p-1 rounded shadow-sm text-white'>
                        <span className='p-0.5 pr-1.5 text-xs md:text-base'>
                            Write Article
                        </span>
                        <span className="text-white flex items-center ">
                            <CgAdd className="fill-current"/>
                        </span>
                        </Link>
                    </button>
                    <button className='flex items-center ml-2.5 md:ml-4'  onClick={openModal} title='Click for more info'>
                        <AiOutlineInfoCircle  />
                    </button>
                    
                </div> */}
            </div>
            
            <div className='mx-3 md:mx-16 lg:mx-28 mt-6'>
                {
                    isLoading ? (
                        <div className="flex justify-center items-center h-[60vh]">
                                <span className="relative flex h-[80px] w-[80px]">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-"></span>
                                </span>
                            </div>
                    ) :(<>
                        <div className='px-3 pb-0.5 border-b-2 mb-1'>
                            <div className='flex flex-row space-x-10'>
                                <button className={`text-base md:text-xl ${storiesSort === "All" ? ("text-red-600 underline underline-offset-8 font-semibold"):("text-zinc-500")}`}
                                    onClick={()=>{setStoriesSort("All")}}
                                >All</button>
                                <button className={`text-base md:text-xl whitespace-nowrap ${storiesSort === "Notes" ? ("text-red-600 underline underline-offset-8 font-semibold"):("text-zinc-500")}`}
                                    onClick={()=>{setStoriesSort("Notes")}}
                                >Market Stories</button>
                            </div>
                        </div>

                        <div className='md:h-[75vh] lg:h-[65vh] md:overflow-y-auto md:px-2'>
                            {filteredList?.map((item, index) => (<div key={index}>
                                {/* PC View */}
                                <div className='w-full hidden md:flex flex-row space-x-3 rounded-lg border shadow-md my-3 p-2 lg:px-3'>
                                    <div className='w-2/3 flex flex-col'>
                                        { item?.author_id === 0 ? (
                                            <>
                                            </>
                                        ):(
                                            <>
                                                <div className='flex flex-row text-xs md:text-sm px-2 mt-0.5 -ml-2'>
                                                    <Link
                                                    href={`/blogs/view-profile/${item?.author_id}`}
                                                    className='text-blue-900 hover:text-blue-600 font-semibold capitalize flex items-center justify-center'
                                                    >
                                                        {`${item?.author_name}`}
                                                    </Link>
                                                </div>
                                            </>
                                        )
                                        } 
                                        <div className="flex flex-col h-full">
                                            <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} className='flex flex-col mb-2 h-full'>
                                                <div className=''>
                                                    <span className='text-base md:text-lg lg:text-2xl font-semibold text-gray-900 line-clamp-1'>
                                                        {item?.Title}
                                                    </span>
                                                </div>
                                                <div className=''>
                                                    <span className='mt-2 lg:mt-4 text-gray-700 text-xs md:text-sm lg:text-lg line-clamp-3 lg:line-clamp-4'>
                                                        {item?.ShortDesc}
                                                    </span>
                                                </div>
                                            </Link>   
                                            {/* <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} className='h-full '>
                                            </Link>    */}



                                            <div className='mt-auto pt-0.5 flex flex-row justify-between'>
                                                <div className='flex items-center justify-center text-xs lg:text-sm whitespace-nowrap'>
                                                    <Moment format="MMM DD, YYYY">{item.NoteDate}</Moment>
                                                </div>
                                                <div className='flex items-center justify-center'>
                                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                                </div>
                                                <div className="flex items-center justify-center mb-2 sm:mb-0 md:px-2">
                                                    <AiOutlineRead className="mr-1 text-black text-xs lg:text-sm whitespace-nowrap" />
                                                    <p className="text-xs lg:text-sm whitespace-nowrap">{item?.TimeToRead} min read</p>
                                                </div>
                                                <div className='flex items-center justify-center'>
                                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                                </div>
                                                <div className="flex items-center justify-center mb-2 sm:mb-0 md:px-2">
                                                    <AiOutlineEye className="mr-1 text-black text-xs lg:text-sm whitespace-nowrap" />
                                                    <p className="text-xs lg:text-sm whitespace-nowrap">{formatNumber(item?.views)} views</p>
                                                </div>
                                                <div className='flex items-center justify-center'>
                                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                                </div>  
                                                <div className="flex items-center justify-center mb-2 sm:mb-0 md:px-2">
                                                    <FaRegComment className="mr-1 text-black text-xs lg:text-sm whitespace-nowrap" />
                                                    <p className="text-xs lg:text-sm whitespace-nowrap ">{formatNumber(item?.comment_views)} comments</p>
                                                </div>
                                                <div className='flex items-center justify-center'>
                                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <button className='flex flex-row items-center justify-center'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`${window.location.origin}/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`);
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
                                                        }}
                                                    >
                                                        <IoShareSocial className="mr-1 text-black text-xs lg:text-sm"/>
                                                        <p className="text-xs lg:text-sm whitespace-nowrap ">Share</p>
                                                    </button>
                                                </div>
                                            </div> 
                                        </div>  
                                    </div>
                                    <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} className='md:w-1/3 flex md:flex-none items-center justify-center'> 
                                        <img
                                            src={item?.img_url}
                                            alt="Picture of the author"
                                            className="w-auto lg:h-full rounded-lg"
                                        />
                                    </Link>
                                </div>              
                                
                                {/* Mobile View */}
                                <div className='md:hidden flex flex-col rounded-lg border-t shadow-md bg-white my-4 mx-2 md:mx-0 p-2'>
                                    <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} key={index} className='h-full cursor-pointer flex flex-col '>
                                        <div className='flex items-center justify-center'>
                                            <img
                                                src={item?.img_url}
                                                alt="Picture of the author"
                                                className="w-auto h-full rounded-lg "
                                            />
                                        </div>
                                        <div className=' line-clamp-2 text-justify font-semibold tracking-tighter mb-1.5 text-base md:text-sm lg:text-base'>
                                            {item.Title}
                                        </div>
                                        <div className='line-clamp-2 text-justify tracking-tighter md:tracking-tight lg:tracking-tighter text-sm md:text-xs lg:text-sm'>
                                            {item.ShortDesc}
                                        </div>
                                    </Link>
                                    { item?.author_id === 0 ? (
                                        <>
                                            
                                        </>
                                    ):(
                                        <>
                                            <div className='flex flex-row text-xs lg:text-sm px-2 mt-0.5 -ml-2'>
                                                <div className='flex items-center justify-center mr-1'><BiUserCircle /></div>
                                                <Link
                                                href={`/blogs/view-profile/${item?.author_id}`} 
                                                className='text-blue-900 hover:text-blue-600 font-semibold capitalize flex items-center justify-center'
                                                >
                                                    {`${item?.author_name}`}
                                                </Link>
                                            </div>
                                        </>
                                    )
                                    }
                                    <div className='w-full flex flex-row justify-between text-sm px-1 lg:px-0 mt-1'>
                                        <div className='flex flex-row space-x-3 md:space-x-2 lg:space-x-3 items-center'>
                                            <div className='text-xs lg:text-sm'>
                                            <Moment format="MMM DD, YYYY">{item.NoteDate}</Moment>
                                            </div>
                                            <div className='flex items-center justify-center'>
                                            <GoDotFill className='text-gray-400 text-sm'/>
                                            </div>
                                            <div className='flex flex-row items-center'>
                                            <AiOutlineRead className="mr-1 text-black text-base md:text-xl" /> <span className='text-xs lg:text-sm'>{item.TimeToRead} min</span>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='w-full mt-1.5 mb-3 grid grid-cols-3 '>
                                        <div className='px-5 py-0.5 lg:py-0.5 border rounded-l-md border-gray-300 flex items-center justify-center'>
                                        <AiOutlineEye className="mr-1 text-black text-base lg:text-xl" /><span className='text-sm md:text-xs lg:text-base whitespace-nowrap'>{formatNumber(item.views)}</span>
                                        </div>
                                        <div className='px-5 py-0.5 lg:py-0.5 border border-gray-300 flex items-center justify-center'>
                                        <FaRegComment className="mr-1 text-black text-base lg:text-xl" /><span className='text-sm md:text-xs lg:text-base whitespace-nowrap'>{formatNumber(item.comment_views)}</span>
                                        </div>
                                        <div className='px-5 py-0.5 lg:py-0.5 border rounded-r-md border-gray-300 flex items-center justify-center'>
                                        <button
                                            className='flex items-center justify-center'
                                            onClick={() => {
                                                if (navigator.clipboard) {
                                                navigator.clipboard.writeText(`${window.location.origin}/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`)
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
                                                tempInput.value = `${window.location.origin}/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`;
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
                                            <IoShareSocial className="mr-1 text-black text-base lg:text-xl"/>
                                            <span className='text-sm md:text-xs lg:text-base whitespace-nowrap'>Share</span>
                                        </button>

                                        </div>
                                        </div>

                                </div>
                            </div>))}


                            {
                                isInfinteLoading && selectedCompany.value === 0 &&
                                <div ref={loading} className="flex justify-center items-center  md:mt-4">
                                    <span className="relative flex h-[40px] w-[40px] md:h-[60px]  md:w-[60px]">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75" style={{ animationDuration: '1.2s' }}></span>
                                    <span className="relative inline-flex rounded-full h-3 w-"></span>
                                    </span>
                                </div>
                            }

                        </div>

                    </>)
                }
            </div>

            <button className='md:hidden sticky bottom-12 lg:bottom-0 lg:left-0 z-50 p-2 text-cyan-900' onClick={()=>{mainDiv?.current?.scrollTo(0, 0);}}>
                <IoIosArrowDropup size={40}/>
            </button>
        
        </div>
        <InfoModal isOpen={isInfoModalOpen} closeModal={closeModal} uid={uid}/>
    
    </>
      
  )
}

export default BlogsPage