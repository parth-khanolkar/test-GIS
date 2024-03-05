'use client'


import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useInfoContext } from '@/context/info';
import Select from 'react-select';
import PieChart from './Insights/PieChart';
import InsightsTable from './Insights/InsightsTable';

const InsightsModal = ({ isOpen, closeModal }) => {
    const { uid } = useInfoContext();

    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [ selectedDate,setSelectedDate ] = useState({ label:"Monthly",value:"Monthly" })
    const [ dateOptions,setDateOptions ] = useState([{ label:"Daily",value:"Daily" },{ label:"Weekly",value:"Weekly" },{ label:"Monthly",value:"Monthly" }])

    const [ sectorData,setSectorData ] = useState([])
    const [ mCapPie,setMCapPie ] = useState({})
    const [ topFour,setTopFour ] = useState([])
    const [ tableData,setTableData ] = useState([])
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '90%' : '88%',
                maxHeight: isMobile ? '90%' : '88%',
                width: isMobile ? '83%' : '80%',
                maxWidth: isMobile ? '100%' : '80%',
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
    };

    const getInsights = async (date) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/insights`,{
                date:date
            });
            
            setTableData(response.data.key);
            setTopFour(response.data.topFour);
            setSectorData(Object.entries(response.data.sectorpie).slice(0, 4));
            setMCapPie(response.data.mcappie);
            if(response.status === 200){
                setIsLoading(false);
            }
        } catch (error) {
            console.log("Error in getInsights: ",error);
        }
    }

    useEffect(() => {
        const calculateDate = () => {
          let currentDate = new Date();
    
          if (selectedDate.value === 'Monthly') {
            currentDate.setDate(currentDate.getDate() - 30);
          } else if (selectedDate.value === 'Weekly') {
            currentDate.setDate(currentDate.getDate() - 7);
          }  else if (selectedDate.value === 'Daily') {
            currentDate.setDate(currentDate.getDate() - 1);
          } 
          
          return currentDate;
        };
    
        const dateToFetch = calculateDate();
        getInsights(dateToFetch);
      }, [selectedDate]);

    

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Alert Modal"
            style={getModalStyle()}
        >
            {/* HEADER */}
            <div className='flex flex-row justify-between border-b border-gray-300 pb-2'>
                <div className='flex flex-row space-x-2 items-center'>
                    <div className='text-sm md:text-lg'>
                        {"Insights"}
                    </div>
                    <div>
                        <Select 
                            value={selectedDate}
                            options={dateOptions}
                            onChange={(value)=>{setSelectedDate(value)}}
                            className='text-xs md:text-base w-28 md:w-44'
                            
                        />
                    </div>
                </div>
                <button className='flex items-center'
                    onClick={closeModal}
                >
                    <AiOutlineCloseCircle size={18}/>
                </button>
            </div>      

            {
                isLoading ? (<>
                    <div className='flex items-center mt-[65%] lg:mt-[10%] justify-center'>
                        <div className="flex justify-center items-center ">
                            <span className="relative flex h-[80px] w-[80px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                    </div>
                </>):(<>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 md:gap-5 lg:mt-5'>
                        <div className='col-span-1 lg:col-span-2 flex flex-col gap-0.5'>
                            <div className='text-red-600 font-semibold text-sm md:text-xl'>{"Market Cap"}</div>
                            <div className='max-h-[25vh] md:max-h-[20vh] lg:max-h-[23vh] w-full flex items-center justify-center'>
                                <PieChart chartData={mCapPie} />
                            </div>
                        </div>
                        <div className='col-span-1 lg:col-span-2 '>
                            <div className='text-red-600 font-semibold text-sm md:text-xl'>{"Top 4 Sector"}</div>
                            <div className='flex flex-col gap-1.5 md:gap-3 mt-3 '>
                                    {
                                        sectorData.map(([label, value],index)=>(
                                            <div key={index} className='flex flex-row text-xs md:text-base'>
                                                <div className='w-1/2 flex items-center justify-center bg-[#143B64] text-white border-2 border-gray-400'>{label}</div>
                                                <div className='w-1/2 flex items-center justify-center border-2 border-gray-400'>{`${value.toFixed(0)} %`}</div>
                                            </div>
                                        ))
                                    }
                            </div>
                        </div>
                        <div className='col-span-1 md:col-span-3 mt-2 md:mt-0'>
                            <div className='text-red-600 font-semibold text-sm md:text-xl'>{"Top 4 Trades"}</div>
                            <div className='flex flex-col mt-3'>
                                <ul className='list-disc'>
                                    {topFour.slice(0, 4).map((item, index) => (
                                    <li key={index} className='text-xs md:text-sm text-justify'>
                                        {`${item.CLIENTNAME} bought ${(item.final_value / 100).toFixed(1)} Cr. in ${item.Company_Name}.`}
                                    </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                        
                    </div>

                    <div className='text-red-600 font-semibold text-sm md:text-xl mt-2'>{`Bulk/Block Deals by Star Holders/Top Performers (${selectedDate.value})`}</div>
                    <div className='max-h-[38vh] mt-1.5'>
                        <InsightsTable data={tableData} />
                    </div>
                </>)
            }

        </ReactModal>
      
    </>
  )
}

export default InsightsModal
