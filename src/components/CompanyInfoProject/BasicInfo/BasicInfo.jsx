import CompanyCard from "./BasicComp/CompanyCard";
import GlanceCard from "./BasicComp/GlanceCard";
import { useInfoContext } from "@/context/info";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";

const BasicInfo = () => {
  const router = useRouter();
  const { fincodeLink } = router.query;
  const {
    fincode,
    setFincode,
    initData,
    setInitData,
    globalStandalone,
    setGlobalStandalone,
    standaloneForBasic,
    setStandaloneForBasic,
    bseForBasic,
    setBseForBasic,
    initBse,
    setInitBse,
    exchange,
    setExchange,
  } = useInfoContext();
  const [data, setData] = useState(null);
  const [graph, setGraph] = useState(null);

  const fetchData1 = async (mode1, mode2) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/new_basicinfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fincode: fincodeLink,
            mode: mode1,
            exchange: mode2,
          }),
        }
      );
      const resJson = await res.json();
      setInitData(resJson?.data);
      // setInitBse(resJson?.Exchange);
      setData(resJson?.data);
      setGraph(resJson?.graph);
      setExchange(resJson?.Exchange);

      resJson?.data?.mode?.value == "S" && setStandaloneForBasic(false);
      resJson?.data?.mode?.value == "C" && setStandaloneForBasic(true);
      resJson?.data?.mode?.value == "S" && setGlobalStandalone(false);
      resJson?.data?.mode?.value == "C" && setGlobalStandalone(true);
      resJson?.Exchange == "NSE" && setBseForBasic(false);
      resJson?.Exchange == "BSE" && setBseForBasic(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData2 = async (mode1, mode2) => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/goindiastock/new_basicinfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fincode: fincodeLink,
            mode: mode1,
            exchange: mode2,
          }),
        }
      );
      const resJson = await res.json();
      setInitData(resJson?.data);
      setData(resJson?.data);
      setGraph(resJson?.graph);
      setExchange(resJson?.Exchange);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setData(null);
    setInitData(null);
    fetchData1("", "");
  }, [fincodeLink]);

  // Calling Dependency Fetch Company Data
  useEffect(() => {
    standaloneForBasic == true && bseForBasic == true && fetchData2("C", "BSE");

    standaloneForBasic == false &&
      bseForBasic == false &&
      fetchData2("S", "NSE");

    standaloneForBasic == false &&
      bseForBasic == true &&
      fetchData2("S", "BSE");

    standaloneForBasic == true &&
      bseForBasic == false &&
      fetchData2("C", "NSE");
  }, [bseForBasic, standaloneForBasic]);

  return (
    <div className="">
      <div className="rounded-lg w-full">
        {/* Company Details */}
        <div className="flex flex-col justify-center lg:flex-row lg:flex lg:justify-between h-full w-full">
          <div className="flex-[0.35] w-full flex justify-center">
            <CompanyCard data={data} graph={graph} />
          </div>
          <div className="flex-[0.65] w-full">
            <GlanceCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
