"use client";

import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Link from "next/link";

import Moment from "react-moment";
import { TwitterShareButton, TwitterIcon } from "react-share";

import bulkBlockImage from "@/assets/images/landingPageIcons/bulk_block.png";
import fundamentalImage from "@/assets/images/Menu Icons/fundamental.png";
import resultImage from "@/assets/images/Menu Icons/Result.png";
import brokerReportImage from "@/assets/images/Menu Icons/BrokerReport.png";
import interviewImage from "@/assets/images/Menu Icons/interview.png";
import analysisImage from "@/assets/images/Menu Icons/analysis.png";

import logo from "@/assets/images/logo.png";
import Image from "next/image";
import axios from "axios";

import Header from "@/components/HomePage/Header";
import { IoShareSocial } from "react-icons/io5";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import MobileFooter from "@/components/MobileFooter";
import Head from "next/head";
import { useInfoContext } from "@/context/info";
import SearchBar from "@/components/GlobalComponents/SearchBar";

const HomePage = () => {
  const router = useRouter();
  const { uid } = useInfoContext();

  const [trendingStories, setTrendingStories] = useState([]);
  const [trendingSearches, settrendingSearches] = useState([]);

  const pageOptions = [
    {
      Option: "Fundamental",
      link: "/fundamentalScreen",
      image: fundamentalImage,
    },
    {
      Option: "Result",
      link: "/resultScreen",
      image: resultImage,
    },
    {
      Option: "Bulk-Block",
      link: "/bulk-block",
      image: bulkBlockImage,
    },
    {
      Option: "Broker Reports",
      link: `/brokerReport`,
      image: brokerReportImage,
    },
    {
      Option: "Interviews",
      link: `/interviews`,
      image: interviewImage,
    },
    {
      Option: "Analysis",
      link: `/earningcalls/${uid}`,
      image: analysisImage,
    },
  ];

  const fetchTrendingSearchs = async () => {
    try {
      const response = await axios.post(
        "https://transcriptanalyser.com/homepage/trending_search",
        {
          userid: "",
          type: "trending",
        }
      );
      settrendingSearches(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchTrendingSearchs();
  }, []);

  const fetchTrendingStories = async () => {
    try {
      const response = await axios.post(
        "https://transcriptanalyser.com/homepage/stories",
        {}
      );
      setTrendingStories(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchTrendingStories();
  }, []);

  return (
    <>
      <Head>
        <title>{"GoIndiaStocks - Unbiased & Balanced"}</title>
      </Head>

      <div
        className={`h-[calc(100vh-50px)] bg-white overflow-x-hidden overflow-y-auto scrollbar-none lg:scrollbar px-2`}
      >
        <header className="sticky top-0 z-10 -mx-2">
          <Header />
        </header>
        <div className="flex flex-col items-center justify-center mt-12">
          <Image
            src={logo}
            alt="Picture of the author"
            className="w-[120.96px] h-[75.39px] md:w-[137.97px] md:h-[86px]"
          />
          {/* COMPANY NAME */}
          <div>
            <span className="text-cyan-900 text-3xl md:text-[40px] font-semibold ">
              {"GO INDIA"}
            </span>
            <span className="text-black text-3xl md:text-[40px] font-semibold">
              {" "}
            </span>
            <span className="text-red-700 text-3xl md:text-[40px] font-semibold ">
              {"STOCKS"}
            </span>
          </div>

          <div className="text-rose-700 text-lg md:text-xl font-semibold ">
            {"Unbiased and Balanced"}
          </div>

          <div className="mt-4 lg:mt-8 flex justify-center w-[90vw] md:w-[80vw] lg:w-[70vw] h-[5vh] md:h-[3vh] lg:h-[5vh]">
            <SearchBar
              handleChange={(option) => {
                router.push(`/companyinfo/${option.value}`);
              }}
            />
          </div>
          <div className="w-full px-4 md:px-20 lg:px-64">
            {/* Div for everything below the Search */}
            <div className="w-full text-sm md:text-base mt-6 lg::mt-4">
              {/* Quick Access Menu Icons */}
              <div className="w-full grid grid-cols-3 lg:grid-cols-6 gap-5 md:gap-2">
                {pageOptions.map((option, index) => (
                  <Link
                    key={index}
                    href={option.link}
                    className="col-span-1 flex flex-col items-center justify-center group"
                  >
                    <div className=" p-2">
                      <Image
                        src={option.image}
                        alt={option.Option}
                        className="w-[28px] h-[28px] md:w-[40px] md:h-[40px] group-hover:h-[32px] group-hover:w-[32px]"
                      />
                    </div>
                    <div className="text-[12px] md:text-[15px] md:t-base pt-0.5 md:pt-1 whitespace-nowrap">
                      {option.Option}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Trending Searches */}
              <div className="w-full mt-8 flex flex-row flex-wrap justify-center space-x-3 text-xs md:text-base">
                <span className="text-zinc-600">{"Trending Searches >"}</span>
                {trendingSearches?.map((item, index) => (
                  <Link
                    href={`/companyinfo/${item.fincode}`}
                    key={index}
                    className="text-[10px] md:text-sm font-semibold md:font-normal hover:border-black hover:text-white hover:bg-cyan-900 py-1 px-1.5 mb-2 text-zinc-500 border border-zinc-500 rounded-md whitespace-nowrap max-w-xs overflow-hidden truncate"
                  >
                    <span className="md:hidden">
                      {item.Company_Name.length > 12
                        ? `${item.Company_Name.slice(0, 12)}...`
                        : item.Company_Name}
                    </span>
                    <span className="hidden md:block">{item.Company_Name}</span>
                  </Link>
                ))}
              </div>

              {/* TRENDING STORIES */}
              <div className="w-full my-10 justify-center">
                <div className="text-red-700 text-xl font-semibold mb-2">
                  TRENDING STORIES
                </div>

                {/* Mapping Stories */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto scrollbar-none px-2">
                  {trendingStories?.map((item, index) => (
                    <div
                      key={index}
                      className={`col-span-1 border border-black rounded-md p-3 ${
                        index >= 5 ? "md:hidden" : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <Link
                          href={`/blogs/insights?type=Article&id=${item?.GeneralNotesId}`}
                        >
                          <div className="line-clamp-1 text-base font-semibold">
                            {item.Title}
                          </div>
                          <div className="mt-2.5 text-xs md:text-sm text-justify ">
                            <span className="line-clamp-4 font-serif tracking-tight">
                              {item?.ShortDesc}
                            </span>
                          </div>
                        </Link>
                        <div className="flex flex-row mt-3 text-xs">
                          <div className="text-blue-500">
                            <Moment fromNow>{item?.CreatedOn}</Moment>
                          </div>
                          <div className="ml-auto">
                            <button
                              className="flex flex-row items-center justify-center"
                              onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard
                                    .writeText(
                                      `${window.location.origin}/blogs/insights?type=Article&id=${item?.GeneralNotesId}`
                                    )
                                    .then(() => {
                                      toast.success(
                                        "Link copied to clipboard",
                                        {
                                          position: "bottom-center",
                                          autoClose: 1500,
                                          hideProgressBar: true,
                                          closeOnClick: true,
                                          pauseOnHover: false,
                                          draggable: false,
                                          progress: undefined,
                                          theme: "light",
                                        }
                                      );
                                    })
                                    .catch((err) => {
                                      console.error(
                                        "Unable to copy to clipboard",
                                        err
                                      );
                                    });
                                } else {
                                  const tempInput =
                                    document.createElement("input");
                                  tempInput.value = `${window.location.origin}/blogs/insights?type=Article&id=${item?.GeneralNotesId}`;
                                  document.body.appendChild(tempInput);
                                  tempInput.select();
                                  document.execCommand("copy");
                                  document.body.removeChild(tempInput);

                                  toast.success("Link copied to clipboard", {
                                    position: "bottom-center",
                                    autoClose: 1500,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: false,
                                    draggable: false,
                                    progress: undefined,
                                    theme: "light",
                                  });
                                }
                              }}
                            >
                              <IoShareSocial className="mr-1 text-black text-base" />
                              <span className="text-xs md:text-sm whitespace-nowrap">
                                Share
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    href={"/blogs"}
                    className={`w-full flex items-center justify-center min-h-[10vh] font-semibold text-cyan-900`}
                  >
                    Load more ...
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="md:mx-2">
          <div className="hidden md:inline-block">
            <Footer />
          </div>
          <div className="md:hidden">
            <MobileFooter />
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
