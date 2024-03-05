"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { RxCross1 } from 'react-icons/rx'
import Moment from 'react-moment'
import Comments from './Comments'
import { useInfoContext } from '@/context/info'
import Link from 'next/link'
import { toast } from 'react-toastify'


const MainCommentsComponent = ({ isCommentsOpen,openComments,closeComments,note_id,note_type }) => {

    const { uid,setUid } = useInfoContext();

    const [ allComments,setAllComments ] = useState([]);

    const [ newComment,setNewComment ] = useState('');

    const fetchAllComments = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gislanding/article-comment`,{
                note_id : note_id,
                note_type: note_type
            });

            setAllComments(response.data.key);
    
        } catch (error) {
            console.log("Error in fetchAllComments:",error);
        }
    }
    
    useEffect(()=>{
        if(note_id && note_type)
        {
            fetchAllComments();
        }
    },[note_type,note_id])
    
    const addNewComment = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gislanding/add-comment`,{
                note_id : note_id,
                note_type: note_type,
                user_id: uid,
                comment: newComment
            });

            if(response.data.key === 'ok'){
                toast.success('Comment added', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                fetchAllComments();
                setNewComment('');
            } else {
                toast.error('Error! Try again.', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.log("Error in addNewComment:",error);
        }
    }

  return (
    <>
      <div className={`z-50 w-[85vw] md:w-[40vw] lg:w-[30vw] bg-[#F6F6F6] h-[calc(100vh-56px)] fixed right-0 flex flex-col ease-in-out duration-500  shadow-md p-1 transform overflow-y-auto overflow-x-hidden
            ${isCommentsOpen ? "translate-x-0 " : "translate-x-full"}
        `}>

            <div className='flex flex-row justify-between mx-2 lg:mx-5'>
                <div className='text-2xl lg:text-3xl tracking-wide '>
                    {"Comments"}
                </div>
                <button className='text-lg lg:text-2xl flex items-center justify-center'
                    onClick={()=>{
                        closeComments()
                    }}
                >
                    <RxCross1 />
                </button>
            </div>

            {
                uid === -1 ? (<>
                    <div className='px-2 lg:px-5 py-2 lg:py-3 mb-2 border-b border-gray-300 flex items-center justify-center'>
                        <Link href={'/loginpage'} className=' px-5 py-2.5 bg-red-600 hover:bg-red-800 text-white rounded-md'>
                            {"Login to Comment"}
                        </Link>
                    </div>
                </>):(<>
                    <div className='px-2 lg:px-5 py-2 lg:py-3 mb-2 border-b border-gray-300 flex flex-col space-y-2'>
                        <textarea className='w-full resize-none text-sm md:text-base h-[10vh] md:h-[15vh] p-2 border border-gray-900 rounded-md' placeholder='Share your thoughts...'
                            value={newComment}
                            onChange={(e)=>{
                                setNewComment(e.target.value);
                            }}
                        />
                        <div className='w-full flex justify-end'>
                            <button className='p-1.5 bg-cyan-900 hover:bg-cyan-950 text-white rounded-md'
                                onClick={()=>{
                                    addNewComment();
                                }}
                            >
                                <IoSend />
                            </button>
                        </div>
                    </div>
                </>)
            }

            <div className='mx-2 lg:mx-5 h-full overflow-y-auto scrollbar-none'>
                {
                    allComments?.map((comm,index)=>(
                        <Comments key={index} commentData={comm} fetchAllComments={fetchAllComments}/>
                    ))
                }
            </div>

        </div>
    </>
  )
}

export default MainCommentsComponent
