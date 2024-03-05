'use client'

import { useCustomScreenerContext } from '@/context/CustomScreenerContext';
import React, { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp, IoMdCloseCircleOutline } from 'react-icons/io';
import FilterModal from './FilterModal';
import Accordion from './Accordion';


const FilterComponent = ({ isOpen,closeSideFilter }) => {
  const { screenerAddedFilters,setScreenerAddedFilters,isApplyButtonDisabled,setIsApplyButtonDisabled } = useCustomScreenerContext();  

  const [openIndex, setOpenIndex] = useState(null);
  const [ isFilterModalOpen,setIsFilterModalOpen ] = useState(false);


  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  }
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  }
  return (
    <>
      <div 
          className={`z-100 w-[100vw] md:w-[40vw] lg:w-[25vw] fixed bottom-0 h-full md:h-[80vh] lg:h-[78vh] bg-white border flex flex-col ease-in-out duration-500 shadow-md transform lg:ml-4 p-2 ${isOpen ? "translate-x-0  md:translate-y-0 md:ml-4" : "-translate-x-full md:translate-y-full"}`}

      >
        <div className='h-full relative'>
          <div className='flex flex-row justify-between mx-1 '>
            <div>
              {`Applied Filters (${screenerAddedFilters.length})`}
            </div>
            <div className='flex flex-row gap-2'>
              <button className='px-2.5 py-0.5 bg-[#133965] text-white text-[11px] md:text-xs rounded-md'
                onClick={()=>{openFilterModal()}}
              >
                {"Add"}
              </button>
              <button className=''
                onClick={()=>{closeSideFilter()}}
              >
                <IoMdCloseCircleOutline size={25}  />
              </button>
            </div>
          </div>
          <hr className='w-full border-t border-black my-2'/>

          <div className='h-[79vh] md:h-[72vh] lg:h-[65vh] overflow-y-auto scrollbar-none '>
            {
              screenerAddedFilters.map((filter, index) => (
                <Accordion
                  key={index}
                  filter={filter}
                  index={index}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  isAdded={true}
                />
              ))
            }
          </div>
          <div className='w-full absolute bottom-0 px-2 pb-1 flex flex-row justify-end'>
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

      <FilterModal isOpen={isFilterModalOpen} closeModal={closeFilterModal} />
    </>
  )
}

export default FilterComponent
