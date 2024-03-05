"use client"

import React, { useEffect,useState } from 'react'
import ReactModal from 'react-modal';
import Moment from 'react-moment';
import axios from 'axios';

import Loader from '../Loader';
import ConfirmationModal from '../ProfilePageComponents/ConfirmationModal';

import { AiFillCloseCircle } from 'react-icons/ai';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';


const DraftModal = ({ isOpen, closeModal,uid }) => {

    const [draftArticles,setDraftArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [articleId,setArticleId] = useState(null);
    const [isConfirmationModalOpen,setIsConfirmationModalOpen] = useState(false);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
      };
    
      const toggleReload = () => {
        setReload((prev)=>!prev);
    }
    
      const handleDelete = (article_Id) => {
        setArticleId(article_Id);
        setIsConfirmationModalOpen(true);
    }

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
      
    const fetchData = async () => {
        if(uid){
            try {
                const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-draft', {
                    user_id:uid,
                });
         
                setDraftArticles(response.data.draft);
                setIsLoading(false);
                
            } catch (error) {
                console.error(error);
            }
        }
    };

    
    useEffect(()=>{
        fetchData();
    },[uid,reload])


    return (
        <>
        <div>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Draft Modal"
                style={modalStyle}
            >
                {isLoading ? (
                    <div className='flex items-center mt-[20%] justify-center'>
                        <Loader />
                    </div>
                ):(
                    <>
                        <div className='w-full flex justify-end'>
                            <button className='' onClick={closeModal}>
                                <AiFillCloseCircle size={"1.5em"} />
                            </button>
                        </div>

                        <div className='flex flex-col mt-6 mx-1 md:mx-28 md:my-10 md:p-1'>
                            <div className=''>
                                <div className='text-3xl font-semibold '>
                                    Drafts
                                </div>
                            </div>
                            <hr className='my-2 md:my-3 border border-black'/>

                            {draftArticles.length === 0 ? (
                                <>
                                    {/* Info for 0 articles */}
                                    <div className='bg-white text-center mt-3 rounded border border-black p-5'>
                                        <span className='font-semibold text-sm md:text-base'>
                                            {"Get started with writing an article. Reach 100,000+ Engaged Readers! Boost your reputation, network with finance experts. Educate, inspire, and be part of our thriving community. Empower investors worldwide with your valuable insights!"}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Mapping Draft Articles */}
                                    <div className='px-1 overflow-y-auto rounded border border-gray-300 h-96 md:h-64 '>
                                        {draftArticles?.map((item,index) =>(
                                            <div key={index} className='flex flex-row md:mx-3'>
                                            <Link 
                                                href={`/blogs/create-article/${item?.article_id}`}
                                                className='w-full my-2 border-black border hover:bg-stone-100 cursor-pointer rounded-l'
                                            >
                                                <div  onClick={closeModal}>
                                                    <div className='px-2 py-1'>
                                                        <div className='md:text-xl font-semibold line-clamp-1'>
                                                            {item?.title}
                                                        </div>
                                                        <div className='text-xs md:text-sm line-clamp-3 h-16'>
                                                            {item?.synopsis}
                                                        </div>
                                                        <span className='text-xs text-neutral-500'>
                                                        {`${formatDate(item?.updated_datetime)} `}
                                                        </span>
                                                        <span className='text-xs text-neutral-500'>
                                                            • <Moment fromNow>{item?.updated_datetime}</Moment>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div 
                                                className='flex items-center justify-center bg-red-700 hover:bg-red-800 my-2 rounded-r w-14 md:w-16 cursor-pointer   border-y border-r border-black'
                                                onClick={()=>{handleDelete(item?.article_id)}}
                                            >
                                                <div className=' text-xl md:text-2xl text-white'>
                                                    <RiDeleteBin5Fill />
                                                </div>
                                            </div>
                                        </div>
                                        ))}

                                    </div>
                                </>
                            )}

                        </div>
                    </>
                )}
                
            </ReactModal>
        </div>
        <ConfirmationModal isOpen={isConfirmationModalOpen} closeModal={closeConfirmationModal} articleId={articleId} toggleReload={toggleReload}/>
        </>
    )
}

export default DraftModal
