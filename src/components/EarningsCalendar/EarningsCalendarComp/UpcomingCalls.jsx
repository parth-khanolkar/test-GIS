import React, { useState } from "react";
import UpcomingCard from "./UpcomingCard";
import { useEarningsContext } from "@/context/Context";
import { FiSearch } from "react-icons/fi";
import { AiFillCloseCircle, AiFillFilter } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const UpcomingEarningCalls = ({ uid }) => {
  const { upcoming, sector } = useEarningsContext();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [checked, setChecked] = useState([]);

  // Search Value update on Change
  function onChange(e) {
    setSearch(e.target.value);
  }
  // Creating array of checked Sectors
  function onCheck(e) {
    var updatedList = [...checked];
    if (e.target.checked) {
      updatedList = [...checked, e.target.value];
    } else {
      updatedList.splice(checked.indexOf(e.target.value), 1);
    }
    setChecked(updatedList);
  }

  // Reset filter
  function resetFilter() {
    setChecked([]);
    var chk = document.getElementsByName("sector");
    for (var i = 0; i < chk.length; i++) {
      chk[i].checked = false;
    }
  }

  return (
    <div className="w-full">
      <div className="flex gap-1 items-center">
        {/* Search */}
        <div
          className={`bg-gray-300 shadow-inner flex flex-grow items-center p-1 border-2 border-gray-400 rounded  m-2`}
        >
          <input
            onChange={onChange}
            type="text"
            className=" bg-transparent outline-none w-full"
            placeholder="Enter company name"
          />
          <FiSearch />
        </div>
        {/* Checkbox */}
        <div className="relative">
          <div className="flex flex-col">
            {!openFilter ? (
              <MdFilterAlt
                onClick={() => setOpenFilter(!openFilter)}
                size={30}
                className="text-[#1a3c61] cursor-pointer"
              />
            ) : (
              <AiFillCloseCircle
                onClick={() => setOpenFilter(!openFilter)}
                size={30}
                className="text-[#1a3c61] cursor-pointer"
              />
            )}
          </div>
          <div
            className={`absolute z-40 left-[-270px] ${
              !openFilter && "hidden"
            } bg-white rounded-md overflow-y-auto h-auto px-2`}
          >
            {/* Flex Box Dropdown for Checkbox and selected Sectors */}
            <div>
              {/* Sector Checkboxes */}
              <div className={`flex gap-1`}>
                <div
                  className={` h-[200px] w-[150px] p-2 bg-[#1a3c61] text-white overflow-y-scroll rounded-md`}
                >
                  <form>
                    {sector?.map((item, index) => (
                      <div
                        key={index}
                        className="relative flex items-center gap-1"
                      >
                        <input
                          type="checkbox"
                          onChange={onCheck}
                          id={item}
                          value={item}
                          name="sector"
                        />
                        <span className="font-semibold text-xs md:text-sm">
                          {item}
                        </span>
                        <br />
                      </div>
                    ))}
                  </form>
                </div>
                {/* Selected Sectors */}
                <div
                  className={` h-[200px] w-[150px] p-2 bg-white text-white overflow-y-scroll rounded-md`}
                >
                  <div className="flex flex-col gap-1">
                    {checked[0] ? (
                      checked?.map((item) => (
                        <p
                          key={item}
                          className="text-xs items-center justify-center rounded-lg text-white bg-[#1a3c61] overflow-hidden px-1 "
                        >
                          {item}
                        </p>
                      ))
                    ) : (
                      <p className="text-black text-sm font-semibold">
                        No Sectors selected yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center mt-1">
                {checked[0] ? (
                  <button
                    onClick={resetFilter}
                    className="text-sm bg-[#21568e] text-white px-2 py-1 rounded-md flex items-center justify-center gap-2 focus:bg-[#2676cb]"
                  >
                    <span>
                      <BiReset size={20} />
                    </span>
                    <span>Reset Sectors</span>
                  </button>
                ) : (
                  <div className="text-sm bg-gray-400 text-white px-2 py-1 rounded-md flex items-center justify-center gap-2 cursor-not-allowed">
                    <span>
                      <BiReset size={20} />
                    </span>
                    <span>Reset Sectors</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cards */}
      {!upcoming ? (
        <div className="flex justify-center items-center h-[calc(100vh-100px)] scrollbar-thin">
          <span class="relative flex h-[80px] w-[80px]">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 items-center"></span>
          </span>
        </div>
      ) : (
        <div className="overflow-y-auto scrollbar-hide sm:scrollbar-default flex flex-col gap-7 px-2 h-[calc(100vh-236px)] scrollbar-thin ">
          {/* Reset all filters Button */}
          <div className="">
            {checked[0] && (
              <div className={`flex justify-end`}>
                <div className="">
                  <span className="italic font-semibold">
                    Filters are applied:{" "}
                  </span>
                  <button
                    onClick={resetFilter}
                    className="text-sm bg-[#1a3c61] text-white px-2 py-1 rounded-md flex items-center justify-center gap-2"
                  >
                    <span>
                      <BiReset size={20} />
                    </span>
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {upcoming
            ?.filter((item) => {
              const searchValue = search.toLowerCase();
              const companyName = item?.company_name.toLowerCase();
              return (
                companyName?.includes(searchValue) &&
                (!checked[0]
                  ? item?.sector?.includes(checked.map((item) => item))
                  : checked.map((item) => item).includes(item?.sector))
              );
            })
            .map((item) => (
              <div key={item?.calendar_id}>
                <UpcomingCard
                  key={item?.calendar_id}
                  name={item?.company_name}
                  date={item?.earning_date}
                  time={item?.earning_time}
                  phone={item?.phone_no}
                  uid={uid}
                  keyDevId={item?.keyDevId}
                  summary={item?.summary}
                  smpGlobalCompany={item?.smp_global_company}
                  eventDate={item?.eventDate}
                  notify={item?.notify}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEarningCalls;
