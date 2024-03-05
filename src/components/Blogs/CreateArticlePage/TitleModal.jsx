"use client"

import React, { useEffect,useState } from 'react'
import ReactModal from 'react-modal';
import DraftModal from './DraftModal';

const TitleModal = ({ senData,isOpen,closeModal,uid }) => {
    const [titleData, setTitleData] = useState('');
    const [isDraftModalOpen,setIsDraftModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // Track mobile state

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);


    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '28%' : '28%',
                maxHeight: isMobile ? '80%' : '80%',
                width: isMobile ? '75%' : '60%',
                maxWidth: isMobile ? '90%' : '80%',
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

    const handleSubmit = () => {
        senData(titleData);
        closeModal();
    }

    const openDraftModal = () => {
        setIsDraftModalOpen(true);
      }
  
      const closeDraftModal = () => {
        setIsDraftModalOpen(false);
      };
    
  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Title Modal"
            style={getModalStyle()}
            shouldCloseOnOverlayClick={false}
        >
            <div className='w-full flex justify-end'>
                <button className='underline underline-offset-2 text-cyan-900 text-sm md:text-lg hover:text-cyan-600' 
                    onClick={openDraftModal}
                >
                    View Draft Articles
                </button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault(); 
                handleSubmit();
            }}>
                    
                <div className='flex flex-col '>
                    <label htmlFor="title" className='mx-0.5'><span className='text-red-500'>*</span>Enter Title:</label>
                    <input type="text" required id='title'
                        placeholder='Title' 
                        className=' p-2 mx-0.5 w-full text-base font-semibold border border-stone-300'
                        value={titleData}
                        onChange={(e) => {setTitleData(e.target.value);}}
                        maxLength={120}
                    />
                    <div className='w-full flex items-center justify-center'>
                    <button type='submit' 
                        className=' rounded text-white px-4 py-1 md:ml-auto mt-5 md:mt-5 bg-red-700 hover:bg-red-800'>
                        Submit 
                    </button>
                    </div>
                </div>                
            </form>
        </ReactModal>
        
        <DraftModal isOpen={isDraftModalOpen} closeModal={closeDraftModal} uid={uid} />
    </>
  )
}

export default TitleModal
