'use client'


import React,{ useState,useEffect } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ReactModal from 'react-modal';
import Select from 'react-select';

const FilterModal = ({ isOpen, closeModal,
    estimateType, setEstimateType,
    estimateTypeList,
    estimateYear, setEstimateYear,
    estimateYearList,
    priceTargetChange, setPriceTargetChange,
    priceTargetChangeList,
    estimateUpgradeChange, setEstimateUpgradeChange,
    estimateUpgradeChangeList,
    scenario, setScenario,
    scenarioList,
    minAnalystReco, setMinAnalystReco,
    minAnalystRecoList,
    growthType, setGrowthType,
    growthTypeList,
    getInitialTableData,
    getFilteredTableData
}) => {
    
    const [isMobile, setIsMobile] = useState(false);
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '80%' : '80%',
                maxHeight: isMobile ? '80%' : '80%',
                width: isMobile ? '90%' : '55%',
                maxWidth: isMobile ? '90%' : '55%',
                margin: 'auto',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: isMobile ? -40:0,
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
                            {"Screen Filters"}
                        </span>
                    </div>
                    <button className='flex items-center'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle size={18}/>
                    </button>
                </div>

                <div className='grid grid-cols-2 gap-5 md:gap-10 lg:gap-8'>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Estimate Type :"}</div>
                        <Select
                            value={estimateType}
                            options={estimateTypeList}
                            onChange={(option)=>{
                                setEstimateType(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                        />
                    </div>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Estimate Year :"}</div>
                        <Select
                            value={estimateYear}
                            options={estimateYearList}
                            onChange={(option)=>{
                                setEstimateYear(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                        />
                    </div>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Price Target Change :"}</div>
                        <Select
                            value={priceTargetChange}
                            options={priceTargetChangeList}
                            onChange={(option)=>{
                                setPriceTargetChange(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                        />
                    </div>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Estimate Upgrade Change :"}</div>
                        <Select
                            value={estimateUpgradeChange}
                            options={estimateUpgradeChangeList}
                            onChange={(option)=>{
                                setEstimateUpgradeChange(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                        />
                    </div>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Scenario :"}</div>
                        <Select
                            value={scenario}
                            options={scenarioList}
                            onChange={(option)=>{
                                setScenario(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                        />
                    </div>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Min Analyst Reco :"}</div>
                        <Select
                            value={minAnalystReco}
                            options={minAnalystRecoList}
                            onChange={(option)=>{
                                setMinAnalystReco(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                            maxMenuHeight={150}
                        />
                    </div>
                    <div className='col-span-1 flex flex-col space-y-1'>
                        <div className='text-xs md:text-sm ml-1'>{"Growth Type :"}</div>
                        <Select
                            value={growthType}
                            options={growthTypeList}
                            onChange={(option)=>{
                                setGrowthType(option);
                            }}
                            className='text-[11px] md:text-sm lg:text-base uppercase' isClearable='true'
                        />
                    </div>

                </div>

                <div className='mt-auto flex flex-row justify-end gap-3'>
                    <button className='text-red-600 hover:bg-sky-50 rounded-md px-2 py-1'
                        onClick={()=>{
                            setEstimateType(null);
                            setEstimateYear(null);
                            setPriceTargetChange(null);
                            setEstimateUpgradeChange(null);
                            setScenario(null);
                            setMinAnalystReco(null);
                            setGrowthType(null);
                            getInitialTableData();
                            closeModal();
                        }}
                    >
                        {"Reset"}
                    </button>
                    <button className='text-[#[#143B64]] hover:bg-sky-50 rounded-md px-2 py-1'
                        onClick={()=>{
                            getFilteredTableData();
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
