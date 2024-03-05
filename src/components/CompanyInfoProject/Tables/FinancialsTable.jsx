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
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import { BiDownload, BiSearchAlt, BiSortAlt2 } from "react-icons/bi";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import DownloadExcel from "./DownloadExcel";
import { FaFileDownload } from "react-icons/fa";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import logo from "@/assets/images/logo.png";

function Table({ data, columns }) {
  // Hooks
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [expand, setExpand] = useState(false);
  const [expand2, setExpand2] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);

  useEffect(() => {
    setExpand(false);
  }, [columns, data]);

  // Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
      expanded: expand,
      columnVisibility,
      columnOrder,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onExpandedChange: setExpand,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getSubRows: (row) => row.child,
  });

  const randomizeColumns = () => {
    table.setColumnOrder(
      table.getAllLeafColumns().map((d, i, a) => {
        if (i === 0) {
          return d.id; // Leave the first value unchanged
        } else {
          return a[a.length - i].id; // Reverse the rest of the values
        }
      })
    );
  };

  const table2 = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
      expanded: expand2,
      columnVisibility,
      columnOrder,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onExpandedChange: setExpand2,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getSubRows: (row) => row.child,
  });

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

  return (
    <div>
      {data ? (
        <div>
          <div className="flex flex-wrap items-center justify-between w-full">
            {/* Search */}
            <div className="flex-none sm:flex gap-2">
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
              <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />
              {/* Reverse Buttons */}
              <button
                onClick={randomizeColumns}
                className={`text-[#083966] hover:text-[#2f70ac] cursor-pointer text-sm font-semibold flex items-center`}
              >
                <span className="rotate-90">
                  <BiSortAlt2 size={20} />
                </span>
                <span className="hidden">Reverse</span>
              </button>
              <vr className="p-[1px] h-[20px] bg-gray-400 rounded-full" />
              {/* ExcelDownload Buttons */}
              <div
                className="flex items-center gap-2 text-[#083966] hover:text-[#2f70ac] cursor-pointer text-sm font-semibold"
                onClick={() => exportExcel()}
              >
                <BiDownload size={20} />
                <p className="hidden">Excel</p>
              </div>
            </div>
          </div>

          {/* Whole Table Container */}
          <div className="overflow-x-auto rounded-md">
            {/* Table Header and Data */}
            <table
              id="financialsTableID"
              className="w-full whitespace-nowrap p-10"
            >
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
                            : "text-right"
                        }`}
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
                {table?.getRowModel().rows.map((row, index) => (
                  <tr key={row.id} className={`even:bg-white odd:bg-[#eaeef5]`}>
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
                        } ${
                          row.original.Codec == "B"
                            ? "font-bold"
                            : row.original.Codec == "B" && "italic"
                        } ${
                          (row.original.Parameter == "Revenue" ||
                            row.original.Parameter == "EBITDA" ||
                            row.original.Parameter == "PAT" ||
                            row.original.Parameter == "EBITDA Margin (%)" ||
                            row.original.Parameter == "EPS" ||
                            row.original.Parameter == "Net Income" ||
                            row.original.Parameter == "PPOP" ||
                            row.original.Parameter == "Diluted EPS" ||
                            row.original.Parameter == "BVPS" ||
                            row.original.Parameter == "Interest Income" ||
                            row.original.Parameter == "Total Net Income" ||
                            row.original.Parameter == "Net Interest Income" ||
                            row.original.Parameter ==
                              "Pre Provision Operating Profit" ||
                            row.original.Parameter == "Profit Before Tax" ||
                            row.original.Parameter == "Net Debt") &&
                          "font-bold"
                        }`}
                      >
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
        </div>
      ) : (
        <div className="flex justify-center items-center font-bold text-xl text-gray-400">
          Table Data not available
        </div>
      )}
    </div>
  );
}

export default Table;
