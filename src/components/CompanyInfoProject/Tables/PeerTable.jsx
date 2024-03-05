import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import {
  AiFillCloseCircle,
  AiFillEdit,
  AiFillPlusCircle,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import { BiDownload, BiSearchAlt } from "react-icons/bi";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FaFilterCircleXmark } from "react-icons/fa6";

import { ToastContainer, toast } from "react-toastify";

import Select from "react-select";
import { useInfoContext } from "@/context/info";
import { MdDelete } from "react-icons/md";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import PeerSlider from "./TableComps/PeerSlider";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaFilter,
} from "react-icons/fa";
import { useRouter } from "next/router";
import SearchBar from "@/components/GlobalComponents/SearchBar";

const PeerTable = ({ data, columns, mode, yearDrop }) => {
  const router = useRouter();
  const { fincodeLink } = router.query;
  const {
    fincode,
    setFincode,
    initData,
    setInitData,
    consoleStatus,
    setConsoleStatus,
    globalStandalone,
    setGlobalStandalone,
    uid,
    setUid,
    peerFincode,
    setPeerFincode,
    reloadPeer,
    setReloadPeer,
    minPeerVal,
    setMinPeerVal,
    maxPeerVal,
    setMaxPeerVal,
    minPeerPossible,
    setMinPeerPossible,
    maxPeerPossible,
    setMaxPeerPossible,
    peerRestore,
    setPeerRestore,
    peerYearFilter,
    setPeerYearFilter,
  } = useInfoContext();

  // Hooks
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [expand, setExpand] = useState(false);
  const [expand2, setExpand2] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [addPeerFlag, setAddPeerFlag] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);

  const [searchInput, setSearchInput] = useState("");

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
      expanded: expand,
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

  const fetchCompanyNames = async () => {
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/company_search`,
        {
          searchtxt: searchInput,
        }
      );

      setSearchOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchCompanyNames();
  }, [searchInput]);

  // Fetch Standalone Table Data Func
  const deletePeer = async (deleteFincode, type) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/deletecustom_peer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: uid,
            fincode: deleteFincode,
            industry: initData?.Industry?.value,
            mode: type,
          }),
        }
      );
      setReloadPeer(reloadPeer + 1);
      toast("Company Deleted!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Not able to delete this Company!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // const table2 = useReactTable({
  //   data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   // getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getExpandedRowModel: getExpandedRowModel(),
  //   state: {
  //     sorting: sorting,
  //     globalFilter: filtering,
  //     expanded: expand2,
  //     columnVisibility,
  //     columnOrder,
  //   },
  //   onSortingChange: setSorting,
  //   onGlobalFilterChange: setFiltering,
  //   onExpandedChange: setExpand2,
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onColumnOrderChange: setColumnOrder,
  //   getSubRows: (row) => row.child,
  // });

  // DOWNLOAD EXCEL
  async function exportExcel(filename = "EXCEL", applyFilters = false) {
    const wb = new Workbook();
    const ws = wb.addWorksheet("Sheet 1");

    const lastHeaderGroup = table2.getHeaderGroups().at(-1);
    if (!lastHeaderGroup) {
      console.error("No header groups found", table.getHeaderGroups());
      return;
    }

    ws.columns = lastHeaderGroup.headers
      .filter((h) => h.column.getIsVisible())
      .map((header) => {
        return {
          header: header.column.columnDef.header,
          key: header.id,
          width: 20,
        };
      });
    // const exportRows = applyFilters
    //   ? table.getFilteredRowModel().rows
    //   : table.getGroupedRowModel().rows;
    const exportRows = table2.getExpandedRowModel().rows;

    exportRows.forEach((row) => {
      const cells = row.getAllCells();
      const values = cells.map((cell) => cell.getValue() ?? "");
      // console.log("values", values);
      ws.addRow(values);
    });

    ws.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    // for csv: await wb.csv.writeBuffer();
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${filename}.xlsx`);
  }

  // useEffect(() => {
  //   table.getRowModel().rows.length < 10 && setShowMore(true);
  // }, []);

  // NEW Search
  const fetchCompanySearch = async () => {
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/company_search`,
        {
          searchtxt: searchInput,
        }
      );
      setSearchOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchCompanySearch();
  }, [searchInput]);

  return (
    <div>
      {data ? (
        <div>
          <div className="flex items-center justify-between w-full flex-wrap">
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
                <BiSearchAlt size={18} className="text-[#083966] " />
              </div>
            </div>

            {/* Reverse and Column Visibility */}
            <div className=" flex gap-2 items-center">
              {/* Year Dropdown */}
              <Select
                className="text-[#0d2843] font-semibold text-sm absolute z-50 flex-1 max-w-[230px] pb-2"
                options={yearDrop}
                value={peerYearFilter}
                placeholder="Years..."
                onChange={(values) => {
                  values ? setPeerYearFilter(values) : setPeerYearFilter(null);
                }}
                isClearable="true"
                // filterOption={customFilterOption}
                // maxMenuHeight="150px"
              />

              <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />

              {/* Search Add Peer */}
              <div className="flex gap-2 items-center bg-white px-1 ">
                <div className="pb-2">
                  {searchOptions && addPeerFlag && (
                    // <Select
                    //   className="text-[#0d2843] font-semibold text-sm absolute z-50 flex-1 max-w-[230px] min-w-[230px]"
                    //   options={searchOptions}
                    //   placeholder="Add Peers..."
                    //   onInputChange={(inp) => {
                    //     setSearchInput(inp);
                    //   }}
                    //   onChange={(values) => {
                    //     values
                    //       ? setPeerFincode(values?.value)
                    //       : setPeerFincode(null);
                    //   }}
                    //   isClearable="true"
                    //   filterOption={customFilterOption}
                    //   maxMenuHeight="150px"
                    // />
                    <SearchBar
                      options={searchOptions}
                      placeholder={"Add Peers..."}
                      handleChange={(values) => {
                        values
                          ? setPeerFincode(values?.value)
                          : setPeerFincode(null);
                      }}
                    />

                    // <Select
                    //   className="text-[#0d2843] font-semibold text-sm absolute z-50 flex-1 max-w-[230px] min-w-[230px]"
                    //   options={searchOptions}
                    //   onInputChange={(inp) => {
                    //     setSearchInput(inp);
                    //   }}
                    //   placeholder="Add Peers..."
                    //   onChange={(values) => {
                    //     values
                    //       ? setPeerFincode(values?.value)
                    //       : setPeerFincode(null);
                    //   }}
                    //   // isClearable="true"
                    //   maxMenuHeight="150px"
                    // />
                  )}
                </div>
                <div>
                  {addPeerFlag ? (
                    <AiFillCloseCircle
                      onClick={() => setAddPeerFlag(!addPeerFlag)}
                      className="text-[#083966] hover:text-[#2f70ac] cursor-pointer"
                      size={30}
                    />
                  ) : (
                    <div
                      onClick={() => setAddPeerFlag(!addPeerFlag)}
                      className="flex gap-1 items-center text-[#083966] hover:text-[#2f70ac] cursor-pointer text-sm"
                    >
                      <AiFillPlusCircle size={22} />
                      <span className="whitespace-nowrap font-bold hidden ">
                        Add Peer
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />

              {/* Slider */}
              <div className="flex gap-2 items-center">
                <div>
                  {filterFlag ? (
                    <FaFilterCircleXmark
                      onClick={() => setFilterFlag(!filterFlag)}
                      className="text-[#083966] hover:text-[#2f70ac] cursor-pointer"
                      size={22}
                    />
                  ) : (
                    <div
                      onClick={() => setFilterFlag(!filterFlag)}
                      className="flex gap-1 items-center text-[#083966] hover:text-[#2f70ac] cursor-pointer text-sm"
                    >
                      <FaFilter size={18} />
                      <span className="whitespace-nowrap font-bold hidden ">
                        Add Peer
                      </span>
                    </div>
                  )}
                </div>
                {filterFlag && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-bold text-[#093967]">
                      MCAP:{" "}
                    </span>
                    <div className="p-1 bg-[#093967] rounded-md mb-1">
                      <div className="">
                        <PeerSlider
                          min={minPeerPossible}
                          max={maxPeerPossible}
                          onChange={({ min, max }) =>
                            console.log(`min = ${min}, max = ${max}`)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />

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
                    <span className="font-bold hidden">Edit Columns</span>
                  </div>
                </div>
                <div className="relative">
                  <div
                    className={`text-sm z-20 ${
                      !dropdownOpen ? "hidden" : "absolute "
                    }`}
                  >
                    <div className="inline-block border border-black shadow rounded p-1 bg-white ">
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

              {/* ExcelDownload Buttons */}
              <div
                className="flex items-center gap-2 text-[#083966] hover:text-[#2f70ac] cursor-pointer text-sm font-semibold"
                onClick={() => exportExcel()}
              >
                <BiDownload size={20} />
                <p className="hidden ">Excel</p>
              </div>
            </div>
          </div>

          {/* Whole Table Container */}
          <div className="overflow-x-auto rounded-md">
            {/* Table Header and Data */}
            <table
              id="tableID"
              className="w-full whitespace-nowrap p-10 lg:table-fixed"
            >
              <tbody>
                {/* Headers */}
                {table?.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-[#093967] text-white">
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`py-2 px-2 font-normal text-sm cursor-pointer ${
                          index == 0
                            ? "sticky left-0 z-10 bg-[#093967] text-left"
                            : "text-right"
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
                    <th className="py-2 px-2 font-normal text-sm text-right">
                      Delete
                    </th>
                  </tr>
                ))}
                {/* Table Data */}
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`even:bg-white odd:bg-[#eaeef5] text-right`}
                  >
                    {row.getVisibleCells().map((cell, index1) => (
                      <td
                        key={cell.id}
                        className={`py-2 px-2 text-sm ${
                          index1 == 0
                            ? "sticky left-0 z-10 whitespace-pre-wrap text-left"
                            : "text-right"
                        }  ${
                          index % 2 == 0 && !row.getParentRow()
                            ? "bg-white"
                            : index % 2 != 0 &&
                              !row.getParentRow() &&
                              "bg-[#eaeef5]"
                        } 
                    ${
                      row.getParentRow() && row.getParentRow().index % 2 == 0
                        ? "text-sm italic bg-white"
                        : row.getParentRow() &&
                          row.getParentRow().index % 2 != 0 &&
                          "text-sm italic bg-[#eaeef5]"
                    } ${row.getIsExpanded() && "font-semibold"} ${
                          cell.getValue() == "BUY"
                            ? "text-green-500"
                            : cell.getValue() == "SELL" && "text-red-500"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}

                        {/* <span
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
                        </span> */}
                      </td>
                    ))}
                    <td
                      className={`py-2 px-2 text-2xl flex items-center justify-end text-red-500 hover:text-red-700 text-right `}
                    >
                      <button
                        onClick={() => {
                          mode
                            ? deletePeer(row.original.fincode, "C")
                            : deletePeer(row.original.fincode, "S");
                        }}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* pagination and Restore Peer*/}
          <div className="flex justify-between flex-wrap items-center mt-2">
            <div
              onClick={() => setPeerRestore(peerRestore + 1)}
              className="bg-[#143b65] hover:bg-[#1d5591] cursor-pointer text-white p-1 rounded-md text-sm"
            >
              Restore Peer
            </div>
            <div className="flex items-center justify-end sticky gap-2 flex-wrap">
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
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
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
        </div>
      ) : (
        <div className="flex justify-center items-center font-bold text-xl text-gray-400">
          Table Data not available
        </div>
      )}
    </div>
  );
};

export default PeerTable;
