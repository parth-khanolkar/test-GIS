import SideBar from '@/components/HomePage/SideBar';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import logo from '@/assets/images/logo.png'
import Image from 'next/image';

const FeaturedCompaniesPage = () => {
    const [featuredCompanies,setFeaturedCompanies] = useState([]);

    const fetchData = async () => {
        try {
        const response = await axios.get("https://transcriptanalyser.com/homepage/featured_com");
        setFeaturedCompanies(response.data);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    }
    useEffect(()=>{
        fetchData();
    },[]) 
  return (
    <>
       <div className='w-full flex flex-row fixed top-0 bg-white border-b border-gray-400'>
            <Link href={"/"} className='text-xs md:text-xl font-semibold p-1 md:p-2 flex flex-row items-center ml-10'>
                <div className='px-2'>
                <Image
                    src={logo}
                    alt=""
                    className='w-auto h-[25px]'
                />
                </div>
                <span className="text-cyan-900  font-semibold mr-1">GO INDIA</span><span className="text-red-700  font-semibold ">STOCKS</span>
            </Link>
        </div>


        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-16 m-4 p-6 border border-gray-400 rounded-md z-0'>
        {
            featuredCompanies?.map((item,index)=>(<>
            <Link href={`/companyinfo/${item.FinCode}`} key={index} className='col-span-1 border border-stone-500 rounded-md flex flex-col p-2 group'>
                <div className='flex items-center justify-center h-12 md:h-20'>
                <img src={item.ImageURL} alt={item.CompanyName} className='h-12 md:h-20 w-auto py-0.5 md:group-hover:h-14'/>
                </div>
                <div className='w-full flex items-center justify-center mt-2 '>
                <span className='text-xs md:text-sm'>{"MCap "}</span>
                <span className='text-xs md:text-sm text-cyan-900 font-semibold ml-1'>{`Rs. Cr ${item.MCAP}`}</span>
                </div>
            </Link>
            </>))

        }
        
        </div>
        
    </>
  )
}

export default FeaturedCompaniesPage
