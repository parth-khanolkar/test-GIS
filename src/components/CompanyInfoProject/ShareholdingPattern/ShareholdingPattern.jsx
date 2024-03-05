import { AiFillCheckCircle } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { useEffect, useState } from "react";
import DownloadExcel from "../Tables/DownloadExcel";
import { useInfoContext } from "@/context/info";
import ShareholdingTable from "../Tables/ShareholdingTable";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { useRouter } from "next/router";

const ShareholdingPattern = () => {
  const [menu, setMenu] = useState({
    share: true,
    top: false,
    bulk: false,
  });
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
  } = useInfoContext();
  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [customColumn, setCustomColumn] = useState([]);
  const [isCheckedStandalone, setIsCheckedStandalone] = useState(false);

  const router = useRouter();
  const { fincodeLink } = router.query;

  // Fetch Standalone Table Data Func
  const fetchData = async (url, body) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/${url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const resJson = await res.json();
      setTableData(resJson);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  // Calling Fetch Company Data
  useEffect(() => {
    menu.share &&
      fincodeLink &&
      fetchData("share_holding_pattern", {
        fincode: fincodeLink,
      });

    menu.top &&
      fincodeLink &&
      fetchData("top_shareholders", {
        fincode: fincodeLink,
      });

    menu.bulk &&
      fincodeLink &&
      fetchData("bulk_block", {
        fincode: fincodeLink,
        type: "Bulk_Deal",
      });
  }, [menu, fincodeLink]);

  useEffect(() => {
    globalStandalone
      ? setIsCheckedStandalone(true)
      : setIsCheckedStandalone(false);
  }, [globalStandalone]);

  function slideLeft() {
    var slider = document.getElementById("shareButtonsID");
    slider.scrollLeft -= 500;
  }
  function slideRight() {
    var slider = document.getElementById("shareButtonsID");
    slider.scrollLeft += 500;
  }

  useEffect(() => {
    setTableData(null);
    setCustomColumn([]);
    setMenu({
      share: true,
      top: false,
      bulk: false,
    });
  }, [fincodeLink]);

  useEffect(() => {
    tableData &&
      !customColumn[0] &&
      tableData?.column &&
      menu.share &&
      !customColumn[0] &&
      tableData?.column.map((item) =>
        item.accessorKey == "Particulars"
          ? setCustomColumn((customColumn) => [
              ...customColumn,
              {
                header: item.header,
                accessorKey: item.accessorKey,
              },
            ])
          : setCustomColumn((customColumn) => [
              ...customColumn,
              {
                header: item.header,
                accessorKey: item.accessorKey,
                cell: (info) => (
                  <div className="text-sm">
                    {info.getValue()}
                    {info.getValue() < 100 && (
                      <span className="text-gray-400">%</span>
                    )}
                  </div>
                ),
              },
            ])
      );

    tableData &&
      tableData?.column &&
      menu.top &&
      !customColumn[0] &&
      tableData?.column.map((item) =>
        item.header == "Number of Shares"
          ? setCustomColumn((customColumn) => [
              ...customColumn,
              {
                header: item.header,
                accessorKey: item.accessorKey,
                cell: (info) =>
                  info.getValue() && (
                    <div className="text-sm">
                      {info.getValue()}
                      <span className="text-gray-400">Cr.</span>
                    </div>
                  ),
              },
            ])
          : item.header == "Value"
          ? setCustomColumn((customColumn) => [
              ...customColumn,
              {
                header: item.header,
                accessorKey: item.accessorKey,
                cell: (info) =>
                  info.getValue() && (
                    <div className="text-sm">
                      {" "}
                      <span className="text-gray-400">₹</span>
                      {info.getValue()}
                      <span className="text-gray-400">Cr.</span>{" "}
                    </div>
                  ),
              },
            ])
          : item.header == "Name"
          ? setCustomColumn((customColumn) => [
              ...customColumn,
              {
                header: item.header,
                accessorKey: item.accessorKey,
              },
            ])
          : setCustomColumn((customColumn) => [
              ...customColumn,
              {
                header: item.header,
                accessorKey: item.accessorKey,
                cell: (info) =>
                  info.getValue() && (
                    <div className="text-sm">
                      {" "}
                      {info.getValue()}
                      <span className="text-gray-400">%</span>{" "}
                    </div>
                  ),
              },
            ])
      );

    tableData &&
      tableData?.column &&
      menu.bulk &&
      setCustomColumn(tableData.column);
  }, [tableData]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md p-2 sm:p-5">
        <h1 className="font-semibold text-[28px]">Shareholding Patterns</h1>
        {/* Menu Buttons Start*/}
        <div className="flex justify-center w-full">
          {/* Left Scroll */}
          <BsFillCaretLeftFill
            className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 hidden sm:inline-block lg:hidden"
            size={40}
            onClick={slideLeft}
          />
          {/* Buttons */}
          <div
            id="shareButtonsID"
            className="flex justify-between w-full gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide"
          >
            <button
              onClick={() => {
                setMenu({
                  share: true,
                  top: false,
                  bulk: false,
                });
                setTableData(null);
                setCustomColumn([]);
              }}
              className={`col-span-1 relative px-2  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.share && "bg-green-200 "
              } flex-1`}
            >
              Shareholding Pattern
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.share ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  share: false,
                  top: true,
                  bulk: false,
                });
                setTableData(null);
                setCustomColumn([]);
              }}
              className={`col-span-1 relative px-2  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.top && "bg-green-200 "
              } flex-1`}
            >
              Top Shareholders
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.top ? "inline-block" : "hidden"
                } `}
              />
            </button>
            <button
              onClick={() => {
                setMenu({
                  share: false,
                  top: false,
                  bulk: true,
                });
                setTableData(null);
                setCustomColumn([]);
              }}
              className={`col-span-1 relative px-2  py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
                menu.bulk && "bg-green-200 "
              } flex-1`}
            >
              Bulk/Block Deals
              <AiFillCheckCircle
                className={`text-green-600 ${
                  menu.bulk ? "inline-block" : "hidden"
                } `}
              />
            </button>
          </div>
          {/* Right Scroll */}
          <BsFillCaretRightFill
            className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 hidden sm:inline-block lg:hidden"
            size={40}
            onClick={slideRight}
          />
        </div>
        {/* Menu BUTTON Ends here */}

        {/* MAIN COMPONENT */}
        <div className="flex flex-col gap-2">
          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg">
            {tableData?.column && tableData?.value && customColumn[0] ? (
              <div className="relative">
                <ShareholdingTable
                  columns={customColumn}
                  data={tableData.value}
                />
              </div>
            ) : tableData && !tableData[0] ? (
              <p className="text-gray-500 font-semibold">Data not loaded!</p>
            ) : (
              // Loading Animation
              <div
                className={`flex justify-center items-center h-[calc(100vh-200px)]`}
              >
                <span className="relative flex h-[80px] w-[80px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareholdingPattern;
