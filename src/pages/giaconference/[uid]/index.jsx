/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import Giaconference from "@/components/GiaConference/Giaconference";
import { AiFillBackward, AiFillLeftCircle } from "react-icons/ai";
import { BsBack } from "react-icons/bs";
import { BiLeftArrow, BiLeftArrowCircle } from "react-icons/bi";
import { useRouter } from "next/router";
const GiaConference = () => {
  const router = useRouter();
  const uid = router.query.uid;
  const [cid, setCid] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [details, setDetails] = useState(false);
  const [annual, setAnnual] = useState(null);
  const [fact, setFact] = useState(null);
  const [info, setInfo] = useState(null);
  const [fincode, setFincode] = useState(null);
  const [transcript2, setTranscript2] = useState(null);
  const [ppt2, setPpt2] = useState(null);

  useEffect(() => {
    async function apiFetch() {
      const res = await fetch(
        "https://transcriptanalyser.com/gis/conference-master"
      );
      const data = await res.json();
      setApiData(data?.key);
    }
    apiFetch();
  }, []);

  return (
    <div>
      {/* Header
      <div className="absolute z-10">
        <div className="flex justify-between sm:justify-center items-center px-5 py-2 bg-white w-screen relative h-[60px] gap-5">
                    <div className="sm:absolute sm:left-0 sm:p-5">
 
            <Image src={logo} alt="Logo" height="80" width="80" />
          </div>
        
          <div className="text-2xl sm:text-3xl font-extrabold underline text-[#163a61] decoration-[#c11e32]">
            GIA Promoter Conference
          </div>
        </div>
      </div> */}

      {/* Header */}
      <div className="">
        <div className="flex justify-between items-center px-5 py-2 bg-white w-screen relative h-[60px] gap-5">
          {/* Left Section */}
          <div className="sm:left-0 sm:p-5">
            {/* Logo */}
            <Image src={logo} alt="Logo" height="80" width="80" />
          </div>
          {/* Heading */}
          <div className="text-2xl sm:text-3xl font-extrabold underline text-[#163a61] decoration-[#c11e32] whitespace-nowrap">
            GIS Promoter Conference
          </div>
          {/* RIght Date */}
          <div className="text-xl font-bold italic text-[#163a61] hidden sm:inline-block whitespace-nowrap">
            27 June, 2023
          </div>
        </div>
      </div>

      {/* Companies */}
      <div className="h-[calc(100vh-95px)] overflow-y-auto px-5 flex flex-col gap-5 mt-5">
        <h1 className="text-justify italic font-semibold text-[#163a61] ">
          Greetings and a warm welcome to the Go India Stocks Conference! We are
          thrilled to have you here as our esteemed guests. Feel free to explore
          the participant companies by simply clicking on them to access their
          collaterals. And don&apos;t miss out on the StockGPT feature, where
          you can ask any questions about a company&lsquo;s earning call. Enjoy
          your time with us !
        </h1>

        <div className="w-full border-t-2 border-red-500"></div>

        <div className="grid  grid-auto-fit-md gap-3 rounded-lg">
          {apiData?.map((item) => (
            <div
              key={item?.fincode}
              onClick={() => {
                setDetails(true);
                setAnnual(item?.annual_report);
                setFact(item?.factsheet);
                setInfo(item?.infopack);
                setCid(item?.calendar_id);
                setFincode(item?.fincode);
                setTranscript2(item?.transcripts);
                setPpt2(item?.ppt);
              }}
              className="bg-white p-2 flex flex-col justify-center items-center rounded-md shadow-md gap-1 hover:underline decoration-[#c11e32] cursor-pointer group"
            >
              <img
                className="object-contain"
                src={item?.ImageURL}
                alt="Logo"
                height={200}
                width={200}
              />
              <p className="text-xl font-bold group-hover:italic">
                {item?.comp_name}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Details */}
      <div
        className={`h-screen w-screen absolute top-0 z-20 ${
          !details && "hidden"
        }`}
      >
        <Giaconference
          key={cid}
          uid={uid}
          cid={cid}
          annualReport={annual}
          factsheet={fact}
          infopack={info}
          fincode={fincode}
          stock={false}
          transcript2={transcript2}
          ppt2={ppt2}
        />
      </div>
      {/* Back Button1 */}
      <div className={`absolute top-0  z-30 ${!details && "hidden"} p-2`}>
        <AiFillLeftCircle
          onClick={() => setDetails(false)}
          className="text-red-500 cursor-pointer"
          size={40}
        />
      </div>
    </div>
  );
};

export default GiaConference;
