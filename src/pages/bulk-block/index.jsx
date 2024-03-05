'use client'

import BulkBlockTable from '@/components/Bulk-Block/BulkBlockTable';
import { useInfoContext } from '@/context/info'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi';
import StarHoldersModal from '../../components/Bulk-Block/StarHoldersModal';
import InsightsModal from '@/components/Bulk-Block/InsightsModal';
import { useBulkBlockContext } from '@/context/BulkBlockContext';
import Slider from '@/components/Bulk-Block/Slider/Slider';
import Select from 'react-select';
import { FaFilter } from 'react-icons/fa';
import FilterModal from '@/components/Bulk-Block/FilterModal';
import MobileFooter from '@/components/MobileFooter';
import Footer from '@/components/Footer';

const BulkBlockPage = () => {

    const { uid } = useInfoContext();
    const { currentFollowing, setCurrentFollowing, getCurrentFollowing,minMCapVal, setMinMCapVal,maxMCapVal, setMaxMCapVal,sectorFilter,setSectorFilter,starHolderFilter,setStarHolderFilter,bulkBlockFilter,setBULKBLOCKFilter,applyFilter,setApplyFilter } = useBulkBlockContext();

    const [ isLoading, setIsLoading] = useState(true);

    const [filtering, setFiltering] = useState("");
    const [ tableData, setTableData ] = useState([]);
    const [ filteredTableData, setFilteredTableData ] = useState([]);

    const [ sectorList, setSectorList ] = useState([]);
    const [ starHoldersList, setStarHoldersList ] = useState([]);

    const [ isStarHoldersModalOpen, setIsStarHoldersModalOpen] = useState(false);
    const [ isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [ isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // MODAL Functions
    const openInsightsModal = () => {
        setIsInsightsModalOpen(true);
    }
    const closeInsightsModal = () => {
        setIsInsightsModalOpen(false);
    }
    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    }
    const closeFilterModal = () => {
        setIsFilterModalOpen(false);
    }
    const openStarHoldersModal = () => {
        setIsStarHoldersModalOpen(true);
    }
    const closeStarHoldersModal = () => {
        setIsStarHoldersModalOpen(false);
    }

    const getStarHoldersList = async () => {
        try {
            const response = await axios.get(`https://transcriptanalyser.com/bulkblockdeals/starholders`);
            
            if(response.status === 200){
                setStarHoldersList(response.data.key);
            }

        } catch (error) {
            console.log("Error in getStarHoldersList: ",error);
        }
    } 
    const getInitialBulkBlock = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblock/bulk-block`,{
                env_type:"live",   //env_type = live/test
                first_time:"yes"
            });

            if(response.status === 200){
                setTableData(response.data.key);
                setFilteredTableData(response.data.key);
                setSectorList(response.data.sector_list);
                setIsLoading(false);
            }
            
        } catch (error) {
            console.log("Error in getInitialBulkBlock: ",error);
        }
        getAdditionalBulkBlock();
    }
    const getAdditionalBulkBlock = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblock/bulk-block`,{
                env_type:"live",   //env_type = live/test
                first_time:"no"
            });
            
            if(response.status === 200){
                setTableData(prev => [...prev,...response?.data?.key]);
                setFilteredTableData(prev => [...prev,...response?.data?.key]);
                setSectorList(response.data.sector_list);
                setIsLoading(false);
            }

        } catch (error) {
            console.log("Error in getAdditionalBulkBlock: ",error);
        }
    }
    //UseEffect for Initial API Call
    useEffect(()=>{
        getStarHoldersList();
        getInitialBulkBlock();
        getCurrentFollowing();
    },[]);

    //UseEffect to apply filters
    useEffect(()=>{
        setFilteredTableData(tableData.filter((item) => {
            const sectorCondition = sectorFilter ? item.sector === sectorFilter?.value : true;
            const starHolderCondition = starHolderFilter ? item.CLIENTNAME === starHolderFilter?.CLIENTNAME : true;
            const bulkBlockCondition = bulkBlockFilter ? item.BULKBLOCK === bulkBlockFilter?.value : true;
            
            return sectorCondition && starHolderCondition && bulkBlockCondition;
          }))
    },[applyFilter])
    
    
  return (
    <>
        <div className='h-[calc(100vh-80px)] overflow-x-hidden overflow-y-auto scrollbar-none lg:scrollbar bg-white'>
            <div className='mx-2 p-2 border shadow-md mt-2 rounded-md'>
                <div className='flex flex-row justify-between  mt-2 mx-2 lg:ml-4 lg:mr-12'>
                    <div className='flex flex-row gap-2'>
                        <button className='text-sm md:text-base text-[#01366D] underline underline-offset-2'
                            onClick={()=>{openStarHoldersModal();}}
                        >
                            {"Follow Top 100 Holders"}
                        </button>
                    </div>
                    <div className='flex flex-row items-center justify-center'>
                        <button className='text-xs md:text-base px-5 py-0.5 bg-rose-700 hover:bg-rose-800 rounded-md text-white '
                            onClick={()=>{openInsightsModal()}}
                        >
                            {"Insights"}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row justify-between mx-2 lg:ml-2 lg:mr-10 mt-4">
                    {/* Search & Filters*/}
                    <div className='flex flex-row items-center space-x-3'>
                        <div className="flex justify-between gap-1 items-center border rounded-full border-[#083966] px-2 py-1 mb-2 ">
                            <input
                                type="type"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                                placeholder="Search by Buyer/Company name ..."
                                className="outline-none bg-transparent text-xs md:text-base w-[55vw] md:w-[32vw] lg:w-[18vw]"
                            />
                            <BiSearchAlt size={18} className="text-[#083966]" />
                        </div>
                        <div className=''>
                            <button className='text-[#083966]'
                                onClick={()=>{openFilterModal()}}
                            >
                                <FaFilter size={18} />
                            </button>
                        </div>
                    </div>                
                </div>


                <div className='mx-0.5 lg:ml-2 lg:mr-10 mt-1'>
                    <BulkBlockTable 
                        data={filteredTableData.filter((item) => {
                            return item?.mcap <= maxMCapVal && item?.mcap >= minMCapVal;
                        })} 
                        filtering={filtering} 
                        setFiltering={setFiltering} 
                        isLoading={isLoading}
                    />
                </div>
            </div>
            
            <footer className="-mx-2 mt-2">
                <div className="hidden lg:inline-block">
                    <Footer />
                </div>
                <div className="lg:hidden">
                    <MobileFooter />
                </div>
            </footer>

        </div>

        <StarHoldersModal isOpen={isStarHoldersModalOpen} closeModal={closeStarHoldersModal} />
        <InsightsModal isOpen={isInsightsModalOpen} closeModal={closeInsightsModal} />
        <FilterModal isOpen={isFilterModalOpen} closeModal={closeFilterModal} sectorList={sectorList} starHoldersList={starHoldersList} />
    </>
  )
}

export default BulkBlockPage

BulkBlockPage.requireAuth = true;