'use client'

import Link from 'next/link';
import React from 'react'
import { IoShareSocial } from 'react-icons/io5';
import Moment from 'react-moment';
import { toast } from 'react-toastify';

const News = ({ newsArray }) => {
  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-4 px-1 md:px-8 md:mx-10 gap-4  scrollbar-none md:scrollbar-thin">
            {newsArray?.map((item, index) => (<>
                <div key={index} className='bg-white drop-shadow-md rounded-lg md:text-base p-2.5 md:p-3.5 px-3 md:px-5 flex flex-col border justify-between'>
                    <Link href={item?.news_link} className='cursor-pointer' target="_blank">
                        <div className=" font-semibold text-base md:text-lg   line-clamp-2   text-sky-800 font-serif">
                            {item?.title}
                        </div>
                        <div className='my-2 md:my-3 text-sm text-justify '>
                            <span className='line-clamp-4 font-serif'>
                                {item?.synopsis}
                            </span>
                        </div>
                    </Link>
                    <Link href={item?.news_link} className='h-full' target="_blank">
                    </Link>
                    <div className='flex flex-row mt-2 md:mt-4 text-xs'>
                        <div className='text-blue-500'>
                            <Moment fromNow>{item?.DateInserted}</Moment>
                        </div>
                        <div className='ml-3.5'>
                            {`- ${item?.source}`} 
                        </div>
                        <div className='ml-auto'>
                        <button className='flex flex-row items-center justify-center'
                                onClick={() => {
                                        if (navigator.clipboard) {
                                        navigator.clipboard.writeText(`${item?.news_link}`)
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
                                        tempInput.value = `${item?.news_link}`;
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
                                <IoShareSocial className="mr-1 text-black text-base"/> 
                                <span className='text-xs md:text-sm whitespace-nowrap'>Share</span>
                            </button>
                        </div>
                    </div>
                </div>


            </>))}
        </div>
    </>
  )
}

export default News
