"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useInfoContext } from '@/context/info';
import { useWatchlistContext } from '@/context/WatchlistContext';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Link from 'next/link';

const SetAlertModal = ({ isOpen, closeModal,companyName,fincode,exchange }) => {
    const { uid,setUid } = useInfoContext();
    const { watchlist,setWatchlist } = useWatchlistContext();


    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [isLoading, setIsLoading] = useState(false);

    const [ alertWatchlistId,setAlertWatchlistId ] = useState('');

    const [ AbovePrice,setAbovePrice ] = useState('');
    const [ BelowPrice,setBelowPrice ] = useState('');

    const [ AbovePE,setAbovePE ] = useState('');
    const [ BelowPE,setBelowPE ] = useState('');

    const [ AbovePB,setAbovePB ] = useState('');
    const [ BelowPB,setBelowPB ] = useState('');

    const [ AbovePS,setAbovePS ] = useState('');
    const [ BelowPS,setBelowPS ] = useState('');

    const [ AboveEVEB,setAboveEVEB ] = useState('');
    const [ BelowEVEB,setBelowEVEB ] = useState('');

    const [ BSENotification,setBSENotification ] = useState({label: "All", value:"All"});


    const BSEOptions = [
        {label: "All", value:"All"},
        {label: "Board Meeting", value:"Board Meeting"},
        {label: "AGM/EGM", value:"AGM/EGM"},
        {label: "Analyst Calls/Meets", value:"Analyst Calls/Meets"},
        {label: "Management Interviews", value:"Management Interviews"},
        {label: "Investor Presentations", value:"Investor Presentations"},
        {label: "Annual Report", value:"Annual Report"},
        {label: "Results", value:"Results"},
        {label: "Credit Ratings", value:"Credit Ratings"},
        {label: "Other Meetings", value:"Other Meetings"},
    ]

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '80%' : '83%',
                maxHeight: isMobile ? '80%' : '83%',
                width: isMobile ? '80%' : '60%',
                maxWidth: isMobile ? '100%' : '60%',
                margin: 'auto',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 999,
            },
        };
    };

    const closeAlertModal = () => {
        closeModal();
    }

    useEffect(()=>{
        setAbovePrice('');
        setBelowPrice('');
        setAbovePE('');
        setBelowPE('');
        setAbovePB('');
        setBelowPB('');
        setAbovePS('');
        setBelowPS('');
        setAboveEVEB('');
        setBelowEVEB('');
        setBSENotification({label: "All", value:"All"});
        
    },[fincode])

    const getStockAlert = async (WatchListGroupId) => {
        try {
            const response = await axios.get('https://www.goindiastocks.in/api/service/GetWatchNotificationByWatchListGroupId',{
                params: {
                    UserId: uid,
                    WatchListGroupId: WatchListGroupId,
                    Fincode: fincode,
                },
            })
            
            console.log(response.data);
            
           if(response.data.Data[0]){
            response.data.Data[0].PriceAlert_Above != 0 && setAbovePrice(response.data.Data[0].PriceAlert_Above);
            response.data.Data[0].PriceAlert_Below != 0 && setBelowPrice(response.data.Data[0].PriceAlert_Below);
            response.data.Data[0].PEAlert_Above != 0 && setAbovePE(response.data.Data[0].PEAlert_Above);
            response.data.Data[0].PEAlert_Below != 0 && setBelowPE(response.data.Data[0].PEAlert_Below);
            response.data.Data[0].PBAlert_Above != 0 && setAbovePB(response.data.Data[0].PBAlert_Above);
            response.data.Data[0].PBAlert_Below != 0 && setBelowPB(response.data.Data[0].PBAlert_Below);
            response.data.Data[0].PriceSalesAlert_Above != 0 && setAbovePS(response.data.Data[0].PriceSalesAlert_Above);
            response.data.Data[0].PriceSalesAlert_Below != 0 && setBelowPS(response.data.Data[0].PriceSalesAlert_Below);
            response.data.Data[0].EVEBITDAAlert_Above != 0 && setAboveEVEB(response.data.Data[0].EVEBITDAAlert_Above);
            response.data.Data[0].EVEBITDAAlert_Below != 0 && setBelowEVEB(response.data.Data[0].EVEBITDAAlert_Below);
            response.data.Data[0].BSENotification && setBSENotification({ label:response.data.Data[0].BSENotification, value:response.data.Data[0].BSENotification });
           }
        } catch (error) {
            console.log("Error in getStockAlert:",error);
        }
    }
    useEffect(()=>{
        if(fincode){
            getStockAlert();
        }
    },[fincode])

    const addToAlertWatchlist = async () => {
        console.log("From SetALertModal");
        try {
            const response = await axios.post(`https://transcriptanalyser.com/watchlists/alert_watchlist`,{
                UserId: uid,
                Fincode: fincode,
                CompanyName: companyName,
                Exchange: exchange,
                Type: "Company"
            });

            if(response.data.data.Status === 'Duplicate' || response.data.data.Status === 'Success'){
                setAlertWatchlistId(response.data.watchlist_id);
                setStockAlert(response.data.watchlist_id)
            }
            

        } catch (error) {
            console.log("Error in addToAlertWatchlist:",error);
        }
    }

    const setStockAlert = async (watchlist_id) => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://transcriptanalyser.com/masked/Add_StockAlert',{
                FinCode: fincode,
                CompanyName: companyName,
                Exchange: exchange,
                PriceAlert_Above: AbovePrice,
                PriceAlert_Below: BelowPrice,
                EVEBITDAAlert_Above: AboveEVEB,
                EVEBITDAAlert_Below: BelowEVEB,
                PBAlert_Above: AbovePB,
                PBAlert_Below: BelowPB,
                PEAlert_Above: AbovePE,
                PEAlert_Below: BelowPE,
                PriceSalesAlert_Above: AbovePS,
                PriceSalesAlert_Below: BelowPS,
                UserId: uid,
                WatchListGroupId: watchlist_id,
                BSENotification: BSENotification.value
              })
            
            console.log(response.data);
            if(response.data.Status === 'Success'){
                closeAlertModal();
                toast.success(`Alert set for ${companyName}`, {
                    position: "bottom-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setIsLoading(false);
            } else {
                toast.error(`Try again later!`, {
                    position: "bottom-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setIsLoading(false);
            }
           
        } catch (error) {
            console.log("Error in setStockAlert:",error);
        }
    }


  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeAlertModal}
            contentLabel="Alert Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-col w-full h-full'>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='text-rose-600 text-2xl font-semibold '>
                        STOCK ALERT <span className='text-base text-black'>- {companyName}</span>
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeAlertModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>

                {
                    uid === -1 ? (<>
                        <div className='h-full flex items-center justify-center'>
                            <Link href={`/loginpage`} className='px-3 py-1 rounded-md bg-red-700 text-white'>
                                {"Login to add to watchlist"}
                            </Link>
                        </div>
                    </>) : (
                        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 lg:gap-y-1 py-2 md:p-2'>
                            <div className='col-span-1 rounded-md border w-full  flex flex-col p-2'>
                                <div className='text-lg'>
                                    {"Price Alert"}
                                </div>
                                <div className='w-full grid grid-cols-2 gap-x-3 px-5 mt-2'>
                                    <div className='col-span-1'>
                                        {"Above"}
                                    </div>
                                    <div className='col-span-1'>
                                        {"Below"}
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='AbovePrice' value={AbovePrice} onChange={(e)=>{setAbovePrice(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='PB'/>
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='BelowPrice' value={BelowPrice} onChange={(e)=>{setBelowPrice(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='PB'/>
                                    </div>

                                </div>
                            </div>
                            <div className='col-span-1'>
                                {/* Placeholder div */}
                            </div>
                            <div className='lg:col-span-2 border-b border-gray-500 w-full  flex flex-col p-2 text-xl'>
                                {"Valuation Alert"}
                            </div>
                            <div className='col-span-1 rounded-md border w-full  flex flex-col p-2'>
                                <div className='text-lg'>
                                    {"PE"}
                                </div>
                                <div className='w-full grid grid-cols-2 gap-x-3 px-5 mt-2'>
                                    <div className='col-span-1'>
                                        {"Above"}
                                    </div>
                                    <div className='col-span-1'>
                                        {"Below"}
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='AbovePE' value={AbovePE} onChange={(e)=>{setAbovePE(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='PE'/>
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='BelowPe' value={BelowPE} onChange={(e)=>{setBelowPE(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='PE'/>
                                    </div>

                                </div>
                            </div>
                            <div className='col-span-1 rounded-md border w-full  flex flex-col p-2'>
                                <div className='text-lg'>
                                    {"PB"}
                                </div>
                                <div className='w-full grid grid-cols-2 gap-x-3 px-5 mt-2'>
                                    <div className='col-span-1'>
                                        {"Above"}
                                    </div>
                                    <div className='col-span-1'>
                                        {"Below"}
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='AbovePB' value={AbovePB} onChange={(e)=>{setAbovePB(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='PB'/>
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='BelowPB' value={BelowPB} onChange={(e)=>{setBelowPB(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='PB'/>
                                    </div>

                                </div>
                            </div>
                            <div className='col-span-1 rounded-md border w-full  flex flex-col p-2'>
                                <div className='text-lg'>
                                    {"Prices/Sales"}
                                </div>
                                <div className='w-full grid grid-cols-2 gap-x-3 px-5 mt-2'>
                                    <div className='col-span-1'>
                                        {"Above"}
                                    </div>
                                    <div className='col-span-1'>
                                        {"Below"}
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='AbovePS' value={AbovePS} onChange={(e)=>{setAbovePS(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='Prices/Sales'/>
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='BelowPS' value={BelowPS} onChange={(e)=>{setBelowPS(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='Prices/Sales'/>
                                    </div>

                                </div>
                            </div>
                            <div className='col-span-1 rounded-md border w-full  flex flex-col p-2'>
                                <div className='text-lg'>
                                    {"EV/EBIDTA"}
                                </div>
                                <div className='w-full grid grid-cols-2 gap-x-3 px-5 mt-2'>
                                    <div className='col-span-1'>
                                        {"Above"}
                                    </div>
                                    <div className='col-span-1'>
                                        {"Below"}
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='AboveEV/EBIDTA' value={AboveEVEB} onChange={(e)=>{setAboveEVEB(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='EV/EBIDTA'/>
                                    </div>
                                    <div className='col-span-1'>
                                        <input id='BelowEV/EBIDTA' value={BelowEVEB} onChange={(e)=>{setBelowEVEB(e.target.value)}} type="text" inputMode="numeric" pattern="[0-9]" className='w-full p-2 rounded-md border border-gray-300' placeholder='EV/EBIDTA'/>
                                    </div>

                                </div>
                            </div>
                            <div className='lg:col-span-2 border-b border-gray-500 w-full '>
                            </div>
                            <div className='col-span-1 rounded-md lg:col-span-2 border w-full flex flex-col md:flex-row space-x-5 p-2 '>
                                <div className='text-lg w-full'>
                                    {"BSE Notifications Alert : "}
                                </div>
                                <div className='md:w-full'>
                                    <Select 
                                        value={BSENotification}
                                        options={BSEOptions}
                                        onChange={(option)=>{
                                            setBSENotification(option);
                                        }}
                                        className='md:w-full'
                                        menuPlacement='top'
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 lg:col-span-2  flex flex-row p-2'>
                                <button
                                    disabled={isLoading}
                                    className="ml-auto px-5 py-1.5 bg-cyan-900 hover:bg-cyan-800 text-white rounded-md relative"
                                    onClick={() => {
                                        addToAlertWatchlist();
                                    }}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full animate-spin border-4 border-solid border-white border-t-transparent"></div>
                                        </div>
                                    ) : (
                                        "Add"
                                    )}
                                </button>

                            </div>
                        </div>
                    )
                }

            </div>           
            
        </ReactModal>
      
    </>
  )
}

export default SetAlertModal
