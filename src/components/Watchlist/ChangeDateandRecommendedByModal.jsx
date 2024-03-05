"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useInfoContext } from '@/context/info';
import { useWatchlistContext } from '@/context/WatchlistContext';
import { toast } from 'react-toastify';

const ChangeDateandRecommendedByModal = ({ isOpen, closeModal,currentDate,companyName,currentRecommender,getWatchlistCompanies,fincode }) => {
    const { uid,setUid } = useInfoContext();
    const { watchlist,setWatchlist } = useWatchlistContext();


    const [isMobile, setIsMobile] = useState(false); // Track mobile state

    const [recommendedBy, setRecommendedBy] = useState('');
    const [newDate, setnewDate] = useState('');


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '35%' : '40%',
                maxHeight: isMobile ? '80%' : '40%',
                width: isMobile ? '80%' : '40%',
                maxWidth: isMobile ? '90%' : '50%',
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

    const editRecommendedBy = async () => {
        if(recommendedBy.toLowerCase() === 'self' && currentRecommender.toLowerCase() === 'self'){
            toast.success(`Tipper changed`,{
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        } else {
            try {
                const response = await axios.post(`https://transcriptanalyser.com/watchlists/edit_recommendedby`,{
                        WatchListGroupId: watchlist.WatchListGroupId,
                        fincode: fincode,
                        UserId: uid,
                        recommendedby: recommendedBy.trim()
                });

                console.log(response.data);
                if(response.data.Data === 'Done'){
                    toast.success(`Tipper changed`,{
                        position: "bottom-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });

                    getWatchlistCompanies();
                }
                
            } catch (error) {
                console.log("Error in editRecommendedBy: ",error);
            }
        }
        setRecommendedBy('');
        // closeModal();
    }
    
    const changeDate = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/edit_adddate',{
                WatchListGroupId: watchlist.WatchListGroupId,
                fincode: fincode,
                UserId: uid,
                date: newDate
            })

            if(response.data.Data === 'Done'){
                toast.success(`Date changed successfully!`,{
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                getWatchlistCompanies();
                // closeModal();
            } else {
                toast.error(`Erorr! Try again.`,{
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
  
             
          } catch (error) {
            console.error(error);
          }
    }

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Change Date Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-col w-full h-full'>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='text-rose-600 text-2xl font-semibold '>
                        EDIT DETAILS <span className='text-base text-black'>- {companyName}</span>
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>

                <form className='mt-10 md:mt-20 lg:mt-10 flex flex-row lg:mx-10 gap-4'
                    onSubmit={(e)=>{
                        e.preventDefault();
                        changeDate();
                    }}
                >
                    <input id='DateInput' placeholder={currentDate} type="date" className='border border-gray-600 px-2.5 py-1.5 rounded-sm' 
                        onChange={(e)=>{setnewDate(e.target.value)}}
                    />

                    <button type='submit' className='flex flex-row items-center justify-center rounded-md px-2.5 py-1 bg-[#093967] hover:bg-cyan-950 text-white gap-2'>
                        Change Date
                    </button>
                </form>


                <form className='mt-10 md:mt-20 lg:mt-10 flex flex-row lg:mx-10 gap-4'
                    onSubmit={(e)=>{
                        e.preventDefault();
                        editRecommendedBy();
                    }}
                >
                    <input required type='text' value={recommendedBy} placeholder={`Currently by : ${currentRecommender ? (currentRecommender) : ("Self")}`} 
                        className='w-full p-1.5 border border-black rounded-md'
                        onChange={(e)=>{
                            setRecommendedBy(e.target.value);
                        }}  
                    />

                    <button type='submit' className='flex flex-row items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 bg-[#093967] hover:bg-cyan-950 text-white gap-2'>
                        Change Tipper
                    </button>
                </form>

            </div>
            
        </ReactModal>
      
    </>
  )
}

export default ChangeDateandRecommendedByModal
