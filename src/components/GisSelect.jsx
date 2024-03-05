import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useInfoContext } from "@/context/info";

const SearchBar = ({ options = [], handleChange, placeholder, onBlur }) => {
  const router = useRouter();
  const { initData, dashCompName } = useInfoContext();
  const gisSelectRef = useRef(null);
  const gisInputRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const handleOutsideClick = (e) => {
    if (gisSelectRef.current && !gisSelectRef.current.contains(e.target)) {
      setIsFocused(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  const handleSelection = (index) => {
    handleChange(options[index]);
    setSelectedOption(0);
    setIsFocused(false);
    gisInputRef.current.blur();
    setSearchInput("");
  };

  useEffect(() => {
    const handleRouteChange = () => {
      gisInputRef.current.blur();
      setIsFocused(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.pathname]);

  useEffect(() => {
    const element = document.getElementById(selectedOption);
    selectedOption && element?.scrollIntoView({ block: "end" });
  }, [selectedOption]);

  return (
    <>
      {/* min-w-[170px] md:min-w-[300px] lg:min-w-[500px]  max-w-[220px] md:max-w-[300px] lg:max-w-[500px] lg:ml-5 */}
      <div
        ref={gisSelectRef}
        className="flex items-center justify-between bg-white px-1 relative border border-gray-300 rounded-md shadow-md p-1 w-full gap-1"
      >
        <input
          ref={gisInputRef}
          className={`outline-none font-semibold h-full ${
            placeholder &&
            (placeholder != "Sectors..." || placeholder != "Watchlists...")
              ? "placeholder:text-black"
              : "placeholder:text-gray-400"
          }  focus:placeholder:text-white w-full`}
          type="text"
          // value={searchInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setSearchInput("");
            onBlur && onBlur();
          }}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
            if (selectedOption < options.length) {
              if (e.key === "ArrowUp" && selectedOption > 0) {
                setSelectedOption((prev) => prev - 1);
              } else if (
                e.key === "ArrowDown" &&
                selectedOption < options.length - 1
              ) {
                setSelectedOption((prev) => prev + 1);
              }
              if (e.key === "Enter" && selectedOption >= 0) {
                handleSelection(selectedOption);
              }
            } else {
              setSelectedOption(0);
            }
          }}
          placeholder={placeholder ? placeholder : "Select..."}
        />
        <IoSearchOutline size={20} className="text-[#143b64]" />

        <ul
          className={`absolute z-100 text-sm bg-white shadow-md rounded-md border border-gray-300 top-9 overflow-y-auto w-full left-0 
                ${isFocused ? "max-h-[200px] " : "hidden"}
                `}
          style={{ zIndex: 999 }}
        >
          {options.length > 0 &&
            options.map((item, index) => (
              <li
                key={index}
                id={index}
                className={`cursor-pointer font-semibold p-1 whitespace-pre-wrap
                  ${
                    selectedOption === index
                      ? "bg-[#183e68] text-white"
                      : "hover:bg-[#eaf4ff]"
                  }
                `}
                onClick={() => {
                  handleSelection(index);
                }}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default SearchBar;
