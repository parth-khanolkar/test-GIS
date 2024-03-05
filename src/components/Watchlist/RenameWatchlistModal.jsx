"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg';
import { useInfoContext } from '@/context/info';
import { useWatchlistContext } from '@/context/WatchlistContext';
import { toast } from 'react-toastify';

const RenameWatchlistModal = ({ isOpen, closeModal,fetchNewWatchlistDropdown }) => {
    const { uid,setUid } = useInfoContext();
    const { watchlist,setWatchlist } = useWatchlistContext();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [changedName, setChangedName] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '35%' : '30%',
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

    const changeWLName = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/name_change', {
                UserId: uid,
                WatchListGroupId: watchlist.WatchListGroupId,
                name: changedName,
            });

            if(response.data?.data.Status === "Success"){
                setWatchlist({WatchListGroupId:response.data?.data.Id ,WatchGroupName:response.data?.data.Name});
                fetchNewWatchlistDropdown();
            }else {
                console.log(`Request failed with status: ${response.status}`);
                alert("Error changing Name")
            }
            
        } catch (error) {
            alert("Error changing Name")
            console.error("Error in addCompanyToWL:", error);
        }
          
    }

    

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Company Graph"
            style={getModalStyle()}
        >
            <div className='flex flex-col'>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='text-rose-600 text-2xl font-semibold '>
                        RENAME WATCHLIST
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>
                <form className='mx-2 lg:mx-5 mt-5 mb-3 flex flex-col gap-3'
                    onSubmit={(e)=>{
                        e.preventDefault();
                        if(changedName.trim().toLowerCase() !== "alert"){
                            changeWLName();
                            closeModal();
                        } else {
                            toast.error(`Watchlist name cannot be "Alert"!`, {
                                position: "bottom-center",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    }}
                >
                    <div className='w-full'>Change name to:</div>
                    <input type="text" value={changedName} placeholder={watchlist.WatchGroupName} className='w-full text-sm lg:text-xl p-1.5 ml-0.5 border border-gray-500 hover:border-gray-700 rounded-md' 
                        onChange={(e)=>{setChangedName(e.target.value)}}
                        maxLength={25}
                    />
                    <div className='flex flex-col items-center w-full justify-center md:justify-start gap-4 md:gap-5 lg:gap-10'>
                        <button type='submit' className='rounded-md px-2.5 py-1.5 border border-black text-white bg-rose-600 hover:bg-rose-700'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
      
    </>
  )
}

export default RenameWatchlistModal
