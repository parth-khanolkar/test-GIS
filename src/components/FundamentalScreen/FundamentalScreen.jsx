"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import FundamentalTable from "./Table/FundamentalTable";
import { useInfoContext } from "@/context/info";
import { RxCross2 } from "react-icons/rx";
import { BiDownload, BiSearchAlt } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import FilterModal from "./FilterModal/FilterModal";
import { toast } from "react-toastify";
import { useWatchlistContext } from "@/context/WatchlistContext";

const FundamentalScreen = () => {
  const { uid } = useInfoContext();
  const { watchlistArray } = useWatchlistContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState({
    INDICES: "Nifty 50",
    Val: "123",
  });
  const [indexDropdown, setIndexDropdown] = useState([]);

  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [watchlistDropdown, setWatchlistDropdown] = useState([]);
  useEffect(() => {
    setWatchlistDropdown(watchlistArray);
  }, [watchlistArray]);

  // Filters
  const [estimateType, setEstimateType] = useState(null);
  const [estimateTypeList, setEstimateTypeList] = useState([]);

  const [estimateYear, setEstimateYear] = useState(null);
  const [estimateYearList, setEstimateYearList] = useState([]);

  const [priceTargetChange, setPriceTargetChange] = useState(null);
  const [priceTargetChangeList, setPriceTargetChangeList] = useState([]);

  const [estimateUpgradeChange, setEstimateUpgradeChange] = useState(null);
  const [estimateUpgradeChangeList, setEstimateUpgradeChangeList] = useState(
    []
  );

  const [scenario, setScenario] = useState(null);
  const [scenarioList, setScenarioList] = useState([]);

  const [minAnalystReco, setMinAnalystReco] = useState(null);
  const [minAnalystRecoList, setMinAnalystRecoList] = useState([]);

  const [growthType, setGrowthType] = useState(null);
  const [growthTypeList, setGrowthTypeList] = useState([]);

  const [triggerDownload, setTriggerDownload] = useState(0);

  const [columnHeaders, setColumnHeaders] = useState(["Company"]);
  const columnAccessors = [
    "CompanyName",
    "price_target",
    "price_target_change",
    "earning_upgrade",
    "earning_growth",
  ];

  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filtering, setFiltering] = useState("");

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const getIndicesList = async () => {
    try {
      const response = await axios.get(
        "https://transcriptanalyser.com/market/indecies_list"
      );

      setIndexDropdown([
        ...(response.data.nse ?? []),
        ...(response.data.bse ?? []),
      ]);
    } catch (error) {
      console.log("Error in getIndicesList: ", error);
    }
  };
  useEffect(() => {
    getIndicesList();
  }, []);

  const getInitialTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/techanalysis/newfundamental_main`,
        {
          indexid: selectedIndex?.Val ? selectedIndex?.Val : 0,
          // exchange: selectedIndex.index,
          WatchListGroupId: selectedWatchlist?.WatchListGroupId
            ? selectedWatchlist.WatchListGroupId
            : 0,
          estimate_year: estimateYear?.value ? estimateYear.value : "",
          scenario: scenario?.value ? scenario.value : "basecase",
          min_analy_recom: minAnalystReco?.value ? minAnalystReco.value : 1,
          pt_change: priceTargetChange?.value ? priceTargetChange.value : 1,
          eu_change: estimateUpgradeChange?.value
            ? estimateUpgradeChange.value
            : 3,
          growth_type: growthType?.value ? growthType.value : "YOY",
          estimate_type: estimateType?.value ? estimateType.value : "EPS",
          default_val: "yes",
        }
      );

      if (response.status === 200) {
        setTableData(response.data?.data);
        setColumnHeaders(["Company", ...response.data?.col_list]);

        setEstimateTypeList(response.data?.parameter_dropdown);
        setEstimateYearList(response.data?.year_estimate_dropdown);
        setPriceTargetChangeList(response.data?.period_price_target_dropdown);
        setEstimateUpgradeChangeList(
          response.data?.period_earning_upgrade_dropdown
        );
        setScenarioList(response.data?.scenario_dropdown);
        setMinAnalystRecoList(response.data?.min_analyst_dropdown);
        setGrowthTypeList(response.data?.growth_type_dropdown);

        setIsLoading(false);

        setEstimateYear({
          label: response.data?.selected_year_estimate,
          value: response.data?.selected_year_estimate,
        });
        setScenario({
          label: response.data?.selected_scenario,
          value: response.data?.selected_scenario,
        });
        setMinAnalystReco({
          label: response.data?.selected_min_analyst,
          value: response.data?.selected_min_analyst,
        });
        setPriceTargetChange({
          label: response.data?.selected_period_price_target,
          value: response.data?.selected_period_price_target,
        });
        setEstimateUpgradeChange({
          label: response.data?.selected_period_earning_upgrade,
          value: response.data?.selected_period_earning_upgrade,
        });
        setEstimateType({
          label: response.data?.selected_parameter,
          value: response.data?.selected_parameter,
        });
        setGrowthType({
          label: response.data?.selected_growth_type,
          value: response.data?.selected_growth_type,
        });
      } else {
        setIsLoading(false);

        toast.error("Error fetching data.", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("Error in getInitialTableData: ", error);
    }
  };
  useEffect(() => {
    getInitialTableData();
  }, []);

  const getFilteredTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/techanalysis/newfundamental_main`,
        {
          indexid: selectedIndex?.Val ? selectedIndex?.Val : 0,
          // exchange: selectedIndex.index,
          WatchListGroupId: selectedWatchlist?.WatchListGroupId
            ? selectedWatchlist.WatchListGroupId
            : 0,
          estimate_year: estimateYear?.value ? estimateYear.value : "",
          scenario: scenario?.value ? scenario.value : "basecase",
          min_analy_recom: minAnalystReco?.value ? minAnalystReco.value : 1,
          pt_change: priceTargetChange?.value ? priceTargetChange.value : 1,
          eu_change: estimateUpgradeChange?.value
            ? estimateUpgradeChange.value
            : 3,
          growth_type: growthType?.value ? growthType.value : "YOY",
          estimate_type: estimateType?.value ? estimateType.value : "EPS",
          default_val: "no",
        }
      );

      if (response.status === 200) {
        setTableData(response.data?.data);
        setColumnHeaders(["Company", ...response.data?.col_list]);

        setEstimateTypeList(response.data?.parameter_dropdown);
        setEstimateYearList(response.data?.year_estimate_dropdown);
        setPriceTargetChangeList(response.data?.period_price_target_dropdown);
        setEstimateUpgradeChangeList(
          response.data?.period_earning_upgrade_dropdown
        );
        setScenarioList(response.data?.scenario_dropdown);
        setMinAnalystRecoList(response.data?.min_analyst_dropdown);
        setGrowthTypeList(response.data?.growth_type_dropdown);

        setIsLoading(false);

        setEstimateYear({
          label: response.data?.selected_year_estimate,
          value: response.data?.selected_year_estimate,
        });
        setScenario({
          label: response.data?.selected_scenario,
          value: response.data?.selected_scenario,
        });
        setMinAnalystReco({
          label: response.data?.selected_min_analyst,
          value: response.data?.selected_min_analyst,
        });
        setPriceTargetChange({
          label: response.data?.selected_period_price_target,
          value: response.data?.selected_period_price_target,
        });
        setEstimateUpgradeChange({
          label: response.data?.selected_period_earning_upgrade,
          value: response.data?.selected_period_earning_upgrade,
        });
        setEstimateType({
          label: response.data?.selected_parameter,
          value: response.data?.selected_parameter,
        });
        setGrowthType({
          label: response.data?.selected_growth_type,
          value: response.data?.selected_growth_type,
        });
      } else {
        setIsLoading(false);

        toast.error("Error fetching data.", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("Error in getFilteredTableData: ", error);
    }
  };

  useEffect(() => {
    getFilteredTableData();
  }, [selectedIndex, selectedWatchlist]);

  useEffect(() => {
    setColumns(
      columnAccessors.map((item, index) =>
        index === 0
          ? {
              header: columnHeaders[index] ? columnHeaders[index] : "",
              accessorKey: item,
            }
          : {
              header: columnHeaders[index] ? columnHeaders[index] : "",
              accessorKey: item,
              cell: (info) =>
                info.getValue() ? `${info.getValue().toFixed(1)}%` : "NA",
            }
      )
    );
  }, [columnHeaders]);

  return (
    <>
      {/* <div className='flex flex-row justify-between md:mx-2'> */}
      <div className="flex flex-row space-x-4 md:space-x-5 ">
        <Select
          value={selectedIndex}
          options={indexDropdown}
          getOptionLabel={(item) => item?.INDICES}
          getOptionValue={(item) => item?.Val}
          onChange={(option) => {
            setSelectedIndex(option);
            setSelectedWatchlist(null);
          }}
          className="text-xs md:text-base w-[35vw] md:w-[32vw] lg:w-[18vw] z-40"
        />
        {uid !== -1 && (
          <Select
            value={selectedWatchlist}
            options={watchlistDropdown}
            getOptionLabel={(option) => option.WatchGroupName}
            getOptionValue={(option) => option.WatchListGroupId}
            placeholder={"Select Watchlist..."}
            onChange={(option) => {
              setSelectedWatchlist(option);
              setSelectedIndex(null);
            }}
            className="text-xs md:text-base w-[45vw] md:w-[32vw] lg:w-[18vw] whitespace-nowrap z-40"
          />
        )}
      </div>

      {/* </div> */}

      <div className="mt-3 md:mt-7 flex flex-row justify-between md:mx-2 mr-6 md:mr-10">
        <div className="flex-none sm:flex gap-2 items-center">
          <div className="flex justify-between gap-1 items-center border rounded-full border-[#083966] px-2 py-1 mb-2">
            <input
              type="type"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Filter by any data..."
              className="text-xs md:text-base outline-none bg-transparent max-w-[30vw] md:max-w-[25vw] lg:max-w-[15vw]"
            />
            {filtering.length > 0 ? (
              <button onClick={() => setFiltering("")}>
                <RxCross2 size={18} className="text-[#083966]" />
              </button>
            ) : (
              <button className="invisible">
                <RxCross2 size={18} className="text-[#083966]" />
              </button>
            )}
            <BiSearchAlt size={18} className="text-[#083966]" />
          </div>
        </div>

        <div className="flex flex-row space-x-3">
          <button
            className="flex items-center justify-center text-[#093967]"
            onClick={() => {
              openFilterModal();
            }}
          >
            <FaFilter size={18} />
          </button>

          {/* Vertical Line */}
          <div className="h-full border-l-2"></div>

          <button
            className="flex items-center justify-center text-[#093967]"
            onClick={() => {
              setTriggerDownload((prev) => prev + 1);
            }}
          >
            <BiDownload size={25} />
          </button>
        </div>
      </div>

      <div className="md:mt-3 flex justify-center h-[60vh] md:h-[70vh] lg:h-[63vh] md:mx-2 mb-2 ">
        <FundamentalTable
          data={tableData}
          columns={columns}
          filtering={filtering}
          setFiltering={setFiltering}
          isLoading={isLoading}
          triggerDownload={triggerDownload}
        />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        closeModal={closeFilterModal}
        estimateType={estimateType}
        setEstimateType={setEstimateType}
        estimateTypeList={estimateTypeList}
        estimateYear={estimateYear}
        setEstimateYear={setEstimateYear}
        estimateYearList={estimateYearList}
        priceTargetChange={priceTargetChange}
        setPriceTargetChange={setPriceTargetChange}
        priceTargetChangeList={priceTargetChangeList}
        estimateUpgradeChange={estimateUpgradeChange}
        setEstimateUpgradeChange={setEstimateUpgradeChange}
        estimateUpgradeChangeList={estimateUpgradeChangeList}
        scenario={scenario}
        setScenario={setScenario}
        scenarioList={scenarioList}
        minAnalystReco={minAnalystReco}
        setMinAnalystReco={setMinAnalystReco}
        minAnalystRecoList={minAnalystRecoList}
        growthType={growthType}
        setGrowthType={setGrowthType}
        growthTypeList={growthTypeList}
        getInitialTableData={getInitialTableData}
        getFilteredTableData={getFilteredTableData}
      />
    </>
  );
};

export default FundamentalScreen;
