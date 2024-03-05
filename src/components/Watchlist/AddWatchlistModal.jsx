"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg';
import { useInfoContext } from '@/context/info';
import { toast } from 'react-toastify';

const AddWatchlistModal = ({ isOpen, closeModal,setWatchlist }) => {
    const [wlName,setWLName] = useState("");
    const { uid,setUid } = useInfoContext();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state


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

    const addNewWatchList = async () => {
        try {
          const response = await axios.post('https://transcriptanalyser.com/watchlists/create_watchlist',{
              uid: uid,
              name: wlName
          })

           const newdata = response.data.data;
           setWatchlist({ WatchGroupName:newdata.Name ,WatchListGroupId:newdata.Id })
        } catch (error) {
          console.error(error);
        }
    };
    

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-col'>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='text-rose-600 text-2xl font-semibold '>
                        NEW WATCHLIST
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>

                <form className='mt-10 md:mt-20 lg:mt-10 flex flex-col items-center justify-center lg:mx-10 gap-4'
                    onSubmit={(e)=>{
                        e.preventDefault();
                        if(wlName.trim().toLowerCase() !== "alert"){
                            addNewWatchList();
                            setWLName("");
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
                    <input type="text" value={wlName} onChange={(e)=>{setWLName(e.target.value)}} placeholder='Enter Name'
                        className='border border-gray-600 px-3 py-1.5 min-w-full'
                        maxLength={25}
                    />
                    <button className='flex flex-row border border-black rounded-md px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white gap-2'
                        type='submit'
                    >
                        <div className='flex items-center text-xl'>
                            <CgAdd />
                        </div>
                        Create WatchList
                    </button>
                </form>
            </div>
        </ReactModal>
      
    </>
  )
}

export default AddWatchlistModal
