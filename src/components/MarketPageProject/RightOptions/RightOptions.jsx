import React, { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import Price from "./RightComps/Price";
import WatchPerform from "./RightComps/WatchPerform";
import TechnicalAnalysis from "./RightComps/TechnicalAnalysis";
import HighLow from "./RightComps/HighLow";
import IndicesStatus from "../IndicesStatus/IndicesStatus";
import SectorMap from "../SectorMap/SectorMap";
import { useInfoContext } from "@/context/info";
import Select from "react-select";

const RightOptions = () => {
  const {
    marketDropdown,
    setMarketDropdown,
    filterSelected,
    setFilterSelected,
  } = useInfoContext();

  const [menu, setMenu] = useState({
    indices: false,
    price: true,
    watch: false,
    tech: false,
    highLow: false,
  });

  const [menuMobile, setMenuMobile] = useState({
    indices: true,
    price: false,
    watch: false,
    tech: false,
    highLow: false,
  });

  function slideLeft() {
    var slider = document.getElementById("marketMenuID");
    slider.scrollLeft -= 500;
  }
  function slideRight() {
    var slider = document.getElementById("marketMenuID");
    slider.scrollLeft += 500;
  }

  function slideLeftMobile() {
    var slider = document.getElementById("marketMenuMobileID");
    slider.scrollLeft -= 500;
  }
  function slideRightMobile() {
    var slider = document.getElementById("marketMenuMobileID");
    slider.scrollLeft += 500;
  }

  async function dropFetch1() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/indecies_list`
    );
    const data1 = await res.json();
    setMarketDropdown(data1);
  }
  useEffect(() => {
    dropFetch1();
  }, []);

  useEffect(() => {
    filterSelected == null &&
      setMenu({
        indices: false,
        price: true,
        watch: false,
        tech: false,
        highLow: false,
      });

    filterSelected == null &&
      setMenuMobile({
        indices: false,
        price: true,
        watch: false,
        tech: false,
        highLow: false,
      });
  }, [filterSelected]);

  return (
    <div className="">
      {/* Period Select */}
      <div className="p-2 w-[250px] ">
        {marketDropdown && (
          <Select
            className="font-semibold text-sm z-50"
            options={[...marketDropdown?.nse, ...marketDropdown?.bse]}
            placeholder="Indices"
            getOptionLabel={(option) => option.INDICES}
            getOptionValue={(option) => option.Val}
            onChange={(values) => {
              values
                ? (setFilterSelected(values.Val), console.log(values.Val))
                : setFilterSelected(1);
            }}
            defaultValue={{
              INDICES: "Nifty 50",
              Val: "123",
            }}
          />
        )}
      </div>
      {/* Menu Buttons Start*/}
      <div className="flex justify-center ">
        {/* Left Scroll */}
        <BsFillCaretLeftFill
          className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 hidden sm:inline-block"
          size={40}
          onClick={slideLeft}
        />
        {/* Menu Buttons Web */}
        <div
          id="marketMenuID"
          className="flex justify-between gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => {
              setMenu({
                indices: false,
                price: true,
                watch: false,
                tech: false,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menu.price && "bg-[#093967] text-white"
            } flex-1`}
          >
            Price
          </button>
          <button
            onClick={() => {
              setMenu({
                indices: false,
                price: false,
                watch: true,
                tech: false,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menu.watch && "bg-[#093967] text-white"
            } flex-1`}
          >
            Performance
          </button>
          <button
            onClick={() => {
              setMenu({
                indices: false,
                price: false,
                watch: false,
                tech: true,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menu.tech && "bg-[#093967] text-white"
            } flex-1`}
          >
            Technical Analysis
          </button>
          <button
            onClick={() => {
              setMenu({
                indices: false,
                price: false,
                watch: false,
                tech: false,
                highLow: true,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menu.highLow && "bg-[#093967] text-white"
            } flex-1`}
          >
            52 Week H&L
          </button>
        </div>
        {/* Right Scroll */}
        <BsFillCaretRightFill
          className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 hidden sm:inline-block"
          size={40}
          onClick={slideRight}
        />
      </div>
      {/* Menu BUTTON Ends here */}

      {/* Menu Buttons MOBILE Start*/}
      <div className="flex justify-center hidden">
        {/* Left Scroll */}
        <BsFillCaretLeftFill
          className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 hidden sm:inline-block"
          size={40}
          onClick={slideLeftMobile}
        />
        {/* Menu Buttons MOBILE*/}
        <div
          id="marketMenuMobileID"
          className="flex justify-between gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => {
              setMenuMobile({
                indices: true,
                price: false,
                watch: false,
                tech: false,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 md:hidden ${
              menuMobile.indices && "bg-[#093967] text-white"
            } flex-1`}
          >
            Indices
          </button>
          <button
            onClick={() => {
              setMenuMobile({
                indices: false,
                price: true,
                watch: false,
                tech: false,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menuMobile.price && "bg-[#093967] text-white"
            } flex-1`}
          >
            Price
          </button>
          <button
            onClick={() => {
              setMenuMobile({
                indices: false,
                price: false,
                watch: true,
                tech: false,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menuMobile.watch && "bg-[#093967] text-white"
            } flex-1`}
          >
            Performance
          </button>
          <button
            onClick={() => {
              setMenuMobile({
                indices: false,
                price: false,
                watch: false,
                tech: true,
                highLow: false,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menuMobile.tech && "bg-[#093967] text-white"
            } flex-1`}
          >
            Technical Analysis
          </button>
          <button
            onClick={() => {
              setMenuMobile({
                indices: false,
                price: false,
                watch: false,
                tech: false,
                highLow: true,
              });
            }}
            className={`relative px-2 md:px-4 py-2 border-2 border-black text-semibold rounded-lg justify-center flex items-center gap-4 ${
              menuMobile.highLow && "bg-[#093967] text-white"
            } flex-1`}
          >
            52 Week H&L
          </button>
        </div>
        {/* Right Scroll */}
        <BsFillCaretRightFill
          className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 hidden sm:inline-block"
          size={40}
          onClick={slideRightMobile}
        />
      </div>
      {/* Menu BUTTON MOBILE here */}

      {/* Web VIEW */}
      <div className="pt-5 w-full max-h-[630px] overflow-x-auto scrollbar-thin">
        {menu.price && <Price />}
        {menu.watch && <WatchPerform />}
        {menu.tech && <TechnicalAnalysis />}
        {menu.highLow && <HighLow />}
      </div>

      {/* Mobile VIEW */}
      <div className="pt-5 hidden ">
        {menuMobile.indices && (
          <div className={`flex flex-col gap-3`}>
            <IndicesStatus />
            <SectorMap />
          </div>
        )}
        {menuMobile.price && <Price />}
        {menuMobile.watch && <WatchPerform />}
        {menuMobile.tech && <TechnicalAnalysis />}
        {menuMobile.highLow && <HighLow />}
      </div>
    </div>
  );
};

export default RightOptions;
