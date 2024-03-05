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
import moment from "moment";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

function TableTT({ data, columns }) {
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
      <div className="flex items-center justify-between w-full">
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
            <div className="relative left-[-70px]">
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
                        <label className="text-[#083966] font-bold whitespace-nowrap">
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
          {/* <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" /> */}
        </div>
      </div>

      {/* Whole Table Container */}
      <div className="overflow-x-auto rounded-md">
        <div></div>
        {/* Table Header and Data */}
        <table id="tableID" className="w-full whitespace-nowrap p-10">
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
                    className={`py-2 px-2 font-normal text-sm cursor-pointer ${
                      index == 0
                        ? "sticky left-0 z-10 bg-[#093967] text-left"
                        : "text-center"
                    } `}
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
                {/* <th className="py-2 px-2 font-normal text-sm text-right">
                  Weekly Trend
                </th> */}
                {/* <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[0].update_date).format("Do MMM ")}
                </th>
                <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[1].update_date).format("Do MMM ")}
                </th>
                <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[2].update_date).format("Do MMM ")}
                </th>
                <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[3].update_date).format("Do MMM ")}
                </th>
                <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[4].update_date).format("Do MMM ")}
                </th>
                <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[5].update_date).format("Do MMM ")}
                </th>
                <th className="py-2 px-2 font-normal text-sm text-center">
                  {moment(data[0].WeekList[6].update_date).format("Do MMM ")}
                </th> */}
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
                    className={`py-2 px-2 text-sm border border-white ${
                      index1 == 0
                        ? "sticky left-0 z-5 whitespace-pre-wrap text-left"
                        : "text-center"
                    } 
  
                      ${
                        index1 == 0 && index % 2 == 0
                          ? "bg-white"
                          : index1 == 0 && index % 2 != 0 && "bg-[#eaeef5]"
                      }
                          ${row.getParentRow() && "text-sm italic"} ${
                      row.getIsExpanded() && "font-semibold"
                    }  ${
                      cell.getValue() >= 0
                        ? "text-green-700"
                        : cell.getValue() < 0 && "text-red-700"
                    } ${
                      index1 != 1 &&
                      index1 != 2 &&
                      index1 != 3 &&
                      cell.getValue() == 2
                        ? "bg-[#0a7033] text-white"
                        : index1 != 1 &&
                          index1 != 2 &&
                          index1 != 3 &&
                          cell.getValue() == 1
                        ? "bg-[#33a862] text-white"
                        : index1 != 1 &&
                          index1 != 2 &&
                          index1 != 3 &&
                          cell.getValue() == -1
                        ? "bg-[#d86161] text-white "
                        : index1 != 1 &&
                          index1 != 2 &&
                          index1 != 3 &&
                          cell.getValue() == -2
                        ? "bg-[#a64444] text-white "
                        : index1 != 1 &&
                          index1 != 2 &&
                          index1 != 3 &&
                          cell.getValue() == 0 &&
                          "bg-gray-400 text-white "
                    } `}
                  >
                    {/* <span>{index + 1} ..</span> */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}

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
                {/* <td
                  className={`py-2 px-2 text-2xl flex items-center justify-end text-red-500 hover:text-red-700 text-right `}
                >
                  {row.original.WeekList.map((item, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 ${
                        item.recommendation == "Strong Buy"
                          ? "bg-[#0a7033] text-white"
                          : item.recommendation == "Buy"
                          ? "bg-[#33a862] text-white"
                          : item.recommendation == "Sell"
                          ? "bg-[#d86161] text-white "
                          : item.recommendation == "Strong Sell"
                          ? "bg-[#a64444] text-white "
                          : item.recommendation == "Neutral" &&
                            "bg-gray-400 text-white "
                      } ${
                        index == 0
                          ? "rounded-l-md"
                          : index + 1 == row.original.WeekList.length &&
                            "rounded-r-md"
                      } shadow-inner`}
                    ></div>
                  ))}
                </td> */}
                {/* <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(0).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(0).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(0).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(0).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(0).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(0).recommendation}
                </td>
                <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(1).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(1).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(1).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(1).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(1).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(0).recommendation}
                </td>
                <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(2).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(2).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(2).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(2).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(2).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(2).recommendation}
                </td>
                <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(3).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(3).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(3).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(3).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(3).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(3).recommendation}
                </td>
                <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(4).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(4).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(4).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(4).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(4).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(4).recommendation}
                </td>
                <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(5).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(5).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(5).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(5).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(5).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(5).recommendation}
                </td>
                <td
                  className={`py-2 px-2 text-center border border-white text-sm ${
                    row.original.WeekList.at(6).recommendation == "Strong Buy"
                      ? "bg-[#0a7033] text-white"
                      : row.original.WeekList.at(6).recommendation == "Buy"
                      ? "bg-[#33a862] text-white"
                      : row.original.WeekList.at(6).recommendation == "Sell"
                      ? "bg-[#d86161] text-white "
                      : row.original.WeekList.at(6).recommendation ==
                        "Strong Sell"
                      ? "bg-[#a64444] text-white "
                      : row.original.WeekList.at(6).recommendation ==
                          "Neutral" && "bg-gray-400 text-white "
                  }`}
                >
                  {row.original.WeekList.at(6).recommendation}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className="flex items-center justify-end sticky mt-2 gap-2 flex-wrap">
        <button
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
          className="rounded-full text-[#143b65] disabled:opacity-30 text-2xl"
        >
          <FaChevronCircleLeft />
        </button>
        <span className="flex items-center gap-1 text-sm">
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
          className="rounded-full text-[#143b65] disabled:opacity-30 text-2xl"
        >
          <FaChevronCircleRight />
        </button>
        <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />
        <span className="flex items-center gap-1 text-sm font-semibold">
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
        <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-[#143b65] rounded-md text-white text-sm"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TableTT;
