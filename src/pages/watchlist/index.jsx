"use client"

import React, { useState,useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import watchlistImage from '@/assets/images/landingPageIcons/addWatchList.png';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable'
import { useInfoContext } from '@/context/info';
import AddWatchlistModal from '@/components/Watchlist/AddWatchlistModal';
import { RiAddCircleLine, RiDeleteBin6Line } from 'react-icons/ri';
import { BsFillXSquareFill } from 'react-icons/bs';
import WatchlistTable from '@/components/Watchlist/WatchlistTable';
import { RxCross2 } from 'react-icons/rx';
import { BiSearchAlt } from 'react-icons/bi';
import { useWatchlistContext } from '@/context/WatchlistContext';
import { FiEdit } from 'react-icons/fi';
import WatchlistDeleteModal from '@/components/Watchlist/DeleteConfirmationModals/WatchlistDelete';
import { MdCancelPresentation, MdCheckBox } from 'react-icons/md';
import RenameWatchlistModal from '@/components/Watchlist/RenameWatchlistModal';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import InviteNotificationModal from '@/components/Watchlist/Share Watchlist Components/InviteNotificationModal';
import { IoShareSocial } from 'react-icons/io5';
import { EmailShareButton } from 'react-share';
import EmailShareModal from '@/components/Watchlist/Share Watchlist Components/EmailShareModal';
import { toast } from 'react-toastify';
import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import SearchBar from '@/components/GlobalComponents/SearchBar';


const WatchlistPage = () => {
    const {uid,setUid} = useInfoContext();
    const { watchlist,setWatchlist,watchlistArray,setWatchlistArray,tableData,setTableData,refreshWatchlist,setRefreshWatchlist,notificationCount,setNotificationCount } = useWatchlistContext();

    
    const [searchOptions, setSearchOptions] = useState([]);
    const [ searchInput,setSearchInput ] = useState('');

    const [isWLLoading,setIsWLLoading] = useState(false);

    const [isWLEmpty,setIsWLEmpty] = useState(false);

    const [isAddWLModalOpen, setIsAddWLModalOpen] = useState(false);
    const [isRenameWLModalOpen, setIsRenameWLModalOpen] = useState(false);
    const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
    const [isWatchlistDeleteModalOpen, setIsWatchlistDeleteModalOpen] = useState(false)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
    const [isEmailShareOpen, setIsEmailShareOpen] = useState(false)
    
    const [filtering,setFiltering] = useState("");

    const fetchWatchlistDropdown = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/user_watchlist', {
                uid: uid
            });

            if (response.status === 200) {
                const data = response.data;
                console.log("Data: ", data);
                console.log(data.data.length > 0);

                if (data.data.length > 0) {
                    setWatchlist(data.data[0]);
                } else {
                    setIsWLEmpty(true);
                }

                setWatchlistArray(data.data);
                setNotificationCount(data.notification_count);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(uid !== -1 && !watchlist ){
            fetchWatchlistDropdown();
        }
    }, [uid]); 


    const fetchNewWatchlistDropdown = async () => {
        if (isWLEmpty) {
            setIsWLEmpty(false);
        }

        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/user_watchlist', {
                uid: uid
            });

            if (response.status === 200) {
                const responseData = response.data;
                setWatchlistArray(responseData.data);
                setNotificationCount(responseData.notification_count);
            } else {
                console.log(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(uid !== -1){
            fetchNewWatchlistDropdown();
        }
    }, [watchlist,uid]);

    useEffect(() => {
        fetchNewWatchlistDropdown();
    }, [refreshWatchlist]);
    

    const fetchCompanyDropdown = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/goindiastock/company_search`,{
          searchtxt: searchInput,
      });
  
            setSearchOptions(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };
      useEffect(() => {
        fetchCompanyDropdown();
      }, [searchInput]);

    const getWatchlistCompanies = async () => {
        setIsWLLoading(true);
        try {
            const response = await fetch("https://transcriptanalyser.com/watchlists/watchlist_comp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                UserId: uid,
                WatchListGroupId: watchlist.WatchListGroupId,
              }),
            });
          
            if (response.status === 200) {
                const responseData = await response.json();
                setTableData(responseData.data.Data);
            } else {
                throw new Error(`Request failed with status: ${response.status}`);
            }
            setIsWLLoading(false);
          } catch (error) {
            console.log("Error in getWatchlistCompanies", error);
          }
          
    }
    useEffect(()=>{
        if(watchlist && uid !== -1){
            getWatchlistCompanies()
        }
    },[watchlist])

    const addCompanyToWL = async (fincode,companyName) => {
        try {
            const response = await fetch('https://transcriptanalyser.com/watchlists/add_company', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                FinCode: fincode.toString(),
                CompanyName: companyName,
                Exchange: "NSE",
                Type: "Company",
                UserId: uid,
                WatchListGroupId: watchlist.WatchListGroupId
              }),
            });
          
            if (response.status === 200) {
                const responseData = await response.json();
                if(responseData?.data?.Status === "Success"){
                    getWatchlistCompanies();
                    toast.success(`${companyName} added`, {
                        position: "bottom-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    toast.error(`${companyName} already exists in the watchlist`, {
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
            } else {
                console.log(`Request failed with status: ${response.status}`);
                toast.error(`Error! Try again later.`, {
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
            
        } catch (error) {
            console.error("Error in addCompanyToWL:", error);
            toast.error(`Error! Try again later.`, {
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
          
    }



    const openAddWLModal = () => {
        setIsAddWLModalOpen(true);
    }
    const closeAddWLModal = () => {
        setIsAddWLModalOpen(false);
    }

    const openWatchlistDeleteModal = () =>{
        setIsWatchlistDeleteModalOpen(true);
    }
    const closeWatchlistDeleteModal = () =>{
    setIsWatchlistDeleteModalOpen(false);
    }

    const openRenameWLModal = () =>{
        setIsRenameWLModalOpen(true);
    }
    const closeRenameWLModal = () =>{
    setIsRenameWLModalOpen(false);
    }

    const openEmailShare = () =>{
        setIsEmailShareOpen(true);
    }
    const closeEmailShare = () =>{
        setIsEmailShareOpen(false);
    }

    const openNotificationModal = () =>{
        setIsNotificationModalOpen(true);
    }
    const closeNotificationModal = () =>{
        setIsNotificationModalOpen(false);
    }


    // IF USER NOT LOGGED IN
    if(uid === -1){
        return(<>
            <div className='h-[calc(100vh-75px)] overflow-y-auto'>
                <div className='h-[90%] flex flex-col items-center justify-center'>
                    <div className='text-lg md:text-2xl text-center'>
                        Stay Ahead, Create Your Watchlist Today!
                    </div>
                    <Image 
                        src={watchlistImage}
                        alt='WatchList'
                        className='w-[120px] h-auto md:w-[158px] mt-10'
                    />
                    <Link href={"/loginpage"} className='text-white mt-10 py-1.5 px-6 rounded-md bg-red-600 hover:bg-red-900'>
                        Log In
                    </Link>
                </div>
                <footer className="mt-2">
                    <div className="hidden lg:inline-block">
                        <Footer />
                    </div>
                    <div className="lg:hidden">
                        <MobileFooter />
                    </div>
                </footer>
            </div>
        </>)
    }
    
    return(
        <>
            {
                watchlistArray.length === 0 ? (
                    <>
                        <div className='h-[calc(100vh-80px)]'>

                            <div className='mx-4 md:mx-10 my-1 md:my-2.5 bg-white flex flex-col items-center justify-center rounded-sm h-[90vh] md:h-[80vh]'>
                                <div className='text-lg md:text-2xl'>
                                    Stay Ahead, Create Your Watchlist Today!
                                </div>
                                <Image 
                                    src={watchlistImage}
                                    alt='WatchList'
                                    className='w-[120px] h-auto md:w-[158px] mt-10'
                                />
                                <button className='text-white mt-10 py-1.5 px-6 rounded-md bg-red-600 hover:bg-red-900 flex flex-row gap-2'
                                    onClick={()=>{openAddWLModal()}}
                                >
                                    <div className='flex items-center text-base md:text-xl'>
                                        <RiAddCircleLine /> 
                                    </div>
                                    Create Watchlist
                                </button>
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

                    </>
                ):(
                    <>
                        <div className='h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden'>

                            <div className='my-1 md:my-2.5 bg-white flex flex-col rounded-md border shadow-md mx-2 '>
                                <div className='mx-2 lg:mx-5 mt-5 mb-3 flex flex-row gap-3 md:gap-8'>
                                    <CreatableSelect
                                        value={watchlist}
                                        options={watchlistArray}
                                        getOptionLabel={(option) => option.WatchGroupName}
                                        getOptionValue={(option) => option.WatchListGroupId}
                                        onChange={(option) => {
                                            setWatchlist(option)
                                        }}
                                        isLoading={isWLLoading}
                                        placeholder='Select Watchlist...'
                                        className='min-w-[50vw] md:min-w-[30vw] lg:min-w-[20vw] max-w-[50vw] md:max-w-[30vw] lg:max-w-[20vw] text-sm lg:text-xl'
                                        isSearchable= {false}
                                    />

                                    <div className='flex flex-row items-center w-full justify-center md:justify-start gap-3 md:gap-5 lg:gap-10'>
                                        <button className='flex flex-row items-center gap-2 md:px-5 md:py-1 lg:py-1.5 md:bg-cyan-900 md:hover:bg-cyan-950 md:rounded-md'
                                            onClick={()=>openAddWLModal()}
                                        >
                                            <div className='flex items-center text-2xl md:text-xl text-[#143B64] md:text-white'
                                            >
                                                <RiAddCircleLine /> 
                                            </div>
                                            <span className='hidden md:block text-white'>
                                                Add Watchlist
                                            </span>
                                        </button>
                                        <button className=''
                                            onClick={()=>{
                                                openRenameWLModal();                                                
                                            }}
                                        >
                                            <div className='flex items-center text-2xl md:text-2xl text-[#143B64]'
                                            >
                                                <FiEdit /> 
                                            </div>
                                        </button>
                                        <button className=''
                                            onClick={()=>{
                                                openWatchlistDeleteModal();
                                            }}
                                        >
                                            <div className='flex items-center text-2xl md:text-2xl text-[#143B64]'
                                            >
                                                <RiDeleteBin6Line /> 
                                            </div>
                                        </button>
                                        {/* {
                                            notificationCount > 0 ? (<>
                                            <button className=' items-center text-xl relative inline-block md:hidden'
                                                onClick={()=>{openNotificationModal()}}
                                            >
                                                <span className='block text-[#143B64]'><FaBell /></span>
                                                <span className='flex items-center justify-center absolute -right-1 -top-1 leading-none text-[9px] bg-red-600 px-1 py-0.5 text-white rounded-full font-semibold'>{notificationCount}</span>
                                            </button>
                                            </>):(<></>)
                                        } */}
                                        <button>
                                            <div className='flex items-center text-2xl md:text-2xl text-[#143B64]'
                                                onClick={()=>{openEmailShare()}}
                                            >
                                                <IoShareSocial /> 
                                            </div>
                                        </button>
                                        
                                    </div>
                                </div>
                                {/* Add Company & Filter Table */}
                                {
                                    isAddCompanyOpen ? (<>
                                        <div className='mx-2 lg:mx-5 mt-2 flex flex-row justify-end gap-3 pb-1.5'>
                                            <div className='md:w-[25vw] lg:w-[30vw]'>
                                                <SearchBar 
                                                    handleChange={(option)=>{
                                                        addCompanyToWL(option.value,option.label);
                                                    }}
                                                />
                                            </div>
                                            <button className='flex items-center text-3xl text-red-600 hover:text-red-700'
                                                onClick={()=>{setIsAddCompanyOpen(false)}}
                                            >
                                                <BsFillXSquareFill />
                                            </button>
                                        </div>
                                    </>):(<>
                                    <div className='mx-2 lg:mx-5 mt-2 flex flex-row justify-between gap-3'>
                                        <div className="flex-none sm:flex gap-2 items-center">
                                            <div className="flex justify-between gap-1 items-center border rounded-full border-[#083966] px-2 py-1 mb-2">
                                            <input
                                                type="type"
                                                value={filtering}
                                                onChange={(e) => setFiltering(e.target.value)}
                                                placeholder="Filter by any data..."
                                                className="text-xs md:text-base outline-none bg-transparent max-w-[30vw] md:max-w-[25vw] lg:max-w-[15vw]"
                                            />
                                            {filtering.length>0 ? (<button onClick={()=>setFiltering("")}><RxCross2 size={18} className="text-[#083966]"/></button>):(<button className='invisible'><RxCross2 size={18} className="text-[#083966]"/></button>)}
                                            <BiSearchAlt size={18} className="text-[#083966]" />
                                            </div>
                                        </div>

                                        <button className='px-2 py-1 mb-2 flex flex-row items-center justify-center gap-2 border border-black rounded-lg text-sm md:text-base'
                                            onClick={()=>{setIsAddCompanyOpen(true)}}
                                        >
                                            <div className='flex items-center text-base md:text-xl'>
                                                <RiAddCircleLine /> 
                                            </div>
                                            <span className='flex items-center text-xs md:text-base'>Add Company</span>
                                        </button>
                                    </div>
                                    </>)
                                }

                                <div className='px-1 lg:px-2 mt-2 z-0 flex justify-center mb-2'>
                                    <WatchlistTable data={tableData} getWatchlistCompanies={getWatchlistCompanies} filtering={filtering} setFiltering={setFiltering} isLoading={isWLLoading}/>
                                </div>

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
                    </>
                )
            }

            <EmailShareModal isModalOpen={isEmailShareOpen} closeModal={closeEmailShare} />
            <InviteNotificationModal isOpen={isNotificationModalOpen} closeModal={closeNotificationModal}/>
            <AddWatchlistModal isOpen={isAddWLModalOpen} closeModal={closeAddWLModal} setWatchlist={setWatchlist} />
            <WatchlistDeleteModal isOpen={isWatchlistDeleteModalOpen} closeModal={closeWatchlistDeleteModal}/>
            <RenameWatchlistModal isOpen={isRenameWLModalOpen} closeModal={closeRenameWLModal} fetchNewWatchlistDropdown={fetchNewWatchlistDropdown}/>
        </>
    )
}

export default WatchlistPage
