import React, { useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import Moment from "react-moment";

function InsightsTable({data}) {

  

  // columns and their individual functions
  const columns = [
    {
      header: "Buyer",
      accessorKey: "CLIENTNAME",
    },
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
      cell: (info) => <span>{convertToIndianNumberFormat((info.getValue()/1000).toFixed(1))}</span>
    },
    {
      header: "Trade Price(Rs)",
      accessorKey: "TRADEPRICE",
    },
    {
      header: "Value(Rs Cr)",
      accessorKey: "final_value",
      cell: (info) => <span>{convertToIndianNumberFormat((info.getValue()/100).toFixed(1))}</span>
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const convertToIndianNumberFormat = (number) => {
    if (isNaN(number)) {
      console.error('Invalid input. Please provide a valid number.');
      return null;
    }
  
    const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
  
    return formattedNumber;
  };
  

  return (
    <>
      <div className="overflow-x-auto w-full rounded-md overflow-y-auto ">
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
                    className={`py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap hover:cursor-pointer ${
                      index == 0
                        ? "sticky left-0 z-10 bg-[#093967] text-left "
                        : index == 1
                        ? "text-left"
                        : "text-center"
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
          </thead>

          <tbody className="">
            {/* Table BODY */}
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={`odd:bg-white even:bg-[#eaeef5]`}>
                {row.getVisibleCells().map((cell, index1) => (
                  <td
                    key={cell.id}
                    title={cell.getValue()}
                    className={`py-2 px-2 text-xs md:text-sm whitespace-nowrap ${
                      index1 == 0
                        ? "sticky left-0 z-10 whitespace-pre-wrap text-left cursor-pointer"
                        : index1 == 1
                        ? "text-left"
                        : "text-center"
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

    </>
  );
}

export default InsightsTable;
