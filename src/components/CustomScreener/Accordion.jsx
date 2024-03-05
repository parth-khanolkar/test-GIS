'use client'

import { useCustomScreenerContext } from '@/context/CustomScreenerContext';
import React, { useState } from 'react'
import Select from 'react-select';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/router';

const Accordion = ({ filter, index, openIndex, setOpenIndex,isAdded }) => {
    const router = useRouter();
    const { screener_id } = router.query
    const { screenerAddedFilters,setScreenerAddedFilters,isApplyButtonDisabled,setIsApplyButtonDisabled,screenerFilterOptions,setScreenerFilterOptions,extraOptionsDropdowns, setExtraOptionsDropdowns } = useCustomScreenerContext();

    const [ filterData,setFilterData ] = useState(filter);

    const isOpen = index === openIndex;

    const handleClick = () => {
      setOpenIndex(isOpen ? null : index);
    };

    const dropdownStyles = {
      indicatorSeparator: (provided, state) => ({
          ...provided,
          display: 'none', // Remove the vertical line
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          display: 'none', // Remove the dropdown indicator arrow
        }),
    };

    const addFilter = async () => {
      try {
        const response = await axios.post(`https://transcriptanalyser.com/screener/add_filter_sc`,{
          filter_id: filterData.filter_id,
          screener_id: screener_id,
          above: filterData.above,
          below: filterData.below,
          quater: filterData.quater ? (filterData.quater) : (""),
          year: filterData.year ? (filterData.year) : (""),
          cagr: filterData.cagr ? (filterData.cagr) : (""),
          cagr_q:filterData.cagr_q ? (filterData.cagr_q) : ("")
        });

        if(response.status === 200){
          setScreenerAddedFilters(prevArray => [...prevArray, filterData]);
          setScreenerFilterOptions(prevArray => prevArray.filter(item => item.filter_id !== filterData.filter_id));
          setIsApplyButtonDisabled(false);
        }


      } catch (error) {
        console.log("Error in addFilter: ",error);
        toast.error('Error! Try again later.', {
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
    }

    const editFilter = async () => {  
      try {
        const response = await axios.post(`https://transcriptanalyser.com/screener/edit_filter_sc`,{
          filter_id: filterData.filter_id,
          screener_id: screener_id,
          above: filterData.above,
          below: filterData.below,
          quater: filterData.quater ? (filterData.quater) : (""),
          year: filterData.year ? (filterData.year) : (""),
          cagr: filterData.cagr ? (filterData.cagr) : (""),
          cagr_q:filterData.cagr_q ? (filterData.cagr_q) : ("")
        });

        if(response.status === 200){
          setScreenerAddedFilters(prevFilters => 
            prevFilters.map(item => (item.filter_id === filterData.filter_id ? filterData : item))
          );
          setIsApplyButtonDisabled(false);
        }


      } catch (error) {
        console.log("Error in editFilter: ",error);
        toast.error('Error! Try again later.', {
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
    }

    const deleteFilter = async () => {  
      try {
        const response = await axios.post(`https://transcriptanalyser.com/screener/delete_filter_sc`,{
          filter_id: filterData.filter_id,
          screener_id: screener_id
        });

        if(response.status === 200){
          setScreenerFilterOptions(prevArray => [...prevArray, filter]);
          setScreenerAddedFilters(prevArray => prevArray.filter(item => item.filter_id !== filterData.filter_id));
          setIsApplyButtonDisabled(false);
        }


      } catch (error) {
        console.log("Error in addFilter: ",error);
        toast.error('Error! Try again later.', {
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
    }

    
  
    return (
      <div>
        <h2 id={`accordion-collapse-heading-${index}`}>
          <button
            type="button"
            className={`flex items-center justify-between w-full px-3 py-1.5 gap-3 ${isOpen ? 'bg-[#133965] text-white' : 'border border-gray-300'}
            `}
            data-accordion-target={`#accordion-collapse-body-${index}`}
            aria-expanded={isOpen}
            aria-controls={`accordion-collapse-body-${index}`}
            onClick={handleClick}
          >
            <span>{filter?.filter_name}</span>
            <div className=''>
              {
                isOpen ? (<IoIosArrowUp />) : (<IoIosArrowDown />)
              }
            </div>
          </button>
        </h2>
        <div
          id={`accordion-collapse-body-${index}`}
          aria-labelledby={`accordion-collapse-heading-${index}`}
          className={`p-5 border border-b border-gray-300 ${isOpen ? '' : 'hidden'}`}
        >
          <div className='grid grid-cols-2 space-x-2'>
            <div className='col-span-1 flex flex-col'>
              <label htmlFor={`filterAbove-${index}`}
                className='text-xs md:text-base'
              >{"Above"}</label>
              <input 
                value={filterData?.above}
                onChange={(e)=>{
                  setFilterData(prevState => ({
                    ...prevState,
                    ["above"]: e.target.value,
                  }));
                }}
                className='w-full p-1 rounded-md border text-xs md:text-base'
                type="number" id={`filterAbove-${index}`}
                // placeholder={filter.above}
              />
            </div>
            <div className='col-span-1 flex flex-col'>
              <label htmlFor={`filterBelow-${index}`}
                className='text-xs md:text-base'
              >{"Below"}</label>
              <input 
                value={filterData?.below}
                onChange={(e)=>{
                  setFilterData(prevState => ({
                    ...prevState,
                    ["below"]: e.target.value,
                  }));
                }}
                className='w-full p-1 rounded-md border text-xs md:text-base'
                type="number" id={`filterBelow-${index}`}
                // placeholder={filter.below}
              />
            </div>
          </div>

          <div className=''>
              {
                filter.Type === "Y" ? (<>
                <div className='grid grid-cols-2 space-x-2'>
                  <div className='col-span-1 flex flex-col'>
                    <label htmlFor={`Year-${index}`}
                      className='text-xs md:text-base'
                    >{"Year"}</label>
                    <Select 
                      styles={dropdownStyles}
                      options={extraOptionsDropdowns.year}
                      value={filterData.year ? ({label:filterData.year, value:filterData.year}) : (null)}
                      onChange={(option)=>{
                        setFilterData(prevState => ({
                          ...prevState,
                          ["year"]: option.value,
                        }));
                      }}
                      // isClearable
                      className='w-full text-xs md:text-sm'
                    />
                  </div>
                  {
                    filter.CAGR === "yes" && 
                    <div className='col-span-1 flex flex-col'>
                      <label htmlFor={`CAGRYear-${index}`}
                        className='text-xs md:text-base'
                      >{"CAGR"}</label>
                      <Select 
                        styles={dropdownStyles}
                        options={extraOptionsDropdowns.cagr}
                        value={filterData.cagr ? ({label:filterData.cagr, value:filterData.cagr}) : (null)}
                        onChange={(option)=>{
                          setFilterData(prevState => ({
                            ...prevState,
                            ["cagr"]: option.value,
                          }));
                        }}
                        className='w-full text-xs md:text-sm'
                      />
                    </div>
                  }                  
                </div>
                </>) : (
                  filter.Type === "Q" && <>
                    <div className='grid grid-cols-2 space-x-2'>
                      <div className='col-span-1 flex flex-col'>
                        <label htmlFor={`Quarter-${index}`}
                          className='text-xs md:text-base'
                        >{"Quarter"}</label>
                        <Select 
                          styles={dropdownStyles}
                          options={extraOptionsDropdowns.quaters}
                          value={filterData.quater ? ({label:filterData.quater, value:filterData.quater}) : (null)}
                          onChange={(option)=>{
                            setFilterData(prevState => ({
                              ...prevState,
                              ["quater"]: option.value,
                            }));
                          }}
                          className='w-full text-xs md:text-sm'

                        />
                      </div>
                      {
                        filter.CAGR === "yes" && 
                        <div className='col-span-1 flex flex-col'>
                          <label htmlFor={`CAGRQuarter-${index}`}
                            className='text-xs md:text-base'
                          >{"CAGR"}</label>
                          <Select 
                            styles={dropdownStyles}
                            options={extraOptionsDropdowns.cagr_q}
                            value={filterData.cagr_q ? ({label:filterData.cagr_q, value:filterData.cagr_q}) : (null)}
                            onChange={(option)=>{
                              setFilterData(prevState => ({
                                ...prevState,
                                ["cagr_q"]: option.value,
                              }));
                            }}
                            className='w-full text-xs md:text-sm'
                          />
                        </div>
                      }
                    </div>
                  </>
                )
              }
          </div>
          <div className='mt-3 flex flex-row justify-end space-x-2'>
              <button className={`px-3 py-0.5 rounded-md bg-[#991b1b] text-white text-xs md:text-sm 
                ${ !isAdded && "hidden" }
                `}
                onClick={()=>{
                  if(isAdded){
                    deleteFilter();
                  }
                }}
              >
                {"Delete"}
              </button>
              <button className='px-3 py-0.5 rounded-md bg-[#143B64] text-white text-xs md:text-sm'
                onClick={()=>{
                  if(isAdded){
                    editFilter();
                  } else {
                    addFilter();
                  }
                }}
              >
                {"Save"}
              </button>
          </div>
        </div>
      </div>
    );
  };

export default Accordion
