import Footer from "@/components/Footer";
import HeatmapTable from "@/components/MarketPageProject/HeatmapTable/HeatmapTable";
import IndicesStatus from "@/components/MarketPageProject/IndicesStatus/IndicesStatus";
import RightOptions from "@/components/MarketPageProject/RightOptions/RightOptions";
import SectorDetail from "@/components/MarketPageProject/SectorDetail/SectorDetail";
import SectorMap from "@/components/MarketPageProject/SectorMap/SectorMap";
import MobileFooter from "@/components/MobileFooter";
import { useInfoContext } from "@/context/info";
import React, { useEffect } from "react";

const MarketPage = () => {
  const {
    sectorDetail,
    setSectorDetail,
    // watchlistData,
    // setWatchlistData,
    filterSelected,
  } = useInfoContext();

  return (
    <div className="overflow-x-hidden">
      <div
        className={`overflow-y-auto bg-[#f4f7fa] overflow-x-hidden h-[calc(100vh-86px)] sm:pr-5 sm:pl-1 sm:pt-2 `}
      >
        <div className="flex flex-col gap-3 w-full h-full ">
          <div className="flex gap-2 flex-wrap">
            {/* Mobile */}
            {sectorDetail == null ? (
              <div className="flex-col gap-3 md:hidden w-full flex">
                <div>
                  <IndicesStatus />
                </div>
                <div
                  className="flex-1 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md
                "
                >
                  <SectorMap />
                </div>
              </div>
            ) : (
              <div className="bg-white md:hidden border-[#4577A8] border-[1px] rounded-md shadow-md">
                <SectorDetail />
              </div>
            )}
            {/* Web */}
            <div className="flex-col gap-3 hidden md:flex-[0.5] w-full md:flex">
              <div>
                <IndicesStatus />
              </div>
              <div className="flex-1 bg-white  border-[#4577A8] border-[1px] rounded-md shadow-md">
                <SectorMap />
              </div>
            </div>
            {/* Mobile */}
            <div className="sm:p-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md md:hidden overflow-x-auto w-full">
              <RightOptions />
            </div>
            {/* Web */}
            <div className="p-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md hidden md:flex-[0.5] md:inline-block overflow-x-auto h-full w-full">
              {sectorDetail == null ? <RightOptions /> : <SectorDetail />}
            </div>
          </div>
          <div className="">
            <HeatmapTable />
          </div>
          <footer>
            <MobileFooter />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
