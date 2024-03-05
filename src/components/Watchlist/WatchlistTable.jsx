import React, { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { MdAddAlert, MdDelete, MdEditCalendar } from "react-icons/md";
import axios from "axios";
import moment from "moment/moment";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { useRouter } from "next/router";
import CompanyDeleteModal from "./DeleteConfirmationModals/CompanyDelete";
import SetAlertModal from "./SetAlertModal";
import Moment from "react-moment";
import { TbUserEdit } from "react-icons/tb";
import ChangeDateandRecommendedByModal from "./ChangeDateandRecommendedByModal";
import { BiEdit } from "react-icons/bi";
import { useInfoContext } from "@/context/info";

function WatchlistTable({
  data,
  getWatchlistCompanies,
  filtering,
  setFiltering,
  isLoading
}) {
  const router = useRouter();

  const {
    companyPage,
    setCompanyPage,
    setInitData,
    dashFincode,
    setDashFincode,
    dashCompName,
    setDashCompName,
  } = useInfoContext();

  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);

  const [isCompanyDeleteModalOpen, setIsCompanyDeleteModalOpen] =
    useState(false);
  const [isAddAlertModalOpen, setIsAddAlertModalOpen] = useState(false);
  const [
    isChangeDateandRecommendedByModalOpen,
    setIsChangeDateandRecommendedByModalOpen,
  ] = useState(false);

  const [WatchListId, setWatchListId] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const [currentDate, setCurrentDate] = useState(null);
  const [fincode, setFincode] = useState(null);
  const [exchange, setExchange] = useState(null);
  const [currentRecommender, setCurrentRecommender] = useState(null);

  // columns and their individual functions
  const columns = [
    {
      header: "Stock Name",
      accessorKey: "Name",
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
      header: "Sector",
      accessorKey: "Sector",
      cell: (info) =>
        info.getValue().length > 15
          ? info.getValue().slice(0, 10) + "..."
          : info.getValue(),
    },
    {
      header: "LTP",
      accessorKey: "LTP",
      cell: (info) => parseFloat(info.getValue()).toFixed(1),
    },
    {
      header: "PE",
      accessorKey: "PE",
      cell: (info) => parseFloat(info.getValue()).toFixed(1),
    },
    {
      header: "PB",
      accessorKey: "PB",
      cell: (info) => parseFloat(info.getValue()).toFixed(1),
    },
    {
      header: "EV/EBITDA",
      accessorKey: "EV_EBITDA",
      cell: (info) => parseFloat(info.getValue()).toFixed(1),
    },
    {
      header: "52 WH",
      accessorKey: "week52High",
      cell: (info) => parseFloat(info.getValue()).toFixed(1),
    },
    {
      header: "52 WL",
      accessorKey: "week52Low",
      cell: (info) => parseFloat(info.getValue()).toFixed(1),
    },
    {
      header: "1D (%)",
      accessorKey: "Day1",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}</span>
        ),
    },
    {
      header: "1W (%)",
      accessorKey: "Week1",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}</span>
        ),
    },
    {
      header: "1M (%)",
      accessorKey: "Month1",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}</span>
        ),
    },
    {
      header: "1Y (%)",
      accessorKey: "Year1",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}</span>
        ),
    },
    {
      header: "3Y (%)",
      accessorKey: "Year3",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}</span>
        ),
    },
    {
      header: "FYTD (%)",
      accessorKey: "YTD",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}</span>
        ),
    },
    {
      header: "Change Since",
      accessorKey: "AddedDate",
      cell: (info) => <Moment format="DD-MM-YYYY">{info.getValue()}</Moment>,
    },
    {
      header: "Change %",
      accessorKey: "ChangeSinceAdded",
      cell: (info) =>
        info.getValue() > 0 ? (
          <span className="text-green-600 font-semibold">
            {info.getValue().toFixed(1)}%
          </span>
        ) : info.getValue() < 0 ? (
          <span className="text-red-600 font-semibold">
            {info.getValue().toFixed(1)}%
          </span>
        ) : (
          <span className="font-semibold">{info.getValue()}%</span>
        ),
    },
    {
      header: "Tipped by",
      accessorKey: "RecommendedBy",
      cell: (info) =>
        info.getValue() ? (
          <span className="font-semibold">{info.getValue()}</span>
        ) : (
          <span>{"Self"}</span>
        ),
    },
  ];
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

  const openCompanyDeleteModal = () => {
    setIsCompanyDeleteModalOpen(true);
  };
  const closeCompanyDeleteModal = () => {
    setIsCompanyDeleteModalOpen(false);
  };

  const openChangeDateandRecommendedByModal = () => {
    setIsChangeDateandRecommendedByModalOpen(true);
  };
  const closeChangeDateandRecommendedByModal = () => {
    setIsChangeDateandRecommendedByModalOpen(false);
  };

  const openAddAlertModal = () => {
    setIsAddAlertModalOpen(true);
  };
  const closeAddAlertModal = () => {
    setIsAddAlertModalOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto w-full rounded-md overflow-y-auto h-[60vh] md:h-[70vh] lg:h-[65vh] relative">
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
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <button>
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
                {/* <th className="py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap text-center">
                  Alert
                </th> */}
                <th className="py-2 px-2 font-normal text-xs md:text-sm whitespace-nowrap text-center">
                  Actions
                </th>
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
                    onClick={() => {
                      if (index1 === 0) {
                        router.push(`/companyinfo/${row.original.Fincode}`);
                        setDashFincode(row.original.Fincode);
                        setDashCompName(row.original.Name);
                        window.localStorage.setItem(
                          "localFincode",
                          row.original.Fincode
                        );
                        setCompanyPage([
                          {
                            name: "SnapShot",
                            link: `/companyinfo/${row.original.Fincode}`,
                            type: "tab",
                          },
                          {
                            name: "Resources",
                            link: "/researchDashboard",
                            type: "tab",
                          },
                        ]);
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {/* <td className="py-2 px-2 md:text-2xl flex items-center justify-center text-cyan-900 ">
                  
                </td> */}
                <td className="py-2 px-2 md:text-2xl flex flex-row items-center space-x-3 justify-center">
                  <button
                    onClick={() => {
                      setFincode(row.original.Fincode);
                      setCompanyName(row.original.Name);
                      setCurrentDate(
                        <Moment format="DD-MM-YYYY">
                          {row.original.AddedDate}
                        </Moment>
                      );
                      setCurrentRecommender(row.original.RecommendedBy);
                      openChangeDateandRecommendedByModal();
                    }}
                    className="text-[#af7644] hover:text-[#ca915f]"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => {
                      setFincode(row.original.Fincode);
                      setCompanyName(row.original.Name);
                      setExchange(row.original.Exchange);
                      openAddAlertModal();
                    }}
                    className="text-[#093967] hover:text-[#5179a5]"
                  >
                    <MdAddAlert />
                  </button>
                  <button
                    onClick={() => {
                      setWatchListId(row.original.WatchlistId);
                      setCompanyName(row.original.Name);
                      openCompanyDeleteModal();
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChangeDateandRecommendedByModal
        isOpen={isChangeDateandRecommendedByModalOpen}
        closeModal={closeChangeDateandRecommendedByModal}
        currentDate={currentDate}
        companyName={companyName}
        currentRecommender={currentRecommender}
        getWatchlistCompanies={getWatchlistCompanies}
        fincode={fincode}
      />

      <SetAlertModal
        isOpen={isAddAlertModalOpen}
        closeModal={closeAddAlertModal}
        companyName={companyName}
        fincode={fincode}
        exchange={exchange}
      />

      <CompanyDeleteModal
        isOpen={isCompanyDeleteModalOpen}
        closeModal={closeCompanyDeleteModal}
        WatchListId={WatchListId}
        getWatchlistCompanies={getWatchlistCompanies}
        companyName={companyName}
      />
    </>
  );
}

export default WatchlistTable;
