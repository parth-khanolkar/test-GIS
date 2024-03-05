"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { TwitterShareButton, TwitterIcon } from 'react-share';
import { AiOutlineHeart, AiFillHeart, AiOutlineEye, AiOutlineRead } from 'react-icons/ai';
import { BiComment, BiShareAlt, BiUserCircle } from 'react-icons/bi';
import Moment from 'react-moment';
import { GoDotFill } from 'react-icons/go';
import { FaRegComment } from 'react-icons/fa';
import { IoShareSocial } from 'react-icons/io5';
import { toast } from 'react-toastify';


const RelatedStories = ({ reco_list,note_id }) => {
  
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

  return (<>
      <div className={`mx-2 md:mx-0 md:mr-1.5 lg:mr-4 flex flex-col gap-1.5 md:gap-3 scrollbar-none md:scrollbar-default`}>
        {reco_list?.map((item, index) => (
            <React.Fragment key={index}>
                {/* PC VIEW */}
                <div className={`w-full flex-row space-x-3 rounded-lg border shadow-md my-3 p-2 lg:px-3 bg-white
                    ${
                        item.note_id === note_id ? ('hidden'):('hidden md:flex')
                    }
                `}>
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
                            <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} className='flex flex-col mb-2 '>
                                <div className=''>
                                    <span className='text-base md:text-lg lg::text-xl font-semibold text-gray-900 line-clamp-1'>
                                        {item?.Title}
                                    </span>
                                </div>
                                <div className=''>
                                    <span className='mt-2 lg:mt-3 text-gray-700 text-xs md:text-sm lg:text-base line-clamp-3 lg:line-clamp-4'>
                                        {item?.ShortDesc}
                                    </span>
                                </div>
                            </Link>   
                            <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} className='h-full '>
                            </Link>   



                            <div className='mt-auto pt-0.5 flex flex-row justify-between'>
                                <div className='flex items-center justify-center text-xs lg:text-sm whitespace-nowrap'>
                                    <Moment format="MMM DD, YYYY">{item.NoteDate}</Moment>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                </div>
                                <div className="flex items-center justify-center lg:px-2">
                                    <AiOutlineRead className="mr-1 text-black text-xs lg:text-sm whitespace-nowrap" />
                                    <p className="text-xs lg:text-sm whitespace-nowrap">{item?.TimeToRead} min 
                                    <span className='hidden lg:inline-block lg:ml-1'>{"read"}</span>
                                    </p>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                </div>
                                <div className="flex items-center justify-center lg:px-2">
                                    <AiOutlineEye className="mr-1 text-black text-xs lg:text-sm whitespace-nowrap" />
                                    <p className="text-xs lg:text-sm whitespace-nowrap">{formatNumber(item?.views)} views</p>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <GoDotFill className='text-gray-400 text-[8px]'/>
                                </div>  
                                <div className="flex items-center justify-center lg:px-2">
                                    <FaRegComment className="mr-1 text-black text-xs lg:text-sm whitespace-nowrap" />
                                    <p className="text-xs lg:text-sm whitespace-nowrap ">{formatNumber(item?.comment_views)}
                                     <span className='hidden lg:inline-block lg:ml-1'>{"comments"}</span>
                                     </p>
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

                {/* MOBILE VIEW */}
                <div key={index} className={`md:hidden flex flex-col rounded-lg border-t shadow-md bg-white my-4 mx-2 md:mx-0 p-2
                    ${
                        item.note_id === note_id ? ('hidden'):('')
                    }
                `}>
                    <Link href={`/blogs/insights?type=${item?.note_type}&id=${item?.note_id}`} key={index} className='h-full cursor-pointer flex flex-col justify-between '>
                        <div className='flex items-center justify-center '>
                            <img
                                src={item?.img_url}
                                alt="Picture of the author"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div>
                        <div className=' line-clamp-2 text-justify font-semibold tracking-tighter mb-1.5 text-base md:text-sm lg:text-base'>
                            {item.Title}
                        </div>
                        <div className='line-clamp-2 text-justify tracking-tighter md:tracking-tight lg:tracking-tighter text-sm md:text-xs lg:text-sm'>
                            {item.ShortDesc}
                        </div>
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

                        {/* <div className='text-xs lg:text-sm flex items-center'>
                            <div className={`px-3 py-1 lg:py-0.5  rounded-2xl text-white 
                                ${
                                item?.note_type === 'Article' ? ' bg-red-500' : 
                                `${
                                item?.note_type === 'Blog' ? ' bg-blue-900':'  bg-yellow-500'}`
                            }
                            `}>
                            {item.note_type}
                            </div>
                        </div> */}
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
            
            </React.Fragment>

          
        ))}
      </div>
      
  </> 
  );
};

export default RelatedStories;
