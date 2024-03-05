'use client'

import FilterComponent from '@/components/CustomScreener/FilterComponent'
import { useCustomScreenerContext } from '@/context/CustomScreenerContext'
import { useInfoContext } from '@/context/info'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiDownload } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'
import { LuSettings } from 'react-icons/lu'

const DeatiledScreenerPage = () => {
    const { uid } = useInfoContext();
    const { screenerAddedFilters,setScreenerAddedFilters } = useCustomScreenerContext();  
    const router = useRouter();
    const { screener_id } = router.query;

    const [ isSideFilterOpen,setIsSideFilterOpen ] = useState(false);

    const [ screenerInfo,setScreenerInfo ] = useState();
    const [ screenerTags,setScreenerTags ] = useState();

    const closeSideFilter = () => {
        setIsSideFilterOpen(false);
    }
    

    const getScreenerDetail = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/screener/fetch_sc_detail`,{
                screener_id: screener_id,
                user_id: "10463",
                user_id: uid,
            });

            setScreenerInfo(response.data?.scinfo);
            setScreenerTags(response.data?.sctags);
            setScreenerAddedFilters(response.data?.scfilter);

        } catch (error) {
            console.log("Error in getScreenerDetail: ",error);
        }
    }
    useEffect(()=>{
        if(screener_id){
            getScreenerDetail();
        }
    },[screener_id]);

  return (
    <>
        <div className='h-[calc(100vh-80px)] overflow-x-hidden overflow-y-auto scrollbar-none lg:scrollbar bg-white p-2 lg:px-4'>
            <div className='flex justify-between'>
                <div className='font-bold text-xl md:text-2xl text-[#093967]'>
                    {screenerInfo?.name}
                </div>
                <button className='flex items-center justify-center md:mr-2 text-lg md:text-2xl'>
                    <LuSettings />
                </button>
            </div>
            <div className='mt-1 mb-2 text-xs text-justify md:text-sm lg:text-base'>
                {screenerInfo?.description} 
            </div>
            <div className='flex flex-wrap flex-row gap-2 text-sm md:text-base'>
                {"by"} <span className='text-red-600 capitalize font-semibold'>{screenerInfo?.username}</span>
                {
                    screenerTags?.map((item,index) => (
                        <div key={index} className='md:px-2 px-1 py-0.5 bg-[#E7F3FF] text-[#093967] font-semibold rounded-sm text-[11px] md:text-sm'>
                            {item?.name}
                        </div>
                    ))
                }
            </div>

            <hr className='w-full border-t border-black my-2'/>

            <div className='flex flex-row justify-between md:mx-4'>
                <div>

                </div>
                <div className='flex flex-row gap-2 md:gap-5'>
                    <button className='text-[#083966]'
                        onClick={()=>{setIsSideFilterOpen(prev => !prev)}}
                    >
                        <FaFilter size={18} />
                    </button>
                    <button className='text-[#083966]'
                        onClick={()=>{}}
                    >
                        <BiDownload size={25} />
                    </button>
                </div>
            </div>
            

        </div>
    
        <FilterComponent isOpen={isSideFilterOpen} closeSideFilter={closeSideFilter} />
    </>
  )
}

export default DeatiledScreenerPage

DeatiledScreenerPage.requireAuth = true;