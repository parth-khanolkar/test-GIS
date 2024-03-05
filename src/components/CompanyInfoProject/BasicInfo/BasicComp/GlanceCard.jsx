import React, { useEffect, useMemo, useState } from "react";
import Table from "../../Tables/Table";
import { useInfoContext } from "@/context/info";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GlanceCard = ({ data, data2 }) => {
  const { standaloneForBasic, setStandaloneForBasic } = useInfoContext();
  const options = { maximumFractionDigits: 2 };
  return (
    <div className=" h-full w-full flex flex-col gap-10 justify-evenly mt-4 md:mt-0">
      {/* At a Glance */}
      <div className="h-full w-full lg:px-3 ">
        <div className="">
          <div className="flex justify-between w-full">
            <div className="font-semibold lg:text-lg">At a Glance</div>
            {/* Toggle Buttons */}
            <div className="flex gap-5 font-semibold text-[#0e2640] lg:mt-0 flex-wrap">
              {/* Standalone/ Consolidated Toggle */}
              <div className="flex justify-end text-sm font-semibold gap-1">
                <span
                  onClick={() => {
                    standaloneForBasic && setStandaloneForBasic(false);
                  }}
                  className={`${
                    !standaloneForBasic
                      ? "text-[#083966] underline underline-offset-2 "
                      : " text-gray-500 cursor-pointer hover:text-[#2f70ac] italic "
                  } `}
                >
                  {!standaloneForBasic
                    ? "Standalone Figures"
                    : "View Standalone"}
                </span>
                <span>/</span>
                <span
                  onClick={() => {
                    !standaloneForBasic && setStandaloneForBasic(true);
                  }}
                  className={`${
                    standaloneForBasic
                      ? "text-[#083966] underline underline-offset-2"
                      : "text-gray-500 cursor-pointer hover:text-[#2f70ac] italic "
                  } `}
                >
                  {standaloneForBasic
                    ? "Consolidated Figures"
                    : "View Consolidated"}
                </span>
              </div>
            </div>
          </div>
          <div className="border-solid p-2 border-[#4577A8] border-[1px] rounded-md bg-white shadow-md flex flex-col gap-5">
            <div className="w-full overflow-x-auto scrollbar-thin">
              <table className="text-center w-full lg:table-fixed">
                <tbody className="font-semibold">
                  <tr className="text-[#002c4f] text-sm">
                    <th className="px-4 border-b-2">P/E</th>
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank"
                        ? "Total Assets"
                        : "EV/EBITDA"}
                    </th>
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank"
                        ? "Net Interest/Avg Assets"
                        : "EV"}
                    </th>
                    <th className="px-4 border-b-2">P/B</th>
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank"
                        ? "Gross NPA"
                        : "Gross Debt"}
                    </th>
                    <th className="px-4 border-b-2">Dividend</th>
                    <th className="px-4 border-b-2">Face Value</th>
                  </tr>
                  <tr>
                    <td className="px-4">{data?.PE?.value}</td>
                    <td className="px-4">
                      <span>
                        {data?.Sector?.value == "Bank"
                          ? Intl.NumberFormat("en-US", options).format(
                              data?.totalassets?.value
                            )
                          : data?.EV_EBITDA?.value}
                      </span>
                      <span className="text-gray-500 font-normal pl-1">
                        {data?.Sector?.value == "Bank" && "Cr."}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className="text-gray-500 font-normal">
                        {data?.Sector?.value != "Bank" && "₹"}
                      </span>
                      <span className="px-1">
                        {data?.Sector?.value == "Bank"
                          ? data?.netintertoavg?.value
                          : data?.EnterpriseValue?.value}
                      </span>
                      <span className="text-gray-500 font-normal">
                        {data?.Sector?.value != "Bank" && "Cr."}
                      </span>
                    </td>
                    <td className="px-4">{data?.P_B?.value}</td>
                    <td className="px-4">
                      <span className="text-gray-500 font-normal">
                        {data?.Sector?.value != "Bank" && "₹"}
                      </span>
                      <span className="px-1">
                        {data?.Sector?.value == "Bank"
                          ? data?.grossnpa?.value
                          : data?.GrossDebt?.value}
                      </span>
                      <span className="text-gray-500 font-normal">
                        {data?.Sector?.value != "Bank" && "Cr."}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className="text-gray-500 font-normal">₹</span>
                      <span className="pl-1">{data?.AnlDiv?.value}</span>
                    </td>
                    <td className="px-4 ">
                      <span className="text-gray-500 font-normal">₹</span>
                      <span className="pl-1">{data?.facevalue?.value}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="h-4"></div>
              <table className="text-center w-full lg:table-fixed">
                <tbody className="font-semibold">
                  <tr className="text-[#002c4f] text-sm">
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank" ? "ROAA" : "P/E 5YR Avg"}
                    </th>
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank"
                        ? "ROAE"
                        : "EV/EBITDA 5yr Avg"}
                    </th>
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank"
                        ? "Book Value per Share"
                        : "ROCE"}
                    </th>
                    <th className="px-4 border-b-2">ROE</th>
                    <th className="px-4 border-b-2">
                      {data?.Sector?.value == "Bank" ? "Net NPA" : "Net Debt"}
                    </th>
                    <th className="px-4 border-b-2">Dividend Yield</th>
                    <th className="px-4 border-b-2">Diluted No. of Shares</th>
                  </tr>
                  <tr>
                    <td className="px-4">
                      {data?.Sector?.value == "Bank"
                        ? data?.roaa?.value
                        : data?.AvgPE?.value}
                    </td>
                    <td className="px-4">
                      {data?.Sector?.value == "Bank"
                        ? data?.roae?.value
                        : data?.Avg_EV_EBITDA?.value}
                    </td>
                    <td className="px-4">
                      <span className="pr-1">
                        {data?.Sector?.value == "Bank"
                          ? data?.bvps?.value
                          : data?.roce?.value}
                      </span>
                      <span className="text-gray-500 font-normal">
                        {" "}
                        {data?.Sector?.value != "Bank" && "%"}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className="pr-1">{data?.ROE?.value}</span>
                      <span className="text-gray-500 font-normal">%</span>
                    </td>
                    <td className="px-4">
                      <span className="text-gray-500 font-normal">
                        {data?.Sector?.value != "Bank" && "₹"}
                      </span>
                      <span className="px-1">
                        {data?.Sector?.value == "Bank"
                          ? data?.netnpa?.value
                          : data?.NetDebt?.value}
                      </span>
                      <span className="text-gray-500 font-normal">
                        {data?.Sector?.value != "Bank" && "Cr."}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className="pr-1">{data?.DivYld?.value}</span>
                      <span className="text-gray-500 font-normal">%</span>
                    </td>
                    <td className="px-4">
                      <span className="px-1">{data?.dilutedNOS?.value}</span>
                      <span className="text-gray-500 font-normal">Cr.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="lg:px-3 w-full">
        <div className="lg:pl-3 h-full w-full border-[#4577A8] overflow-x-auto border-solid border-[1px] bg-white rounded-md shadow-md ">
          <fieldset className="p-2 bg-white flex flex-col gap-5 m-1">
            <table className="w-full table-fixed text-center ">
              <tbody className="font-semibold w-full">
                <tr className="text-[#002c4f] text-sm">
                  <th></th>
                  <th className="px-2 border-b-2">Revenue CAGR</th>
                  <th className="px-2 border-b-2">PAT CAGR</th>
                  <th className="px-2 border-b-2">Stock Price CAGR</th>
                  <th className="px-2 border-b-2">ROE</th>
                </tr>
                <tr>
                  <td className="px-2 text-[#002c4f]">10 Yrs:</td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compundsales_growth_10?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compound_profit_10?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.stockprice_cagr_10?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2">
                    <span className="pr-1">{data?.roe10?.value}</span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 text-[#002c4f]">5 Yrs: </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compundsales_growth_5?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compound_profit_5?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {" "}
                      {data?.stockprice_cagr_5?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2">
                    <span className="pr-1">{data?.roe5?.value}</span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 text-[#002c4f]">3 Yrs: </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compundsales_growth_3?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compound_profit_3?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.stockprice_cagr_3?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2">
                    <span className="pr-1">{data?.roe3?.value}</span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 text-[#002c4f]">LY: </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compundsales_growth_1?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.compound_profit_1?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2 border-r-2">
                    <span className="pr-1">
                      {data?.stockprice_cagr_1?.value}
                    </span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                  <td className="px-2">
                    <span className="pr-1">{data?.ROE?.value}</span>
                    <span className="text-gray-500 font-normal">%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>

      {/* Charts */}
      <div className="h-full w-full lg:px-3 ">
        <fieldset className="border-solid p-2 border-[#4577A8] border-[1px] rounded-md shadow-md h-full flex w-full gap-5 flex-wrap bg-white ">
          {/* Fundamental Analysis */}
          <div className="flex flex-col h-full sm:flex-[0.6]">
            <h1 className="text-[#073559] font-semibold text-xl">
              Fundamental Analysis:
            </h1>
            <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap justify-between">
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center max-h-[100px] md:min-h-[100px] min-h-[70px] md:min-w-[100px] max-w-[100px] min-w-[70px] flex-1">
                  <CircularProgressbar
                    value={data?.suggestion_per?.value}
                    maxValue={100}
                    text={`${
                      data?.suggestion_per?.value != null
                        ? data?.suggestion_per?.value
                        : "NA"
                    }%`}
                    styles={buildStyles({
                      textSize: "30px",
                      pathColor: "#2dac5c",
                      textColor: "black",
                    })}
                  />
                </div>
                <div>
                  <p className={`text-sm font-semibold `}>
                    {data?.analyst_count?.value == null ||
                    data?.analyst_count?.value == 0
                      ? "Not covered by any analyst"
                      : "Analysts have suggested that investors can buy this stock"}
                  </p>
                  <p
                    className={`text-sm text-gray-400 ${
                      (data?.analyst_count?.value == null ||
                        data?.analyst_count?.value == 0) &&
                      "hidden"
                    }`}
                  >
                    from {data?.analyst_count?.value} analyst
                  </p>
                </div>
              </div>

              <div className="flex flex-col  gap-1 text-sm font-semibold sm:w-auto w-full">
                <p className="font-semibold underline w-full">Price Target</p>
                <div className="flex items-center sm:flex-col gap-3 ">
                  <div className="bg-green-500/40 p-1 rounded-md w-full text-center px-3 sm:flex">
                    <span className="pr-1">High:</span>
                    <div>
                      <span className="text-gray-600 font-normal">₹</span>
                      <span>{data?.pt_high?.value}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-500/40 p-1 rounded-md w-full text-center px-3 sm:flex">
                    <span className="pr-1"> Avg:</span>
                    <div>
                      <span className="text-gray-600 font-normal">₹</span>
                      <span>{data?.pt_avg?.value}</span>
                    </div>
                  </div>
                  <div className="bg-red-500/40 p-1 rounded-md w-full text-center px-3 sm:flex">
                    <span className="pr-1"> Low:</span>
                    <div>
                      <span className="text-gray-600 font-normal">₹</span>
                      <span>{data?.pt_low?.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <vr className="w-1 rounded-md bg-gray-200 sm:inline-block hidden"></vr>
          <hr className="h-1 rounded-md w-full bg-gray-200 inline-block sm:hidden"></hr>
          {/* Technical Analysis */}
          <div className="flex flex-col h-full sm:flex-[0.4] w-full">
            <h1 className="text-[#073559] font-semibold text-xl">
              Technical Analysis:
            </h1>
            <div className="flex items-center w-full px-10 sm:px-0">
              <div className="flex flex-col gap-3 text-sm font-semibold mt-3 w-full">
                <div className="flex gap-1 items-center">
                  <p className="flex-1">Daily:</p>
                  <div
                    className={`${
                      data?.ta_daily?.value?.includes("Buy")
                        ? "bg-green-500/50"
                        : "bg-red-500/50"
                    } p-1 rounded-md w-full flex-1 mr-2 text-center`}
                  >
                    <p>
                      {data?.ta_daily?.value ? data?.ta_daily?.value : "NA"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="flex-1">Weekly:</p>
                  <div
                    className={`${
                      data?.ta_weekly?.value?.includes("Buy")
                        ? "bg-green-500/50"
                        : "bg-red-500/50"
                    } p-1 rounded-md w-full flex-1 mr-2 text-center`}
                  >
                    <p>
                      {data?.ta_weekly?.value ? data?.ta_weekly?.value : "NA"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="flex-1">Monthly:</p>
                  <div
                    className={`${
                      data?.ta_month?.value?.includes("Buy")
                        ? "bg-green-500/50"
                        : "bg-red-500/50"
                    } p-1 rounded-md w-full flex-1 mr-2 text-center`}
                  >
                    <p>
                      {data?.ta_month?.value ? data?.ta_month?.value : "NA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default GlanceCard;
