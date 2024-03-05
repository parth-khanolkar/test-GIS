'use client'


import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useInfoContext } from '@/context/info';
import { FaBell, FaRegBell } from 'react-icons/fa';
import { useBulkBlockContext } from '@/context/BulkBlockContext';

const StarHoldersModal = ({ isOpen, closeModal }) => {
    const { uid } = useInfoContext();
    const { currentFollowing, setCurrentFollowing, getCurrentFollowing } = useBulkBlockContext();

    const [isMobile, setIsMobile] = useState(false);

    const [isTop50, setIsTop50] = useState(true);

    const [top50, setTop50] = useState([]);
    const [starPerformers, setStarPerformers] = useState([]);

    const top50ClientNamesArray = top50.map(item => item.CLIENTNAME);
    const starPerformersClientNamesArray = starPerformers.map(item => item.CLIENTNAME);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '80%' : '85%',
                maxHeight: isMobile ? '80%' : '85%',
                width: isMobile ? '83%' : '60%',
                maxWidth: isMobile ? '100%' : '60%',
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

    const getTop100 = async () => {
        try {
            const response = await axios.get(`https://transcriptanalyser.com/bulkblockdeals/tophundred`);
            
            setTop50(response.data?.top50);
            setStarPerformers(response.data?.star);


        } catch (error) {
            console.log("Error in getTop100: ",error);
        }
    }

    useEffect(()=>{
        getTop100();
    },[]);

    const insertNotification = async (client_name) => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/insert_notification`,{
                user_id: uid,
                client_name: [client_name],
            });
            
            if(response.status === 200){
                setCurrentFollowing(prevFollowing => [...prevFollowing, client_name]);
            }
            

        } catch (error) {
            console.log("Error in insertNotification:",error);
        }
    }
    const deleteNotification = async (client_name) => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/delete_notification`,{
                user_id: uid,
                client_name: [client_name],
            });

            if(response.status === 200){
                setCurrentFollowing(prevFollowing => prevFollowing.filter(name => name !== client_name));
            }            
            

        } catch (error) {
            console.log("Error in insertNotification:",error);
        }
    }

    const insertNotificationForAll = async (client_name) => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/insert_notification`,{
                user_id: uid,
                client_name: client_name,
            });
            
            if(response.status === 200){
                setCurrentFollowing(prevFollowing => [...prevFollowing, ...client_name]);
            }
            

        } catch (error) {
            console.log("Error in insertNotification:",error);
        }
    }
    const deleteNotificationForAll = async (client_name) => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/delete_notification`,{
                user_id: uid,
                client_name: client_name,
            });

            if(response.status === 200){
                // setCurrentFollowing(prevFollowing => prevFollowing.filter(name => name !== client_name));
                setCurrentFollowing(prevFollowing => prevFollowing.filter(name => !client_name.includes(name)));
            }            
            

        } catch (error) {
            console.log("Error in insertNotification:",error);
        }
    }
    

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
                    {
                        isTop50 ? (<>
                            <div className='text-sm md:text-lg'>
                                {"Top 50 Performers"}
                            </div>
                            {
                                top50ClientNamesArray.every(clientName => currentFollowing.includes(clientName)) ? (
                                    <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white'
                                        onClick={()=>{
                                            deleteNotificationForAll(top50ClientNamesArray);
                                        }}
                                    >
                                        {"Unfollow All"}
                                    </button>
                                ) : (
                                    <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white'
                                        onClick={()=>{
                                            insertNotificationForAll(top50ClientNamesArray);
                                        }}
                                    >
                                        {"Follow All"}
                                    </button>
                                )
                            }
                        </>):(<>
                            <div className='text-sm md:text-lg'>
                                {"Star Profiles"}
                            </div>
                            {
                                starPerformersClientNamesArray.every(clientName => currentFollowing.includes(clientName)) ? (
                                    <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white'
                                        onClick={()=>{
                                            deleteNotificationForAll(starPerformersClientNamesArray);
                                        }}
                                    >
                                        {"Unfollow All"}
                                    </button>
                                ) : (
                                    <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white'
                                        onClick={()=>{
                                            insertNotificationForAll(starPerformersClientNamesArray);
                                        }}
                                    >
                                        {"Follow All"}
                                    </button>
                                 )
                            }
                            
                        </>)
                    }
                </div>
                <button className='flex items-center'
                    onClick={closeModal}
                >
                    <AiOutlineCloseCircle size={18}/>
                </button>
            </div>      

            {/* Switch the columns */}
            <div className='flex flex-row gap-2 md:gap-6 md:mx-4 mt-1.5'>
                <button className={`flex items-center justify-center w-1/2 text-sm md:text-lg font-semibold
                    ${
                        isTop50 ? ('text-red-600 border-b-2 border-red-600'):('text-gray-600 border-b-2 border-gray-600 hover:text-gray-700 hover:border-gray-700')
                    }`}
                    onClick={()=>{setIsTop50(true)}}
                >
                    {'Top 50'}
                </button>
                <button className={`flex items-center justify-center w-1/2 text-sm md:text-lg font-semibold
                    ${
                        !isTop50 ? ('text-red-600 border-b-2 border-red-600'):('text-gray-600 border-b-2 border-gray-600 hover:text-gray-700 hover:border-gray-700')
                    }`}
                    onClick={()=>{setIsTop50(false)}}
                >
                    {'Star Performers'}
                </button>
            </div>     

            <div className='flex gap-2 mt-2 mb-2 pb-2 border-b font-semibold text-blue-900 border-black'>
                <div className='w-2/5 flex items-center justify-center text-xs md:text-base'>
                    {'Holder Name'}
                </div>
                <div className='w-1/5 flex items-center justify-center text-xs md:text-base'>
                    {''}
                </div>
                <div className='w-2/5 flex items-center justify-center text-xs md:text-base'>
                    {'Overall Averge'}
                </div>
            </div>

            <div className='flex flex-col gap-2 overflow-y-auto h-[50vh] md:h-[68vh] lg:h-[60vh] scrollbar-none lg:scrollbar'>
                {
                    isTop50 ? (<>
                        {
                            top50?.map((item,index)=>(
                            <div key={index} className='flex gap-2'>
                                <div className='w-2/5 flex items-center justify-center text-xs md:text-sm text-center'>
                                    {item.CLIENTNAME}
                                </div>
                                {
                                    currentFollowing.includes(item.CLIENTNAME) ? (
                                        <button className='w-1/5 flex items-center justify-center text-xs md:text-sm'
                                            onClick={()=>{
                                                deleteNotification(item.CLIENTNAME);
                                            }}
                                        >
                                            <FaBell size={18}/>
                                        </button>
                                    ):(
                                        <button className='w-1/5 flex items-center justify-center text-xs md:text-sm'
                                            onClick={()=>{insertNotification(item.CLIENTNAME)}}
                                        >
                                            <FaRegBell size={18}/>
                                        </button>
                                    )
                                }
                                
                                <div className={`w-2/5 flex items-center justify-center text-xs md:text-base rounded-md py-1.5 md:py-2
                                    ${
                                        item.overall_avg > 0 ? ('bg-green-200 bg-opacity-50 text-green-800'):('bg-red-300 bg-opacity-40 text-red-800')
                                    }
                                `}>
                                    {`${item.overall_avg} %`}
                                </div>
                            </div>
                            ))
                        }
                    </>):(<>
                        {
                            starPerformers?.map((item,index)=>(
                            <div key={index} className='flex gap-2'>
                                <div className='w-2/5 flex items-center justify-center text-xs md:text-sm text-center'>
                                    {item.CLIENTNAME}
                                </div>
                                {
                                    currentFollowing.includes(item.CLIENTNAME) ? (
                                        <button className='w-1/5 flex items-center justify-center text-xs md:text-sm'
                                            onClick={()=>{
                                                deleteNotification(item.CLIENTNAME);
                                            }}
                                        >
                                            <FaBell size={18}/>
                                        </button>
                                    ):(
                                        <button className='w-1/5 flex items-center justify-center text-xs md:text-sm'
                                            onClick={()=>{insertNotification(item.CLIENTNAME)}}
                                        >
                                            <FaRegBell size={18}/>
                                        </button>
                                    )
                                }
                                <div className={`w-2/5 flex items-center justify-center text-xs md:text-base rounded-md py-1.5 md:py-2
                                    ${
                                        item.overall_avg > 0 ? ('bg-green-200 bg-opacity-50 text-green-800'):('bg-red-300 bg-opacity-40 text-red-800')
                                    }
                                `}>
                                    {`${item.overall_avg.toFixed(1)} %`}
                                </div>
                            </div>
                            ))
                        }
                    </>)
                }
            </div>

        </ReactModal>
      
    </>
  )
}

export default StarHoldersModal
