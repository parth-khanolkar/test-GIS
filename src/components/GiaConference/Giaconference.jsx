import { useEarningsContext } from "@/context/Context";
import { useEffect, useState } from "react";
import {
  BiArrowBack,
  BiMessageRoundedDots,
  BiMessageRoundedX,
} from "react-icons/bi";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillCloseCircle,
  AiOutlineDownload,
} from "react-icons/ai";
import { RxExternalLink } from "react-icons/rx";
import Link from "next/link";
const Giaconference = ({
  uid,
  cid,
  annualReport,
  factsheet,
  infopack,
  stock,
  transcript2,
  ppt2,
}) => {
  const {
    widgets,
    setWidgets,
    audioFile,
    setAudioFile,
    stockGptUrl,
    brokerFlag,
    selectedText,
    setSelectedText,
  } = useEarningsContext();

  // Local States
  const [details, setDetails] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [result, setResult] = useState(null);
  const [ppt, setPpt] = useState(null);
  const [summary, setSummary] = useState(null);
  const [detailedSummary, setDetailedSummary] = useState(null);
  const [broker, setBroker] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [audio, setAudio] = useState(null);
  const [stockGpt, setStockGpt] = useState(false);
  const [fincode, setFincode] = useState("");
  const [chat, setChat] = useState("");
  const [resultPdf, setResultPdf] = useState(true);
  const [resultTable, setResultTable] = useState(false);
  const [viewTable, setViewTable] = useState(false);

  // Function to get the Selected Text
  function handleMouseUp() {
    const selectedTextLocal = `${window.getSelection().toString()}`;
    setSelectedText(selectedTextLocal);
  }

  function handlePDfTable() {
    setResultPdf(!resultPdf);
    setResultTable(!resultTable);
  }

  function handleTranscript() {
    setWidgets({
      results: false,
      broker: false,
      transcripts: true,
      ppt: false,
      summary: false,
      sentiment: false,
      infopack: false,
    });
  }
  function handleResults() {
    setWidgets({
      results: true,
      transcripts: false,
      broker: false,
      ppt: false,
      summary: false,
      sentiment: false,
      infopack: false,
    });
  }
  function handleBroker() {
    setWidgets({
      results: false,
      transcripts: false,
      ppt: false,
      broker: true,
      summary: false,
      sentiment: false,
      infopack: false,
    });
  }
  function handlePpt() {
    setWidgets({
      results: false,
      transcripts: false,
      ppt: true,
      broker: false,
      summary: false,
      sentiment: false,
      infopack: false,
    });
  }
  function handleSummary() {
    setWidgets({
      results: false,
      transcripts: false,
      broker: false,
      ppt: false,
      summary: true,
      sentiment: false,
      infopack: false,
    });
  }
  function handleSentiment() {
    setWidgets({
      results: false,
      transcripts: false,
      ppt: false,
      broker: false,
      summary: false,
      sentiment: true,
      infopack: false,
    });
  }

  function handleInfopack() {
    setWidgets({
      results: false,
      transcripts: false,
      ppt: false,
      broker: false,
      summary: false,
      sentiment: false,
      infopack: true,
    });
  }

  // fetching Details Page data
  useEffect(() => {
    async function apifetch() {
      const res = await fetch(
        `https://transcriptanalyser.com/gis/calendar-detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: uid,
            calendar_id: cid,
          }),
        }
      );
      const data = await res.json();
      setDetails(data?.key);
      setTranscript(details?.transcript);
      setResult(details?.result);
      setPpt(details?.ppt);
      setSummary(details?.notes?.summary);
      setDetailedSummary(details?.notes?.heading);
      setSentiment(details?.transcript_analyser_link);
      setAudio(details?.audio);
      setFincode(details?.fincode);
      setChat(details?.chat_available);
    }
    if (cid && uid) {
      apifetch();
    }
  }, [
    details?.audio,
    details?.sentiment,
    uid,
    cid,
    details?.result,
    details?.ppt,
    details?.fincode,
  ]);

  // fetching broker radar data
  useEffect(() => {
    async function brokerfetch() {
      const res = await fetch(
        `https://transcriptanalyser.com/gis/broker-radar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fincode: details?.fincode,
          }),
        }
      );
      const data = await res.json();
      setBroker(data);
    }
    if (details?.fincode) {
      brokerfetch();
      console.log(broker);
    }
  }, [details]);

  useEffect(() => {
    setAudioFile(audio);
  }, [audio]);

  return (
    <div className="h-screen bg-[#0d2945]">
      <div className="flex flex-col w-screen h-[calc(100vh-100px)] sm:h-screen overflow-hidden">
        {/* Top Widgets Section */}
        <div className="flex text-white w-full h-full overflow-hidden p-5 gap-5 ">
          {/* Left Widgets */}
          <div className="flex flex-col h-full w-full justify-center items-center gap-5 relative">
            {/* ABsolute Table Button */}
            <div
              className={`${
                details?.earning_table == "none" && "hidden"
              } absolute right-[-20px] top-[150px] shadow-sm shadow-black`}
            >
              <div onClick={() => setViewTable(!viewTable)} className="flex">
                <div className="rotate-[270deg] text-xl bg-red-600 px-3 rounded-t-md font-semibold flex justify-between items-center gap-3 h-7 absolute left-[-66px] top-[60px] cursor-pointer">
                  <span>
                    {!viewTable ? (
                      <AiFillCaretUp size={22} />
                    ) : (
                      <AiFillCaretDown size={22} />
                    )}
                  </span>
                  <span>Table</span>
                </div>
                <table
                  className={`${
                    !viewTable && "hidden"
                  } rounded-l overflow-hidden`}
                >
                  <thead className="text-sm">
                    <tr className="bg-[#056eef] text-white text-left font-semibold">
                      <td></td>
                      <th className="px-4 py-2">Value</th>
                      <th className="px-4 py-2">QoQ</th>
                      <th className="px-4 py-2">YoY</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className={`bg-[#eaeef5]`}>
                      <td className="font-bold px-4 py-2 text-black">
                        Revenue (Rs. cr)
                      </td>
                      <td className={`text-black font-semibold px-4 py-2`}>
                        {details?.earning_table?.revenue}
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.revenue_growth_qoq > 0
                            ? "text-green-700"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.revenue_growth_qoq > 0 && "+"}
                        {details?.earning_table?.revenue_growth_qoq}%
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.revenue_growth_yoy > 0
                            ? "text-green-700"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.revenue_growth_yoy > 0 && "+"}
                        {details?.earning_table?.revenue_growth_yoy}%
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="text-sm">
                    <tr className={`bg-white text-black`}>
                      <td className="font-bold px-4 py-2">EBITDA (Rs. cr)</td>
                      <td className={`text-black font-semibold px-4 py-2`}>
                        {details?.earning_table?.ebitda}
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.ebitda_growth_qoq > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.ebitda_growth_qoq > 0 && "+"}
                        {details?.earning_table?.ebitda_growth_qoq}%
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.ebitda_growth_yoy > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.ebitda_growth_yoy > 0 && "+"}
                        {details?.earning_table?.ebitda_growth_yoy}%
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="text-sm">
                    <tr className={`bg-[#eaeef5] text-black`}>
                      <td className="font-bold px-4 py-2">EBITDA Margin (%)</td>
                      <td className={`text-black font-semibold px-4 py-2`}>
                        {details?.earning_table?.ebitda_margin}
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.ebitda_margin_growth_qoq > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.ebitda_margin_growth_qoq > 0 &&
                          "+"}
                        {details?.earning_table?.ebitda_margin_growth_qoq?.toFixed(
                          0
                        )}{" "}
                        bps
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.ebitda_margin_growth_yoy > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.ebitda_margin_growth_yoy > 0 &&
                          "+"}
                        {details?.earning_table?.ebitda_margin_growth_yoy?.toFixed(
                          0
                        )}{" "}
                        bps
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="text-sm">
                    <tr className={`bg-white text-black`}>
                      <td className="font-bold px-4 py-2">PAT (Rs. cr)</td>
                      <td className={`text-black font-semibold px-4 py-2`}>
                        {details?.earning_table?.pat}
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.pat_growth_qoq > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.pat_growth_qoq > 0 && "+"}
                        {details?.earning_table?.pat_growth_qoq}%
                      </td>
                      <td
                        className={`${
                          details?.earning_table?.pat_growth_yoy > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold px-4 py-2`}
                      >
                        {details?.earning_table?.pat_growth_yoy > 0 && "+"}
                        {details?.earning_table?.pat_growth_yoy}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/*Widgets Buttons */}
            <div className="flex gap-2 text-lg w-full">
              <button
                onClick={handleTranscript}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.transcripts && "bg-white text-[#0d2945]"
                } ${
                  !transcript &&
                  !transcript2 &&
                  "text-gray-600 border border-gray-700"
                }`}
              >
                Transcripts
              </button>
              {/* <button
                onClick={handleResults}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.results && "bg-white text-[#0d2945]"
                } ${!result && "text-gray-600 border border-gray-700"}`}
              >
                <p className={` ${result && "hidden sm:inline-block"}`}>
                  Results
                </p>
                <a
                  href={result}
                  target="_blank"
                  className={`flex items-center gap-1 justify-center sm:hidden ${
                    !result && "hidden"
                  }`}
                >
                  Results <AiOutlineDownload size={20} />
                </a>
              </button> */}
              <button
                onClick={handlePpt}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.ppt && "bg-white text-[#0d2945]"
                } ${!ppt && !ppt2 && "text-gray-600 border border-gray-700"}`}
              >
                <p className={` ${ppt && "hidden sm:inline-block"}`}>PPT</p>
                <a
                  href={ppt}
                  target="_blank"
                  className={`flex items-center gap-1 justify-center sm:hidden ${
                    !ppt && "hidden"
                  }`}
                >
                  PPT <AiOutlineDownload size={20} />
                </a>
              </button>
              <button
                onClick={handleSummary}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.summary && "bg-white text-[#0d2945]"
                } ${
                  (summary?.length == 0 || cid == 0) &&
                  "text-gray-600 border border-gray-700"
                }`}
              >
                Summary
              </button>
            </div>

            {/* Sentiment and Broker Button*/}
            <div className="flex justify-between w-full gap-2">
              {/* Annual Report Button */}
              <button
                onClick={handleSentiment}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.sentiment && "bg-white text-[#0d2945]"
                } ${!annualReport && "text-gray-600 border border-gray-700"}`}
              >
                <p className={` ${annualReport && "hidden sm:inline-block"}`}>
                  Annual Report
                </p>
                <a
                  href={annualReport}
                  target="_blank"
                  className={`flex items-center gap-1 justify-center sm:hidden ${
                    !annualReport && "hidden"
                  } whitespace-nowrap`}
                >
                  Annual Report <AiOutlineDownload size={20} />
                </a>
              </button>
              {/* Factsheet */}
              <button
                onClick={handleBroker}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.broker && "bg-white text-[#0d2945]"
                } ${!factsheet && "text-gray-600 border border-gray-700"}`}
              >
                <p className={` ${factsheet && "hidden sm:inline-block"}`}>
                  Factsheet
                </p>
                <a
                  href={factsheet}
                  target="_blank"
                  className={`flex items-center gap-1 justify-center sm:hidden ${
                    !factsheet && "hidden"
                  }`}
                >
                  Factsheet <AiOutlineDownload size={20} />
                </a>
              </button>
              {/* Infopack */}
              <button
                onClick={handleInfopack}
                className={`py-0 border border-white rounded-lg flex-1 px-1 shadow-lg ${
                  widgets.infopack && "bg-white text-[#0d2945]"
                } ${!infopack && "text-gray-600 border border-gray-700"}`}
              >
                <p className={` ${infopack && "hidden sm:inline-block"}`}>
                  Infopack
                </p>
                <a
                  href={infopack}
                  target="_blank"
                  className={`flex items-center gap-1 justify-center sm:hidden ${
                    !infopack && "hidden"
                  }`}
                >
                  Infopack <AiOutlineDownload size={20} />
                </a>
              </button>
            </div>

            {/* Widgets Opened Fields */}
            <div
              onMouseUp={handleMouseUp}
              id="scroll-element"
              className={`w-full h-full bg-[#0d2945] rounded-lg flex-col shadow-lg ${
                widgets.transcripts || widgets.summary
                  ? "overflow-x-auto"
                  : "overflow-hidden"
              }`}
            >
              {/* Transcript */}
              {
                <div
                  className={`text-justify ${
                    widgets.transcripts ? "inline-block" : "hidden"
                  } p-2 ${!transcript?.[0] && transcript2?.[0] && "hidden"}`}
                >
                  {uid == 0 ? (
                    <div className="text-3xl animate-pulse underline">
                      Login to view transcript.
                    </div>
                  ) : !transcript ? (
                    <div
                      className={`text-3xl animate-pulse ${
                        transcript2 && "hidden"
                      }`}
                    >
                      {!transcript2
                        ? `Transcript not available`
                        : `Loading....`}
                    </div>
                  ) : (
                    transcript?.[0] &&
                    transcript?.map((items) => (
                      <div key={items?.text} className="mb-2 sm:mb-4">
                        <h1 className="text-xl sm:text-2xl italic font-semibold px-3">
                          {items?.person_name} :
                        </h1>
                        <p className="text-sm sm:text-lg px-6 sm:px-10">
                          {items?.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              }
              {transcript &&
                widgets.transcripts &&
                (transcript2 == null ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    {cid == 0 ? `Transcript not available` : `Loading....`}
                  </div>
                ) : transcript2 ? (
                  <div className="w-full h-full">
                    <iframe
                      key={transcript2}
                      src={transcript2}
                      className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                    />
                    <a
                      href={transcript2}
                      className="sm:hidden animate-pulse flex justify-center"
                      target="_blank"
                    >
                      Click here to view Transcript!
                    </a>
                  </div>
                ) : (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    Transcript not available
                  </p>
                ))}
              {/* Results */}
              {/* {widgets.results &&
                (result == null ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
                  </div>
                ) : resultPdf == true ? (
                  result?.[0] ? (
                    <div className="w-full h-full">
                      <iframe
                        key={result}
                        src={result}
                        className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                      />
                      <a
                        href={result}
                        className="sm:hidden animate-pulse flex justify-center"
                        target="_blank"
                      >
                        Click here to view Results!
                      </a>
                    </div>
                  ) : (
                    <p className="p-5 flex justify-center sm:text-2xl text-xl  animate-pulse">
                      Result PDF not available
                    </p>
                  )
                ) : (
                  resultTable == true &&
                  (details?.earning_table != "none" ? (
                    <div className="w-full h-full flex justify-center items-center pt-[110px] sm:pt-0 ">
                      <div className="overflow-none">
                        <table className="table-auto whitespace-nowrap ">
                          <thead className="text-lg">
                            <tr className="bg-[#056eef] text-white text-left">
                              <td></td>
                              <th className="font-semibold px-6 py-3">Value</th>
                              <th className="font-semibold px-6 py-3">
                                QoQ (%)
                              </th>
                              <th className="font-semibold px-6 py-3">
                                Yoy(%)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-md">
                            <tr className={`bg-[#eaeef5] text-black`}>
                              <td className="font-semibold px-6 py-3 ">
                                Revenue (Rs. cr)
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.revenue}
                              </td>
                              <td className="font-semibold px-6 py-3 ">
                                {details?.earning_table?.revenue_growth_qoq}
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.revenue_growth_yoy}
                              </td>
                            </tr>
                          </tbody>
                          <tbody className="text-md">
                            <tr className={`bg-white text-black`}>
                              <td className="font-semibold px-6 py-3">
                                EBITDA
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.ebitda}
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.ebitda_growth_qoq}
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.ebitda_growth_yoy}
                              </td>
                            </tr>
                          </tbody>
                          <tbody className="text-md">
                            <tr className={`bg-[#eaeef5] text-black`}>
                              <td className="font-semibold px-6 py-3">PAT</td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.pat}
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.pat_growth_qoq}
                              </td>
                              <td className="font-semibold px-6 py-3">
                                {details?.earning_table?.pat_growth_yoy}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    details?.earning_table == "none" && (
                      <p className="w-full h-full flex justify-center items-center pt-[110px] sm:pt-0 sm:text-2xl text-xl animate-pulse">
                        Earning Table not available!
                      </p>
                    )
                  ))
                ))} */}

              {/* Broker */}
              {widgets.broker &&
                (factsheet == null || "" ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
                  </div>
                ) : factsheet ? (
                  <div className="w-full h-full">
                    <iframe
                      key={factsheet}
                      src={factsheet}
                      className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                    />
                    <a
                      href={factsheet}
                      className="sm:hidden animate-pulse flex justify-center"
                      target="_blank"
                    >
                      Click here to view Factsheet!
                    </a>
                  </div>
                ) : (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    Factsheet not available
                  </p>
                ))}

              {/*PPT  */}
              {widgets.ppt &&
                (ppt == null ? (
                  <div
                    className={`text-3xl animate-pulse flex justify-center items-center ${
                      ppt2 && "hidden"
                    }`}
                  >
                    {!ppt2 ? `PPT not available` : `Loading....`}
                  </div>
                ) : ppt ? (
                  <div className="w-full h-full">
                    <iframe
                      key={ppt}
                      src={ppt}
                      className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                    />
                    <a
                      href={ppt}
                      className="sm:hidden animate-pulse flex justify-center"
                      target="_blank"
                    >
                      Click here to view PPT!
                    </a>
                  </div>
                ) : (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    PPT not available
                  </p>
                ))}

              {!ppt &&
                widgets.ppt &&
                (ppt2 == null ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    {!ppt2 ? `PPT not available` : `Loading1....`}
                  </div>
                ) : ppt2 ? (
                  <div className="w-full h-full">
                    <iframe
                      key={ppt2}
                      src={ppt2}
                      className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                    />
                    <a
                      href={ppt2}
                      className="sm:hidden animate-pulse flex justify-center"
                      target="_blank"
                    >
                      Click here to view PPT!
                    </a>
                  </div>
                ) : (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    PPT not available
                  </p>
                ))}
              {/* Sentiment */}
              {widgets.sentiment &&
                (annualReport == null || "" ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
                  </div>
                ) : annualReport ? (
                  <div className="w-full h-full">
                    <iframe
                      key={annualReport}
                      src={annualReport}
                      className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                    />
                    <a
                      href={annualReport}
                      className="sm:hidden animate-pulse flex justify-center"
                      target="_blank"
                    >
                      Click here to view Annual Report!
                    </a>
                  </div>
                ) : (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    Annual Report not available
                  </p>
                ))}

              {/* Infopack */}
              {widgets.infopack &&
                (infopack == null || "" ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
                  </div>
                ) : infopack ? (
                  <div className="w-full h-full">
                    <iframe
                      key={infopack}
                      src={infopack}
                      className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                    />
                    <a
                      href={infopack}
                      className="sm:hidden animate-pulse flex justify-center"
                      target="_blank"
                    >
                      Click here to view Infopack!
                    </a>
                  </div>
                ) : (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    Infopack not available
                  </p>
                ))}

              {/* Summary */}
              <div
                className={`text-justify ${
                  widgets.summary ? "inline-block" : "hidden"
                } p-2`}
              >
                {!summary ? (
                  <div className="text-3xl animate-pulse">
                    {cid == 0 ? `Summary not available` : `Loading....`}
                  </div>
                ) : (
                  widgets.summary &&
                  (summary?.[0] ? (
                    // Summary
                    <div>
                      <h1 className="text-2xl sm:text-3xl italic font-semibold px-3">
                        Summary :
                      </h1>
                      {summary?.map((items) => (
                        <div key={items} className="my-2 select-none">
                          <p className="text-sm sm:text-lg px-6">{items}</p>
                        </div>
                      ))}
                      {detailedSummary?.map((items) => (
                        <div key={items?.text} className="my-4 select-none">
                          <h1 className="text-2xl sm:text-3xl italic font-semibold px-3">
                            {items?.heading} :
                          </h1>
                          {items?.text?.map((items) => (
                            <div key={items} className="my-2 select-none">
                              <p className="text-sm sm:text-lg px-6">{items}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                      No Summary Available
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Chat STOCK GPT */}
          <div
            className={`lg:flex lg:justify-center lg:h-full lg:w-[600px] items-center rounded-lg absolute lg:relative sm:right-4 md:right-0 sm:w-auto left-0 sm:left-auto top-0 h-screen z-30 ${
              !stockGpt && "hidden"
            } 
          lg:${chat != "yes" && "hidden"}`}
          >
            <iframe
              key={fincode}
              src={`https://chat-ai-rouge-six.vercel.app/chat/${fincode}`}
              className="bg-white rounded-lg  sm:h-[calc(100vh-100px)] shadow-2xl sm:w-[calc(100vh-250px)] w-screen h-screen lg:w-full lg:h-full"
            />
          </div>

          {/* Stock GPT Open/Close Buttons */}
          <div
            className={`w-full flex justify-end cursor-pointer absolute z-30 ${
              !stockGpt ? "bottom-[80px]" : "top-0 sm:top-auto"
            }  right-0 sm:bottom-[18px] sm:right-4 lg:hidden ${
              chat != "yes" && "hidden"
            }`}
          >
            {!stockGpt ? (
              <div className=" flex flex-col items-center rounded-lg text-white p-1">
                <BiMessageRoundedDots
                  onClick={() => setStockGpt(true)}
                  size={50}
                  className="rounded-full bg-[#1e3e60] p-1 "
                />
                <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                  Stock GPT
                </h1>
              </div>
            ) : (
              <div className=" flex flex-col items-center rounded-lg p-1">
                <BiMessageRoundedX
                  onClick={() => setStockGpt(false)}
                  size={50}
                  className="rounded-full bg-white text-[#1e3e60] sm:bg-[#1e3e60] sm:text-white p-1 "
                />
                <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                  Stock GPT
                </h1>
              </div>
            )}
          </div>
          {/* Toggle button for results and table */}
          {/* <div
            className={`${
              !widgets.results && "hidden"
            } flex justify-start cursor-pointer absolute z-30 ${
              resultPdf ? "top-[182px]" : "top-[150px]"
            }
              left-7 font-semibold`}
          >
            <button
              onClick={handlePDfTable}
              className={`${
                resultPdf ? "bg-[#1c61b6]" : "bg-gray-500"
              } w-[50px] rounded-l-sm px-3 py-1`}
            >
              PDF
            </button>
            <button
              onClick={handlePDfTable}
              className={`${
                resultTable ? "bg-[#1c61b6]" : "bg-gray-500"
              } w-[50px] rounded-r-sm`}
            >
              Table
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Giaconference;
