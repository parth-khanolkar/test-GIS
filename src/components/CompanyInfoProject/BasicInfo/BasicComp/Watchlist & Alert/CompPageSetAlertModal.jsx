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

const CompPageSetAlertModal = ({ isOpen, closeModal }) => {
    const { uid,setUid,fincode, setFincode,initData,setInitData,exchange, setExchange } = useInfoContext();
    const { watchlistArray,setWatchlistArray } = useWatchlistContext();

    // const [ watchlist,setWatchlist ] = useState(null);

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [isAddNewWatchlistModalOpen, setIsAddNewWatchlistModalOpen] = useState(false); 

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '45%' : '40%',
                maxHeight: isMobile ? '80%' : '40%',
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
              zIndex: 100,
            },
        };
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
                    <div className='text-rose-600 text-base md:text-2xl font-semibold '>
                        STOCK ALERT <span className='text-base text-black'>- {initData?.CompName.value}</span>
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>
                

            </div>
        </ReactModal>
      
    </>
  )
}

export default CompPageSetAlertModal
