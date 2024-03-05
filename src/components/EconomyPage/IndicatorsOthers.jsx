'use client'

import React from 'react'
import EconomyTable from './EconomyTable/EconomyTable'

const IndicatorsOthers = ({ OthersData }) => {
  return (
    <>
        <div className='lg:text-2xl text-[#143b64] font-semibold '>
            <div>{"Indicators Others"}</div>
        </div>

        <div className=' mt-2 md:mt-4 p-0.5 md:p-3 border rounded-md border-gray-300 shadow-md'>
            <EconomyTable Data={OthersData} />
        </div>
    </>
  )
}

export default IndicatorsOthers
