'use client'

import CreateNewScModal from '@/components/CustomScreener/ScreenerHome/CreateNewScModal';
import Footer from '@/components/Footer';
import MobileFooter from '@/components/MobileFooter';
import { useInfoContext } from '@/context/info';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const CustomScreenerPage = () => {
  const { uid } = useInfoContext();

  const [ screenExpansion,setScreenExpansion ] = useState({
    savedScreen : false,
    trendingScreen : false,
    quarterlyScreen : false,
    valuationScreen : false,
  });

  const [ isLoading,setIsLoading ] = useState(true)
  const [ isCreateNewScOpen,setIsCreateNewScOpen ] = useState(false)

  const [ savedScreenData,setSavedScreenData ] = useState([])
  const [ trendingScreenData,setTrendingScreenData ] = useState([])
  const [ quarterlyScreenData,setQuarterlyScreenData ] = useState([])
  const [ valuationScreenData,setValuationScreenData ] = useState([])

  const openCreateNewSc = () => {
    setIsCreateNewScOpen(true);
  }
  const closeCreateNewSc = () => {
    setIsCreateNewScOpen(false);
  }

  const getScreenerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://transcriptanalyser.com/screener/fetch_sc`,{
        // userid : uid,
        userid : "10463",
      });

      setSavedScreenData(response.data['Saved Items']);
      setTrendingScreenData(response.data['Trending Screens']);
      setQuarterlyScreenData(response.data['Quarterly Results']);
      setValuationScreenData(response.data['Valuation Screens']);

      setIsLoading(false);
    } catch (error) {
      console.log("Error in getScreenerData: ",error);
    }
  }

  useEffect(()=>{
    if(uid !== -1)
    {
      getScreenerData();
    }
  },[uid]);

  return (
    <>
        <div className='h-[calc(100vh-80px)] overflow-x-hidden overflow-y-auto scrollbar-none lg:scrollbar bg-white p-2'>
          <div className='flex justify-between mt-2 '>
            <div className='font-semibold text-xl md:text-2xl'>
              {"Stock Screens"}
            </div>

            <button className='text-white bg-[#133965] px-1.5 md:px-3 py-0.5 md:py-1 md:mr-2 rounded-md text-[10px] md:text-sm'
              onClick={()=>{openCreateNewSc();}}
            >
              {"Create New Screen"}
            </button>
          </div>

          {/* Saved Screens */}
          <div className={`p-2 border shadow-md rounded-md mt-3 md:mr-2`}>
            <div className='md:text-xl font-semibold mb-2'>
              {"Saved Screens"}
            </div>
            {
              isLoading ? (
                <div className='flex items-center h-[15vh] justify-center'>
                            <div className="flex justify-center items-center ">
                            <span className="relative flex h-[40px] w-[40px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                        </div>
              ) : (<>
                {
                   savedScreenData.length > 0 ? (<>
                     <div className={`md:mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3
                       ${
                         screenExpansion.savedScreen ? ('') : ('max-h-[25vh] md:max-h-[32vh] overflow-hidden')
                       }
                     `}>
                       {
                         savedScreenData.map((item,index)=>(
                           <Link href={`/customScreener/${item.screener_id}`} key={index} className='col-span-1 flex flex-col p-1.5 md:p-3 rounded-md border border-gray-400 hover:shadow-sm'>
                             <div className='font-semibold text-sm md:text-base'>
                               {item.name}
                             </div>
                             <div className='text-[11px] md:text-xs'>
                               {item.description}
                             </div>
                           </Link>
                         ))
                       }
                     </div>
                     <div className={`mt-2 flex justify-end`}>
                       <button className={`text-xs md:text-sm`}
                         onClick={()=>{
                           setScreenExpansion({
                             savedScreen : !screenExpansion.savedScreen,
                             trendingScreen : false,
                             quarterlyScreen : false,
                             valuationScreen : false,
                           });
                         }}
                       >
                         {
                           screenExpansion.savedScreen ? ('Show less...') : ('Show more...')
                         }
                       </button>
                     </div>
                   </>) : (
                     <div className='flex items-center justify-center h-[10vh] font-semibold text-gray-500 text-sm md:text-lg'>
                       {"No data available."}
                     </div>
                   )
                 }
   
              </>)
            } 
            </div>

          {/* Trending Screens */}
          <div className={`p-2 border shadow-md rounded-md mt-5 md:mr-2`}>
            <div className='md:text-xl font-semibold mb-2'>
              {"Trending Screens"}
            </div>
            {
              isLoading ? (
                <div className='flex items-center h-[15vh] justify-center'>
                            <div className="flex justify-center items-center ">
                            <span className="relative flex h-[40px] w-[40px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                        </div>
              ) : (<>
                {
                   trendingScreenData.length > 0 ? (<>
                     <div className={`md:mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3
                       ${
                         screenExpansion.trendingScreen ? ('') : ('max-h-[25vh] md:max-h-[32vh] overflow-hidden')
                       }
                     `}>
                       {
                         trendingScreenData.map((item,index)=>(
                           <Link href={`/customScreener/${item.screener_id}`} key={index} className='col-span-1 flex flex-col p-1.5 md:p-3 rounded-md border border-gray-400 hover:shadow-sm'>
                             <div className='font-semibold text-sm md:text-base'>
                               {item.name}
                             </div>
                             <div className='text-[11px] md:text-xs'>
                               {item.description}
                             </div>
                           </Link>
                         ))
                       }
                     </div>
                     <div className={`mt-2 flex justify-end`}>
                       <button className={`text-xs md:text-sm`}
                         onClick={()=>{
                           setScreenExpansion({
                             savedScreen : false,
                             trendingScreen : !screenExpansion.trendingScreen,
                             quarterlyScreen : false,
                             valuationScreen : false,
                           });
                         }}
                       >
                         {
                           screenExpansion.trendingScreen ? ('Show less...') : ('Show more...')
                         }
                       </button>
                     </div>
                   </>) : (
                     <div className='flex items-center justify-center h-[10vh] font-semibold text-gray-500 text-sm md:text-lg'>
                       {"No data available."}
                     </div>
                   )
                 }
              </>)
            } 

          </div>

          {/* Quarterly Results */}
          <div className={`p-2 border shadow-md rounded-md mt-5 md:mr-2`}>
            <div className='md:text-xl font-semibold mb-2'>
              {"Quarterly Results"}
            </div>
            {
              isLoading ? (
                <div className='flex items-center h-[15vh] justify-center'>
                            <div className="flex justify-center items-center ">
                            <span className="relative flex h-[40px] w-[40px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                        </div>
              ) : (<>
                {
                   quarterlyScreenData.length > 0 ? (<>
                     <div className={`md:mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3
                       ${
                         screenExpansion.quarterlyScreen ? ('') : ('max-h-[25vh] md:max-h-[32vh] overflow-hidden')
                       }
                     `}>
                       {
                         quarterlyScreenData.map((item,index)=>(
                           <Link href={`/customScreener/${item.screener_id}`} key={index} className='col-span-1 flex flex-col p-1.5 md:p-3 rounded-md border border-gray-400 hover:shadow-sm'>
                             <div className='font-semibold text-sm md:text-base'>
                               {item.name}
                             </div>
                             <div className='text-[11px] md:text-xs'>
                               {item.description}
                             </div>
                           </Link>
                         ))
                       }
                     </div>
                     <div className={`mt-2 flex justify-end`}>
                       <button className={`text-xs md:text-sm`}
                         onClick={()=>{
                           setScreenExpansion({
                             savedScreen : false,
                             trendingScreen : false,
                             quarterlyScreen : !screenExpansion.quarterlyScreen,
                             valuationScreen : false,
                           });
                         }}
                       >
                         {
                           screenExpansion.quarterlyScreen ? ('Show less...') : ('Show more...')
                         }
                       </button>
                     </div>
                   </>) : (
                     <div className='flex items-center justify-center h-[10vh] font-semibold text-gray-500 text-sm md:text-lg'>
                       {"No data available."}
                     </div>
                   )
                 }
              </>)
            } 

          </div>

          {/* Valuation Screens */}
          <div className={`p-2 border shadow-md rounded-md mt-5 md:mr-2`}>
            <div className='md:text-xl font-semibold mb-2'>
              {"Valuation Screens"}
            </div>
            {
              isLoading ? (
                <div className='flex items-center h-[15vh] justify-center'>
                            <div className="flex justify-center items-center ">
                            <span className="relative flex h-[40px] w-[40px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                        </div>
                        </div>
              ) : (<>
                {
                   valuationScreenData.length > 0 ? (<>
                     <div className={`md:mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3
                       ${
                         screenExpansion.valuationScreen ? ('') : ('max-h-[25vh] md:max-h-[32vh] overflow-hidden')
                       }
                     `}>
                       {
                         valuationScreenData.map((item,index)=>(
                           <Link href={`/customScreener/${item.screener_id}`} key={index} className='col-span-1 flex flex-col p-1.5 md:p-3 rounded-md border border-gray-400 hover:shadow-sm'>
                             <div className='font-semibold text-sm md:text-base'>
                               {item.name}
                             </div>
                             <div className='text-[11px] md:text-xs'>
                               {item.description}
                             </div>
                           </Link>
                         ))
                       }
                     </div>
                     <div className={`mt-2 flex justify-end`}>
                       <button className={`text-xs md:text-sm`}
                         onClick={()=>{
                           setScreenExpansion({
                             savedScreen : false,
                             trendingScreen : false,
                             quarterlyScreen : false,
                             valuationScreen : !screenExpansion.valuationScreen,
                           });
                         }}
                       >
                         {
                           screenExpansion.valuationScreen ? ('Show less...') : ('Show more...')
                         }
                       </button>
                     </div>
                   </>) : (
                     <div className='flex items-center justify-center h-[10vh] font-semibold text-gray-500 text-sm md:text-lg'>
                       {"No data available."}
                     </div>
                   )
                 }
              </>)
            } 

          </div>

          <footer className="-mx-2 mt-2">
              <div className="hidden lg:inline-block">
                  <Footer />
              </div>
              <div className="lg:hidden">
                  <MobileFooter />
              </div>
          </footer>

        </div> 
        
        <CreateNewScModal  isOpen={isCreateNewScOpen} closeModal={closeCreateNewSc} />
    </>
  )
}

export default CustomScreenerPage

CustomScreenerPage.requireAuth = true;
