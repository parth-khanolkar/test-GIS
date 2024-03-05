import React, { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";

function QuarterlyTable({ data,filtering,setFiltering,isLoading,triggerDownload }) {
    const router = useRouter();
    
    const columns = [
        {
            header: "Company Name",
            accessorKey: "company_name",
            cell: (info) =>
              info.getValue().length > 15 ? (
                <span className="line-clamp-1 truncate">
                  {info.getValue().slice(0, 15) + "..."}
                </span>
              ) : (
                <span className="line-clamp-1 truncate">{info.getValue()}</span>
              ),
        },
        {
            header: "Revenue",
            accessorKey: "revenue",
            cell: (info) => convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1)),
        },
        {
            header: "Revenue Growth (QoQ)",
            accessorKey: "revenue_growth_qoq",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`+${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : (
                <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
              ),
        },
        {
            header: "Revenue Growth (YoY)",
            accessorKey: "revenue_growth_yoy",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`+${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : (
                <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
              ),
        },
        {
            header: "EBITDA",
            accessorKey: "ebitda",
            cell: (info) => convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1)),
        },
        {
            header: "EBITDA Growth (QoQ)",
            accessorKey: "ebitda_growth_qoq",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`+${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : (
                <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
              ),
        },
        {
            header: "EBITDA Growth (YoY)",
            accessorKey: "ebitda_growth_yoy",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`+${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : (
                <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
              ),
        },
        {
            header: "EBITDA Margin",
            accessorKey: "ebitda_margin",
            cell: (info) => <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
        },
        {
            header: "EBITDA Margin Growth (QoQ)",
            accessorKey: "ebitda_margin_growth_qoq",
            cell: (info) => <span className="font-medium">{`${convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(0))} bps`}</span>
        },
        {
            header: "EBITDA Margin Growth (YoY)",
            accessorKey: "ebitda_margin_growth_yoy",
            cell: (info) => <span className="font-medium">{`${convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(0))} bps`}</span>
        },
        {
            header: "PAT",
            accessorKey: "pat",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`${convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1))}`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1))}`}
                </span>
              ) : (
                <span className="">{`${convertToIndianNumberFormat(parseFloat(info.getValue()).toFixed(1))}`}</span>
              ),
        },
        {
            header: "PAT Growth (QoQ)",
            accessorKey: "pat_growth_qoq",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`+${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : (
                <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
              ),
        },
        {
            header: "PAT Growth (YoY)",
            accessorKey: "pat_growth_yoy",
            cell: (info) =>
              info.getValue() > 0 ? (
                <span className=" font-medium">
                  {`+${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : info.getValue() < 0 ? (
                <span className=" font-medium">
                  {`${parseFloat(info.getValue()).toFixed(1)}%`}
                </span>
              ) : (
                <span className="">{`${parseFloat(info.getValue()).toFixed(1)}%`}</span>
              ),
        },
        
    ]

  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);

  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter: filtering,
      sorting: sorting,
      columnVisibility,
    },
    onGlobalFilterChange: setFiltering,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const convertToIndianNumberFormat = (number) => {
    if (isNaN(number)) {
      console.error('Invalid input. Please provide a valid number.');
      return null;
    }
  
    const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
  
    return formattedNumber;
  };

  async function exportExcel(filename = "Quarterly Results", applyFilters = false) {
    const wb = new Workbook();
    const ws = wb.addWorksheet("Sheet 1");

    const lastHeaderGroup = table.getHeaderGroups().at(-1);
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
    const exportRows = table.getExpandedRowModel().rows;

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
  useEffect(()=>{
    if(triggerDownload > 0){
      exportExcel();
    }
  },[triggerDownload]);

  return (
    <>
      <div className="overflow-x-auto w-full rounded-md overflow-y-auto h-[60vh] md:h-[70vh] lg:h-[63vh]">
      {
            isLoading ? (
                // Table Loader
                <div className="flex items-center justify-center h-full gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.3s] bg-black" style={{ animationDuration: '0.8s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.15s] bg-black" style={{ animationDuration: '0.8s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse bg-black" style={{ animationDuration: '0.8s' }}></div>
                </div>
            ):(
        
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
                    style={{ width: "100px" }}
                        key={header.id}
                        className={`py-2 px-2 font-normal text-xs md:text-sm hover:cursor-pointer ${
                        index == 0
                            ? "sticky left-0 z-10 bg-[#093967]"
                            : "text-right"}
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                    >
                        <button className="text-xs text-right">
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
                
              </tr>
            ))}
          </thead>

          <tbody className="">
            {/* Table BODY */}
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={`odd:bg-white even:bg-[#eaeef5]`}>
                {row.getVisibleCells().map((cell, index1) => (
                    <td
                    style={{ width: "100px" }}
                        key={cell.id}
                        title={cell.getValue()}
                        className={`py-2 px-2 text-xs md:text-sm whitespace-nowrap ${
                        index1 == 0
                            ? "sticky left-0 z-10 whitespace-pre-wrap text-left "
                            : "text-right"}
                        }   ${index % 2 == 0 ? "bg-white" : "bg-[#eaeef5]"} 
                    
                        `}
                        onClick={() => {
                            if (index1 === 0) {
                              router.push(`/companyinfo/${row.original.fincode}`);
                            }
                          }}
                        
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

    </>
  );
}

export default QuarterlyTable;
