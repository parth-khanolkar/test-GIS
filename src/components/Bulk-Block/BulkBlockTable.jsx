import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
  } from "@tanstack/react-table";
  import React, { useMemo, useState } from "react";
  import {
    AiFillCloseCircle,
    AiFillEdit,
    AiOutlineDoubleLeft,
    AiOutlineDoubleRight,
  } from "react-icons/ai";
  import { BiSearchAlt } from "react-icons/bi";
  import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
  import {
    FaBell,
    FaChevronCircleLeft,
    FaChevronCircleRight,
    FaRegBell,
  } from "react-icons/fa";
import Moment from "react-moment";
import ProfileModal from "./ProfileModal";
import { useBulkBlockContext } from "@/context/BulkBlockContext";
import axios from "axios";
import { useInfoContext } from "@/context/info";
  
  function BulkBlockTable({ data,filtering, setFiltering,isLoading }) {
    const { currentFollowing, setCurrentFollowing, getCurrentFollowing } = useBulkBlockContext();
    const { uid } = useInfoContext();

    const columns = [
        {
          header: "Buyer Name",
          accessorKey: "CLIENTNAME",
          cell: (info) => (<span className="line-clamp-2">{info.getValue()}</span>),
          
        },
        {
          header: "Company Name",
          accessorKey: "Company_Name",
          cell: (info) => (<span className="line-clamp-2">{info.getValue()}</span>),
        },
        {
          header: "Trade Date",
          accessorKey: "UPD_TIME",
          cell: (info) => (<Moment format="DD MMM 'YY">{info.getValue()}</Moment>),
        },
        {
          header: "Volume",
          accessorKey: "final_volume",
          cell: (info) => (convertToIndianNumberFormat(info.getValue()))
        },
        {
          header: "Trade Price(Rs)",
          accessorKey: "TRADEPRICE",
          cell: (info) => (parseFloat(info.getValue()).toFixed(1))
        },
        {
          header: "Value",
          accessorKey: "final_value",
          cell: (info) => (parseFloat(info.getValue()).toFixed(1))
        },
        {
          header: "Share Price Change(1Y)",
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
          header: "Avg Return",
          accessorKey: "overall_avg",
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
          header: "Market Cap (Rs Cr)",
          accessorKey: "mcap",
          cell: (info) => (convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1)))
        },
        {
          header: "Sector",
          accessorKey: "sector",
          cell: (info) => info.getValue() ? (<span>{info.getValue()}</span>) : ('-'),
        },
        {
          header: "Bulk Block",
          accessorKey: "BULKBLOCK",
        },
    ];

    // Hooks
    const [sorting, setSorting] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState([]);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [clientName, setClientName] = useState('');
  
    const openProfileModalOpen = () => {
      setIsProfileModalOpen(true);
    }
    const closeProfileModalOpen = () => {
      setIsProfileModalOpen(false);
    }

    // Table
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      // getExpandedRowModel: getExpandedRowModel(),
      state: {
        sorting: sorting,
        globalFilter: filtering,
        // expanded: expand,
        columnVisibility,
        columnOrder,
      },
      onSortingChange: setSorting,
      onGlobalFilterChange: setFiltering,
      // onExpandedChange: setExpand,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnOrderChange: setColumnOrder,
      getSubRows: (row) => row.subrowlist,
    });

    const convertToIndianNumberFormat = (number) => {
      if (isNaN(number)) {
        console.error('Invalid input. Please provide a valid number.');
        return null;
      }
    
      const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
    
      return formattedNumber;
    };

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
          
        {/* Whole Table Container */}
        <div className="overflow-x-auto w-full rounded-md overflow-y-auto scrollbar-none lg:scrollbar h-[60vh] md:h-[70vh] lg:h-[63vh]">
          {/* Table Header and Data */}
          {
            isLoading ? (
                // Table Loader
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center justify-center h-[5vh] gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.3s] bg-black" style={{ animationDuration: '0.8s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.15s] bg-black" style={{ animationDuration: '0.8s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-pulse bg-black" style={{ animationDuration: '0.8s' }}></div>
                  </div>
                </div>
            ):(
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
                        className={`py-2 px-2 md:font-normal text-[11px] font-semibold md:text-sm whitespace-nowrap hover:cursor-pointer 
                          ${
                            index == 0
                              ? "sticky left-0 z-10 bg-[#093967] text-left"
                              : index == 1
                              ? "text-left"
                              : "text-center"
                          }
                        `}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <button>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {
                            { asc: " ⬇️", desc: " ⬆️" }[
                              header.column.getIsSorted() ?? null
                            ]
                          }
                        </button>
                      </th>
                    ))}
                    <th className="py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap text-center">
                        Follow
                    </th>
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
                          className={`py-2 px-2 text-[9px] font-semibold md:font-normal md:text-sm 
                              ${
                                index1 == 0
                                  ? "sticky left-0 z-10 whitespace-pre-wrap text-left cursor-pointer"
                                  : index1 == 1
                                  ? "text-left cursor-pointer"
                                  : "text-center"
                              }   ${index % 2 == 0 ? "bg-white" : "bg-[#eaeef5]"} 
                          `}
                          onClick={() => {
                            if(index1 === 0){
                              setClientName(cell.getValue());
                              openProfileModalOpen();
                            }

                            if (index1 === 1) {
                              window.open(`/companyinfo/${row.original.FINCODE}`);
                            }
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                      <td className="text-center">
                        {
                          currentFollowing.includes(row.original.CLIENTNAME) ? (
                              <button className=''
                                  onClick={()=>{
                                      deleteNotification(row.original.CLIENTNAME);
                                  }}
                              >
                                  <FaBell />
                              </button>
                          ):(
                              <button className=''
                                  onClick={()=>{insertNotification(row.original.CLIENTNAME)}}
                              >
                                  <FaRegBell />
                              </button>
                          )
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
            )
          }
        </div>

        {/* pagination */}
        <div className="flex items-center justify-center md:justify-end mt-2 gap-2 flex-wrap">
          <button
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full text-[#143b65] disabled:opacity-30 md:text-2xl"
          >
            <FaChevronCircleLeft />
          </button>
          <span className="flex items-center gap-1 text-xs md:text-sm">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <button
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className="rounded-full text-[#143b65] disabled:opacity-30 md:text-2xl"
          >
            <FaChevronCircleRight />
          </button>
          <span className="flex items-center gap-1 text-xs md:text-sm font-semibold">
            Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-11 bg-gray-200"
              min={0}
              max={table.getPageCount()}
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="p-1 md:p-2 bg-[#143b65] rounded-md text-white text-xs md:text-sm"
          >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>

        <ProfileModal isOpen={isProfileModalOpen} closeModal={closeProfileModalOpen} clientName={clientName} />
      </>
    );
  }
  
  export default BulkBlockTable;
  