'use client'


import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PDFModal = ({ isOpen, closeModal,modalHeader,pfdLink }) => {

    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '90%' : '100%',
                maxHeight: isMobile ? '90%' : '100%',
                width: isMobile ? '75%' : '60%',
                maxWidth: isMobile ? '75%' : '60%',
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

    

    

    

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Alert Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-row justify-between space-x-3 border-b border-gray-300 pb-2'>
                <div className='flex items-center text-xs md:text-base'>
                    {modalHeader}
                </div>
                <button className='flex items-center'
                    onClick={closeModal}
                >
                    <AiOutlineCloseCircle size={18}/>
                </button>
            </div> 

            <iframe src={pfdLink} className='h-[85%] md:h-[90%] w-full mt-2' frameborder="0"></iframe>

        </ReactModal>
      
    </>
  )
}

export default PDFModal
