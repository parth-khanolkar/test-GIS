import React, { useRef,useState,useEffect } from 'react'
import Image from 'next/image'

import blogImage from '@/assets/images/landingPageIcons/blog.png'
import bulkBlockImage from '@/assets/images/landingPageIcons/bulk_block.png'
import earningsImage from '@/assets/images/landingPageIcons/earnings.png'
import eventsImage from '@/assets/images/landingPageIcons/events.png'
import marketImage from '@/assets/images/landingPageIcons/market.png'
import newsImage from '@/assets/images/landingPageIcons/news.png'
import sectorImage from '@/assets/images/landingPageIcons/sector.png'
import watchlistImage from '@/assets/images/landingPageIcons/watchlist.png'
import homeImage from '@/assets/images/landingPageIcons/home.png'
import Link from 'next/link'
import { useRouter } from 'next/router'


const SideBar = ({ isOpen }) => {
    const router = useRouter();
    const sidebarRef = useRef();

    const topOptionsSideBar = [
        {
            Option : "Home",
            link : "/",
            image : homeImage,

        },
        {
            Option : "Sector",
            link : "#",
            image : sectorImage,

        },
        {
            Option : "Market",
            link : "#",
            image : marketImage,

        },
        {
            Option : "Earnings",
            link : "#",
            image : earningsImage,

        },
        {
            Option : "Bulk/Block",
            link : "/bulk-block",
            image : bulkBlockImage,

        },
        {
            Option : "Watchlist",
            link : "/watchlist",
            image : watchlistImage,

        },
        {
            Option : "Events",
            link : "#",
            image : eventsImage,

        },
        {
            Option : "News",
            link : "#",
            image : newsImage,

        },
        {
            Option : "Blog",
            link : "#",
            image : blogImage,

        },
    ]

  return (
    <>
        {
            // isOpen ? (<>
                <div ref={sidebarRef} className={`z-100 w-[48vw] md:w-[30vw] lg:w-[18vw] fixed left-0  h-screen bg-indigo-50 flex  ease-in-out duration-500 transform ${
                    isOpen ? "translate-x-0 " : "-translate-x-full"}`}>
                    <div className='w-full flex flex-col items-start justify-start'>
                        {
                            topOptionsSideBar.map((item,index)=>(
                                <Link href={item.link} key={index} className={`w-full flex flex-row pl-8 md:pl-14 py-3.5 space-x-4 hover:bg-sky-950 hover:text-white cursor-pointer
                                ${
                                    router.pathname === item.link ? ("bg-sky-950 text-white"):("")   
                                }
                                `}>
                                    <Image
                                    src={item.image}
                                    alt={item.Option}
                                    className='w-[20px] h-[20px] md:w-[28px] md:h-[28px]'
                                    />
                                    <span>
                                        {item.Option}
                                    </span>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            // </>):(<></>)
        }
       
    </>
  )
}

export default SideBar
