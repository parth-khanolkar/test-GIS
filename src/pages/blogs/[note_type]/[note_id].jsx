"use client"
import React,{ useState,useEffect } from 'react'
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from 'axios'

import DetailedArticle from '@/components/Blogs/DetailedArticle';
// import RecommendedStories from '@/components/Blogs/RecommendedStories';
// import DisqusComment from '@/components/Blogs/DisqusComment';
import Head from 'next/head'

import { AiOutlineEye, AiOutlineHome, AiOutlineRead } from "react-icons/ai";
import { BiComment, BiArrowBack, BiUserCircle } from "react-icons/bi";
import { useInfoContext } from '@/context/info';
import { FaRegComment } from 'react-icons/fa';
import RelatedStories from '@/components/Blogs/RelatedStories';
import { GoDotFill } from 'react-icons/go';
import Footer from '@/components/Footer';
import { IoShareSocial } from 'react-icons/io5';
import { toast } from 'react-toastify';
import MainCommentsComponent from '@/components/Blogs/Comments/MainCommentsComponent';
import { IoIosArrowDropup } from "react-icons/io";


const Detail = () => {
    const [articleDetails,setArticleDetails] = useState(null);
    const [relatedList,setRelatedList] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const router = useRouter();
    const { note_type, note_id } = router.query;

    const { uid,setUid } = useInfoContext();

    const fetchData = async () => {
        setIsLoading(true);
      try {
        const response = await axios.post('https://transcriptanalyser.com/gislanding/article-detail', {
          note_id,
          note_type
        });

        setArticleDetails(response.data?.article_detail);
        setRelatedList(response.data?.related_list);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
     
    useEffect(() => {
        if(note_id && note_type){
            fetchData();
        }
    
      }, [note_id,note_type]);

    const closeComments = () => {
        setIsCommentsOpen(false);
    }
    const openComments = () => {
        setIsCommentsOpen(true);
    }
    const toggleComments = () => {
        setIsCommentsOpen(prev=> !prev);
    }


  return (
    <>
    <Head>
        <title>{articleDetails?.Title}</title>
    </Head>
    <div className='bg-white overflow-x-hidden h-[calc(100vh-56px)] overflow-y-auto scrollbar-none min-w-full'>
    <div id='top'></div>

        <MainCommentsComponent isCommentsOpen={isCommentsOpen} closeComments={closeComments}  openComments={openComments} note_id={note_id} note_type={note_type}/>

        <div className="hidden md:block mb-1 md:pl-8 py-4 text-red-700 text-4xl font-semibold">
            MARKET STORIES
        </div>
        <hr className="border-gray-600 mb-6 mx-8 hidden md:block" />

        {/* Mobile view */}
        <div className="flex items-center justify-center font-semibold py-1 mb-3 md:hidden border-b-4 border-red-700 bg-[#132842] text-white sticky top-0 z-10">
            MARKET STORIES
        </div>
        
        

        {
            isLoading ? (<>
                <div className="flex justify-center items-center h-[60vh]">
                    <span className="relative flex h-[80px] w-[80px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-"></span>
                    </span>
                </div>
            </>):(<>
                <div className=' flex flex-col mx-1 md:mx-5 md:mt-6'>
                    <div className='w-full flex flex-col lg:pr-2 border-gray-300'>
                        <div className='md:px-3 lg:px-5 md:mx-16 lg:mx-48 flex flex-row'>
                            <Link href={'/blogs'} className='md:flex items-center hidden'>
                                <BiArrowBack className='text-xl lg:text-2xl'/>
                            </Link>
                            <div className='text-xl lg:text-3xl flex justify-center items-center text-center w-full lg:flex-none px-2 md:mx-0 font-serif font-semibold lg:font-normal '>
                                {articleDetails?.Title}
                            </div>

                        </div>
                        {/* META DATA PC VIEW */}
                        <div className="md:px-3 lg:px-5 md:mx-20 lg:mx-56 md:flex flex-row my-3 p-1 py-2 justify-between hidden border-t border-b border-[#B7B7B7] ">
                            <div className="text-sm text-blue-600 flex items-center justify-center">
                                {articleDetails?.NoteDate}
                            </div>  
                            <div className='flex items-center justify-center'>
                            <GoDotFill className='text-gray-400 text-[8px]'/>
                            </div>
                            <div className='flex flex-row justify-center items-center'>
                                <AiOutlineRead className="ml-2 text-black w-5 h-5" />
                                <span className="text-sm ml-2 font-semibold">
                                    {articleDetails?.TimeToRead} min read
                                </span>
                            </div>
                            <div className='flex items-center justify-center'>
                            <GoDotFill className='text-gray-400 text-[8px]'/>
                            </div>
                            <div className='flex flex-row justify-center items-center'>
                                <AiOutlineEye className="text-black w-5 h-5" />
                                <span className="text-sm ml-2 font-semibold">{articleDetails?.views} views</span>
                            </div>
                            <div className='flex items-center justify-center'>
                            <GoDotFill className='text-gray-400 text-[8px]'/>
                            </div>
                            <button className='flex flex-row items-center justify-center '
                                onClick={()=>{toggleComments()}}
                            >
                                <div className='flex items-center justify-center'>
                                    <FaRegComment className="text-black w-5 h-5 " />
                                </div>
                                <div className="text-sm ml-2 font-semibold">Comments</div>
                            </button>
                            <div className='flex items-center justify-center'>
                            <GoDotFill className='text-gray-400 text-[8px]'/>
                            </div>
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
                                <IoShareSocial className='w-5 h-5'/> <span className='text-sm ml-2 font-semibold'>Share</span>
                            </button>                            
                        </div>

                        {/* META DATA MOBILE VIEW */}
                        <div className='md:hidden flex flex-col p-1 px-3'>
                            {/* <div className='flex flex-row justify-end'>
                                <div className='flex flex-row justify-between space-x-4 md:space-x-10'>
                                    
                                </div>
                            </div> */}

                            <div className='flex flex-row justify-between w-full border-t border-b border-black p-1 py-2 my-3'>
                                <div className=" text-[10px] md:text-sm text-blue-600 flex items-center justify-center">
                                    {articleDetails?.NoteDate}
                                </div>
                                
                                <div className='flex flex-row justify-center items-center'>
                                    <AiOutlineEye className="text-black w-3.5 h-4.5 md:w-5 md:h-5" />
                                    <span className=" text-[10px] md:text-sm ml-2 font-semibold">{articleDetails?.views} views</span>
                                </div>
                                
                                <button className='flex flex-row items-center justify-center '
                                    onClick={()=>{toggleComments()}}
                                >
                                    <div className='flex items-center justify-center'>
                                        <FaRegComment className="text-black w-3.5 h-4.5 md:w-5 md:h-5 " />
                                    </div>
                                    <div className=" text-[10px] md:text-sm ml-2 font-semibold">Comments</div>
                                </button>
                                <button className='flex flex-row items-center justify-center'
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
                                        <IoShareSocial className='text-black w-3.5 h-4.5 md:w-5 md:h-5'/> 
                                        <span className='text-xs ml-2 font-semibold'>Share</span>
                                    </button>
                            </div>
                        </div>

                        <div className=' bg-white'>
                            <DetailedArticle article_detail={articleDetails} />
                        </div>


                    </div>
                    {
                        (relatedList.length > 1 || (relatedList.length === 1 && relatedList[0]?.note_id !== articleDetails.note_id)) && <div className='flex flex-col mt-5'>
                            <div className='text-base md:text-xl mb-2 text-red-700 font-semibold whitespace-nowrap mx-0.5 md:mx-10 lg:mx-72'>
                                RELATED STORIES
                            </div>

                            <div className='mx-0.5 md:mx-10 lg:mx-72'>
                                <RelatedStories reco_list={relatedList} note_id={articleDetails.note_id}/>
                            </div>
                        </div>
                    }

                </div>
            </>)
        }
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
        <Footer/>
    </div>    
    
    </>
  )
}

export default Detail
