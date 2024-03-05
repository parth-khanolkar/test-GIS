import EconomyGraphModal from "@/components/EconomyPage/EconomyGraph/EconomyGraphModal";
import IndicatorsOthers from "@/components/EconomyPage/IndicatorsOthers";
import IndicatorsYOY from "@/components/EconomyPage/IndicatorsYOY";
import QuarterlyIndicatorsOthers from "@/components/EconomyPage/QuarterlyIndicatorsOthers";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Economy = () => {
  const [ isLoading,setIsLoading ] = useState(true);

  const [ indicatorsYOYData,setIndicatorsYOYData ] = useState();
  const [ indicatorsOthersData,setIndicatorsOthersData ] = useState();
  const [ indicatorsOthersQuarterlyData,setIndicatorsOthersQuarterlyData ] = useState();

  const getindicatorsYOY = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://transcriptanalyser.com/gis/indicators_yoy`);
      // const response = await axios.get(`https://www.goindiastocks.com/GIA/GetindicatorsYOY`);

      setIndicatorsYOYData(response.data);
      setIsLoading(false);

    } catch (error) {
      console.log("Error in getindicatorsYOY: ",error);
    }
  }
  const getindicators_Others = async () => {
    try {
      const response = await axios.get(`https://transcriptanalyser.com/gis/indicators_others`);
      // const response = await axios.get(`https://www.goindiastocks.com/GIA/Getindicators_Others`);
      
      setIndicatorsOthersData(response.data);
      
    } catch (error) {
      console.log("Error in getindicators_Others: ",error);
    }
  }
  const getindicators_Others_Qtrly = async () => {
    try {
      const response = await axios.get(`https://transcriptanalyser.com/gis/indicators_others_qtrly`);
      // const response = await axios.get(`https://www.goindiastocks.com/GIA/Getindicators_Others_Qtrly`);
      
      setIndicatorsOthersQuarterlyData(response.data);

    } catch (error) {
      console.log("Error in getindicators_Others_Qtrly: ",error);
    }
  }

  useEffect(() => {
    getindicatorsYOY();
    getindicators_Others();
    getindicators_Others_Qtrly();
  }, []);

  return (<>
    <div className={`h-[calc(100vh-80px)] bg-white  overflow-y-auto scrollbar-none lg:scrollbar px-2`}>
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
          <div className='p-2 border shadow-md mt-2 rounded-md'>
            { indicatorsYOYData && <IndicatorsYOY YOYData={indicatorsYOYData}/>}
          </div>
          <div className='p-2 border shadow-md mt-2 rounded-md'>
            { indicatorsOthersData && <IndicatorsOthers OthersData={indicatorsOthersData}/>}
          </div>
          <div className='p-2 border shadow-md my-2 rounded-md'>
            { indicatorsOthersQuarterlyData && <QuarterlyIndicatorsOthers OthersQuarterlyData={indicatorsOthersQuarterlyData}/>}
          </div>
          </>)
      }
    </div>

    
    {/* <EconomyGraphModal /> */}
  </>)
};

export default Economy;
