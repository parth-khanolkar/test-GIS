import { useEarningsContext } from "@/context/Context";
import AudioPlayer from "./Widgets/AudioPlayer";
import { useEffect, useRef, useState } from "react";
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
import { TbNotes } from "react-icons/tb";
import { RxExternalLink } from "react-icons/rx";
import Link from "next/link";
import Broker from "./Widgets/Broker";
import axios from "axios";
import Notes from "../Notes/Notes";
import $ from "jquery";
import { PDFWorker } from "pdfjs-dist";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
const EarningsWidgetsPage = ({ uid, cid }) => {
  const {
    widgets,
    setWidgets,
    audioFile,
    setAudioFile,
    stockGptUrl,
    brokerFlag,
    selectedText,
    setSelectedText,
    noteFlag,
    setNoteFlag,
    masterNotesFlag,
    setMasterNotesFlag,
    outside,
    setOutside,
    defaultCompanyForDetailedNotes,
    setDefaultCompanyForDetailedNotes,
  } = useEarningsContext();

  // useRef
  const audioLinkRef = useRef();

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
  const [pdfUpload, setPdfUpload] = useState(null);
  const [reload, setReload] = useState(0);
  const [fileType, setFiletype] = useState(null);
  const [uploadAudioLink, setUploadAudioLink] = useState(null);
  const [transcriptUploadFlag, setTranscriptUploadFlag] = useState(false);
  const [ResultsUploadFlag, setResultsUploadFlag] = useState(false);
  const [pptUploadFlag, setPPTUploadFlag] = useState(false);
  const [audioUploadFlag, setAudioUploadFlag] = useState(false);

  // Function to get the Selected Text from Transcript
  function handleMouseUpTranscript() {
    const selectedTextLocal = `${window.getSelection().toString()}`;
    if (
      $(window.getSelection().baseNode).closest("#transcript-id").attr("id") ==
      "transcript-id"
    ) {
      selectedTextLocal?.[0] &&
        setSelectedText(
          selectedTextLocal +
            `<p><span style="font-size: 10px"><em style="color: rgb(153, 153, 153);"><strong>Source: Transcript of "${details?.company_name}(${details?.quarter_source})"</strong></em></span><br></p>`
        );
    }
  }
  // Function to get the Selected Text from Transcript
  function handleMouseUpSummary() {
    const selectedTextLocal = `${window.getSelection().toString()}`;

    if (
      $(window.getSelection().baseNode).closest("#summary-id").attr("id") ==
      "summary-id"
    ) {
      selectedTextLocal?.[0] &&
        setSelectedText(
          selectedTextLocal +
            `<p><span style="font-size: 10px"><em style="color: rgb(153, 153, 153);"><strong>Source: Summary of "${details?.company_name}(${details?.quarter_source})"</strong></em></span><br></p>`
        );
    }
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
      console.log(details);
      apifetch();
      setPdfUpload(null);
      setFiletype(null);
      setTranscriptUploadFlag(false);
      setResultsUploadFlag(false);
      setPPTUploadFlag(false);
      setAudioUploadFlag(false);
    }
  }, [
    details?.audio,
    details?.sentiment,
    uid,
    cid,
    details?.result,
    details?.ppt,
    details?.fincode,
    reload,
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
    }
  }, [details]);

  useEffect(() => {
    setAudioFile(audio);
  }, [audio]);

  // PDF Upload API
  async function PDFUploadForAdmin(file) {
    var form_data = new FormData();
    form_data.append("file", file, file.name);
    const headers = { "Content-Type": file.type };
    file.name.includes(".pdf")
      ? await axios
          .post(
            "https://transcriptanalyser.com/gis/uploadpdf",
            form_data,

            headers
          )
          .then((data) => {
            setPdfUpload(data["data"]["link"]);
          })
      : alert("Please choose a PDF file!");
  }

  // Audio Upload API
  async function AudioUploadForAdmin(file) {
    var form_data = new FormData();
    form_data.append("file", file, file.name);
    const headers = { "Content-Type": file.type };
    file.name.includes(".mp3")
      ? await axios
          .post(
            "https://transcriptanalyser.com/gis/uploadmp3",
            form_data,

            headers
          )
          .then((data) => {
            setPdfUpload(data["data"]["link"]);
          })
      : alert("Please choose an Audio file!");
  }
  // Then Upload PDF Link
  useEffect(() => {
    async function PDFLinkUpload() {
      const res = await fetch(`https://transcriptanalyser.com/gis/manual-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdf_link: pdfUpload,
          calendar_id: cid,
          file_type: fileType,
        }),
      });
      res && setReload(reload + 1);
    }
    if (pdfUpload && fileType) {
      PDFLinkUpload();
    }
  }, [pdfUpload, fileType]);

  // Audio upload Direct Link
  async function AudioDefaultLinkUpload() {
    const res = await fetch(`https://transcriptanalyser.com/gis/manual-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        online_link: uploadAudioLink,
        calendar_id: cid,
        file_type: fileType,
      }),
    });
    res && setReload(reload + 1);
    const data = await res.json();
    console.log(data);
  }

  useEffect(() => {
    console.log(uploadAudioLink);
  }, [uploadAudioLink]);

  // Handle Transcript Upload
  const handleUploadTranscript = (e) => {
    PDFUploadForAdmin(e.target.files[0]);
    setFiletype("transcript");
  };

  // Handle Result Upload
  const handleUploadResult = (e) => {
    PDFUploadForAdmin(e.target.files[0]);
    setFiletype("result");
  };

  // Handle PPT Upload
  const handleUploadPPT = (e) => {
    PDFUploadForAdmin(e.target.files[0]);
    setFiletype("ppt");
  };

  // Handle Audio Upload
  const handleUploadAudio = (e) => {
    AudioUploadForAdmin(e.target.files[0]);
    setFiletype("audio");
  };

  function slideLeft() {
    var slider = document.getElementById("earningDetailsMenu");
    slider.scrollLeft -= 500;
  }
  function slideRight() {
    var slider = document.getElementById("earningDetailsMenu");
    slider.scrollLeft += 500;
  }

  // useEffect(() => {
  //   alert(`${stockGptUrl}/${fincode}`);
  // }, [stockGptUrl, fincode]);

  return (
    <div className="h-full bg-[#15385d]">
      <div className="flex flex-col w-full h-[calc(100vh-100px)] sm:h-full overflow-hidden">
        {/* Top Widgets Section */}
        <div className="flex text-white w-full h-full overflow-hidden p-2 gap-5">
          {/* Left Widgets */}
          <div
            onClick={() => setOutside(true)}
            className="flex flex-col h-full w-full justify-center items-center relative"
          >
            {/* ABsolute Table Button */}
            <div
              className={`${
                details?.earning_table == "none" && "hidden"
              } absolute right-[-10px] top-[150px] shadow-sm shadow-black`}
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
            <div className="flex gap-2 px-10 w-full">
              {/* Left Scroll */}
              <BsFillCaretLeftFill
                className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 md:hidden"
                size={20}
                onClick={slideLeft}
              />
              <div
                id={"earningDetailsMenu"}
                className="text-sm overflow-y-hidden font-[500] flex w-full gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide"
              >
                <button
                  onClick={handleTranscript}
                  className={`px-1 rounded-t-md ${
                    widgets.transcripts
                      ? "bg-[#0d2844] text-white"
                      : "bg-[#e2f1ff] text-black"
                  } ${
                    transcript?.length == 0 &&
                    !details?.pdf_link?.[0] &&
                    "text-gray-600 "
                  }`}
                >
                  Transcripts
                </button>
                <button
                  onClick={handleResults}
                  className={` px-1 rounded-t-md  ${
                    widgets.results
                      ? "bg-[#0d2844] text-white"
                      : "bg-[#e2f1ff] text-black"
                  } ${!result && "text-gray-600"}`}
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
                </button>
                <button
                  onClick={handlePpt}
                  className={`px-1 rounded-t-md  ${
                    widgets.ppt
                      ? "bg-[#0d2844] text-white"
                      : "bg-[#e2f1ff] text-black"
                  } ${!ppt && "text-gray-600"}`}
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
                  className={`px-1 rounded-t-md  ${
                    widgets.summary
                      ? "bg-[#0d2844] text-white"
                      : "bg-[#e2f1ff] text-black"
                  } ${summary?.length == 0 && "text-gray-600"}`}
                >
                  Summary
                </button>
                <button
                  onClick={handleSentiment}
                  className={`bg-[#0d2945] rounded-t-md  flex items-center justify-center gap-2 px-1 ${
                    widgets.sentiment
                      ? "bg-[#0d2844] text-white"
                      : "bg-[#e2f1ff] text-black"
                  } ${!sentiment && "text-gray-600"}`}
                >
                  <p>Sentiment analyser</p>
                  <RxExternalLink size={20} />
                </button>
                <button
                  onClick={handleBroker}
                  className={`px-1 rounded-t-md ${
                    widgets.broker
                      ? "bg-[#0d2844] text-white"
                      : "bg-[#e2f1ff] text-black"
                  } ${
                    !broker?.key?.[0] && "text-gray-600 border border-gray-700"
                  }`}
                >
                  Broker Radar
                </button>
              </div>
              {/* Right Scroll */}
              <BsFillCaretRightFill
                className="opacity-30 hover:opacity-80 cursor-pointer transition ease-in-out delay-50 md:hidden"
                size={20}
                onClick={slideRight}
              />
            </div>

            {/* Widgets Opened Fields */}
            <div
              id="scroll-element"
              className={`w-full h-full bg-white text-black border-2 border-[#0d2844] rounded-lg flex-col ${
                widgets.transcripts || widgets.summary
                  ? "overflow-x-auto"
                  : "overflow-hidden"
              }`}
            >
              {/* Transcript */}
              {
                <div
                  id="transcript-id"
                  onMouseUp={handleMouseUpTranscript}
                  onMouseOver={() => setOutside(true)}
                  className={`text-justify ${
                    widgets.transcripts ? "inline-block" : "hidden"
                  } p-2 ${
                    details?.transcript_pdf == "yes" && "w-full h-full"
                  } overflow-x-hidden`}
                >
                  {uid == 0 ? (
                    <div className="text-3xl animate-pulse underline">
                      Login to view transcript.
                    </div>
                  ) : !transcript ? (
                    <div className="text-3xl animate-pulse">Loading....</div>
                  ) : details?.transcript_pdf == "yes" ? (
                    <div className="w-full h-full">
                      <iframe
                        key={details?.pdf_link}
                        src={details?.pdf_link}
                        className="w-full h-[calc(100vh-300px)] sm:h-full overflow-hidden hidden sm:inline-block "
                      />
                      <a
                        href={details?.pdf_link}
                        className="sm:hidden animate-pulse flex justify-center"
                        target="_blank"
                      >
                        Click here to view Transcript!
                      </a>
                    </div>
                  ) : transcript?.[0] ? (
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
                  ) : (
                    <div className="p-5 text-center items-center w-full">
                      <p
                        className={`animate-pulse items-center text-2xl ${
                          transcriptUploadFlag && "hidden"
                        }`}
                      >
                        No Transcript available
                      </p>
                      {details?.admin_user_id.some((item) => item == uid) &&
                        (!transcriptUploadFlag ? (
                          <div>
                            <input
                              className="p-2 text-black bg-white rounded-xl"
                              type="file"
                              onChange={(e) => {
                                handleUploadTranscript(e);
                                e.target.files[0].name.includes(".pdf") &&
                                  setTranscriptUploadFlag(true);
                              }}
                            />
                            <div className="flex justify-between bg-white rounded-md px-1 mt-2">
                              <input
                                type="text"
                                placeholder="Upload Transcripts Link..."
                                className="outline-none text-lg text-black w-full pr-2"
                                onChange={(e) => {
                                  setUploadAudioLink(e.target.value);
                                  setFiletype("transcript");
                                }}
                              />
                              <button
                                // onClick={() => {
                                //   AudioDefaultLinkUpload();
                                //   setTranscriptUploadFlag(true);
                                // }}
                                onClick={() => {
                                  uploadAudioLink.includes(".pdf")
                                    ? (AudioDefaultLinkUpload(),
                                      setTranscriptUploadFlag(true))
                                    : alert("Insert a PDF link!");
                                }}
                                className="font-bold text-black hover:text-green-500"
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Loading Animation
                          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                            <span className="relative flex h-[80px] w-[80px]">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              }

              {/* Results */}
              {widgets.results &&
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
                    <div className="p-5 text-center items-center">
                      <p
                        className={`${
                          ResultsUploadFlag && "hidden"
                        } animate-pulse items-center text-2xl`}
                      >
                        Result not available
                      </p>
                      {details?.admin_user_id.some((item) => item == uid) &&
                        (!ResultsUploadFlag ? (
                          <div>
                            <input
                              className="p-2 text-black bg-white rounded-xl"
                              type="file"
                              onChange={(e) => {
                                handleUploadResult(e);
                                e.target.files[0].name.includes(".pdf") &&
                                  setResultsUploadFlag(true);
                              }}
                            />
                            <div className="flex justify-between bg-white rounded-md px-1 mt-2">
                              <input
                                type="text"
                                placeholder="Upload Transcripts Link..."
                                className="outline-none text-lg text-black w-full pr-2"
                                onChange={(e) => {
                                  setUploadAudioLink(e.target.value);
                                  setFiletype("result");
                                }}
                              />
                              <button
                                // onClick={() => {
                                //   AudioDefaultLinkUpload();
                                //   setResultsUploadFlag(true);
                                // }}
                                onClick={() => {
                                  uploadAudioLink.includes(".pdf")
                                    ? (AudioDefaultLinkUpload(),
                                      setPPTUploadFlag(true))
                                    : alert("Insert a PDF link!");
                                }}
                                className="font-bold text-black hover:text-green-500"
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Loading Animation
                          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                            <span className="relative flex h-[80px] w-[80px]">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-"></span>
                            </span>
                          </div>
                        ))}
                    </div>
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
                ))}

              {/* Broker */}
              {widgets.broker &&
                (broker == null ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
                  </div>
                ) : !broker?.key[0] ? (
                  <p className="p-5 text-2xl animate-pulse flex justify-center items-center">
                    Broker Radar not available
                  </p>
                ) : (
                  <div className="px-10 py-5 overflow-y-scroll flex flex-col gap-5 h-full">
                    {broker?.key?.map((item) => (
                      <Broker
                        key={item?.["Sr No"]}
                        date={item?.["REPORT DATE"]}
                        broker={item?.["BROKER NAME"]}
                        company={item?.["comp_name"]}
                        summary1={item?.["SUMMARY PT 1"]}
                        summary2={item?.["SUMMARY PT 2"]}
                        summary3={item?.["SUMMARY PT 3"]}
                        cmp={item?.["CMP"]}
                        tp={item?.["TP"]}
                        updown={item?.["UP/DOWN"]}
                      />
                    ))}
                  </div>
                ))}

              {/*PPT  */}
              {widgets.ppt &&
                (ppt == null ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
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
                  <div className="p-5 text-center items-center">
                    <p
                      className={`animate-pulse items-center text-2xl ${
                        pptUploadFlag && "hidden"
                      }`}
                    >
                      No PPT available
                    </p>
                    {details?.admin_user_id.some((item) => item == uid) &&
                      (!pptUploadFlag ? (
                        <div>
                          <input
                            className="p-2 text-black bg-white rounded-xl"
                            type="file"
                            onChange={(e) => {
                              handleUploadPPT(e);
                              e.target.files[0].name.includes(".pdf") &&
                                setPPTUploadFlag(true);
                            }}
                          />
                          <div className="flex justify-between bg-white rounded-md px-1 mt-2">
                            <input
                              type="text"
                              placeholder="Upload Transcripts Link..."
                              className="outline-none text-lg text-black w-full pr-2"
                              onChange={(e) => {
                                setUploadAudioLink(e.target.value);
                                setFiletype("ppt");
                              }}
                            />
                            <button
                              // onClick={() => {
                              //   AudioDefaultLinkUpload();
                              //   setPPTUploadFlag(true);
                              // }}
                              onClick={() => {
                                uploadAudioLink.includes(".pdf")
                                  ? (AudioDefaultLinkUpload(),
                                    setPPTUploadFlag(true))
                                  : alert("Insert a PDF link!");
                              }}
                              className="font-bold text-black hover:text-green-500"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Loading Animation
                        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                          <span className="relative flex h-[80px] w-[80px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-"></span>
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
              {/* Sentiment */}
              {widgets.sentiment &&
                (sentiment == null ? (
                  <div className="text-3xl animate-pulse flex justify-center items-center">
                    Loading....
                  </div>
                ) : sentiment ? (
                  <div>
                    <iframe
                      key={sentiment}
                      src={sentiment}
                      className="h-screen w-screen absolute left-0 top-0 bottom-0 bg-white z-[50]"
                    />
                    <button onClick={handleTranscript}>
                      <AiFillCloseCircle
                        size={50}
                        className=" absolute right-4 top-4 bottom-0 bg-white z-[50] text-[#132d49]"
                      />
                    </button>
                  </div>
                ) : (
                  <p className="p-5">Sentiment not available</p>
                ))}

              {/* Summary */}
              <div
                id="summary-id"
                onMouseUp={handleMouseUpSummary}
                onMouseOver={() => setOutside(true)}
                className={`text-justify ${
                  widgets.summary ? "inline-block" : "hidden"
                } p-2`}
              >
                {!summary ? (
                  <div className="text-3xl animate-pulse">Loading....</div>
                ) : (
                  widgets.summary &&
                  (summary?.[0] ? (
                    // Summary
                    <div>
                      <h1 className="text-2xl sm:text-3xl italic font-semibold px-3">
                        Summary :
                      </h1>
                      {summary?.map((items) => (
                        <div key={items} className="my-2">
                          <p className="text-sm sm:text-lg px-6">{items}</p>
                        </div>
                      ))}
                      {detailedSummary?.map((items) => (
                        <div key={items?.text} className="my-4">
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
            className={`lg:flex lg:justify-center lg:h-full lg:w-[600px] items-center rounded-lg absolute lg:relative sm:right-0 sm:w-auto left-0 sm:left-auto top-0 h-screen z-30 ${
              !stockGpt && "hidden"
            } 
          lg:${chat != "yes" && "hidden"}`}
          >
            <iframe
              key={fincode}
              src={`${stockGptUrl}/${fincode}`}
              className="bg-white rounded-lg  sm:h-[calc(100vh-90px)] shadow-2xl sm:w-[calc(100vh-250px)] w-screen h-screen lg:w-full lg:h-full"
            />
          </div>

          {/* Stock GPT Open/Close Buttons */}
          <div
            className={`flex gap-1 justify-end cursor-pointer absolute z-30 ${
              !stockGpt ? "bottom-[80px]" : "top-0 lg:bottom-[80px] lg:top-auto"
            }  right-0`}
          >
            {!stockGpt ? (
              <div
                className={` flex flex-col items-center rounded-lg text-white ${
                  chat != "yes" && "hidden"
                } lg:hidden `}
              >
                <BiMessageRoundedDots
                  onClick={() => setStockGpt(!stockGpt)}
                  size={40}
                  className="rounded-full bg-[#1e3e60] hover:bg-[#295584] p-1 "
                />
                <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                  Stock GPT
                </h1>
              </div>
            ) : (
              <div
                className={` flex flex-col items-center rounded-lg ${
                  chat != "yes" && "hidden"
                } lg:hidden `}
              >
                <BiMessageRoundedX
                  onClick={() => setStockGpt(!stockGpt)}
                  size={40}
                  className="rounded-full bg-white text-[#1e3e60] p-1 "
                />
                <h1 className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-[#28598d] ">
                  Stock GPT
                </h1>
              </div>
            )}
          </div>
        </div>
        {/* Bottom Audio Section*/}
        <div key={cid} className="absolute sm:relative bottom-0">
          {details?.admin_user_id.some((item) => item == uid) &&
            !audio?.[0] &&
            (!audioUploadFlag ? (
              <div className="flex gap-4 items-center">
                <input
                  className="p-2 text-black text-xs bg-white rounded-xl hidden"
                  type="file"
                  id="audioInput"
                  onChange={(e) => {
                    handleUploadAudio(e);
                    e.target.files[0].name.includes(".mp3") &&
                      setAudioUploadFlag(true);
                  }}
                />
                <label
                  htmlFor="audioInput"
                  className="text-white font-semibold hover:underline decoration-red-600 italic bg-[#091e37] text-sm "
                >
                  Upload Audio File
                </label>
                <p className="text-white text-xl">/</p>
                <div className="flex bg-white rounded-md px-1">
                  <input
                    // ref={audioLinkRef}
                    type="text"
                    placeholder="Upload Audio Link..."
                    className="outline-none text-sm"
                    onChange={(e) => {
                      setUploadAudioLink(e.target.value);
                      setFiletype("audio");
                    }}
                  />
                  <button
                    onClick={() => {
                      uploadAudioLink.includes(".mp3")
                        ? (AudioDefaultLinkUpload(), setAudioUploadFlag(true))
                        : alert("Insert an Audio link!");
                    }}
                    className="font-bold hover:text-green-500"
                  >
                    Upload
                  </button>
                </div>
              </div> // Loading Animation
            ) : (
              <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <span className="relative flex h-[80px] w-[80px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-"></span>
                </span>
              </div>
            ))}
          <AudioPlayer audio={audio} />
        </div>
      </div>
    </div>
  );
};

export default EarningsWidgetsPage;
