/* eslint-disable react-hooks/exhaustive-deps */
import { useEarningsContext } from "@/context/Context";
import moment from "moment/moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { BiReset, BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";
import { BsPlusCircleFill, BsSortNumericUpAlt } from "react-icons/bs";
import { MdRestorePage } from "react-icons/md";
import Select from "react-select";
import newNoteGif from "../../../src/assets/gifs/newNoteGif.gif";
import DetailedNotes from "./DetailedNote";
import dynamic from "next/dynamic";
import chroma from "chroma-js";

import ReactDOM from "react-dom";
import NoteEdit from "./NoteEdit";
import { useInfoContext } from "@/context/info";
import axios from "axios";
import SearchBar from "../GlobalComponents/SearchBar";
import { useRouter } from "next/router";

const Notes = ({ compByDetailPage }) => {
  const router = useRouter();

  // Contexts
  const {
    selectedText,
    setSelectedText,
    detailsPage,
    detailedNotes,
    setDetailedNotes,
    reloadNotes,
    setReloadNotes,
    masterNotesFlag,
    setMasterNotesFlag,
    compFilter,
    setCompFilter,
    editIsOn,
    setEditIsOn,
    outside,
    setOutside,
    noteEditID,
    setNoteEditID,
    defaultCompanyForDetailedNotes,
    setDefaultCompanyForDetailedNotes,
  } = useEarningsContext();

  const { uid, notesToggle, setNotesToggle } = useInfoContext();

  // Importing Jodit
  const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
  // const Editor = dynamic(() => import("../Notes/Editor"), {
  //   ssr: false,
  // });

  // JODIT Configuration
  const config = {
    zIndex: 0,
    readonly: false,
    autofocus: true,
    activeButtonsInReadOnly: ["source", "fullsize", "print", "about"],
    toolbarButtonSize: "middle",
    theme: "default",
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 420,
    direction: "ltr",
    language: "en",
    debugLanguage: false,
    i18n: "en",
    tabIndex: -1,
    toolbar: true,
    enter: "P",
    useSplitMode: false,
    // colorPickerDefaultTab: "background",
    imageDefaultWidth: 100,
    removeButtons: [
      "source",
      "about",
      "outdent",
      "indent",
      "video",
      "print",
      "superscript",
      "subscript",
      "file",
      "cut",
      "selectall",
      "colorPickerDefaultTab",
      "ul",
      "ol",
    ],
    disablePlugins: ["paste", "stat"],
    events: {},
    textIcons: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    placeholder: "Type your text here....",
    showXPathInStatusbar: false,
  };
  // React Select Color
  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      const color = chroma("#8e80f8");
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : "#000000",
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#002094"
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles) => {
      const color = chroma("#1a3c61");
      return {
        ...styles,
        backgroundColor: color.alpha(0.2).css(),
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#0f2339",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: "#0f2339",
      ":hover": {
        backgroundColor: "#0f2339",
        color: "white",
      },
    }),
  };

  //References
  const selectCompRef = useRef();
  const addCompanyRef = useRef();

  //Hooks
  const [noteMaster, setNoteMaster] = useState(null);
  const [selectedDetailedNotes, setSelectedDetailedNotes] = useState(null);
  const [selectedDetailedCompany, setSelectedDetailedCompany] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  const [newNoteFlag, setNewNoteFlag] = useState(false);
  const [addCompany, setAddCompany] = useState(null);
  const [newNoteText, setNewNoteText] = useState(null);
  const [companyState, setCompanyState] = useState(null);
  const [oldest, setOldest] = useState(false);
  const [options, setOptions] = useState([]);

  // ...........Functions...........
  // Fetching Notes
  async function noteMasterFetch() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-master2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uid,
      }),
    });
    const data = await res.json();
    setNoteMaster(data);

    // Resetting hooks after posting note
    setAddCompany(null);
    addCompanyRef?.current?.clearValue();
  }
  // Post New Note
  async function postNewNoteFunc() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-create2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uid,
        note_html: newNoteText,
        comp_fincode: String(addCompany),
      }),
    });
    setReloadNotes(reloadNotes + 1);
    setNewNoteFlag(false);
    setSelectedText(null);
    setNewNoteText(null);
  }
  // Restore Notes
  async function restoreNotesFunc() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-restore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uid,
      }),
    });
    setReloadNotes(reloadNotes + 1);
  }

  // ...........useEffects...........
  // Fetching Note Master
  useEffect(() => {
    uid && noteMasterFetch();
  }, [uid, reloadNotes]);

  // Highlighting text Feature
  useEffect(() => {
    if (selectedText?.length > 0 && newNoteText == null && !editIsOn) {
      setNewNoteText(selectedText);
    } else if (selectedText?.length > 0 && newNoteText != null && !editIsOn) {
      setNewNoteText(newNoteText + "<br/>" + selectedText);
    } else {
      setNewNoteText("");
    }
  }, [selectedText]);

  // useEffect(() => {
  //   newNoteText != selectedText && setSelectedText(null);
  // }, [newNoteText]);

  useEffect(() => {
    selectedText && !editIsOn && setNewNoteFlag(true);
  }, [selectedText]);

  useEffect(() => {
    editIsOn && setNewNoteFlag(false);
  }, [editIsOn]);

  // Closing New Note Box and Closing DetailedNote page
  // useEffect(() => {
  //   !detailsPage && setNewNoteFlag(false);
  //   // setDetailedNotes(false);
  // }, [detailsPage]);

  // Detailed Notes with
  useEffect(() => {
    compFilter
      ? setDetailedNotes(true)
      : (setDetailedNotes(false), selectCompRef?.current?.clearValue());
  }, [compFilter]);

  // Setting Initial company state
  useEffect(() => {
    compByDetailPage && setCompanyState(compByDetailPage);
  }, [compByDetailPage]);

  // Setting Company for New Note when on Details Page of Earning calander
  useEffect(() => {
    compByDetailPage &&
      (setCompanyState(compByDetailPage),
      setAddCompany(compByDetailPage.FINCODE));

    !compByDetailPage &&
      detailedNotes &&
      (setCompanyState(defaultCompanyForDetailedNotes),
      setAddCompany(defaultCompanyForDetailedNotes.FINCODE));
  }, [newNoteFlag, defaultCompanyForDetailedNotes]);

  useEffect(() => {
    setCompanyState(defaultCompanyForDetailedNotes);
    setAddCompany(defaultCompanyForDetailedNotes.FINCODE);
  }, [defaultCompanyForDetailedNotes]);

  // NEW COMP DROPDOWN
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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

  useEffect(() => {
    !detailedNotes && setCompanyState(null);
  }, [detailedNotes]);

  return (
    <div>
      {/* .....HEADER Start..... */}
      <div>
        {/* Colorbars for design */}
        <div>
          <div className="bg-[#031638] py-1"></div>
          <div className="bg-[#143a65] py-1"></div>
          <div className="bg-[#1f60a7] py-1"></div>
        </div>
        {/* Heading and Closing button */}
        <div className="px-3 py-1 flex justify-between items-center text-[#14395d] ">
          <h1 className="text-4xl font-semibold border-b-2 border-gray-300 flex-1">
            NOTES
          </h1>
          <AiOutlineCloseCircle
            onClick={() => setNotesToggle(false)}
            className="hover:text-[#2362a1] cursor-pointer"
            size={40}
          />
        </div>
        {/* Filters*/}
        {uid > 0 && (
          <div className={`${(detailedNotes || noteEditID) && "hidden"}`}>
            <div className="flex flex-col justify-between items-center px-3 py-2 gap-1">
              {/* Filter Options */}
              <div
                className={`flex gap-2 w-full items-center bg-white  justify-between`}
              >
                {/* Companies*/}
                {/* <Select
                ref={selectCompRef}
                className="text-[#0d2843] font-semibold text-sm w-full max-w-[250px]"
                options={searchOptions}
                placeholder="Select any Company"
                onInputChange={(input) => {
                  setSearchInput(input);
                }}
                onChange={(values) => {
                  values
                    ? (setCompFilter(values?.value),
                      setSelectedComp(values?.label),
                      setDefaultCompanyForDetailedNotes({
                        Company_Name: values?.label,
                        FINCODE: values?.value,
                      }))
                    : (setCompFilter(null),
                      setSelectedComp(null),
                      setDefaultCompanyForDetailedNotes({
                        Company_Name: "",
                        FINCODE: "",
                      }));
                }}
                // isOptionDisabled={(option) => option.isdisabled}
                isClearable="true"
                filterOption={customFilterOption}
              /> */}
                <div className="flex-1 h-full">
                  <SearchBar
                    placeholder={"Select any Company..."}
                    handleChange={(values) => {
                      values
                        ? (setCompFilter(values?.value),
                          setSelectedComp(values?.label),
                          setDefaultCompanyForDetailedNotes({
                            Company_Name: values?.label,
                            FINCODE: values?.value,
                          }))
                        : (setCompFilter(null),
                          setSelectedComp(null),
                          setDefaultCompanyForDetailedNotes({
                            Company_Name: "",
                            FINCODE: "",
                          }));
                    }}
                  />
                </div>

                {/* Sorting */}
                <div className="text-xs flex flex-col rounded-md overflow-hidden">
                  <div
                    onClick={() => setOldest(false)}
                    className={`flex items-center cursor-pointer pl-1 ${
                      !oldest
                        ? "bg-[#143a65] text-white"
                        : "bg-gray-300 text-gray-500 hover:bg-[#297eda] hover:text-white"
                    }    justify-between  px-1`}
                  >
                    <p className="font-semibold">Newest</p>
                    <BiSortDown size={18} />
                  </div>
                  <div
                    onClick={() => setOldest(true)}
                    className={`flex items-center cursor-pointer pl-1 ${
                      oldest
                        ? "bg-[#143a65] text-white"
                        : "bg-gray-300 text-gray-500 hover:bg-[#297eda] hover:text-white"
                    }  justify-between px-1`}
                  >
                    <p className="font-semibold">Oldest</p>
                    <BiSortUp size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* .....HEADER End..... */}

      {uid > 0 ? (
        <div>
          {/* .....MAIN Start..... */}
          {!detailedNotes && !noteEditID ? (
            <div
              className={`px-3 ${
                compFilter == null
                  ? "h-[calc(100vh-300px)] sm:h-[calc(100vh-190px)]"
                  : "h-[calc(100vh-330px)] sm:h-[calc(100vh-220px)]"
              }  overflow-y-auto flex flex-col gap-3`}
            >
              {noteMaster == null ? (
                // Loading Animation
                <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                  <span className="relative flex h-[80px] w-[80px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-"></span>
                  </span>
                </div>
              ) : !noteMaster?.key?.[0] ? (
                <div className="h-[calc(100vh-200px)] flex flex-col text-center items-center justify-center gap-5">
                  <h1 className="text-gray-400 rounded-md text-3xl">
                    &#34;Start taking notes, just select the info that is useful
                    to you&#34;
                  </h1>
                  <div className="relative w-full overflow-hidden border-2 border-[#031638] rounded-md h-[96px]">
                    <Image src={newNoteGif} alt="my-gif" />
                  </div>
                </div>
              ) : // Mapping Note Master
              oldest ? (
                noteMaster?.key.toReversed().map((item) => (
                  <div
                    key={item?.comp_fincode}
                    onClick={() => {
                      setCompFilter(item?.comp_fincode);
                      setSelectedComp(item?.comp_name);
                      setDefaultCompanyForDetailedNotes({
                        Company_Name: item?.comp_name,
                        FINCODE: item?.comp_fincode,
                      });
                    }}
                    className="border-2 border-gray-300 hover:border-gray-400 p-2 rounded-md cursor-pointer bg-gray-100 shadow-md hover:bg-white"
                  >
                    {/* Company Name */}
                    <h1 className="font-bold text-lg text-[#1a396e] underline underline-offset-2 decoration-red-600">
                      {item?.comp_name}
                    </h1>
                    <p className="text-xs font-semibold text-gray-500 italic">
                      Last updated: {item?.DateUpdated}
                    </p>
                  </div>
                ))
              ) : (
                noteMaster?.key.map((item) => (
                  <div
                    key={item?.comp_fincode}
                    onClick={() => {
                      setCompFilter(item?.comp_fincode);
                      setSelectedComp(item?.comp_name);
                      setDefaultCompanyForDetailedNotes({
                        Company_Name: item?.comp_name,
                        FINCODE: item?.comp_fincode,
                      });
                    }}
                    className="border-2 border-gray-300 hover:border-gray-400 p-2 rounded-md cursor-pointer bg-gray-100 shadow-md hover:bg-white"
                  >
                    {/* Company Name */}
                    <h1 className="font-bold text-lg text-[#1a396e] underline underline-offset-2 decoration-red-600">
                      {item?.comp_name}
                    </h1>
                    <p className="text-xs font-semibold text-gray-500 italic">
                      Last updated: {item?.DateUpdated}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : detailedNotes && !noteEditID ? (
            <DetailedNotes
              uid={uid}
              fincode={compFilter}
              compName={selectedComp}
            />
          ) : (
            noteEditID && <NoteEdit />
          )}
          {/* .....MAIN End..... */}

          {/* .....ABSOLUTE Components..... */}
          {/* BLACK OVERLAY START */}
          <div
            className={`bg-black/50 w-full h-full absolute z-10 top-0
        ${!newNoteFlag && "hidden"}`}
          ></div>
          {/* BLACK OVERLAY Ends */}

          {/* Plus Button Start */}
          <div
            onClick={() => setNewNoteFlag(!newNoteFlag)}
            className={`p-3 absolute z-30 bottom-0 right-0 ${
              noteEditID && "hidden"
            }`}
          >
            <BsPlusCircleFill
              className="text-[#091e37] hover:text-[#1d558e] cursor-pointer"
              size={40}
            />
          </div>

          {/* Restore all Notes Button */}
          <div
            onClick={restoreNotesFunc}
            className={`text-gray-400 p-3 absolute z-20 bottom-0 group left-0 flex items-end cursor-pointer ${
              noteEditID && "hidden"
            }`}
          >
            <MdRestorePage
              className="group-hover:text-[#1d558e] cursor-pointer"
              size={30}
            />
            <span className="text-xl group-hover:text-[#1d558e]">
              Restore Notes
            </span>
          </div>

          {/* New NOTE Box */}
          <div
            key={defaultCompanyForDetailedNotes}
            className={`w-full h-full flex flex-col justify-center gap-2 absolute z-20 top-0 ${
              !newNoteFlag && "hidden"
            } p-5 `}
          >
            <div className="text-white font-bold italic text-2xl flex justify-center items-center relative bg-white/80 rounded-md">
              <h1 className="text-[#0d2843] px-2 py-1 rounded-md underline decoration-red-600 underline-offset-2">
                New Note
              </h1>
              <AiFillCloseCircle
                size={40}
                onClick={() => setNewNoteFlag(false)}
                className="text-[#122334] absolute right-0 cursor-pointer hover:text-[#4384c6]"
              />
            </div>
            {/* Add Company*/}
            <div className="bg-white p-1 rounded-md">
              {/* <Select
            ref={addCompanyRef}
            className="text-[#0d2843] font-bold text-sm flex-1 z-40 "
            options={noteMaster?.comp_dropdown}
            getOptionLabel={(option) => option.Company_Name}
            getOptionValue={(option) => option.FINCODE}
            placeholder="Select a Company"
            isClearable="true"
            onChange={(values) =>
              values
                ? setAddCompany(values.FINCODE, setCompanyState(values))
                : (setAddCompany(null), setCompanyState(null))
            }
            defaultValue={{ Company_Name: selectedComp, FINCODE: compFilter }}
            value={companyState}
          /> */}
              {/* <Select
            // ref={addCompanyRef}
            className="text-[#0d2843] font-bold text-sm flex-1 z-40 "
            options={options}
            // getOptionLabel={(option) => option.Company_Name}
            // getOptionValue={(option) => option.FINCODE}
            placeholder="Select a Company"
            onInputChange={(e) => setSearchInput(e)}
            isClearable="true"
            onChange={(values) =>
              values
                ? setAddCompany(
                    values.label,
                    setCompanyState({
                      Company_Name: values?.label,
                      FINCODE: values?.value,
                    })
                  )
                : (setAddCompany(null), setCompanyState(null))
            }
            defaultValue={{ Company_Name: selectedComp, FINCODE: compFilter }}
            value={companyState}
          /> */}
              <div className="flex-1 h-full">
                <SearchBar
                  ref={addCompanyRef}
                  placeholder={
                    companyState?.Company_Name
                      ? companyState?.Company_Name
                      : // : selectedComp
                        // ? selectedComp
                        `Select any Company...`
                  }
                  handleChange={(values) =>
                    values
                      ? setAddCompany(
                          values.value,

                          setCompanyState({
                            Company_Name: values.label,
                            FINCODE: values.value,
                          })
                        )
                      : (setAddCompany(null), setCompanyState(null))
                  }
                />
              </div>
            </div>
            {/* Jodit-Rich Text Editor */}
            <div className="bg-white p-1 rounded-md">
              <JoditEditor
                config={config}
                value={newNoteText}
                onBlur={(content) => {
                  setNewNoteText(content);
                }}
                tabIndex={1}
              />
            </div>
            {/* Post Button */}
            <div className="flex justify-end">
              {addCompany ? (
                <button
                  onClick={postNewNoteFunc}
                  className="bg-[#0d2843] text-xl font-semibold text-white rounded-md px-2 "
                >
                  Post
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-xl font-semibold text-gray-500 cursor-not-allowed rounded-md px-2 "
                >
                  Post
                </button>
              )}
            </div>
          </div>
          {/* .....ABSOLUTE Components Ends here..... */}
        </div>
      ) : (
        <div className="text-gray-500 hover:text-[#173c5f] font-semibold text-lg hover:underline h-full w-full flex justify-center items-center cursor-pointer ">
          <div
            onClick={() => router.push("/loginpage")}
            className="border-2 border-gray-500 hover:border-[#173c5f] rounded-md px-2 py-1"
          >
            Login to access NOTES!
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
