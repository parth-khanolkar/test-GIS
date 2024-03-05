import React,{ useState,useEffect } from 'react'
import Select from "react-select";

import Moment from 'react-moment';
import axios from 'axios';
import { IoShareSocial } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { IoIosArrowDropup } from "react-icons/io";


const News = () => {
    const [newsArray,setNewsArray] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    const [ selectedFilter,setSelectedFilter ] = useState({ value: 'LatestNews', label: 'Latest News' });

    const [ selectedCompany,setSelectedCompany ] = useState(null);
    const [ companyList,setCompanyList ] = useState([]);

    const [ selectedSector,setSelectedSector ] = useState(null);
    const [ sectorList,setSectorList ] = useState([]);
    


    const [ filterOptions,setFilterOptions ] = useState([
        { value: 'LatestNews', label: 'Latest News' },
        { value: 'CompanyNews', label: 'Company News' },
        { value: 'SectorNews', label: 'Sector News' },
    ]);
    

    const getLatestNews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://transcriptanalyser.com/gislanding/news-master');

        if(response.status === 200){
          setNewsArray(response.data.key);
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error("Error in getLatestNews: ",error);
      }
    };

    const getDropdownList = async () => {
      try {
        const response = await axios.post('https://transcriptanalyser.com/gislanding/news-comp',{
          type:'',
          value:''
        });

        if(response.status === 200){
          setSectorList(response.data.sector_list);
          setCompanyList(response.data.comp_dropdown);
        }
        
      } catch (error) {
        console.error("Error in getDropdownList: ",error);
      }
    };
    useEffect(() => {
      getLatestNews();    
      getDropdownList();
    }, []); 

    const getFilteredNews = async (FilterType,Value) => {
      setIsLoading(true);
        try {
            const response = await axios.post(`https://transcriptanalyser.com/gislanding/news-comp`,{
                type: FilterType,
                value: Value.toString()
            });

            if(response.status === 200){
              setNewsArray(response.data.data);
              setSectorList(response.data.sector_list);
              setCompanyList(response.data.comp_dropdown);
              setIsLoading(false);
            }
        } catch (error) {
            console.log("Error in getFilteredNews",error);
        }
    }

  return (
    <>
    <div className='h-[calc(100vh-80px)] bg-white  overflow-y-auto scrollbar-none lg:scrollbar'>
            <div id='top'></div>
            
            {/* FILTERS */}
            <div className='pt-2 md:pb-1 px-2 lg:px-10 flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5 sticky top-0 bg-white z-10'>
                {/* FILTER TYPE */}
                <Select
                  options={filterOptions}
                  value={selectedFilter}
                  onChange={(option) => {
                      if(option?.value === 'LatestNews'){
                          setSelectedCompany(null);
                          setSelectedSector(null);
                          setSelectedFilter(option);
                          getLatestNews();
                      } else {
                          setSelectedFilter(option);
                      }
                  }}
                  className="text-xs md:text-base w-56 md:w-64"
                  isSearchable={false}
                  placeholder={'Select Company...'}
                />

                <div className='flex flex-row gap-2'>
                  {
                    selectedFilter?.value === 'CompanyNews' && 
                    <Select
                      options={companyList}
                      value={selectedCompany}
                      placeholder={'Select Company...'}
                      onChange={(option)=>{
                        getFilteredNews('company',option.value);
                        setSelectedCompany(option);
                        var id1 = document.getElementById('top');
                        if (id1) {
                            id1.scrollIntoView({
                                behavior: 'smooth',
                                inline: 'nearest',
                            });
                        }
                      }}
                      className="text-xs md:text-base w-44 md:w-64"
                    />
                  }
                  {
                    selectedFilter?.value === 'SectorNews' && 
                    <Select
                      options={sectorList}
                      value={selectedSector}
                      placeholder={'Select Sector...'}
                      onChange={(option)=>{
                        getFilteredNews('sector',option.value);
                        setSelectedSector(option);
                        var id1 = document.getElementById('top');
                        if (id1) {
                            id1.scrollIntoView({
                                behavior: 'smooth',
                                inline: 'nearest',
                            });
                        }
                      }}
                      className="text-xs md:text-base w-44 md:w-64"
                    />
                  }
                </div>

            </div>

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
                </>):(<> 
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-4 px-1 md:px-8 md:mx-10 gap-4 scrollbar-none md:scrollbar-thin mt-5 mb-5">

                    {newsArray?.map((item, index) => (
                      <div key={index} className='bg-white border shadow-md rounded-lg md:text-base p-2.5 md:p-3.5 px-3 md:px-5 flex flex-col'>
                        <a href={selectedFilter?.value === 'LatestNews' ? (item?.news_link):(item?.link)} className='cursor-pointer' target="_blank">
                            <div className="font-semibold text-base md:text-lg line-clamp-2  h-14 text-sky-800 font-serif">
                                {item?.title}
                            </div>
                            <div className={`my-2 md:my-3 text-sm text-justify 
                                    ${
                                      item?.synopsis && ('h-20') 
                                    }
                                `}>
                                <span className='line-clamp-4 font-serif'>
                                    {item?.synopsis}
                                </span>
                            </div>
                        </a>
                        <div className='flex flex-row mt-2 md:mt-4 text-xs'>
                            <div className='text-blue-500'>
                                <Moment fromNow>{item?.DateInserted}</Moment>
                            </div>
                            <div className='ml-3.5'>
                                {`- ${item?.source}`} 
                            </div>
                            <div className='ml-auto'>
                            <button className='flex flex-row items-center justify-center'
                                    onClick={() => {
                                            if (navigator.clipboard) {
                                            navigator.clipboard.writeText(`${item?.news_link}`)
                                                .then(() => {
                                                toast.success('Link copied to clipboard', {
                                                    position: "bottom-center",
                                                    autoClose: 1500,
                                                    hideProgressBar: true,
                                                    closeOnClick: true,
                                                    pauseOnHover: false,
                                                    draggable: false,
                                                    progress: undefined,
                                                    theme: "light",
                                                });
                                                })
                                                .catch((err) => {
                                                console.error('Unable to copy to clipboard', err);
                                                });
                                            } else {
                                            const tempInput = document.createElement('input');
                                            tempInput.value = `${item?.news_link}`;
                                            document.body.appendChild(tempInput);
                                            tempInput.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(tempInput);
                
                                            toast.success('Link copied to clipboard', {
                                                position: "bottom-center",
                                                autoClose: 1500,
                                                hideProgressBar: true,
                                                closeOnClick: true,
                                                pauseOnHover: false,
                                                draggable: false,
                                                progress: undefined,
                                                theme: "light",
                                            });
                                            }
                                    }}
                                >
                                    <IoShareSocial className="mr-1 text-black text-base"/> 
                                    <span className='text-xs md:text-sm whitespace-nowrap'>Share</span>
                                </button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </>)
            }
            <button className='fixed bottom-5 lg:bottom-0 right-0 z-50 p-2 text-cyan-900'
            onClick={() => { 
                var id1 = document.getElementById('top');
                    if (id1) {
                        id1.scrollIntoView({
                            behavior: 'smooth',
                            inline: 'nearest',
                        });
                    }
                }}
            >
                <IoIosArrowDropup size={40} />
            </button>
    </div>
    </>
  )
}

export default News
