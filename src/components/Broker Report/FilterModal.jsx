'use client'

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const FilterModal = ({ isOpen, closeModal }) => {
    
    const [isMobile, setIsMobile] = useState(false);    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '60%' : '50%',
                maxHeight: isMobile ? '60%' : '50%',
                width: isMobile ? '83%' : '60%',
                maxWidth: isMobile ? '83%' : '60%',
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
                            {"Broker Report Filter"}
                        </span>
                    </div>
                    <button className='flex items-center'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle size={18}/>
                    </button>
                </div>

                
                
                <div className='mt-auto flex flex-row justify-end gap-3'>
                    <button className='text-red-600 hover:bg-sky-50 rounded-md px-2 py-1'
                        onClick={()=>{

                        }}
                    >
                        {"Reset"}
                    </button>
                    <button className='text-[#[#143B64]] hover:bg-sky-50 rounded-md px-2 py-1'
                        onClick={()=>{

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
