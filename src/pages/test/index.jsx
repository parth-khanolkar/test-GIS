'use client'

import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Test = () => {
  const router = useRouter();
  console.log(router);

  const searchParams = useSearchParams()
 
  const id = searchParams.get('id')
  const search = searchParams.get('search')

  return (
    <>
        <div className='flex items-center justify-center font-bold text-3xl'>
          {search} & {id}
        </div>
    </>
  )
}

export default Test
