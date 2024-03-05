"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg';
import { useInfoContext } from '@/context/info';
import { useWatchlistContext } from '@/context/WatchlistContext';
import Select from 'react-select';
import NewWatchlistCompanyPageModal from './NewWatchlistCompanyPageModal';
import { toast } from 'react-toastify';
import Link from 'next/link';

const AddToWatchlistModal = ({ isAddToWatchlistModalOpen, closeAddToWatchlistModal }) => {
    const { uid,setUid,fincode, setFincode,initData,setInitData,exchange, setExchange } = useInfoContext();
    const { watchlistArray,setWatchlistArray } = useWatchlistContext();

    // const [ watchlist,setWatchlist ] = useState(null);

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [isAddNewWatchlistModalOpen, setIsAddNewWatchlistModalOpen] = useState(false); 

    const openAddNewWatchlistModal = () => {
        setIsAddNewWatchlistModalOpen(true);
    }
    const closeAddNewWatchlistModal = () => {
        setIsAddNewWatchlistModalOpen(false);
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '55%' : '50%',
                maxHeight: isMobile ? '80%' : '50%',
                width: isMobile ? '80%' : '40%',
                maxWidth: isMobile ? '80%' : '50%',
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

    const addCompanyToWL = async (watchlist) => {
        try {
            const response = await fetch('https://transcriptanalyser.com/watchlists/add_company', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                FinCode: initData?.fincode.value.toString(),
                CompanyName: initData?.CompName.value,
                Exchange: exchange,
                Type: "Company",
                UserId: uid,
                WatchListGroupId: watchlist.WatchListGroupId
              }),
            });
          
            if (response.ok) {
                const responseData = await response.json();
                if(responseData?.data?.Status === "Success"){
                    toast.success(`${initData?.CompName.value} added to watchlist ${watchlist.WatchGroupName}`,{
                        position: "bottom-center",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    closeAddToWatchlistModal();

                } else {
                    toast.info(`${initData?.CompName.value} already exists in the watchlist`,{
                        position: "bottom-center",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            } else {
                toast.error(`Try again later`,{
                    position: "bottom-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
          
          } catch (error) {
            console.error("Error in addCompanyToWL:", error);
          }
          
    }

           

  return (
    <>
        <ReactModal
            isOpen={isAddToWatchlistModalOpen}
            onRequestClose={closeAddToWatchlistModal}
            contentLabel="Example Modal"
            style={getModalStyle()}
        >
            <div className='h-full flex flex-col'>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='text-rose-600 text-base md:text-2xl font-semibold '>
                        ADD TO WATCHLIST
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeAddToWatchlistModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>
                {
                    uid === -1 ? (<>
                        <div className='h-full flex items-center justify-center'>
                            <Link href={`/loginpage`} className='px-3 py-1 rounded-md bg-red-700 text-white'>
                                {"Login to add to watchlist"}
                            </Link>
                        </div>
                    </>) : (
                        <div className='mt-5 flex flex-col mx-1.5 md:mx-4 gap-3'>
                            <div className='text-sm md:text-base'>
                                Add <span className='text-black font-semibold'>{initData?.CompName.value}</span> to:
                            </div>
                            <Select
                                // value={watchlist}
                                placeholder='Select Watchlist...'
                                options={watchlistArray}
                                getOptionLabel={(option) => option.WatchGroupName}
                                getOptionValue={(option) => option.WatchListGroupId}
                                onChange={(option) => {
                                    addCompanyToWL(option);
                                }}
                                maxMenuHeight={150}
                                isSearchable={false}
                            />
                            <div className='mt-10 flex items-center justify-center'>
                                <button className='flex flex-row border border-black rounded-md px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white gap-2'
                                    onClick={()=>{
                                        openAddNewWatchlistModal();
                                    }}
                                >
                                    <div className='flex items-center text-xl'>
                                        <CgAdd />
                                    </div>
                                    Create New WatchList
                                </button>
                            </div>
                        </div>
                    )
                }

            </div>
        </ReactModal>

        <NewWatchlistCompanyPageModal isOpen={isAddNewWatchlistModalOpen} closeModal={closeAddNewWatchlistModal} closeParentModal={closeAddToWatchlistModal} />
      
    </>
  )
}

export default AddToWatchlistModal
