"use client"

import React, { useEffect,useState } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { useWatchlistContext } from '@/context/WatchlistContext';
import { useInfoContext } from '@/context/info';
import { toast } from 'react-toastify';


const WatchlistDeleteModal = ({ isOpen,closeModal }) => {
  const { uid,setUid } = useInfoContext();
  const { watchlist,setWatchlist,refreshWatchlist,setRefreshWatchlist, watchlistArray, setWatchlistArray } = useWatchlistContext();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);

    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '25%' : '20%',
                maxHeight: isMobile ? '80%' : '40%',
                width: isMobile ? '80%' : '55%',
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

    const deleteWatchlist = async () => {
        try {
          const response = await axios.post('https://transcriptanalyser.com/watchlists/delete_watchlist',{
            UserId: window.localStorage.getItem("UserId"),
            WatchListGroupId: watchlist.WatchListGroupId,
            name: watchlist.WatchGroupName
          })

          if(response.data.data.Status === 'Success'){
            toast.success(`Watchlist deleted!`,{
              position: "bottom-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            fetchWatchlistDropdown();
            
          } else {
            toast.error(`Error deleting Watchlist!`,{
              position: "bottom-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            toast.info(`Try again later`,{
              position: "bottom-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });

          }
        } catch (error) {
          console.error("Error in deleteWatchlist:",error);
        }
      }

    const fetchWatchlistDropdown = async () => {
        try {
            const response = await fetch('https://transcriptanalyser.com/watchlists/user_watchlist', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log("Watchlist dropdown",data.data);
                if (data.data[0]) {
                    setWatchlist(data.data[0]);
                    setWatchlistArray
                }
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Company Graph"
            style={getModalStyle()}
        >
          <div className='w-full felx items-center justify-center text-center'>
            Are you sure you want to delete <span className='font-bold'>{watchlist.WatchGroupName}</span> Watchlist?
          </div>
          <div className='w-full flex justify-center items-center gap-20 lg:pt-5 md:pt-8 pt-5'>
            <button className='text-white bg-red-600 hover:bg-red-800 px-3 py-1.5 rounded-lg'
                onClick={()=>{
                    deleteWatchlist();
                    closeModal();
                }}
            >
                YES
            </button>

            <button className='text-white bg-cyan-900 hover:bg-cyan-950 px-3 py-1.5 rounded-lg'
                onClick={()=>{closeModal()}}
            >
                NO
            </button>
          </div>
        </ReactModal>
    </>
  )
}

export default WatchlistDeleteModal
