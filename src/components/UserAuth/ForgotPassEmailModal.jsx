'use client'


import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassEmailModal = ({ isOpen, closeModal,type }) => {


    const [isMobile, setIsMobile] = useState(false);   
    const [ emailId,setEmailId ] = useState(''); 
    const [ OTP,setOTP ] = useState('');
    const [ UserOTP,setUserOTP ] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '45%' : '50%',
                maxHeight: isMobile ? '45%' : '50%',
                width: isMobile ? '83%' : '50%',
                maxWidth: isMobile ? '83%' : '50%',
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

    const isEmailValid = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const sendPasswordResetLink = async () => {
        if(isEmailValid(emailId)){
            try {
                const response = await axios.post(`https://transcriptanalyser.com/gisuser/reset-password`,{
                    emailid: emailId
                });
                
                if(response.data?.Message === "user not found"){
                    toast.error('User not found!', {
                        position: "bottom-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                } else if(response.data?.Status === "Success"){
                    toast.success('Link sent. Please check mail.', {
                        position: "bottom-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                    closeThisModal();
                }

            } catch (error) {
                console.log("Error in sendPasswordResetLink: ",error);
                toast.error('Server error! Try again later.', {
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
        } else {
            toast.error('Invalid Email Id!', {
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
    }

    const sendOTPForgotEmail = async () => {
        if(isEmailValid(emailId)){
            try {
                const response = await axios.post(`https://transcriptanalyser.com/gisuser/edit_profile`,{
                    emailid: emailId
                });

                if(response.status === 200){
                    toast.error('OTP sent. Please check mail.', {
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
                setOTP(response.data?.otp);

            } catch (error) {
                console.log("Error in sendPasswordResetLink: ",error);
                toast.error('Server error! Try again later.', {
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
        } else {
            toast.error('Invalid Email Id!', {
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
    }

    const sendLinkForgotEmail = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gisuser/update-email`,{
                emailid: emailId,
                otp: OTP,
            });

            if(response.status === 200){
                toast.error('Link sent. Please check mail.', {
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
            console.log("Error in sendPasswordResetLink: ",error);
            toast.error('Server error! Try again later.', {
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
    }

    const closeThisModal = () => {
        setEmailId("");
        closeModal();
    }
    

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeThisModal}
            contentLabel="Alert Modal"
            style={getModalStyle()}
        >
            <div className='h-full'>
                    {/* HEADER */}
                <div className='flex flex-row justify-between border-b border-gray-300 pb-2'>
                    <div className='flex items-center'>
                        <span className='text-base md:text-lg font-semibold'>
                            {
                                type === "password" ? ("Forgot Password") : ("Forgot Email")
                            }
                        </span>
                    </div>
                    <button className='flex items-center'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle size={18}/>
                    </button>
                </div>

                {/* Rest of the Modal */}
                {
                    type === "password" ? (<>
                    <form className='flex flex-col justify-center mt-5 lg:mx-20'
                        onSubmit={(e)=>{
                            e.preventDefault();
                            sendPasswordResetLink();
                        }}
                    >
                        <label htmlFor="emailId" className='mb-3'>{"Email Id"}</label>
                        <input 
                            type="text"
                            value={emailId}
                            onChange={(e)=>{
                                setEmailId(e.target.value);
                            }}
                            className='px-1.5 py-1 border border-gray-300 w-full mb-5'
                        />
                        <div className='flex items-center justify-center'>
                            <button type='submit' className='px-3 py-1.5 bg-[#143b64] text-white font-semibold rounded-[3.5px]'>
                                {"Submit"}
                            </button>
                        </div>

                    </form>
                    </>):(<>
                        <form className='flex flex-col justify-center mt-5 lg:mx-20'
                            onSubmit={(e)=>{
                                e.preventDefault();
                                sendOTPForgotEmail();
                            }}
                        >
                            <label htmlFor="emailId" className='mb-3'>{"Email Id"}</label>
                            <input 
                                type="text"
                                value={emailId}
                                placeholder='Email Id'
                                onChange={(e)=>{
                                    setEmailId(e.target.value);
                                }}
                                className='px-1.5 py-1 border border-gray-300 w-full mb-5'
                            />
                            <div className='flex items-center justify-end'>
                                <button type='submit' className='px-3 py-1.5 bg-[#143b64] text-white font-semibold rounded-[3.5px]'>
                                    {"Submit OTP"}
                                </button>
                            </div>

                        </form>
                        <form className='flex flex-col justify-center mt-5 lg:mx-20'
                            onSubmit={(e)=>{
                                e.preventDefault();
                                if(UserOTP == OTP && UserOTP.length > 0){
                                    sendLinkForgotEmail();
                                } else {
                                    toast.error('Invalid OTP!', {
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
                            }}
                        >
                            <input 
                                type="password"
                                value={UserOTP}
                                placeholder='OTP'
                                disabled = {!isEmailValid(emailId) || emailId.length === 0}
                                onChange={(e)=>{
                                    setUserOTP(e.target.value);
                                }}
                                className='px-1.5 py-1 border border-gray-300 w-full mb-5'
                            />
                            <div className='flex items-center justify-center'>
                                <button type='submit' className='px-3 py-1.5 bg-[#143b64] text-white font-semibold rounded-[3.5px]'>
                                    {"Submit"}
                                </button>
                            </div>

                        </form>
                    </>)
                }

            </div>
        </ReactModal>
      
    </>
  )
}

export default ForgotPassEmailModal
