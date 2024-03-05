"use client"

import { useInfoContext } from '@/context/info'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

import avatarImage from '@/assets/images/avatar.png'
import Image from 'next/image';
import { FaLinkedin, FaRegEdit, FaSlideshare } from 'react-icons/fa';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import logo from '@/assets/images/logoWithBg.png';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useDebounceCallback } from '@react-pdf-viewer/core';


const ProfilePage = () => {
    const { uid } = useInfoContext();

    const [ isLoading,setIsLoading ] = useState(true);
    const [ isEditable,setIsEditable ] = useState(false);
    const [ userData,setUserData ] = useState({})

    const [ name,setName ] = useState("");
    const [ secondaryEmail,setSecondaryEmail ] = useState("");
    const [ mobileNumber,setMobileNumber ] = useState("");
    const [ bio,setBio ] = useState("");
    const [ linkedIn,setLinkedIn ] = useState("");

    const getProfileDetails = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gisuser/fetch_profile`,{
                user_id:uid
            });

            setUserData(response.data?.data);

            setIsLoading(false);
        } catch (error) {
            console.log("Error in getProfileDetails: ",error);
        }
    }
    useEffect(() => {
        if(uid !== -1){
            getProfileDetails();
        }
    },[uid]);

    const resetValuesToOriginal = () => {
        setName(userData?.Name);
        setSecondaryEmail(userData?.SecondaryEmailId);
        if(userData.MobileNo){
            setMobileNumber(userData?.MobileNo);
        }
        setBio(userData?.bio);
        setLinkedIn(userData?.linkedin);
    }
    useEffect(()=>{
        resetValuesToOriginal();
    },[userData])


    const isEmailValid = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };
    // const isLinkedInProfileLinkValid = (linkedin) => {
    //     const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    //     return linkedinPattern.test(linkedin);
    //   };      

    const saveChanges = async () => {
        if((mobileNumber.length > 4 || mobileNumber.length === 0) && isEmailValid(secondaryEmail)){ // && isLinkedInProfileLinkValid(linkedIn)
            try {
                const response = await axios.post(`https://transcriptanalyser.com/gisuser/edit_profile`,{
                    user_id:uid,
                    name : name.length > 0 ? (name):(userData?.Name),
                    secondary_email_id : secondaryEmail.length > 0 ? (secondaryEmail) : (userData?.SecondaryEmailId),
                    mobile_no : mobileNumber.length > 0 ? (mobileNumber) : (userData?.MobileNo),
                    bio: bio.length > 0 ? (bio):(userData?.bio),
                    linkedin: linkedIn.length > 0 ? (linkedIn):(userData?.linkedin)
                });
    
                if(response.status === 200){
                    toast.success('Changes saved', {
                        position: "bottom-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                    setIsEditable(false);
                }
                
            } catch (error) {
                console.log("Error in saveChanges: ",error);
                toast.error('Server Error! Try again later.', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                resetValuesToOriginal();
                setIsEditable(false);
                
            }
        } else if(!isEmailValid(secondaryEmail)) {
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
        // else if(!isLinkedInProfileLinkValid(linkedIn)) {
        //     toast.error('Invalid LinkedIn URL!', {
        //         position: "bottom-center",
        //         autoClose: 1500,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: false,
        //         draggable: false,
        //         progress: undefined,
        //         theme: "light",
        //     });
        // } 
        else {
            toast.error('Invalid Mobile Number!', {
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

  return (
    <>
        <div className='h-[calc(100vh-47px)] bg-white overflow-y-auto scrollbar-none lg:scrollbar px-2 flex justify-center'>
            {
                isLoading ? (<>
                    <div className='flex items-center mt-[65%] lg:mt-[10%] justify-center'>
                        <div className="flex justify-center items-center ">
                            <span className="relative flex h-[80px] w-[80px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                    </div>
                </>) : (<>
                    <div className='w-[99%] md:w-[75%] lg:w-[70%] border shadow-lg rounded-md my-5 md:my-5 h-fit'>
                        <div className='bg-[#E5F0FC] flex flex-row space-x-5 py-3 md:py-6 px-5 lg:px-10 items-center'>
                            <Image src={avatarImage} alt="Profile Picture" className='w-auto h-[12vh] md:h-[10vh] lg:h-[12vh] rounded-full'/>
                            <div className='flex flex-col'>
                                <div className='text-xl md:text-3xl whitespace-nowrap'>
                                    {userData?.Name}
                                </div>
                                <div className=''>
                                    <span className='bg-[#c8dff6] px-2 py-1 rounded-[3.5px] text-xs md:text-sm capitalize'>
                                        {userData?.group_name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='px-5 lg:px-10 py-3 md:py-6'>
                            {/* Editable Data */}
                            <div className='flex justify-between'>
                                <div className='text-[#093967] text-base md:text-xl underline underline-offset-4 font-semibold'>
                                    {"Personal Information"}
                                </div>
                                <div className='flex flex-row space-x-3 items-center'>
                                    {
                                        isEditable ? (<>
                                            <button className='px-2 py-0.5 bg-[#133C66] text-white rounded-[3.5px] text-xs md:text-sm'
                                                onClick={()=>{
                                                    saveChanges();
                                                }}
                                            >
                                                {"Save"}
                                            </button>
                                            <button className='px-2 py-0.5 bg-red-700 text-white rounded-[3.5px] text-xs md:text-sm'
                                                onClick={()=>{
                                                    setIsEditable(false);
                                                    resetValuesToOriginal();
                                                }}
                                            >
                                                {"Cancel"}
                                            </button>
                                            
                                        </>):(<>
                                            <button className='px-2 py-0.5 bg-black text-white rounded-[3.5px] text-xs md:text-sm'
                                                onClick={()=>{setIsEditable(true);}}
                                            >
                                                {"Edit"}
                                            </button>
                                        </>)
                                    }
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                                <div className='col-span-1 flex flex-col border rounded-[3.5px] text-sm md:text-base'>
                                    <label htmlFor="FullName" className='bg-[#E5F0FC] py-0.5 px-1 text-xs md:text-sm'>
                                        {"Full Name"}
                                    </label>
                                    <input
                                        id='FullName'
                                        disabled={!isEditable} 
                                        type="text" 
                                        value={name}
                                        onChange={(e)=>{setName(e.target.value);}}
                                        className={`py-0.5 px-1 font-semibold  whitespace-nowrap shadow-sm
                                        ${
                                            !isEditable ? ('bg-white') : ('bg-red-50')
                                        }
                                        `}
                                    />
                                </div>
                                <div className='col-span-1 flex flex-col border rounded-[3.5px] text-sm md:text-base'>
                                    <label htmlFor="PrimaryEmail" className='bg-[#E5F0FC] py-0.5 px-1 text-xs md:text-sm'>
                                        {"Primary Email"}
                                    </label>
                                    <input
                                        id='PrimaryEmail'
                                        disabled={true} 
                                        type="text" 
                                        value={userData?.EmailId}
                                        className={`py-0.5 px-1 font-semibold  whitespace-nowrap shadow-sm bg-white`}
                                    />
                                </div>
                                <div className='col-span-1 flex flex-col border rounded-[3.5px] text-sm md:text-base'>
                                    <label htmlFor="SecondaryEmail" className='bg-[#E5F0FC] py-0.5 px-1 text-xs md:text-sm'>
                                        {"Secondary Email"}
                                    </label>
                                    <input
                                        id='SecondaryEmail'
                                        disabled={!isEditable} 
                                        type="text" 
                                        value={secondaryEmail}
                                        onChange={(e)=>{setSecondaryEmail(e.target.value);}}
                                        className={`py-0.5 px-1 font-semibold  whitespace-nowrap shadow-sm
                                        ${
                                            !isEditable ? ('bg-white') : ('bg-red-50')
                                        }
                                        `}
                                    />
                                </div>
                                <div className='col-span-1 flex flex-col border rounded-[3.5px] text-sm md:text-base'>
                                    <label htmlFor="MobileNumber" className='bg-[#E5F0FC] py-0.5 px-1 text-xs md:text-sm'>
                                        {"Mobile Number"}
                                    </label>
                                    <input
                                        id='MobileNumber'
                                        disabled={!isEditable}
                                        type="text"
                                        value={mobileNumber}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/[^+-\d\s]/g, '');
                                            setMobileNumber(numericValue);
                                        }}
                                        pattern="[0-9]*" // Allow only numeric values
                                        maxLength={15}
                                        className={`py-0.5 px-1 font-semibold  whitespace-nowrap shadow-sm
                                            ${!isEditable ? 'bg-white' : 'bg-red-50'}
                                        `}
                                    />

                                </div>
                                <div className='col-span-1 md:col-span-2 flex flex-col border rounded-[3.5px] text-sm md:text-base'>
                                    <label htmlFor="Bio" className='bg-[#E5F0FC] py-0.5 px-1 text-xs md:text-sm'>
                                        {"Bio"}
                                    </label>
                                    <textarea id="Bio" 
                                        disabled={!isEditable}
                                        value={bio}
                                        onChange={(e)=>{setBio(e.target.value);}}
                                        maxLength={350}
                                        className={`w-full resize-none h-[10vh] md:h-[15vh] py-0.5 px-1 
                                        ${
                                            !isEditable ? ('bg-white') : ('bg-red-50')
                                        }
                                        `}
                                    />
                                </div>
                                <div className='col-span-1 md:col-span-2 flex flex-col border rounded-[3.5px] text-sm md:text-base'>
                                    <label htmlFor="LinkedIn" className='bg-[#E5F0FC] py-0.5 px-1 text-xs md:text-sm flex flex-row items-center space-x-1'>
                                        <span className='bg-white text-[#0A66C2] text-lg'><FaLinkedin /></span>
                                        <span>{"LinkedIn Profile URL"}</span>
                                    </label>
                                    <input
                                        id='LinkedIn'
                                        disabled={!isEditable} 
                                        type="text"                      
                                        value={linkedIn}
                                        onChange={(e)=>{setLinkedIn(e.target.value);}}
                                        className={`py-0.5 px-1 font-semibold  whitespace-nowrap shadow-sm
                                        ${
                                            !isEditable ? ('bg-white') : ('bg-red-50')
                                        }
                                        `}
                                    />
                                </div>

                            </div>
                                
                            {/* Current Plan */}
                            <div className='text-[#093967] text-base md:text-xl underline underline-offset-4 font-semibold mt-5'>
                                {"Current Plan"}
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-5 mt-5'>
                                <div className='col-span-1 flex flex-row items-center space-x-2'>
                                    <div className='text-[12px] md:text-sm whitespace-nowrap'>{"Current Plan: "}</div>
                                    <div className=''>
                                        <span className='bg-[#c8dff6] whitespace-nowrap px-2 py-1 rounded-[3.5px] text-xs md:text-sm capitalize'>
                                            {userData?.group_name}
                                        </span>
                                    </div>
                                </div>
                                <div className='col-span-1 flex flex-row items-center space-x-2'>
                                    <div className='text-[12px] md:text-sm whitespace-nowrap'>{"Expiry Date: "}</div>
                                    <div className=''>
                                        <span className='rounded-[3.5px]  whitespace-nowrap text-sm md:text-base capitalize'>
                                            {'--/--'}
                                        </span>
                                    </div>
                                </div>
                                <div className='col-span-1 flex flex-row items-center space-x-2'>
                                    <div className='text-[12px] md:text-sm whitespace-nowrap'>{"Member Since: "}</div>
                                    <div className=''>
                                        <span className='rounded-[3.5px]  whitespace-nowrap text-sm md:text-base capitalize font-medium'>
                                            {userData?.member_since}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Subscriptions */}
                            <div className='text-[#093967] text-base md:text-xl underline underline-offset-4 font-semibold mt-5'>
                                {"Subscriptions"}
                            </div>
                            <div className='flex overflow-x-auto scrollbar-none mt-5 px-2 pb-4 h-max w-full lg:justify-center'>
                                <div className='flex space-x-5'>
                                    {/* Cards */}
                                    <div className='w-[70vw] md:w-[35vw] lg:w-[25vw] flex flex-col rounded-[3.5px] shadow-xl border px-3 md:px-5 py-2 h-full'>
                                        <div className='flex flex-col'>
                                            <div className='text-sm md:text-base font-medium'>
                                                {"Premium"}
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-between '>
                                            <div className='flex flex-col'>
                                                <div className='text-lg md:text-2xl font-semibold flex justify-center'>
                                                    {"₹ 0"}
                                                </div>
                                                <div className='font-semibold text-gray-400 flex flex-row items-center'>
                                                    <div className='text-xl md:text-3xl line-through'>{"₹ 4999"}</div>
                                                    <div className=' md:text-lg'>{"/Year"}</div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col items-end justify-end'>
                                                <div className='px-3 py-1.5 bg-[#FFEEB4] rounded-[3.5px]'>
                                                    {"Pro"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='border-t-2 border-gray-300 mt-3 flex justify-center'>
                                            <div className='py-1.5 px-3 bg-[#19AF55] font-medium text-white text-xs md:text-sm'>
                                                {"Early Bird Offer"}
                                            </div>
                                        </div>
                                        <div className='my-5'>
                                            <ul className='space-y-4'>
                                                <li className='flex flex-row items-center space-x-2'>
                                                    <span className='text-green-600 text-lg md:text-xl'><BsFillPatchCheckFill /></span>
                                                    <span className='text-xs md:text-xs'>{"GIIN Membership"}</span>
                                                </li>
                                                <li className='flex flex-row items-center space-x-2'>
                                                    <span className='text-green-600 text-lg md:text-xl'><BsFillPatchCheckFill /></span>
                                                    <span className='text-xs md:text-xs'>{"Exclusive Blogs Access"}</span>
                                                </li>
                                                <li className='flex flex-row items-center space-x-2'>
                                                    <span className='text-green-600 text-lg md:text-xl'><BsFillPatchCheckFill /></span>
                                                    <span className='text-xs md:text-xs'>{"Customized Alerts"}</span>
                                                </li>
                                                <li className='flex flex-row items-center space-x-2'>
                                                    <span className='text-green-600 text-lg md:text-xl'><BsFillPatchCheckFill /></span>
                                                    <span className='text-xs md:text-xs'>{"Technical Analysis Tools"}</span>
                                                </li>
                                                <li className='flex flex-row items-center space-x-2'>
                                                    <span className='text-green-600 text-lg md:text-xl'><BsFillPatchCheckFill /></span>
                                                    <span className='text-xs md:text-xs'>{"Educational Resources"}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='mt-auto mb-3 flex justify-center items-center'>
                                            <div className='px-2.5 py-1 rounded-[3.5px] text-white bg-[#093967] font-semibold text-[11px] md:text-sm'>
                                                {"UPGRADE YOUR INVESTING"}
                                            </div>
                                        </div>

                                    </div>

                                    <div className='w-[70vw] md:w-[35vw] lg:w-[25vw] flex flex-col rounded-[3.5px] shadow-xl border px-3 md:px-5 py-2 h-full'>
                                        <div className='flex flex-col'>
                                            <div className='text-sm md:text-base font-medium'>
                                                {"Enterprise"}
                                            </div>
                                            <div className='text-[10px] md:text-xs'>
                                                {"For the vig community, teams and experienced users"}
                                            </div>
                                        </div>
                                        <div className='flex justify-center md:mt-1.5 lg:mt-10'>
                                            <div className='text-[11px] md:text-[13px]'>
                                                {"*Pricing for this plan depends on your requirements"}
                                            </div>
                                        </div>
                                        <div className='border-t-2 border-gray-300 my-3'/>
                                        <div className='flex justify-center'>
                                            <Image src={logo} alt='Logo' className='w-[60%] h-auto'/>
                                        </div>
                                        <div className='text-justify text-[12px] md:text-[12px]'>
                                            {"We provide a customized Enterprise Plan to meet the specific needs of businesses. It includes customizable features for enhanced operational efficiency. Contact us for more information."}
                                        </div>
                                        <div className='mt-auto mb-3 flex justify-center items-center'>
                                            <Link href={`/contactus`} className='px-2.5 py-1 rounded-[3.5px] text-white bg-[#093967] font-semibold text-[11px] md:text-sm'>
                                                {"GET CUSTOM PLAN"}
                                            </Link>
                                        </div>


                                    </div>
                                </div>
                            </div>



                        </div>

                    </div>

                </>)
            }
        </div>
    </>
  )
}

export default ProfilePage

ProfilePage.requireAuth = true;
