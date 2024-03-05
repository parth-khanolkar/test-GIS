"use client"

import React, { useEffect,useState } from 'react'
import ReactModal from 'react-modal';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';


import { CgAdd } from 'react-icons/cg';
import { AiFillCloseCircle } from 'react-icons/ai';  

const InfoModal = ({ isOpen, closeModal,uid }) => {
    const [modalData,setModalData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    
    const modalStyle = {
        content: {
            height: '70%',
            maxHeight: '80%', 
            width: '80%', 
            maxWidth: '80%', 
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

    useEffect(() => {
        const fetchData = async () => {
            if(uid !== -1){
                setIsLoading(true);
                try {
                    const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-explore', {
                        user_id:uid,
                    });
            
                    setModalData(response.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [isOpen])



    return (
        <>
            <div className=''>
                <ReactModal
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={modalStyle}
                >
                    {isLoading ? (
                        <div className='flex items-center mt-[65%] lg:mt-[10%] justify-center'>
                            <div className="flex justify-center items-center ">
                            <span className="relative flex h-[80px] w-[80px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                        </div>
                        ):(
                        <>
                        <div className='w-full flex justify-end'>
                            <button className='' onClick={closeModal}>
                                <AiFillCloseCircle size={"1.5em"} />
                            </button>
                        </div>



                        <div className='flex justify-center items-center h-[80%] md:h-[90%]'>
                            <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                                <div className='p-2 md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-zinc-500'>
                                    {/* Insert Image here */}
                                    <div className='flex flex-col items-center justify-center h-full'>
                                        { modalData?.profile_complete_status ? (
                                            <>
                                                <div className='flex flex-col items-center justify-center -mt-5'>
                                                    <div className='text-red-600 font-semibold text-xl'>
                                                        Profile Complete!
                                                    </div>
                                                
                                                    <div className='my-4 md:mt-6'>
                                                    <Link href={`/blogs/profile`}>
                                                        <img src={modalData?.profile_img} alt="Profile logo" className='h-20 w-20 md:h-32 md:w-32 hover:p-1.5 p-0.5 border border-stone-600 shadow-md rounded-full object-cover ' />
                                                    </Link>
                                                    </div>
                                                </div>
                                            </>
                                        ):(
                                            <>
                                                <div className='md:-mt-10'>
                                                    <span className='text-red-600 font-semibold text-xl'>
                                                        Complete Your Profile
                                                    </span>
                                                </div>
                                                <div className='my-4 md:mt-6'>
                                                <Link href={`/blogs/profile`}>
                                                    <img src={modalData?.profile_img}alt="Profile logo" className='h-20 w-20 md:h-32 md:w-32  hover:p-1.5 p-0.5 border border-stone-600 shadow-md rounded-full object-cover' />
                                                </Link>
                                                </div>

                                                <div className='border border-black h-1.5 w-[50%]'>
                                                    <div className='bg-red-600 w-[70%] h-full'  >
                                                        <span className='text-white'>-</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='p-2 md:w-1/2 flex flex-col justify-center items-center'>
                                    <div className='text-center font-semibold mb-5'>
                                        {modalData.intro}
                                    </div>

                                    <div className='mt-5 -mb-3'>
                                        <button>
                                            <Link href={`/blogs/create-article/0`} className='flex flex-row bg-red-700 hover:bg-red-800 p-1 rounded shadow-sm text-white cursor-pointer'>
                                                <span className='p-0.5 pr-1.5'>
                                                    Write Article
                                                </span>
                                                <span className="text-white flex items-center">
                                                    <CgAdd className="fill-current" />
                                                </span>
                                            </Link>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>


                        </>
                    )}
                </ReactModal>
            </div>
        </>
    );
  };

  export default InfoModal;
  
