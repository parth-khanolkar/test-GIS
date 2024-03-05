import React from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import { AiOutlineDownload } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";
import FileSaver from "file-saver";

const DownloadExcel = ({ data, fileName = "EXCEL" }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  return (
    <div
      className="flex items-center gap-2 text-[#083966] hover:text-[#2a6eaf] rounded-md cursor-pointer text-sm px-1"
      // onClick={() => {
      //   const data1 = data?.length ? data : [];
      //   const worksheet = XLSX.utils.json_to_sheet(data1);
      //   const workbook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      //   XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "Table.xlsx");
      // }}
      onClick={() => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data1 = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data1, fileName + fileExtension);
      }}
    >
      <BiDownload size={25} />
      {/* <ReactHTMLTableToExcel
        className="download-button"
        table={data}
        filename="tablexls"
        sheet="tablexls"
        buttonText="Excel"
      /> */}
    </div>
  );
};

export default DownloadExcel;
