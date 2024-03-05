"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg';
import { useInfoContext } from '@/context/info';
import { HiRefresh } from 'react-icons/hi';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import moment from "moment/moment";
import Moment from 'react-moment';
import { toast } from 'react-toastify';
import { useWatchlistContext } from '@/context/WatchlistContext';

const InviteNotificationModal = ({ isOpen, closeModal }) => {
    const { uid,setUid } = useInfoContext();
    const { watchlist,setWatchlist } = useWatchlistContext();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [ data, setData ] = useState([]);

    const columns = [
        {
          header: "Watchlist Name",
          accessorKey: "WatchlistName",
          cell: (info) =>
            info.getValue().length > 15
              ? info.getValue().slice(0, 15) + "..."
              : info.getValue(),
        },
        {
          header: "Shared By",
          accessorKey: "SharedBy",
          cell: (info) =>
            info.getValue().length > 15
              ? info.getValue().slice(0, 15) + "..."
              : info.getValue(),
        },
        {
          header: "Date of Sharing",
          accessorKey: "DateOfSharing",
          cell: (info) => <span><Moment format="DD MMM, YYYY">{info.getValue()}</Moment></span>,
        },
        
      ];
      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // state: {
        //   globalFilter: filtering,
        //   sorting: sorting,
        //   columnVisibility,
        // },
        // onGlobalFilterChange: setFiltering,
        // onSortingChange: setSorting,
      });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '35%' : '45%',
                maxHeight: isMobile ? '80%' : '80%',
                width: isMobile ? '90%' : '40%',
                maxWidth: isMobile ? '90%' : '50%',
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

    const getNotifications = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/view_invitation',{
                UserId: uid
            });

            console.log(response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.log("Error in getNotifications: ",error);
        }
    }  
    useEffect(()=>{
        if(uid !== -1){
            getNotifications();
        }
    },[uid]);  

    const acceptInvitation = async (WatchListGroupId,WatchlistName) => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/accept_invitation',{
                UserId: uid,
                WatchListGroupId : WatchListGroupId
            });

            console.log(response.data);
            if(response.data.data === 'success'){
                toast.success('Invite accepted', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "light",
                });
                setWatchlist({ WatchListGroupId:WatchListGroupId,WatchGroupName:WatchlistName });
                closeModal();
            }

        } catch (error) {
            console.log("Error in acceptInvitation : ",error);
        }
    }

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-col'>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='flex flex-row gap-3 md:gap-4 lg:gap-5'>
                        <div className='text-rose-600 text-2xl font-semibold '>
                            INVITATIONS
                        </div>
                        <button className='text-lg'
                            onClick={()=>{getNotifications();}}
                        >
                            <HiRefresh />
                        </button>
                    </div>
                    
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto w-full rounded-md overflow-y-auto scrollbar-none mt-5 h-[30vh]">
                    <table className="w-full">
                    {/* Table HEADERS */}
                    <thead className="w-full sticky z-20 top-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="bg-[#093967] text-white text-left"
                        >
                            {headerGroup.headers.map((header, index) => (
                            <th
                                key={header.id}
                                className={`py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap hover:cursor-pointer text-left`}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                                {
                                { asc: " ⬇️", desc: " ⬆️" }[
                                    header.column.getIsSorted() ?? null
                                ]
                                }
                            </th>
                            ))}
                            {/* <th className="py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap text-center">
                            Alert
                            </th> */}
                            <th className="py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap text-center">
                            Actions
                            </th>
                        </tr>
                        ))}
                    </thead>

                    <tbody className="">
                        {/* Table BODY */}
                        {table.getRowModel().rows.map((row, index) => (
                        <tr key={row.id} className={`odd:bg-white even:bg-[#eaeef5]`}>
                            {row.getVisibleCells().map((cell, index1) => (
                            <td
                                key={cell.id}
                                className={`py-2 px-2 text-xs md:text-sm whitespace-nowrap text-left
                                  ${index % 2 == 0 ? "bg-white" : "bg-[#eaeef5]"} 
                            
                            `}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                            ))}
                            <td className="px-2 flex flex-row items-center space-x-3 justify-center text-xl">
                                <button
                                    onClick={() => {acceptInvitation(row.original.WatchListGroupId,row.original.WatchlistName)}}
                                    className="p-2 text-green-500"
                                >
                                    <MdCheckCircle />
                                </button>
                                <button
                                    onClick={() => {alert("Pending!")}}
                                    className="p-2 text-red-500"
                                >
                                    <MdCancel />
                                </button>
                            </td>
                            
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>



            </div>
        </ReactModal>
      
    </>
  )
}

export default InviteNotificationModal
