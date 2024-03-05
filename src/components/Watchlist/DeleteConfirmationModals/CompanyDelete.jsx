"use client"

import React, { useEffect,useState } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';


const CompanyDeleteModal = ({ isOpen,closeModal,WatchListId,getWatchlistCompanies,companyName }) => {

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
              zIndex:999,
            },
        };
    };
    
    const deleteCompany = async () => {
        try {
          const response = await axios.post('https://transcriptanalyser.com/watchlists/delete_company',{
            UserId: window.localStorage.getItem("UserId"),
            WatchListId: WatchListId
          })
          getWatchlistCompanies();
        } catch (error) {
          console.error("Error in deleteCompany:",error);
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
          <div className='w-full felx items-center justify-center text-center'>
            Are you sure you want to delete <span className='font-bold'>{companyName}</span> from Watchlist?
          </div>
          <div className='w-full flex justify-center items-center gap-20 lg:pt-5 md:pt-8 pt-5'>
            <button className='text-white bg-red-600 hover:bg-red-800 px-3 py-1.5 rounded-lg'
                onClick={()=>{
                    deleteCompany();
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

export default CompanyDeleteModal
