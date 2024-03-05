'use client'

import { useBulkBlockContext } from '@/context/BulkBlockContext';
import React from 'react'
import Moment from 'react-moment'

const EconomyTable = ({ Data }) => {
  const { indicatorId,setIndicatorId,indicatorDatasetId,setIndicatorDatasetId,isEconomyGraphModalOpen,setIsEconomyGraphModalOpen,openEconomyGraphModal,closeEconomyGraphModal } = useBulkBlockContext();

  return (
    <>
      <div className='overflow-x-auto w-full rounded-md overflow-y-auto max-h-[60vh] md:max-h-[70vh] lg:max-h-[63vh]'>
        <table className='table-auto text-xs md:text-sm col-span-1 w-full'>
              <thead className='w-full sticky z-20 top-0 bg-white'>
                  <tr className=''>
                      <th className="text-left px-1.5 py-1 whitespace-nowrap sticky left-0 z-10 bg-white">{Data?.DataHeader[0]?.Category}</th>
                      <th className="text-center px-1.5 py-1 whitespace-nowrap">{Data?.DataHeader[0]?.Unit}</th>

                      {Data?.DataHeader[0]?.ObjList.map((item, index) => (
                          <th key={index} className="text-center px-1.5 py-1 whitespace-nowrap">
                              <Moment format="MMM YY">{item.item_date}</Moment>
                          </th>
                      ))}

                  </tr>
              </thead>
              <tbody>
                  {Data?.DataFirst?.map((item, index) => (
                      <tr key={index} className='my-2 border-y border-gray-300' >

                          <td className="sticky left-0 z-10 bg-white text-left font-medium px-1.5 py-1 hover:underline underline-offset-2 cursor-pointer whitespace-nowrap"
                            onClick={()=>{
                              setIndicatorId(item.indicator_id);
                              setIndicatorDatasetId(item.indicator_dataset_id);
                              openEconomyGraphModal();
                            }}
                          >
                            {item.SubCategory}
                          </td>
                          <td className="text-center font-medium px-1.5 py-1 whitespace-nowrap">{item.Unit}</td>

                          {item.ObjList.map((obj, objIndex) => (
                            <td key={objIndex} className={`text-center px-1.5 py-1 whitespace-nowrap`} style={{ backgroundColor: obj?.color }}>
                              {
                                obj.India === 'NA' ? (obj.India) : (<>{obj.India} %</>)
                              }
                            </td>
                          ))}

                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

    </>
  )
}

export default EconomyTable
