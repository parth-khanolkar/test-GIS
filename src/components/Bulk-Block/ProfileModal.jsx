'use client'


import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useInfoContext } from '@/context/info';
import { FaBell, FaRegBell } from 'react-icons/fa';
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
  } from "@tanstack/react-table";
import Moment from "react-moment";
import { useBulkBlockContext } from '@/context/BulkBlockContext';

const ProfileModal = ({ isOpen, closeModal,clientName }) => {
    const { uid } = useInfoContext();
    const { currentFollowing, setCurrentFollowing, getCurrentFollowing } = useBulkBlockContext();

    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [ data,setData ] = useState([]);
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '80%' : '85%',
                maxHeight: isMobile ? '80%' : '85%',
                width: isMobile ? '83%' : '60%',
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

    const columns = [
        {
          header: "Company",
          accessorKey: "Company_Name",
        },
        {
          header: "Return %",
          accessorKey: "change_percent",
          cell: (info) =>
            info.getValue() > 0 ? (
            <span className="text-green-600 bg-opacity-40 bg-green-200 px-1.5 py-1 ">
                {`${info.getValue().toFixed(1)} %`}
            </span>
            ) : info.getValue() < 0 ? (
            <span className="text-red-600 bg-opacity-40 bg-red-200 px-1.5 py-1 ">
                {`${info.getValue().toFixed(1)} %`}
            </span>
            ) : (
            <span className="bg-opacity-40 bg-gray-400 px-1.5 py-1">{`${info.getValue()} %`}</span>
            ),
        },
        {
            header: "Date",
            accessorKey: "UPD_TIME",
            cell: (info) => <Moment format="DD MMM 'YY">{info.getValue()}</Moment>,
        },
        {
            header: "Volume(K)",
            accessorKey: "final_volume",
        },
        {
            header: "Trade Prices(Rs)",
            accessorKey: "TRADEPRICE",
        },
        {
          header: "Value (Rs Cr)",
          accessorKey: "final_value",
          
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        
      });

    const getClientProfile = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/profiletrades`,{
                name:clientName
            });

            setData(response.data?.key);
            if(response.status === 200){
                setIsLoading(false);
            }

        } catch (error) {
            console.log("Error in getClientProfile: ",error);
        }
    }

    useEffect(()=>{
        getClientProfile();
    },[clientName]);

    const insertNotification = async (client_name) => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/insert_notification`,{
                user_id: uid,
                client_name: [client_name],
            });
            
            if(response.status === 200){
                setCurrentFollowing(prevFollowing => [...prevFollowing, client_name]);
            }

        } catch (error) {
            console.log("Error in insertNotification:",error);
        }
    }

    const deleteNotification = async (client_name) => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/delete_notification`,{
                user_id: uid,
                client_name: [client_name],
            });

            if(response.status === 200){
                setCurrentFollowing(prevFollowing => prevFollowing.filter(name => name !== client_name));
            } 
            

        } catch (error) {
            console.log("Error in insertNotification:",error);
        }
    }

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Alert Modal"
            style={getModalStyle()}
        >
            {/* HEADER */}
            <div className='flex flex-row justify-between border-b border-gray-300 pb-2'>
                <div className='flex flex-row space-x-2 items-center'>
                    <div className='text-xs md:text-lg'>
                        {clientName}
                    </div>
                    {
                        currentFollowing.includes(clientName) ? (
                            <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white hidden md:flex'
                                onClick={()=>{deleteNotification(clientName);}}
                            >
                                {"Unfollow"}
                            </button>
                        ) :(
                            <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white hidden md:flex'
                                onClick={()=>{insertNotification(clientName);}}
                            >
                                {"Follow"}
                            </button>
                        )
                    }
                    
                </div>
                <button className='flex items-center'
                    onClick={closeModal}
                >
                    <AiOutlineCloseCircle size={18}/>
                </button>
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
                    <div className='flex justify-between mt-3 '>
                        <div className='flex flex-row items-center space-x-2 text-sm md:text-lg'>
                            <div className=''>{"Avg Return"}</div>
                            <div className={`px-2.5 py-0.5 rounded-md
                                ${
                                    data[0]?.overall_avg > 0 ? ('bg-green-200 bg-opacity-50 text-green-800'):('bg-red-300 bg-opacity-40 text-red-800')
                                }
                            `}>
                                {`${data[0]?.overall_avg} %`}
                            </div>
                        </div> 
                        {
                            currentFollowing.includes(clientName) ? (
                                <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white md:hidden'
                                    onClick={()=>{deleteNotification(clientName);}}
                                >
                                    {"Unfollow"}
                                </button>
                            ) :(
                                <button className='text-xs md:text-sm px-2 py-0.5 bg-[#093967] hover:bg-cyan-950 rounded-md text-white md:hidden'
                                    onClick={()=>{insertNotification(clientName);}}
                                >
                                    {"Follow"}
                                </button>
                            )
                        }
                    </div>

                    <div className="overflow-x-auto w-full rounded-md overflow-y-auto scrollbar-none lg:scrollbar-thin max-h-[53vh] md:max-h-[70vh] lg:max-h-[65vh] mt-5">
                        {/* Table Header and Data */}
                        <table className="w-full sticky z-20 top-0">
                            <thead className="w-full sticky z-20 top-0">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                key={headerGroup.id}
                                className="bg-[#093967] text-white text-left"
                                >
                                {headerGroup.headers.map((header, index) => (
                                    <th
                                    key={header.id}
                                    className={`py-2 px-2 md:font-normal text-[10px] font-semibold md:text-sm whitespace-nowrap  
                                        ${
                                        index == 0
                                            ? "sticky left-0 z-10 bg-[#093967] text-left"
                                            : "text-center"
                                        }
                                    `}
                                    onClick={header.column.getToggleSortingHandler()}
                                    >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    </th>
                                ))}
                                </tr>
                            ))}
                            </thead>


                            {/* Table Data */}
                            <tbody className="">
                                {/* Table BODY */}
                                {table.getRowModel().rows.map((row, index) => (
                                <tr key={row.id} className={`odd:bg-white even:bg-[#eaeef5]`}>
                                    {row.getVisibleCells().map((cell, index1) => (
                                    <td
                                        key={cell.id}
                                        // title={cell.getValue()}
                                        className={`py-2 px-2 text-[10px] font-semibold md:font-normal md:text-sm 
                                            ${
                                            index1 == 0
                                                ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                                                : "text-center whitespace-nowrap"
                                            }   ${index % 2 == 0 ? "bg-white" : "bg-[#eaeef5]"} 
                                        `}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                    ))}
                                    
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>)
            }



        </ReactModal>
      
    </>
  )
}

export default ProfileModal
