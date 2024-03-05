import React, { useEffect, useState } from 'react'
import { IoLocationOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { MdCall } from 'react-icons/md'
import { RiMailSendLine } from 'react-icons/ri';
import { LuClock5 } from "react-icons/lu";
import axios from 'axios';

const ContactUs = () => {
    const [ name,setName ] = useState('');
    const [ emailId,setEmailId ] = useState('');
    const [ message,setMessage ] = useState('');

    useEffect(()=>{
        if(typeof window !== 'undefined' && window.localStorage){
            setName(window.localStorage.getItem("UserName"));
            setEmailId(window.localStorage.getItem("UserEmail"));
        }
    },[])

    const submitMail = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/masked/contact_us',{
                Name:name,
                EmailId:emailId,
                Message:message,
                url:1
            });
            
            console.log("Response --> ",response.data);
            if(response.data.Status === "Success"){
                alert('Message Delivered!');
                toast.success(`Message Delivered!`,{
                    position: "bottom-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setMessage('');
            }
            
        } catch (error) {
            console.log("Error in submitMail: ",error);
        }
        // try {
        //     const response = await axios.post('https://transcriptanalyser.com/masked/contact_us',{
        //         Name:name,
        //         EmailId:emailId,
        //         Message:message,
        //         url:0
        //     });
            
        //     console.log("Response --> ",response.data);
                        
        // } catch (error) {
        //     console.log("Error in submitMail: ",error);
        // }
    }

  return (
    <>
        <div className='bg-[#f4f4f4] h-[calc(100vh-56px)]  overflow-y-auto overflow-x-hidden flex items-center justify-center lg:p-10'>
            <div className='bg-white w-full h-full overflow-y-auto scrollbar-none lg:rounded-md md:p-10 lg:shadow-md'> 
            {/* Main white div */}
                <div className='w-full md:hidden bg-[#143B64] text-white flex items-center justify-center py-2 sticky top-0'>
                    <span className='text-xl font-semibold'>Contact Us</span>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 py-1.5 md:py-0 px-3'>
                    <div className='col-span-1 flex flex-col '>
                        <div className='w-full md:flex justify-start text-3xl font-semibold hidden mb-3 -ml-3'>
                            Contact Us
                        </div>
                        <div className='text-justify'>
                            {"Let's connect! We're here to help, and we'd love to hear from you! Whether you have a question, a comment, or just want to chat, you can reach out to us through the contact form on this page, or by phone, email, or social media."}
                        </div>
                        
                        <div className='grid grid-cols-2 w-full gap-3 mt-3'>
                            <a href={`https://wa.me/917710971806`} target='_blank' className='col-span-1 w-full py-2 bg-[#143B64] hover:bg-cyan-950 text-white flex flex-row items-center justify-center rounded-md space-x-3'>
                                <div className='flex items-center justify-center md:text-2xl bg-[#34b740] bourder border-black rounded-full'><IoLogoWhatsapp /></div>
                                <span className='hidden md:inline-block md:text-lg'>{"Message us on WhatsApp"}</span>
                                <span className='text-sm md:hidden'>{"WhatsApp"}</span>
                            </a>
                            <a href={`tel:+91 22 62640831`} className='col-span-1 w-full py-2 bg-[#143B64] hover:bg-cyan-950 text-white flex flex-row items-center justify-center rounded-md space-x-3'>
                                <div className='flex items-center justify-center md:text-2xl'><MdCall /></div>
                                <span className='text-sm md:text-lg'>{"Call us"}</span>
                            </a>
                            
                        </div>

                        <form className='w-full mt-5 flex flex-col gap-5'
                            onSubmit={(e)=>{
                                e.preventDefault();
                                submitMail();
                            }}
                        >
                            <input required type="text" id='Name' placeholder='Name' value={name} 
                                onChange={(e)=>{setName(e.target.value)}}
                                className='w-full p-2 border border-gray-300 rounded-md'
                            />
                            <input required type="text" id='EmailId' placeholder='Email Id' value={emailId} 
                                onChange={(e)=>{setEmailId(e.target.value)}}
                                className='w-full p-2 border border-gray-300 rounded-md'
                            />
                            <textarea required type="text" id='Message' placeholder='Message' value={message} 
                                onChange={(e)=>{setMessage(e.target.value)}}
                                className='w-full p-2 border border-gray-300 rounded-md h-32 resize-none'
                            />
                            <button type='submit' className='py-2 bg-[#143B64] hover:bg-cyan-950 text-white flex flex-row items-center justify-center rounded-md space-x-3 '>
                                <div className='flex items-center justify-center md:text-lg'><RiMailSendLine /></div>
                                <span className='text-sm md:text-base'>Send</span>
                            </button>
                        </form>

                    </div> {/* Left Half */}

                    {/* <div className='col-span-1 flex flex-col border md:border-none border-gray-300 rounded-md shadow-md md:shadow-none'> */}
                    <div className='col-span-1 flex flex-col '>
                        <div className='w-full flex items-center justify-center text-2xl'>
                            {"Better Yet, See Us In Person!"}
                        </div>
                        <div className='w-full text-center mt-2 md:text-lg flex items-center justify-center'>
                            {"We love our customers, so feel free to visit during normal business hours."}
                        </div>

                        <div className='bg-[#143B64] h-56 mt-2 rounded-md flex flex-col gap-3 text-white p-4'>
                            <div className='flex items-end justify-center md:text-xl font-semibold whitespace-nowrap'>
                                {"Go India Stocks - A Unit of Go India Advisors"}
                            </div>
                            <div className='flex flex-col md:mx-10 gap-5'>
                                <div className='flex flex-row gap-5'>
                                    <div className='flex items-center justify-center'>
                                        <IoLocationOutline />
                                    </div>
                                    <div className=''>
                                        {"Parinee Crescenzo, B wing, 10th Floor, BKC, Bandra (East), Mumbai - 400051"}
                                    </div>
                                </div>
                                <div className='flex flex-row gap-5'>
                                    <div className='flex items-center justify-center'>
                                        <MdCall />
                                    </div>
                                    <div className='hover:underline underline-offset-2 cursor-pointer'>
                                        {"+91 22 62640831"}
                                    </div>
                                </div>
                                <div className='flex flex-row gap-5'>
                                    <div className='flex items-center justify-center'>
                                        <LuClock5 />
                                    </div>
                                    <div className=''>
                                        {"Open Mon - Fri (09:00 am - 05:00 pm)"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        

                    </div> {/* Right Half */}

                </div>
                
            </div> {/* Main white div */}
        </div>
      
    </>
  )
}

export default ContactUs
