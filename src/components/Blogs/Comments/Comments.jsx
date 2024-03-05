"use client"

import { useInfoContext } from '@/context/info';
import axios from 'axios';
import React, { useState } from 'react'
import { FaRegComment } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import Moment from 'react-moment'
import { toast } from 'react-toastify';

const Comments = ({ commentData,fetchAllComments }) => {

    const { uid,setUid } = useInfoContext();

    const [ isSubCommentHidden, setIsSubCommentHidden ] = useState(false);
    const [ isReplyActive, setIsReplyActive ] = useState(false);

    const [ newComment, setNewComment ] = useState('');

    const addNewSubComment = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gislanding/add-subcomment`,{
                comment_id : commentData.comment_id,
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
                setIsReplyActive(false);
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
        <div className='p-1.5 my-3 bg-white rounded-md'>
            <div className='flex flex-row gap-2'>
                <div className='w-8 h-8 md:w-9 md:h-9 rounded-full bg-cyan-900 text-white flex items-center justify-center text-sm md:text-xl'>
                    {commentData?.Name.charAt(0).toUpperCase()}
                </div>
                <div className='flex flex-col'>
                    <div className='font-semibold text-sm md:text-base'>
                        {commentData?.Name}
                    </div>
                    <div className='text-xs text-zinc-400'>
                        <Moment fromNow>{commentData.DateInserted}</Moment>
                    </div>
                </div>
            </div>
            <div className='ml-4 lg:mx-4 mt-2 border-l-2'>
                <div className='mx-3 text-gray-600 text-sm text-justify'>
                    {commentData.comment}
                </div>
                <div className='mx-2 lg:mx-5 mt-5 flex flex-row justify-between'>
                    <div className=''>
                        {
                            !isSubCommentHidden && commentData.subcomment?.length!==0  ? (
                            <button className='flex flex-row items-center justify-center gap-2 text-sm'
                                onClick={()=>{
                                    setIsSubCommentHidden(true);
                                }}
                            >
                                <div className='flex items-center justify-center'> <FaRegComment /> </div>
                                <div className=''>{"Hide replies"}</div>
                            </button>
                            ) :(
                        
                            <button className='flex items-center justify-center text-sm cursor-default'
                                onClick={()=>{
                                setIsSubCommentHidden(false);
                                }}
                            >
                                <div className='flex items-center justify-center'> <FaRegComment /> </div>
                                <div className='ml-1'>{commentData.subcomment?.length}</div>
                            </button>
                            )
                        }
                    </div>
                    {
                        uid === -1 ? (<></>) : (<>
                            <button className={`text-[#143B64] text-xs`}
                                onClick={()=>{
                                    setIsReplyActive(prev=>!prev);
                                }}
                            >
                                {
                                    isReplyActive ? (<RxCross2 size={20}/>):('Reply')
                                }
                            </button>
                        </>)
                    }
                </div>
                {
                    isReplyActive && <>
                        <form className='flex flex-row gap-1 mx-2 lg:mx-5'
                            onSubmit={(e)=>{
                                e.preventDefault();
                                addNewSubComment();
                            }}
                        >
                            <input type="text" value={newComment} className='p-1.5 border rounded-md w-full' 
                                onChange={(e)=>{
                                    setNewComment(e.target.value);
                                }}
                            />

                            <button type='submit' className='text-cyan-900'>
                                <IoSend size={20}/>
                            </button>
                        </form>
                    </>
                }
                {
                    !isSubCommentHidden && commentData.subcomment?.map((subc,index) => (
                        <div key={index} className='p-1.5 ml-5 border-gray-300 py-3 bg-white'>
                            <div className='flex flex-row gap-2'>
                                <div className='w-8 h-8 md:w-9 md:h-9 rounded-full bg-cyan-900 text-white flex items-center justify-center text-sm md:text-xl'>
                                    {subc?.Name.charAt(0).toUpperCase()}
                                </div>
                                <div className='flex flex-col'>
                                    <div className='font-semibold text-sm md:text-base'>
                                        {subc?.Name}
                                    </div>
                                    <div className='text-xs text-zinc-400'>
                                        <Moment fromNow>{subc.DateInserted}</Moment>
                                    </div>
                                </div>
                            </div>
                            <div className='mx-4 mt-3 border-l-2'>
                                <div className='ml-3 text-gray-600 text-sm text-justify'>
                                    {subc.comment}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    </>
  )
}

export default Comments
