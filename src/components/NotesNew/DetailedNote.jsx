import { useEarningsContext } from "@/context/Context";
import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { RiDeleteBin2Line } from "react-icons/ri";
import {
  BiDotsVerticalRounded,
  BiPlus,
  BiSortDown,
  BiSortUp,
} from "react-icons/bi";
import moment from "moment/moment";
import Select from "react-select";
import dynamic from "next/dynamic";
import chroma from "chroma-js";
import Image from "next/image";
import deleteimage from "../../assets/images/companieslogo/deleteimage.png";
import newNoteGif from "../../../src/assets/gifs/newNoteGif.gif";
import { AiFillCloseCircle } from "react-icons/ai";
import SearchBar from "../GlobalComponents/SearchBar";

const DetailedNotes = ({ uid, fincode, compName }) => {
  // Importing Jodit
  const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
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
    placeholder: "",
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
      const color = chroma("#1174de");
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
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

  // Contexts
  const {
    // noteRemoveContext,
    // setNoteRemoveContext,
    // noteIdContext,
    // setNoteIdContext,
    selectedText,
    setSelectedText,
    // noteFlag,
    // setNoteFlag,
    // tagsContext,
    // setTagsContext,
    // detailedNotes,
    setDetailedNotes,
    reloadNotes,
    setReloadNotes,
    compFilter,
    setCompFilter,
    editIsOn,
    setEditIsOn,
    outside,
    setOutside,
    noteEditID,
    setNoteEditID,
    currentNoteText,
    setCurrentNoteText,
    noteIsSavingID,
    setNoteIsSavingID,
    noteIsSaving,
    setNoteIsSaving,
    defaultCompanyForDetailedNotes,
    setDefaultCompanyForDetailedNotes,
  } = useEarningsContext();

  // References
  const changeCompRef = useRef();

  // HOOKS
  const [note, setNote] = useState(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [reloadLocal, setReloadLocal] = useState(0);
  const [dotFlag, setDotFlag] = useState(false);
  const [changeCompFlag, setChangeCompFlag] = useState(false);
  const [oldest, setOldest] = useState(false);

  //FUNCTIONS
  // Fetch NoteHTML
  async function fetchNotes() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-detail2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uid,
        comp_fincode: String(fincode),
      }),
    });
    const data = await res.json();
    setNote(data);
  }
  // DELETE Note
  async function deleteNoteFunc() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: deleteId,
      }),
    });
    setNote(null);
    setDeleteId(null);
    setDeleteFlag(false);
    setReloadLocal(reloadLocal + 1);
    setReloadNotes(reloadNotes + 1);
  }
  // Change COMPANY
  async function changeCompanyFunc(id, fincode) {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/note-edit-comp2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note_id: id,
          comp_fincode: fincode,
        }),
      }
    );
    setReloadNotes(reloadNotes + 1);
  }

  // USE EFFECTS
  //Fetching Notes
  useEffect(() => {
    uid && fincode && fetchNotes();
  }, [uid, fincode, reloadLocal]);
  useEffect(() => {
    setNoteIsSaving(false);
    setNoteIsSavingID(null);
  }, [note]);

  // Reload when new note is added
  useEffect(() => {
    setNote(null);
    setReloadLocal(reloadLocal + 1);
  }, [reloadNotes]);

  return (
    <div className="px-3 py-2">
      {/* HEADER Start */}
      <div className="flex items-center gap-2 relative border-b-2 border-[#14395d] p-1">
        <div className="text-[#091e37] hover:text-white hover:bg-[#14395d]/95 hover:rounded-md cursor-pointer">
          <BsArrowLeft onClick={() => setCompFilter(null)} size={35} />
        </div>

        {/* Companies*/}
        {/* <div className="flex-1">
          <Select
            ref={changeCompRef}
            className="text-[#0d2843] font-semibold text-md flex-1"
            options={note?.comp_dropdown}
            getOptionLabel={(option) => option.Company_Name}
            getOptionValue={(option) => option.FINCODE}
            defaultValue={defaultCompanyForDetailedNotes}
            placeholder="Company"
            isClearable="true"
            onChange={(values) => {
              values
                ? (setCompFilter(values.FINCODE),
                  setDefaultCompanyForDetailedNotes({
                    Company_Name: values?.Company_Name,
                    FINCODE: values?.FINCODE,
                  }),
                  setNote(null))
                : (setCompFilter(null),
                  setNote(null),
                  setDefaultCompanyForDetailedNotes({
                    Company_Name: "",
                    FINCODE: "",
                  }));
            }}
            color="#0d2843"
          />
        </div> */}
        <div className="flex-1 h-full">
          <SearchBar
            ref={changeCompRef}
            placeholder={
              defaultCompanyForDetailedNotes?.Company_Name[0]
                ? defaultCompanyForDetailedNotes?.Company_Name
                : `Select any Company...`
            }
            handleChange={(values) => {
              values
                ? (setCompFilter(values.value),
                  setDefaultCompanyForDetailedNotes({
                    Company_Name: values?.label,
                    FINCODE: values?.value,
                  }),
                  setNote(null))
                : (setCompFilter(null),
                  setNote(null),
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
            <p className="font-bold">Newest</p>
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
            <p className="font-bold">Oldest</p>
            <BiSortUp size={18} />
          </div>
        </div>
      </div>
      {/* HEADER End */}

      {/* MAIN Start */}
      <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-185px)] overflow-y-auto flex flex-col border-b-2 border-[#14395d]">
        {!note?.key[0] && note != null ? (
          <div className="h-[calc(100vh-200px)] flex flex-col text-center items-center justify-center gap-5">
            <h1 className="text-gray-400 rounded-md text-3xl">
              &#34;Start taking notes, just select the info that is useful to
              you&#34;
            </h1>
            <div className="relative w-full overflow-hidden border-2 border-[#031638] rounded-md h-[96px]">
              <Image src={newNoteGif} alt="my-gif" />
            </div>
          </div>
        ) : note?.key[0] && note != null && oldest ? (
          note?.key?.toReversed().map((item) => (
            <div
              key={item?.note_id}
              className="border-b-2 border-gray-300 py-1"
            >
              {/* Note CARD Start*/}
              <div className="p-1 rounded-md">
                {/* Date and Delete Button */}
                <div className="flex justify-between pb-1">
                  {/* Date */}
                  <div className="text-xs font-semibold text-gray-400 group-hover:text-gray-500 italic">
                    <p className="text-gray-500">
                      {moment
                        .utc(item?.DateUpdated)
                        .format("MMMM Do, YYYY hh:mma")}
                    </p>
                    <p
                      className={`text-xs text-[#1f60a7] animate-pulse pl-1 ${
                        !(noteIsSaving && noteIsSavingID == item?.note_id) &&
                        "hidden"
                      }`}
                    >
                      Updating the Note...
                    </p>
                    {/* <p className="text-gray-500">
                      {moment.utc(note?.DateInserted).format("h:mmA")}
                    </p> */}
                  </div>
                  {/* Menu Button */}
                  <div
                    onClick={() => {
                      setDotFlag(true);
                      setDeleteId(item?.note_id);
                    }}
                    onBlur={() =>
                      !changeCompFlag &&
                      !deleteFlag &&
                      setTimeout(() => {
                        setDotFlag(false);
                      }, "400")
                    }
                    className="relative"
                  >
                    <button>
                      <BiDotsVerticalRounded className="text-black hover:text-white hover:bg-black/80 rounded-full cursor-pointer transition delay-50" />
                    </button>
                    {dotFlag && deleteId == item?.note_id && (
                      <div className="flex flex-col absolute right-0 text-xs font-semibold bg-[#031638]/90 text-white rounded-sm z-30 whitespace-nowrap">
                        <div
                          onClick={() => {
                            setDeleteFlag(false);
                            setChangeCompFlag(true);
                            setDotFlag(false);
                          }}
                          className="hover:bg-[#1f60a7] p-1 cursor-pointer"
                        >
                          Change Company
                        </div>
                        <hr />
                        <p
                          onClick={() => {
                            setDeleteFlag(true);
                            setChangeCompFlag(false);
                            setDotFlag(false);
                          }}
                          className="hover:bg-red-600 p-1 cursor-pointer"
                        >
                          Delete note
                        </p>
                      </div>
                    )}
                    {/* <RiDeleteBin2Line
                      onClick={() => {
                        setDeleteFlag(true);
                        setDeleteId(item?.note_id);
                      }}
                      className="text-red-400 hover:text-red-700 cursor-pointer"
                      size={25}
                    /> */}
                  </div>
                </div>
                {/* Change Company */}
                {/* {changeCompFlag && deleteId == item?.note_id && (
                  <Select
                    key={item?.note_id}
                    className="text-[#0d2843] font-bold text-md flex-1"
                    options={note?.comp_dropdown}
                    getOptionLabel={(option) => option.Company_Name}
                    getOptionValue={(option) => option.FINCODE}
                    placeholder="Change Company"
                    isClearable="true"
                    onChange={(values) => {
                      values &&
                        (changeCompanyFunc(item?.note_id, values?.FINCODE),
                        setNote(null),
                        console.log(item?.note_id),
                        console.log(values.FINCODE));
                    }}
                    color="#0d2843"
                    onBlur={() => {
                      setChangeCompFlag(false);
                    }}
                    autoFocus="true"
                  />
                )} */}

                {changeCompFlag && deleteId == item?.note_id && (
                  <div className="flex-1 h-full">
                    <SearchBar
                      placeholder={
                        defaultCompanyForDetailedNotes?.Company_Name[0]
                          ? defaultCompanyForDetailedNotes?.Company_Name
                          : `Select any Company...`
                      }
                      handleChange={(values) => {
                        values &&
                          (changeCompanyFunc(item?.note_id, values?.value),
                          setNote(null));
                      }}
                    />
                  </div>
                )}
                <div
                  className="text-justify hover:bg-gray-300/60 cursor-text px-1 rounded-md transition delay-50"
                  onClick={() => {
                    setNoteEditID(item?.note_id);
                    setCurrentNoteText(item?.note_html);
                    setEditIsOn(true);
                  }}
                  dangerouslySetInnerHTML={{ __html: item?.note_html }}
                ></div>
              </div>
              {/* NOTE CARD End*/}
            </div>
          ))
        ) : note?.key[0] && note != null && !oldest ? (
          note?.key?.map((item) => (
            <div
              key={item?.note_id}
              className="border-b-2 border-gray-300 py-1"
            >
              {/* Note CARD Start*/}
              <div className="p-1 rounded-md">
                {/* Date and Delete Button */}
                <div className="flex justify-between pb-1">
                  {/* Date */}
                  <div className="text-xs font-semibold text-gray-400 group-hover:text-gray-500 italic">
                    <p className="text-gray-500">
                      {moment
                        .utc(item?.DateUpdated)
                        .format("MMMM Do, YYYY hh:mma")}
                    </p>
                    <p
                      className={`text-xs text-[#1f60a7] animate-pulse pl-1 ${
                        !(noteIsSaving && noteIsSavingID == item?.note_id) &&
                        "hidden"
                      }`}
                    >
                      Updating the Note...
                    </p>
                    {/* <p className="text-gray-500">
                      {moment.utc(note?.DateInserted).format("h:mmA")}
                    </p> */}
                  </div>
                  {/* Menu Button */}
                  <div
                    onClick={() => {
                      setDotFlag(true);
                      setDeleteId(item?.note_id);
                    }}
                    onBlur={() =>
                      !changeCompFlag &&
                      !deleteFlag &&
                      setTimeout(() => {
                        setDotFlag(false);
                      }, "400")
                    }
                    className="relative"
                  >
                    <button>
                      <BiDotsVerticalRounded className="text-black hover:text-white hover:bg-black/80 rounded-full cursor-pointer transition delay-50" />
                    </button>
                    {dotFlag && deleteId == item?.note_id && (
                      <div className="flex flex-col absolute right-0 text-xs font-semibold bg-[#031638]/90 text-white rounded-sm z-30 whitespace-nowrap">
                        <div
                          onClick={() => {
                            setDeleteFlag(false);
                            setChangeCompFlag(true);
                            setDotFlag(false);
                          }}
                          className="hover:bg-[#1f60a7] p-1 cursor-pointer"
                        >
                          Change Company
                        </div>
                        <hr />
                        <p
                          onClick={() => {
                            setDeleteFlag(true);
                            setChangeCompFlag(false);
                            setDotFlag(false);
                          }}
                          className="hover:bg-red-600 p-1 cursor-pointer"
                        >
                          Delete note
                        </p>
                      </div>
                    )}
                    {/* <RiDeleteBin2Line
                      onClick={() => {
                        setDeleteFlag(true);
                        setDeleteId(item?.note_id);
                      }}
                      className="text-red-400 hover:text-red-700 cursor-pointer"
                      size={25}
                    /> */}
                  </div>
                </div>
                {/* Change Company */}
                {/* {changeCompFlag && deleteId == item?.note_id && (
                  <Select
                    key={item?.note_id}
                    className="text-[#0d2843] font-bold text-md flex-1"
                    options={note?.comp_dropdown}
                    getOptionLabel={(option) => option.Company_Name}
                    getOptionValue={(option) => option.FINCODE}
                    placeholder="Change Company"
                    isClearable="true"
                    onChange={(values) => {
                      values &&
                        (changeCompanyFunc(item?.note_id, values?.FINCODE),
                        setNote(null),
                        console.log(item?.note_id),
                        console.log(values.FINCODE));
                    }}
                    color="#0d2843"
                    onBlur={() => {
                      setChangeCompFlag(false);
                    }}
                    autoFocus="true"
                  />
                )} */}

                {changeCompFlag && deleteId == item?.note_id && (
                  <div className="flex-1 h-full">
                    <SearchBar
                      placeholder={
                        defaultCompanyForDetailedNotes?.Company_Name[0]
                          ? defaultCompanyForDetailedNotes?.Company_Name
                          : `Select any Company...`
                      }
                      handleChange={(values) => {
                        values &&
                          (changeCompanyFunc(item?.note_id, values?.value),
                          setNote(null));
                      }}
                      onBlur={() => setChangeCompFlag(false)}
                      autofocus={"true"}
                    />
                  </div>
                )}
                <div
                  className="text-justify hover:bg-gray-300/60 cursor-text px-1 rounded-md transition delay-50"
                  onClick={() => {
                    setNoteEditID(item?.note_id);
                    setCurrentNoteText(item?.note_html);
                    setEditIsOn(true);
                  }}
                  dangerouslySetInnerHTML={{ __html: item?.note_html }}
                ></div>
              </div>
              {/* NOTE CARD End*/}
            </div>
          ))
        ) : (
          // Loading Animation
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <span className="relative flex h-[80px] w-[80px]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-"></span>
            </span>
          </div>
        )}
      </div>
      {/* MAIN End */}

      {/* ABSOLUTE Components */}
      {/* Delete Note */}
      <div
        className={`bg-black/50 w-full h-full absolute z-10 top-0
        ${!deleteFlag && "hidden"}`}
      >
        <div
          className={` flex flex-col justify-center items-center h-full w-full`}
        >
          {/* Actual Delete Card */}
          <div className="w-[250px] h-[150px] rounded-md bg-white flex flex-col justify-between overflow-hidden shadow-md">
            <div className="flex justify-between items-center">
              <h1 className="font-bold italic pl-1 text-center">
                Are you sure you want to delete this Note?
              </h1>
              <Image src={deleteimage} alt="Delete Image" />
            </div>
            <p className="text-sm italic text-gray-500 text-center">
              &quot;Don&apos;t worry you can Restore them anytime?&quot;
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setDeleteFlag(false);
                  setDeleteId(null);
                }}
                className="flex-1 bg-[#c2c2c2] hover:bg-[#dfdfdf] p-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteNoteFunc();
                }}
                className="flex-1 bg-[#d05555] hover:bg-[#ff5d5d] text-white p-2 font-semibold"
              >
                Yes, I am sure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedNotes;
