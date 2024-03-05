import { useEarningsContext } from "@/context/Context";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AiFillCaretDown,
  AiFillCloseCircle,
  AiFillDelete,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BsPinAngleFill, BsPlusCircleFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BiCross, BiPlus, BiPlusCircle, BiReset } from "react-icons/bi";
import NoteCard1 from "./NoteCard";
import deleteimage from "../../../../assets/images/companieslogo/deleteimage.png";
import newNoteGif from "../../../../assets/gifs/newNoteGif.gif";

import dynamic from "next/dynamic";

import {
  MdFilter,
  MdFilterAlt,
  MdResetTv,
  MdRestorePage,
  MdSettingsBackupRestore,
} from "react-icons/md";
import Select from "react-select";
import axios from "axios";
import Image from "next/image";

const Notes = ({ userId, fincode }) => {
  const {
    noteRemoveContext,
    setNoteRemoveContext,
    noteIdContext,
    setNoteIdContext,
    selectedText,
    setSelectedText,
    noteFlag,
    setNoteFlag,
    tagsContext,
    setTagsContext,
  } = useEarningsContext();

  // JODIT LEARN
  const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = {
    zIndex: 0,
    readonly: false,
    activeButtonsInReadOnly: ["source", "fullsize", "print", "about"],
    toolbarButtonSize: "middle",
    theme: "default",
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 220,
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

  useEffect(() => {
    console.log(content);
  }, [content]);

  //References
  const selectComp = useRef();
  const selectCustCat = useRef();
  const selectPreCat = useRef();
  const selectSector = useRef();

  // States
  const [noteMaster, setNoteMaster] = useState(null);
  const [sortedNoteMaster, setSortedNoteMaster] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [newNoteFlag, setNewNoteFlag] = useState(false);
  const [tagsforpost, setTagsforpost] = useState([]);
  const [uniqueTagsforpost, setUniquetagsforpost] = useState([]);
  const [filterId, setFilterId] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [filterTypeFlag, setFilterTypeFlag] = useState("all");
  const [filterFlag, setFilterFlag] = useState(false);
  const [addedCatTags, setAddedCatTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [companyFlag, setCompanyFlag] = useState(true);
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [preCatFlag, setPreCatFlag] = useState(false);
  const [custCatFlat, setCustCatFlag] = useState(false);
  const [imgList, setImgList] = useState([]); // already uploaded
  const [newImages, setNewImages] = useState([]); // new post images

  useEffect(() => {
    if (selectedText?.length > 0) {
      setNewNote(newNote + "\n" + selectedText);
    }
  }, [selectedText]);

  useEffect(() => {
    newNote != selectedText && setSelectedText(null);
  }, [newNote]);

  useEffect(() => {
    fincode && addTagforpost(fincode, "company");
  }, [selectedText, fincode, noteRemoveContext]);

  useEffect(() => {
    filterTypeFlag == "company" &&
      (selectCustCat?.current?.clearValue(),
      selectSector?.current?.clearValue(),
      selectPreCat?.current?.clearValue());
    filterTypeFlag == "preCategory" &&
      (selectComp?.current?.clearValue(),
      selectSector?.current?.clearValue(),
      selectCustCat?.current?.clearValue());
    filterTypeFlag == "custCategory" &&
      (selectComp?.current?.clearValue(),
      selectSector?.current?.clearValue(),
      selectPreCat?.current?.clearValue());
    filterTypeFlag == "sector" &&
      (selectComp?.current?.clearValue(),
      selectCustCat?.current?.clearValue(),
      selectPreCat?.current?.clearValue());
  }, [filterType]);

  // NoteMaster Fetch
  useEffect(() => {
    async function notefetch() {
      const res = await fetch(
        `https://transcriptanalyser.com/gis/note-master`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            filter_value: filterId,
            filter_type: filterType,
          }),
        }
      );
      const data = await res.json();
      setNoteMaster(data?.key);
    }
    notefetch();
  }, [noteRemoveContext, filterId, filterType, userId]);

  // Sorted NoteMaster
  useEffect(() => {
    let arr = noteMaster?.note?.sort(function (a, b) {
      var c = new Date(a.DateInserted);
      var d = new Date(b.DateInserted);
      return d - c;
    });
    setSortedNoteMaster(arr);
  }, [noteMaster]);

  // NoteRemove API
  async function noteRemove() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: noteIdContext,
      }),
    });
    setNoteRemoveContext(noteRemoveContext + 1);
    setNoteIdContext(null);
  }

  // NoteRestore API
  async function restoreNotes() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-restore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });
    setNoteRemoveContext(noteRemoveContext + 1);
  }

  // Image Upload API
  async function ImageUploadAPI(file) {
    var form_data = new FormData();
    form_data.append("file", file, file.name);
    const headers = { "Content-Type": file.type };

    await axios
      .post("https://transcriptanalyser.com/gis/uploadfile", form_data, headers)
      .then((data) => {
        setNewImages((newImages) => [...newImages, data["data"]["link"]]);
      });
  }

  const handleFileInput = (e) => {
    ImageUploadAPI(e.target.files[0]);
  };

  //Note Create API
  async function noteCreate() {
    const res = await fetch(`https://transcriptanalyser.com/gis/note-create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        note_html: newNote,
        tag_list: uniqueTagsforpost,
        img_list: newImages,
      }),
    });
    setTagsforpost([]);
    setNoteRemoveContext(noteRemoveContext + 1);
  }

  // Add tags for post
  async function addTagforpost(id, type) {
    let arr = [
      ...tagsforpost,
      {
        tag_id: id,
        tag_type: type,
      },
    ];
    setTagsforpost(arr);
  }
  // Setting unique tag for post
  useEffect(() => {
    const arrayUniqueByKey = [
      ...new Map(tagsforpost.map((item) => [item["tag_id"], item])).values(),
    ];
    setUniquetagsforpost(arrayUniqueByKey);
  }, [tagsforpost]);

  // Opening Text typing are when text selected on screen
  useEffect(() => {
    newNote && setNewNoteFlag(true);
  }, [newNote]);

  useEffect(() => {
    console.log(filterId);
    console.log(filterType);
  }, [filterId, filterType]);

  return (
    <div>
      <div
        className={`bg-black/50 w-full h-full absolute z-10 top-0
        ${!newNoteFlag && "hidden"}`}
      ></div>
      {/* Delete Note */}
      <div
        className={`bg-black/50 w-full h-full absolute z-10 top-0
        ${!noteIdContext && "hidden"}`}
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
                onClick={() => setNoteIdContext(null)}
                className="flex-1 bg-[#c2c2c2] hover:bg-[#dfdfdf] p-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={noteRemove}
                className="flex-1 bg-[#d05555] hover:bg-[#ff5d5d] text-white p-2 font-semibold"
              >
                Yes, I am sure
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Header */}
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
            onClick={() => setNoteFlag(false)}
            className="hover:text-[#2362a1] cursor-pointer"
            size={40}
          />
        </div>

        {/* Filters*/}
        <div className="flex flex-col justify-between items-center px-3 py-2 gap-1">
          {/* Filter Options */}
          <div className={`flex gap-2 w-full bg-white flex-wrap`}>
            {/* Company Filter*/}
            <Select
              ref={selectComp}
              className="text-[#0d2843] font-semibold text-sm flex-1"
              options={noteMaster?.comp}
              getOptionLabel={(option) => option.Company_Name}
              getOptionValue={(option) => option.FINCODE}
              placeholder="Company"
              onChange={(values) => {
                values &&
                  (setFilterId(values.FINCODE),
                  setFilterType("company"),
                  setFilterTypeFlag("company"));
              }}
              color="#0d2843"
            />

            {/* Sector Filter*/}
            <Select
              ref={selectSector}
              className="text-[#0d2843] font-semibold text-sm flex-1"
              options={noteMaster?.sector}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              placeholder="Sector"
              onChange={(values) => {
                values &&
                  (setFilterId(values.label),
                  setFilterType("sector"),
                  setFilterTypeFlag("sector"));
              }}
              color="#0d2843"
              disable
            />
          </div>
          <div className={`flex gap-2 w-full bg-white flex-wrap`}>
            {/* Predefined Category Filter */}
            <Select
              ref={selectPreCat}
              className="text-[#0d2843] font-semibold text-sm flex-1"
              options={noteMaster?.category_predefined}
              placeholder="Tags"
              getOptionLabel={(option) => option.category_name}
              getOptionValue={(option) => option.category_id}
              onChange={(values) => {
                values &&
                  (setFilterId(values.category_id),
                  setFilterType("category"),
                  setFilterTypeFlag("preCategory"));
              }}
              color="#0d2843"
            />
            {/*Custom Category Filter*/}
            <Select
              ref={selectCustCat}
              className="text-[#0d2843] font-semibold text-sm flex-1"
              options={noteMaster?.category_custom}
              placeholder="Custom Tags"
              getOptionLabel={(option) => option.category_name}
              getOptionValue={(option) => option.category_id}
              onChange={(values) => {
                values &&
                  (setFilterId(values.category_id),
                  setFilterType("category"),
                  setFilterTypeFlag("custCategory"));
              }}
              color="#0d2843"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mb-2">
          <div
            onClick={() => {
              setFilterId(0);
              setFilterType("all");
              setFilterTypeFlag("all");
              setFilterFlag(false);
              selectComp?.current?.clearValue();
              selectPreCat?.current?.clearValue();
              selectCustCat?.current?.clearValue();
              selectSector?.current?.clearValue();
            }}
            className={`text-sm bg-[#091e37] hover:bg-[#1a3c61] text-white px-2 py-1 rounded-md flex items-center justify-center gap-2 w-[100px] cursor-pointer ${
              filterId == 0 && filterType == "all" && "hidden"
            }`}
          >
            <span>
              <BiReset size={20} />
            </span>
            <span>Reset All</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`px-3 ${
          filterId == 0 && filterType == "all"
            ? "h-[calc(100vh-290px)] sm:h-[calc(100vh-220px)]"
            : "h-[calc(100vh-330px)] sm:h-[calc(100vh-260px)]"
        } flex flex-col overflow-y-auto`}
      >
        <div className="flex flex-col gap-3">
          {/* Card */}
          {noteMaster == null ? (
            // Loading Animation
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
              <span className="relative flex h-[80px] w-[80px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-"></span>
              </span>
            </div>
          ) : noteMaster?.note[0] ? (
            sortedNoteMaster?.map((item) => (
              <NoteCard1
                key={item?.note_id}
                note={item?.note_html}
                images={item?.img_list}
                date={item?.DateInserted}
                noteId={item?.note_id}
                userId={userId}
                tagList={item?.tag_list1}
                companylist={noteMaster?.comp}
                preCatList={noteMaster?.category_predefined}
                customCatList={noteMaster?.category_custom}
              />
            ))
          ) : (
            <div className="h-[calc(100vh-200px)] flex flex-col text-center items-center justify-center gap-5">
              <h1 className="text-gray-400 rounded-md text-3xl">
                &#34;Start taking notes, just select the info that is useful to
                you&#34;
              </h1>
              <div className="relative w-full overflow-hidden bg-red-900 h-[100px]">
                <Image src={newNoteGif} alt="my-gif" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Absolute Components */}
      {/* Plus Button to add new Note */}
      <div
        onClick={() => setNewNoteFlag(!newNoteFlag)}
        className="p-3 absolute z-20 bottom-0 right-0"
      >
        <BsPlusCircleFill
          className="text-[#091e37] hover:text-[#1d558e] cursor-pointer"
          size={40}
        />
      </div>

      {/* Restore Button to add new Note */}
      <div
        onClick={restoreNotes}
        className="text-gray-400 p-3 absolute z-20 bottom-0 group left-0 flex items-end cursor-pointer"
      >
        <MdRestorePage
          className="group-hover:text-[#1d558e] cursor-pointer"
          size={30}
        />
        <span className="text-xl group-hover:text-[#1d558e]">
          Restore Notes
        </span>
      </div>

      {/* New NOTE */}
      <div
        className={`w-full flex flex-col py-10 absolute z-20 top-0 p-1 ${
          !newNoteFlag && "hidden"
        } `}
      >
        <div className="p-2 bg-gray-200 rounded-md flex flex-col gap-2 h-full">
          {/* Close New Note Typing... */}
          <div className="flex justify-between ">
            {/* Heading */}
            <h1 className="font-bold text-lg text-[#091e37] underline decoration-red-500 decoration-2 flex-1 text-center pl-4 italic">
              Make New Note here
            </h1>
            <AiFillCloseCircle
              onClick={() => setNewNoteFlag(false)}
              size={30}
              className="text-[#091e37] hover:text-[#1d558e] cursor-pointer"
            />
          </div>

          {/* Select Tags */}
          <div className="bg-[#091e37] p-2 rounded-md h-auto flex flex-col relative">
            <div>
              <h1 className="font-bold underline decoration-red-500 decoration-2 text-white">
                Add Tags
              </h1>
            </div>
            <div>
              {/* Tags Select Button */}
              <div className="flex justify-between border-t-2 my-1 border-white gap-1 py-1">
                {/* Company Button */}
                <button
                  onClick={() => {
                    setCompanyFlag(true);
                    setPreCatFlag(false);
                    setCustCatFlag(false);
                  }}
                  className={`underline decoration-red-500 decoration-2 flex-1 rounded-md ${
                    companyFlag
                      ? "bg-white text-[#091e37] font-bold"
                      : "text-white font-semibold "
                  }`}
                >
                  Companies
                </button>
                <button
                  onClick={() => {
                    setCompanyFlag(false);
                    setPreCatFlag(true);
                    setCustCatFlag(false);
                  }}
                  className={`underline decoration-red-500 decoration-2 flex-1 rounded-md ${
                    preCatFlag
                      ? "bg-white text-[#091e37] font-bold"
                      : "text-white font-semibold "
                  }`}
                >
                  Tags
                </button>
                <button
                  onClick={() => {
                    setCompanyFlag(false);
                    setPreCatFlag(false);
                    setCustCatFlag(true);
                  }}
                  className={`underline decoration-red-500 decoration-2 flex-1 rounded-md ${
                    custCatFlat
                      ? "bg-white text-[#091e37] font-bold"
                      : "text-white font-semibold "
                  }`}
                >
                  Custom Tags
                </button>
              </div>
            </div>

            {/* All Tags */}
            <div className="">
              <div className="w-full">
                {/* Company Tags */}
                <div className={`h-full ${!companyFlag && "hidden"}`}>
                  <div className="h-full flex gap-1 ">
                    {!noteMaster?.comp?.[0] ? (
                      <h1 className="text-sm">
                        You are no company to select from.
                      </h1>
                    ) : (
                      <Select
                        className="absolute text-[#0d2843] text-sm bg-white font-semibold w-full"
                        options={noteMaster?.comp}
                        placeholder="Select Companies"
                        getOptionLabel={(option) => option.Company_Name}
                        getOptionValue={(option) => option.FINCODE}
                        onChange={(values) => {
                          values && addTagforpost(values.FINCODE, "company");
                        }}
                        color="#0d2843"
                        value={() => {}}
                        maxMenuHeight={150}
                        menuPosition="fixed"
                      />
                    )}
                  </div>
                </div>
                {/* Predefined Category */}
                <div className={`h-full flex gap-1 ${!preCatFlag && "hidden"}`}>
                  {!noteMaster?.category_predefined?.[0] ? (
                    <h1 className="text-sm font-semibold text-white">
                      There are no Predefined Tags to add.
                    </h1>
                  ) : (
                    <Select
                      className="absolute text-[#0d2843] text-sm bg-white font-semibold w-full"
                      options={noteMaster?.category_predefined}
                      placeholder="Select predefined tags"
                      getOptionLabel={(option) => option.category_name}
                      getOptionValue={(option) => option.category_id}
                      onChange={(values) => {
                        values && addTagforpost(values.category_id, "category");
                      }}
                      searchBy="category_name"
                      color="#0d2843"
                      dropdownGap={0}
                      dropdownHeight="100px"
                      value={() => {}}
                      maxMenuHeight={150}
                      menuPosition="fixed"
                    />
                  )}
                </div>
                {/* Custom Category */}
                <div
                  className={`h-full flex gap-1 ${!custCatFlat && "hidden"}`}
                >
                  {!noteMaster?.category_custom?.[0] ? (
                    <h1 className="text-sm font-semibold text-white">
                      You have not created any Custom Tag.
                    </h1>
                  ) : (
                    <Select
                      className="absolute text-[#0d2843] text-sm bg-white font-semibold w-full"
                      options={noteMaster?.category_custom}
                      placeholder="Select custom tags"
                      getOptionLabel={(option) => option.category_name}
                      getOptionValue={(option) => option.category_id}
                      onChange={(values) => {
                        values && addTagforpost(values.category_id, "category");
                      }}
                      searchBy="category_name"
                      color="#0d2843"
                      dropdownGap={0}
                      dropdownHeight="100px"
                      value={() => {}}
                      maxMenuHeight={150}
                      menuPosition="fixed"
                    />
                  )}
                </div>
                {/* Category Custom */}
                <div className={`h-full  ${!categoryFlag && "hidden"}`}>
                  {/* Category Type select button */}
                  <div
                    className={`flex justify-evenly gap-1 ${
                      !categoryFlag && "hidden"
                    } border-b border-dotted mb-2 border-white pb-1`}
                  >
                    <button
                      onClick={() => {
                        setPreCatFlag(true);
                        setCustCatFlag(false);
                      }}
                      className={`underline decoration-red-500 decoration-2 mb-1 flex-1 rounded-md ${
                        preCatFlag
                          ? "bg-white text-[#091e37] font-bold"
                          : "text-white font-semibold "
                      }`}
                    >
                      Prefefined
                    </button>
                    <button
                      onClick={() => {
                        setPreCatFlag(false);
                        setCustCatFlag(true);
                      }}
                      className={`underline decoration-red-500 decoration-2 mb-1 flex-1 rounded-md ${
                        custCatFlat
                          ? "bg-white text-[#091e37] font-bold"
                          : "text-white font-semibold "
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#091e37] p-2 rounded-md h-auto text-xs font-semibold flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
            {uniqueTagsforpost[0] ? (
              uniqueTagsforpost?.map((item) => (
                <div
                  key={item?.tag_id}
                  className="bg-[#1a68ba] text-center rounded px-1 flex items-center justify-center gap-1 text-white"
                >
                  <p>
                    {item?.tag_type == "category"
                      ? noteMaster?.category_custom.map(
                          (item2) =>
                            item2?.category_id == item?.tag_id &&
                            item2?.category_name
                        )
                      : noteMaster?.comp.map(
                          (item2) =>
                            item2?.FINCODE == item?.tag_id &&
                            item2?.Company_Name
                        )}
                  </p>
                  <p
                    onClick={() => {
                      setTagsforpost((data) =>
                        data.filter((item1) => item1?.tag_id !== item?.tag_id)
                      );
                    }}
                    className="flex items-center h-full justify-center text-center font-bold text-sm text-white hover:text-[#15385d] cursor-pointer"
                  >
                    x
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white font-semibold text-sm">
                No tags are selected yet.
              </p>
            )}
          </div>

          {/* Image Upload */}
          <input
            className="p-1 h-[50px] bg-white w-full rounded-xl"
            type="file"
            onChange={handleFileInput}
          />
          {newImages?.[0] && (
            <div className="flex gap-1 h-[180px] overflow-x-auto">
              {newImages?.map((item) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="h-[100px] w-[100px]"
                  key={item}
                  src={item}
                  alt="Image"
                />
              ))}
            </div>
          )}
          {/* TextArea */}
          {/* <JoditEditor
            ref={editor}
            value={newNote}
            config={config}
            onBlur={(newContent) => setNewNote(newContent)} // preferred to use only this option to update the content for performance reasons
            // onChange={(newContent) => {
            //   setNewNote(content);
            // }}
          /> */}
          <textarea
            onChange={(e) => {
              setNewNote(e.target.value);
            }}
            value={newNote}
            placeholder="Type here to post a note..."
            className="bg-[#091e37] w-full h-[380px] p-1 text-justify text-white text-sm font-semibold outline-none broder-2 border-gray-800 rounded-md"
          ></textarea>

          <div className="flex justify-end">
            {newNote[0] ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    newNote?.[0] && setNewNote("");
                  }}
                  className={`bg-[#091e37] text-white rounded-md px-3 py-1 font-semibold focus:bg-[#154784] flex items-center gap-1 hover:bg-[#0f335e]`}
                >
                  <BiReset size={20} />
                  <span>Reset Note</span>
                </button>
                <button
                  onClick={() => {
                    newNote?.[0] &&
                      (setNewNoteFlag(!newNoteFlag),
                      setNewNote(""),
                      setNewImages([]));
                    // addedCatTags?.map((item) => {
                    //   addTagforpost(item?.category_id, "category")
                    // });
                    setNoteMaster(null);
                    noteCreate();
                  }}
                  className={`bg-[#091e37] text-white rounded-md px-3 py-1 font-semibold focus:bg-[#154784] hover:bg-[#0f335e]`}
                >
                  Post
                </button>
              </div>
            ) : (
              <button
                disabled
                className={`bg-gray-400 text-white rounded-md px-3 py-1 font-semibold cursor-not-allowed`}
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
      {/* End of Main Container */}
    </div>
  );
};

export default Notes;
