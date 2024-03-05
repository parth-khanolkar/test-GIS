"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useInfoContext } from "@/context/info";

const SearchBar = ({ handleChange, placeholder, onBlur }) => {
  const router = useRouter();
  const { initData, dashCompName } = useInfoContext();
  const navSearchRef = useRef(null);
  const inputRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");
  const [options, setOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const handleOutsideClick = (e) => {
    if (navSearchRef.current && !navSearchRef.current.contains(e.target)) {
      setIsFocused(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  const fetchCompanySearch = async () => {
    try {
      const response = await axios.post(
        `https://transcriptanalyser.com/goindiastock/company_search`,
        {
          searchtxt: searchInput,
        }
      );
      setOptions(response.data.data.slice(0, 7));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (searchInput !== "") {
      fetchCompanySearch();
    }
  }, [searchInput]);

  const handleSelection = (index) => {
    handleChange(options[index]);
    setSelectedOption(0);
    setSearchInput("");
    setOptions([]);
    inputRef.current.blur();
    setIsFocused(false);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      inputRef.current.blur();
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
      <div
        ref={navSearchRef}
        className="flex items-center justify-between bg-white px-1 relative border border-gray-300 rounded-md shadow-md p-1 w-full h-full gap-2"
      >
        <input
          ref={inputRef}
          className={`outline-none font-semibold h-full ${
            placeholder && placeholder != "Select any Company..."
              ? "placeholder:text-black"
              : "placeholder:text-gray-400"
          } ${
            placeholder == "Select any Company..." &&
            "placeholder:text-gray-400"
          } focus:placeholder:text-white w-full`}
          type="text"
          value={searchInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setSearchInput("");
            onBlur && onBlur();
          }}
          onChange={(e) => {
            setSearchInput(e.target.value);
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
          placeholder={placeholder ? placeholder : "Select any Company..."}
        />
        <IoSearchOutline size={20} className="text-[#143b64]" />

        { options.length > 0  &&
          <div
            className={`flex flex-col absolute text-sm bg-white shadow-md rounded-md border border-gray-300 top-10 overflow-y-auto w-full left-0 
                  ${isFocused ? "max-h-[200px] " : "hidden"}
                  `}
            style={{ zIndex: 999 }}
          >
            {
              options.map((item, index) => (
                <div
                  key={index}
                  id={index}
                  className={`cursor-pointer font-semibold p-1 whitespace-pre-wrap
                    ${
                      selectedOption === index
                        ? "bg-[#183e68] text-white"
                        : "hover:bg-[#eaf4ff]"
                    }
                  `}
                  onClick={()=>{
                    handleSelection(index);
                  }}
                >
                  {item?.label}
                </div>
              ))}
          </div>
        }
      </div>
    </>
  );
};

export default SearchBar;
