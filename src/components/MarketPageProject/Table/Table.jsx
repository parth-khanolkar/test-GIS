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
import DownloadExcel from "../../CompanyInfoProject/Tables/DownloadExcel";
import { FaFileDownload } from "react-icons/fa";
import Download from "./Download";

function Table({ data, columns }) {
  // Hooks
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);

  // Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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

  return (
    <div>
      <div className="flex items-center justify-between w-full ">
        {/* Search */}
        <div className="flex-none sm:flex gap-2 items-center">
          <div className="flex justify-between gap-1 items-center border rounded-full border-[#083966] px-2 py-1 mb-2">
            <input
              type="type"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Filter by any data..."
              className="outline-none bg-transparent"
            />
            <BiSearchAlt size={18} className="text-[#083966]" />
          </div>
        </div>

        {/* Reverse and Column Visibility */}
        <div className=" flex gap-2 items-center">
          {/* Column Visibility */}
          <div>
            <div className="flex text-sm">
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
                {/* <span className="font-bold hidden md:inline-block">
                  Edit Columns
                </span> */}
              </div>
            </div>
            <div className="relative">
              <div
                className={`text-sm z-20 ${
                  !dropdownOpen ? "hidden" : "absolute "
                }`}
              >
                <div className="inline-block border border-black shadow rounded p-1 bg-white">
                  {table.getAllLeafColumns().map((column, index) => {
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
          <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />
          {/* Reverse Buttons */}
          <div className="flex items-center gap-4 my-2 sm:my-0 text-[#083966] font-semibold">
            {data ? (
              <Download data={data} fileName="EXCEL" />
            ) : (
              <button className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                <FaFileDownload size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Whole Table Container */}
      <div className="overflow-x-auto rounded-md">
        <div></div>
        {/* Table Header and Data */}
        <table id="tableID" className="w-full sm:whitespace-nowrap p-10">
          <tbody>
            {/* Headers */}
            {table?.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#093967] text-white text-left"
              >
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`py-2 px-2 font-normal text-sm ${
                      index == 0
                        ? "sticky left-0 z-10 bg-[#093967] text-left"
                        : "text-center"
                    } `}
                    // onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
            {/* Table Data */}
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`even:bg-white odd:bg-[#eaeef5] text-center`}
              >
                {row.getVisibleCells().map((cell, index1) => (
                  <td
                    key={cell.id}
                    className={`py-2 px-2 text-sm border-gray-300 border-b ${
                      index1 == 0
                        ? "sticky left-0 z-10 whitespace-pre-wrap text-left bg-white"
                        : "text-center"
                    } 
                      ${row.getParentRow() && "text-sm italic"} ${
                      row.getIsExpanded() && "font-semibold"
                    } ${
                      cell.getValue() >= 0 && cell.getValue() < 5
                        ? "bg-[#a2ceab]"
                        : cell.getValue() >= 5 && cell.getValue() < 20
                        ? "bg-[#61b87c]"
                        : cell.getValue() >= 20 && cell.getValue() <= 100
                        ? "bg-[#3e8a56]"
                        : cell.getValue() < 0 && cell.getValue() > -5
                        ? "bg-[#f6dcde]"
                        : cell.getValue() <= -5 && cell.getValue() > -20
                        ? "bg-[#f3cdce]"
                        : cell.getValue() <= -20 && "bg-[#e96d6b]"
                    } `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    <span>{index1 != 0 && "%"}</span>
                    <span
                      className={`${index1 == 0 && "pl-2"} ${
                        index1 != 0 && "hidden"
                      }  text-black hover:text-[#216787]`}
                    >
                      {row.getCanExpand() && (
                        <button
                          {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: "pointer" },
                          }}
                        >
                          {row.getIsExpanded() ? (
                            <AiFillCaretUp />
                          ) : (
                            <AiFillCaretDown />
                          )}
                        </button>
                      )}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
