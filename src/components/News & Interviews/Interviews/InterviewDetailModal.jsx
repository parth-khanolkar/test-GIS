"use client"

import React, { useEffect,useRef,useState } from 'react'
import ReactModal from 'react-modal';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

import { IoArrowBackCircleOutline, IoSend } from "react-icons/io5";
import { BiMessageRoundedDots } from 'react-icons/bi';
import { useInfoContext } from '@/context/info';
import { RxCross2 } from 'react-icons/rx';
import { setRequestMeta } from 'next/dist/server/request-meta';
import ChatMessage from './ChatMessage';
import { RiRobot2Fill } from 'react-icons/ri';
import Head from 'next/head';

const InterviewDetailModal = ({ isOpen,interviewId }) => {
    const { uid } = useInfoContext();

    const [ isSummaryActive, setIsSummaryActive ] = useState(true);
    const [ isChatActive, setIsChatActive ] = useState(false);

    const [ isDataLoading, setIsDataLoading ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);

    const [ title, setTitle ] = useState('');
    const [ videoLink, setVideoLink ] = useState('');

    const [ transcript, setTranscript ] = useState([]);
    const [ summary, setSummary ] = useState([]);
    
    const [ userQuestion,setUserQuestion ] = useState('');
    const [ messageArray,setMessageArray ] = 
        useState([
            {
                inputBy:'bot',
                message:'Hi, what would you like to learn about this Earning call?' ,
            },
        ]);

    const modalStyle = {
        content: {
            height: '100%',
            maxHeight: '100%', 
            width: '100%', 
            maxWidth: '100%', 
            margin: 'auto', 
            backgroundColor: '#15385D',
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: -40,
            right: 40,
            bottom: 0,
            zIndex: 999,
          },
    };

    const getInterviewDetail = async () => {
        setIsDataLoading(true);
        try {
            const response = await axios.post(`https://transcriptanalyser.com/interview/interview_detail`,{
                interview_id: interviewId
            });

            setTranscript(response.data?.transcript.split('\n'));
            setSummary(response.data?.summary.split('\n'));
            
            setTitle(response.data?.description);
            setVideoLink(response.data?.news_link);

            if(response.status === 200){
                setIsDataLoading(false);
            }
        } catch (error) {
            console.log("Error in getInterviewDetail :",error);
        }
    }
    useEffect(()=>{
        if(interviewId !== 0){
            getInterviewDetail();
            setMessageArray([{inputBy:'bot',message:'Hi, what would you like to learn about this Interview?' }]);
        }
    },[interviewId]);

    // const closeInterviewModal = () => {
    //     setIsSummaryActive(true);
    //     setIsChatActive(false);
    //     setUserQuestion('');
    //     closeModal();
    // }

    const getAnswer = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post('https://transcriptanalyser.com/interview/interview_chat',{
                interview_id: interviewId,
                question: userQuestion,
            });
            
            if(response.data.data){
                setMessageArray((prevMessages) => [
                    ...prevMessages,
                    { inputBy: 'bot', message: response.data.data.answer },
                ]);
                // executeScrollIntoView();
                setIsLoading(false);
            }


        } catch (error) {
            console.log("Error in getAnswer: ",error);
        }
    }

    const executeScrollIntoView = () => {
        var id1 = document.getElementById('scroller');
        if (id1) {
          id1.scrollIntoView({
            behavior: 'smooth',
            inline: 'nearest',
          });
        }
      };
    
      useEffect(() => {
        executeScrollIntoView();
      }, [messageArray]);


    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <ReactModal
                isOpen={isOpen}
                // onRequestClose={closeInterviewModal}
                contentLabel="Interview Page Modal"
                style={modalStyle}
            >
                <div className='h-full relative'>
                    <div className='w-full flex justify-start mb-1'>
                        <Link href={`/interviews`} className='flex items-center justify-center rounded-full text-white text-2xl md:text-4xl'>
                            <IoArrowBackCircleOutline />
                        </Link>
                    </div>

                    <div className='flex flex-col lg:flex-row gap-3 lg:mx-10 mt-auto'>
                        {/* Video & Summary */}
                        <div className='flex flex-col gap-3 lg:w-1/2'>
                            <div className='w-full '>
                                <span className='text-white md:text-xl lg:text-2xl'>
                                    {title}
                                </span>
                            </div>
                            <div className=''>
                                <iframe src={videoLink} className='w-full md:h-[45vh] lg:h-[58vh]'></iframe>
                            </div>
                        </div>

                        {/* SUMMARY & Transcript */}
                        <div className='w-full h-full lg:w-1/2 flex flex-col gap-2'>
                            {/* SUMMARY & TRANSCRIPT Buttons */}
                            <div className='grid grid-cols-2 gap-3'>
                                <button className={`border border-white rounded-md py-2 md:text-lg font-semibold tracking-wider
                                    ${
                                        isSummaryActive ? ('bg-white text-[#15385D]'):('text-white')
                                    }
                                `}
                                    onClick={()=>{setIsSummaryActive(true)}}
                                >
                                    {'Summary'}
                                </button>
                                <button className={`border border-white rounded-md py-2 md:text-lg font-semibold tracking-wider
                                    ${
                                        !isSummaryActive ? ('bg-white text-[#15385D]'):('text-white')
                                    }
                                `}
                                    onClick={()=>{setIsSummaryActive(false)}}
                                >
                                    {'Transcript'}
                                </button>
                            </div>
                            <div className='bg-[#0D2844] w-full p-2 md:p-4 rounded-md overflow-y-auto max-h-[40vh] md:max-h-[35vh] lg:max-h-[78vh] text-white scrollbar-thin text-sm md:text-base text-justify'>
                            {
                                isDataLoading ? (<>
                                    <div className='flex items-center mt-[65%] lg:mt-0 justify-center'>
                                        <div className="flex justify-center items-center ">
                                            <span className="relative flex h-[80px] w-[80px]">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                                            </span>
                                        </div>
                                    </div>
                                </>):(<>
                                    

                                        {
                                            isSummaryActive ? (<>
                                                    {summary.map((item, index) => (
                                                        <div key={index} className={`${(item.length === 0 ) ? ('hidden'): ('')} my-3 text-xs md:text-base`}>
                                                            {item}
                                                            {index < summary.length - 1 && <br />} 
                                                        </div>
                                                    ))}
                                            </>):(<>
                                                    {transcript.map((item, index) => (
                                                        <div key={index} className={`${(item.length === 0 ) ? ('hidden'): ('')} my-3 text-xs md:text-base`}>
                                                            {item}
                                                            {index < transcript.length - 1 && <br />} 
                                                        </div>
                                                    ))}
                                            </>)
                                        }
                                </>)
                            }
                            </div>
                        </div>
                    </div>

                    {
                        isChatActive && <>
                            {
                                uid === -1 ? (<> {/* USER NOT LOGGED IN */}
                                <div className='w-full lg:w-1/2 lg:right-0 absolute bottom-4 p-3 bg-white rounded-md'>
                                    <Link href={'/login'} className='px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md'>
                                        Login to acccess
                                    </Link>
                                </div>
                                </>):(<>
                                    <div className='w-full lg:w-1/2 lg:right-0 absolute bottom-4 p-3 mr-4  rounded-md flex flex-col gap-3'>
                                        <div className='w-full bg-white p-2 rounded-md h-[60vh] md:h-[40vh] lg:h-[80vh] overflow-y-auto '>
                                            {
                                                messageArray.map((item,index)=>(
                                                    <div key={index} className='my-3'>
                                                        <ChatMessage message={item}/>
                                                    </div>
                                                ))
                                            }
                                            {
                                                isLoading && <>
                                                    <div className='flex flex-row gap-2 justify-start mr-20'>
                                                        <div className='flex items-start justify-center'>
                                                            <div className='p-1 rounded-full bg-cyan-900 text-white'>
                                                                <RiRobot2Fill size={20}/>
                                                            </div>
                                                        </div>
                                                        <div className='py-0.5 px-3 border border-gray-400 rounded-md text-justify flex items-center justify-center gap-2'>
                                                        
                                                            <div className="w-1 h-1 rounded-full animate-pulse [animation-delay:-0.3s] bg-black" style={{ animationDuration: '1s' }}></div>
                                                            <div className="w-1 h-1 rounded-full animate-pulse [animation-delay:-0.15s] bg-black" style={{ animationDuration: '1s' }}></div>
                                                            <div className="w-1 h-1 rounded-full animate-pulse bg-black" style={{ animationDuration: '1s' }}></div>
                                                        
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            <div id='scroller'></div>
                                        </div>

                                        <form
                                            className='w-full flex flex-row gap-2 rounded-md bg-white'
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                setMessageArray((prevMessages) => [
                                                    ...prevMessages,
                                                    { inputBy: 'user', message: userQuestion },
                                                ]);

                                                getAnswer();
                                                setUserQuestion('');
                                            }}
                                        >
                                            <input
                                                placeholder="Type your message..."
                                                className='w-full p-1 m-1 border focus:shadow-inner rounded-md resize-none'
                                                value={userQuestion}
                                                onChange={(e)=>{setUserQuestion(e.target.value)}}
                                            />
                                            <button type='submit' className='text-cyan-900 px-1.5 py-0.5 rounded-md'>
                                                <IoSend size={20}/>
                                            </button>
                                        </form>

                                        
                                    </div>
                                </>)
                            }
                        </>
                    }


                    <button className='absolute bottom-0 right-0 p-1 text-cyan-900 bg-white rounded-full border shadow-md' 
                        onClick={()=>{
                            setIsChatActive(prev=>!prev);
                        }}
                    >
                        {
                            isChatActive ? (<RxCross2 size={35} />):(<BiMessageRoundedDots size={35}/>)
                        }
                    </button>
                    
                </div>
            </ReactModal>
        </>
    );
  };

  export default InterviewDetailModal;
  
