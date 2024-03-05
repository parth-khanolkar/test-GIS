import React, { useState } from 'react'
import { 
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table'
import moment from 'moment/moment'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CompanyGraphModal from './CompanyGraphModal';

function GlobalWatchlistTable  ({data})  {
    const [columnVisibility, setColumnVisibility] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fincode, setFincode] = useState(0);
    const [companyName, setcompanyName] = useState(0);
    const [sorting, setSorting] = useState([]);


    const columns = [
      { 
        header: 'Stock', 
        accessorKey: 'company_name', 
        cell:(info)=>(info.getValue().length > 15 ? info.getValue().slice(0, 15)+"..."  : info.getValue())
      },
      { 
        header: 'LTP', 
        accessorKey: 'live_price', 
      },
      { 
        header: 'Change %', 
        accessorKey: 'change_percent', 
        cell:(info)=>(info.getValue()>0 ? (<span className='text-green-600'>{info.getValue()}%</span>):(info.getValue()<0 ? (<span className='text-red-600'>{info.getValue()}%</span>):(<span className=''>{info.getValue()}%</span>))) 
      },
      { 
        header: 'Change', 
        accessorKey: 'change', 
        cell:(info)=>(info.getValue()>0 ? (<span className='text-green-600'>{info.getValue()}</span>):(info.getValue()<0 ? (<span className='text-red-600'>{info.getValue()}</span>):(<span className=''>{info.getValue()}</span>))) 
      },
      { 
        header: 'Volume', 
        accessorKey: 'volume', 
        cell:(info)=>(formatNumber(info.getValue()))
      },

    ]

    const table = useReactTable({ 
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state:{
        // globalFilter: filtering,
        sorting:sorting,
        columnVisibility,
        },
        // onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        initialState:{
          hiddenColumns:["AddedDate","ChangeSinceAdded"]
        }
    })

    function formatNumber(number) {
      if (number >= 10000000) {
        return (number / 10000000).toFixed(2) + ' Cr';
      } else if (number >= 100000) {
        return (number / 100000).toFixed(2) + ' L';
      } else if (number >= 1000) {
        return (number / 1000).toFixed(2) + ' K';
      } else {
        return number.toString();
      }
    }

    const openModal = () =>{
      setIsModalOpen(true);
    }

    const closeModal = () =>{
      setIsModalOpen(false);
    }

  return (<>
    <div className='flex flex-col w-full'>
    {/* EDIT Options */}
      <div>
        <div className="flex text-sm justify-end">
          <div
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex gap-2 items-center text-[#083966] hover:text-[#2f70ac] cursor-pointer "
          >
            <span>
              {!dropdownOpen ? (
                <AiFillEdit size={20} />
              ) : (
                <AiFillCloseCircle size={20} />
              )}
            </span>
            <span className="font-bold">
              Edit Columns
            </span>
          </div>
        </div>
        <div className="relative flex  justify-end">
          <div
            className={`text-sm z-50 ${
              !dropdownOpen ? "hidden" : "absolute "
            }`}
          >
            <div className="inline-block border border-black shadow rounded p-1 bg-white">
              {table?.getAllLeafColumns().map((column, index) => {
                return (
                  <div
                    key={column.id}
                    className={`px-1 ${index == 0 && "hidden"}`}
                  >
                    <label className="text-[#083966] font-bold">
                      <input
                        {...{
                          type: "checkbox",
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />{" "}
                      {column.columnDef.header}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE div */}
      <div className='overflow-x-auto w-full rounded-md overflow-y-auto scrollbar-none md:scrollbar-thin'>
        <table className='w-full text-xs md:text-sm'>
            {/* Table HEADERS */}
            <thead className='w-full sticky z-20 top-0'>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-[#093967] text-white text-left">
                {headerGroup.headers.map((header,index) => 
                    <th key={header.id} className={`py-2 px-2 whitespace-nowrap hover:cursor-pointer ${
                    index == 0
                    ? "sticky left-0 z-10 bg-[#093967] text-left"
                    : "text-center"
                    }`}
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
                )}
                </tr>
            ))}
            </thead>

                
            <tbody className=''>
            {/* Table BODY */}
            {table.getRowModel().rows.map((row,index) => (
                <tr key={row.id} className={`odd:bg-white even:bg-[#eaeef5]`}>
                {row.getVisibleCells().map((cell,index1) => (
                    <td key={cell.id}
                    className={`py-2 px-2  ${
                    index1 == 0
                        ? "sticky left-0 z-10 whitespace-nowrap text-left cursor-pointer"
                        : "text-center"
                    }  ${index % 2 == 0 ? "bg-white" : "bg-[#eaeef5]"} 
                    `}
                    onClick={()=>{
                      if(index1 === 0){
                        setFincode(row.original.fincode);
                        setcompanyName(row.original.company_name);
                        openModal(); 
                      }}}
                    >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
                    
    <CompanyGraphModal isOpen={isModalOpen} closeModal={closeModal} fincode={fincode} companyName={companyName}/>
  </>)
}

export default GlobalWatchlistTable
