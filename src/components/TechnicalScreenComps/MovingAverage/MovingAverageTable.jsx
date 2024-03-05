import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaFilter,
} from "react-icons/fa";

function MovingAverageTable({ data, columns }) {
  // Hooks
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownRadioOpen, setDropdownRadioOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);
  const [radioFilter, setRadioFilter] = useState("all");

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

  useEffect(() => {
    console.log(radioFilter);
  }, [radioFilter]);

  return (
    <div className="min-h-[500px]">
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
          {/* Vertical LINE */}
          <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />
          {/* Filter RADIO BUTTONS */}
          <div>
            <div className="flex text-sm">
              <div
                onClick={() => {
                  setDropdownRadioOpen(!dropdownRadioOpen);
                }}
                className="flex gap-2 items-center text-[#083966] hover:text-[#2f70ac] cursor-pointer "
              >
                <span>
                  {!dropdownRadioOpen ? (
                    <FaFilter size={18} />
                  ) : (
                    <AiFillCloseCircle size={20} />
                  )}
                </span>
                {/* <span className="font-bold hidden md:inline-block">
                      Edit Columns
                    </span> */}
              </div>
            </div>
            <div className="relative left-[-80px]">
              <div
                className={`text-sm z-20 ${
                  !dropdownRadioOpen ? "hidden" : "absolute "
                }`}
              >
                <div
                  onChange={(e) => setRadioFilter(e.target.value)}
                  className="inline-block border border-black shadow rounded p-1 bg-white whitespace-nowrap"
                >
                  <h1 className="font-bold underline underline-offset-2 text-[#093967]">
                    Price
                  </h1>
                  <div className="flex gap-1 items-center font-bold">
                    <input
                      type="radio"
                      value="all"
                      name="filterRadio"
                      defaultChecked
                    />
                    <p>{`All`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="less50" name="filterRadio" />
                    <p>{`< 50 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="greater50" name="filterRadio" />
                    <p>{`> 50 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="less200" name="filterRadio" />
                    <p>{`< 200 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="greater200" name="filterRadio" />
                    <p>{`> 200 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="less263" name="filterRadio" />
                    <p>{`< 263 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="greater263" name="filterRadio" />
                    <p>{`> 263 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="less445" name="filterRadio" />
                    <p>{`< 445 Days`}</p>
                  </div>
                  <div className="flex gap-1 items-center font-bold">
                    <input type="radio" value="greater445" name="filterRadio" />
                    <p>{`> 445 Days`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              </tr>
            ))}
            {/* Table Data */}
            {table
              .getRowModel()
              .rows.filter((row) =>
                radioFilter == "all"
                  ? row
                  : radioFilter == "less50"
                  ? row.original.Price <= row.original.Avg50DaysValue
                  : radioFilter == "greater50"
                  ? row.original.Price > row.original.Avg50DaysValue
                  : radioFilter == "less200"
                  ? row.original.Price <= row.original.Avg200DaysValue
                  : radioFilter == "greater200"
                  ? row.original.Price > row.original.Avg200DaysValue
                  : radioFilter == "less263"
                  ? row.original.Price <= row.original.Avg7_263_DaysValue
                  : radioFilter == "greater263"
                  ? row.original.Price > row.original.Avg7_263_DaysValue
                  : radioFilter == "less445"
                  ? row.original.Price <= row.original.Avg5_445_DaysValue
                  : radioFilter == "greater445" &&
                    row.original.Price > row.original.Avg5_445_DaysValue
              )
              .map((row, index) => (
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
                      } ${
                        cell.getValue() == "Strong Buy"
                          ? "bg-[#4ebe7b] text-white"
                          : cell.getValue() == "Buy"
                          ? "bg-[#93dbb0] text-white"
                          : cell.getValue() == "Sell"
                          ? "bg-[#ff9f9f] text-white "
                          : cell.getValue() == "Strong Sell"
                          ? "bg-[#f87373] text-white "
                          : cell.getValue() == "Neutral" &&
                            "bg-gray-400 text-white "
                      } `}
                    >
                      {/* <span>{index + 1} ..</span> */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}

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
      {/* pagination */}
      <div className="flex items-center justify-end mt-2 gap-2 flex-wrap">
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

export default MovingAverageTable;
