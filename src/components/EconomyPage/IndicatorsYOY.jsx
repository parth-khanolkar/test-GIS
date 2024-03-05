import { useBulkBlockContext } from '@/context/BulkBlockContext';
import React from 'react';
import Moment from 'react-moment';

const TableSection = ({ data, categoryKey }) => {
  const { indicatorId,setIndicatorId,indicatorDatasetId,setIndicatorDatasetId,isEconomyGraphModalOpen,setIsEconomyGraphModalOpen,openEconomyGraphModal,closeEconomyGraphModal } = useBulkBlockContext();

  return (
    <>
      <div className='col-span-1 overflow-x-auto w-full rounded-md overflow-y-auto max-h-[60vh] md:max-h-[70vh] lg:max-h-[63vh]'>
        <table className='text-xs md:text-sm w-full'>
            <thead className='w-full sticky z-20 top-0 bg-white'>
                <tr>
                  <th className="text-left px-1.5 py-1 whitespace-nowrap sticky left-0 z-10 bg-white">
                    {data?.DataHeader?.Category}
                  </th>
                  <th className="text-center px-1.5 py-1 whitespace-nowrap">
                    {data?.DataHeader?.Unit}
                  </th>
                  
                  {data?.DataHeader?.ObjList.map((item, headerIndex) => (
                      <th key={headerIndex} className="text-center px-1.5 py-1 whitespace-nowrap">
                      <Moment format="MMM YY">{item.item_date}</Moment>
                      </th>
                  ))}
                </tr>
            </thead>
            <tbody>
                {data[categoryKey]?.map((item, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <tr className='bg-[#143b64] text-white'>
                      <td className='px-3 sticky left-0 z-10'>{rowIndex + 1 + ". " + item.Category}</td>
                      <td></td>
                      {data?.DataHeader?.ObjList.map((headerItem, headerIndex) => (
                          <td key={headerIndex}></td>
                      ))}
                    </tr>
                    {item.Rows.map((row, innerRowIndex) => (
                    <tr key={`${rowIndex}-${innerRowIndex}`} className='mb-4 border-y border-gray-300'>
                        <td className="text-left font-medium px-1.5 py-1 hover:underline underline-offset-2 cursor-pointer whitespace-nowrap sticky left-0 z-10 bg-white"
                          onClick={()=>{
                            setIndicatorId(row.indicator_id);
                            setIndicatorDatasetId(row.indicator_dataset_id);
                            openEconomyGraphModal();
                          }}
                        >
                            {row.SubCategory}
                        </td>
                        <td className="text-center font-medium px-1.5 py-1 whitespace-nowrap">
                            {row.Unit}
                        </td>
                        {row.ObjList.map((obj, objIndex) => (
                            <td key={`${rowIndex}-${innerRowIndex}-${objIndex}`} className={`text-center px-1.5 py-1 whitespace-nowrap`} 
                              style={{ backgroundColor: obj?.color }}>
                                {obj.India === 'NA' ? (obj.India) : (<>{obj.India} %</>)}
                            </td>
                        ))}
                    </tr>
                    ))}
                </React.Fragment>
                ))}
            </tbody>
        </table>
    
      </div>
    </>
  )
};

const IndicatorsYOY = ({ YOYData }) => { 
  

  return (
    <>
      <div className='lg:text-2xl text-[#143b64] font-semibold '>
        <div>{"Indicators YoY"}</div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 mt-2 md:mt-4 p-0.5 md:p-3 border rounded-md border-gray-300 shadow-md`}>
        <TableSection data={YOYData} categoryKey="DataFirst" />
        <TableSection data={YOYData} categoryKey="DataSecond" />
      </div>
    </>
  )
};

export default IndicatorsYOY;
