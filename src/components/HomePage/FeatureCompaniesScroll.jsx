import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const FeaturedCompaniesScroll = () => {

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
      <Link href={"/featuredcompanies"} className="w-full inline-flex flex-nowrap overflow-hidden bg-white lg:py-0.5">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-infinite-scroll">
          {
            featuredCompanies?.map((item,index)=>(
              <li key={index}>
                <img src={item.ImageURL} alt={item.CompanyName} className='h-12 md:h-16 w-auto py-0.5'/>
              </li>
            ))
          }
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
        {
            featuredCompanies?.map((item,index)=>(
              <li key={index}>
                <img src={item.ImageURL} alt={item.CompanyName} className='h-12 md:h-16 w-auto py-0.5'/>
              </li>
            ))
          }
        </ul>
      </Link>
      
    </>
  )
}

export default FeaturedCompaniesScroll
