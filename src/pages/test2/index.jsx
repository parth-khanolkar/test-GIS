'use client'

import SearchBar from '@/components/GlobalComponents/SearchBar'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'


const Test2 = () => {
  const router = useRouter();
  console.log(router);
  const Blog = "Blogssss"
  const id = "546"

  const [ company,setCompany ] = useState();

  useEffect(()=>{
    console.log("Company: ",company);
  },[company]);

  return (
    <>
      <div className='h-[80vh]'>
        <Link href={`/test?id=${id}&search=${Blog}`} className='flex items-center justify-center font-bold'>
          Link
        </Link>
          <div>
              {/* <SearchBar handleChange={()=>{}}/> */}
          </div>
        
        
      </div>
     

    </>
  )
}

export default Test2
