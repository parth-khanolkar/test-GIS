'use client'


import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useInfoContext } from '@/context/info';
import Slider from './Slider/Slider';
import { useBulkBlockContext } from '@/context/BulkBlockContext';
import Select from 'react-select';

const FilterModal = ({ isOpen, closeModal, sectorList, starHoldersList }) => {
    const { uid } = useInfoContext();
    const { minMCapVal, setMinMCapVal,maxMCapVal, setMaxMCapVal,sectorFilter,setSectorFilter,starHolderFilter,setStarHolderFilter,bulkBlockFilter,setBULKBLOCKFilter,applyFilter,setApplyFilter } = useBulkBlockContext();


    const [isMobile, setIsMobile] = useState(false);
    const formattedSectorList = sectorList.map((item) => (
        item !== null ? { label: item, value: item } : null
      )).filter(Boolean);
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '60%' : '50%',
                maxHeight: isMobile ? '60%' : '50%',
                width: isMobile ? '83%' : '60%',
                maxWidth: isMobile ? '83%' : '60%',
                margin: 'auto',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 999,
            },
        };
    }


    

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Alert Modal"
            style={getModalStyle()}
        >
            <div className='h-full flex flex-col gap-3'>
                    {/* HEADER */}
                <div className='flex flex-row justify-between border-b border-gray-300 pb-2'>
                    <div className='flex items-center'>
                        <span className='text-base md:text-lg font-semibold'>
                            {"Bulk/Block Filter"}
                        </span>
                    </div>
                    <button className='flex items-center'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle size={18}/>
                    </button>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-5' style={{zIndex:999}}>
                    <div className='col-span-1 flex flex-col md:gap-1'>
                        <div className='text-[9px] md:text-sm ml-1'>{"Sector :"}</div>
                        <Select 
                            value={sectorFilter}
                            placeholder='Sector...'
                            options={formattedSectorList}
                            maxMenuHeight={150}
                            className='text-[11px] md:text-sm lg:text-base'
                            isClearable= {true}
                            onChange={(option)=>{
                                setSectorFilter(option);
                            }}
                        />
                    </div>
                    <div className='col-span-1 flex flex-col gap-1' style={{zIndex:999}}>
                        <div className='text-[9px] md:text-sm ml-1'>{"Star Holder :"}</div>
                        <Select
                            value={starHolderFilter}
                            placeholder='Star Holder...'
                            options={starHoldersList}
                            getOptionLabel={(item)=>item.CLIENTNAME}
                            getOptionValue={(item)=>item.CLIENTNAME}
                            maxMenuHeight={150}
                            className='text-[11px] md:text-sm lg:text-base'
                            isClearable= {true}
                            onChange={(option)=>{
                                // The whole object of starHoldersList will be put in the filter. Check the Object structure from API
                                setStarHolderFilter(option);
                            }}
                        />
                    </div>
                    <div className='col-span-1 flex flex-col gap-1' style={{zIndex:999}}>
                        <div className='text-[9px] md:text-sm ml-1'>{"Bulk/Block :"}</div>
                        <Select 
                            value={bulkBlockFilter}
                            placeholder='Bulk/Block'
                            options={[{label:"BULK",value:"BULK"},{label:"BLOCK",value:"BLOCK"}]}
                            className='text-[11px] md:text-sm lg:text-base'
                            isClearable= {true}
                            onChange={(option)=>{
                                setBULKBLOCKFilter(option);
                            }}
                        />
                    </div>

                </div>   

                <div className='text-sm md:text-xl mt-5'>
                    {"Market Cap(Rs Cr)"}
                </div>
                <div className='flex items-center justify-center'>
                    <div className=' px-3 py-1.5 bg-[#143B64] rounded-md text-xs md:text-base'>
                        <Slider 
                            min={0}
                            max={50000}
                            onChange={() =>{}}
                        />
                    </div>
                </div>
                
                <div className='flex items-center justify-center'>
                    <div className='flex flex-row gap-5'>
                        <button className='px-2 py-1 rounded-md bg-[#143B64] text-white text-xs md:text-base'
                            onClick={()=>{
                                setMinMCapVal(0);
                                setMaxMCapVal(5000);
                            }}
                        >
                            {"Small Cap"}
                        </button>
                        <button className='px-2 py-1 rounded-md bg-[#143B64] text-white text-xs md:text-base'
                            onClick={()=>{
                                setMinMCapVal(5000);
                                setMaxMCapVal(20000);
                            }}
                        >
                            {"Mid Cap"}
                        </button>
                        <button className='px-2 py-1 rounded-md bg-[#143B64] text-white text-xs md:text-base'
                            onClick={()=>{
                                setMinMCapVal(20000);
                                setMaxMCapVal(50000);
                            }}
                        >
                            {"Large Cap"}
                        </button>

                    </div>
                </div>
                
                <div className='mt-auto flex flex-row justify-end gap-3'>
                    <button className='text-red-600 hover:bg-sky-50 rounded-md px-2 py-1'
                        onClick={()=>{
                            setMinMCapVal(0);
                            setMaxMCapVal(50000);
                            setStarHolderFilter(null);
                            setSectorFilter(null);
                            setBULKBLOCKFilter(null);
                        }}
                    >
                        {"Reset"}
                    </button>
                    <button className='text-[#[#143B64]] hover:bg-sky-50 rounded-md px-2 py-1'
                        onClick={()=>{
                            setApplyFilter(prev=>!prev)
                            closeModal();
                        }}
                    >
                        {"Apply"}
                    </button>
                </div>
            </div>

        </ReactModal>
      
    </>
  )
}

export default FilterModal
