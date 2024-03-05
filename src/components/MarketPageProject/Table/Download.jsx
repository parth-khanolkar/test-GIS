import React from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import { AiOutlineDownload } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";

const Download = ({ data = [], fileName }) => {
  return (
    <div
      className="flex items-center gap-2 hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm"
      onClick={() => {
        const data1 = data?.length ? data : [];
        const worksheet = XLSX.utils.json_to_sheet(data1);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "Table.xlsx");
      }}
    >
      <BiDownload size={20} />
    </div>
  );
};

export default Download;
