"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useInfoContext } from '@/context/info';
import { useWatchlistContext } from '@/context/WatchlistContext';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useCustomScreenerContext } from '@/context/CustomScreenerContext';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Accordion from './Accordion';



const FilterModal = ({ isOpen, closeModal }) => {
    const { uid,setUid } = useInfoContext();
    const { screenerAddedFilters,setScreenerAddedFilters,isApplyButtonDisabled,setIsApplyButtonDisabled,screenerFilterOptions,setScreenerFilterOptions,extraOptionsDropdowns, setExtraOptionsDropdowns } = useCustomScreenerContext();

    const router = useRouter();
    const { screener_id } = router.query;

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [openIndex, setOpenIndex] = useState(null);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '90%' : '83%',
                maxHeight: isMobile ? '90%' : '83%',
                width: isMobile ? '85%' : '60%',
                maxWidth: isMobile ? '100%' : '60%',
                margin: 'auto',
                backgroundColor: 'rgba(249, 249, 249, 1)',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: isMobile ? -20:0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 999,
            },
        };
    };

    const getFilters = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/screener/get_filter`,{
                screener_id:screener_id
            });

            setScreenerFilterOptions(response.data?.data);
            setExtraOptionsDropdowns({
                quaters: response.data?.quaters.map(quarter => ({
                    label: quarter,
                    value: quarter
                })),
                year: response.data?.year.map(y => ({
                    label: y,
                    value: y
                })),
                cagr: response.data?.cagr.map(c => ({
                    label: c,
                    value: c
                })),
                cagr_q: response.data?.cagr_q.map(cq => ({
                    label: cq,
                    value: cq
                })),
                
            });

        } catch (error) {
            console.log("Error in getFilters: ",error);
        }
    }
    useEffect(()=>{
        if(screener_id){
            getFilters();
        }
    },[screener_id]);
    
  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Filter Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-col w-full h-full text-black'>
                <div className='flex flex-row justify-between'>
                    <div className='text-2xl font-semibold '>
                        {"Screener Filters"}
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>  

                <hr  className='border-t border-black w-full mt-2'/>     

                <div className='grid grid-cols-1 lg:grid-cols-2 h-full border-b border-r border-l border-black'>
                    <div className='col-span-1 flex flex-col lg:border-r border-black bg-[#f1f7ff] p-2'>
                        <div className='font-semibold text'>
                            {"Search Criteria"}
                        </div>
                        <input type="text" className='my-1 border border-gray-400'/>
                        <div className='h-[25vh] md:h-[33vh] lg:h-[60vh] overflow-y-auto scrollbar-none border border-gray-400'>
                            {
                                screenerFilterOptions?.map((filter,index)=>(
                                    <Accordion
                                        key={index}
                                        filter={filter}
                                        index={filter.filter_id}
                                        openIndex={openIndex}
                                        setOpenIndex={setOpenIndex}
                                        isAdded={false}
                                    />
                                ))
                            }
                            
                        </div>
                    </div>
                    <div className='col-span-1 flex flex-col p-2 relative'>
                        <div className='font-semibold text'>
                            {`Filters Applied (${screenerAddedFilters.length})`}
                        </div>

                        <div className='h-[25vh] md:h-[30vh] lg:h-[61vh] mt-1 overflow-y-auto scrollbar-none border border-gray-400'>
                            {
                                screenerAddedFilters?.map((filter,index)=>(
                                    <Accordion
                                        key={index}
                                        filter={filter}
                                        // index={index + screenerFilterOptions.length}
                                        index={filter.filter_id}
                                        openIndex={openIndex}
                                        setOpenIndex={setOpenIndex}
                                        isAdded={true}
                                    />
                                ))
                            }                            
                        </div>
                        
                        <div className='w-full absolute bottom-0 right-0 justify-end px-2 py-0.5 md:py-1 flex flex-row space-x-2 bg-[#f9f9f9]'>
                            <button className='px-3 py-0.5 rounded-md text-xs md:text-sm lg:text-base bg-red-800 text-white'
                                onClick={()=>{
                                    closeModal();
                                }}
                            >
                                {"Cancel"}
                            </button>
                            <button disabled={isApplyButtonDisabled} className='px-3 py-0.5 rounded-md text-xs md:text-sm lg:text-base disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-[#143B64] text-white'
                                onClick={()=>{
                                    setIsApplyButtonDisabled(true);
                                }}
                            >
                                {"Apply"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>       
        </ReactModal>
      
    </>
  )
}

export default FilterModal
