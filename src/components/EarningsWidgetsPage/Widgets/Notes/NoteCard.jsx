import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { BiCross, BiPlus } from "react-icons/bi";
import { BsPinAngleFill, BsTicket } from "react-icons/bs";
import { RiDeleteBin2Line } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import Notes from "./Notes";
import { useEarningsContext } from "@/context/Context";
import Select from "react-select";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiFillCloseCircle,
} from "react-icons/ai";
import axios from "axios";
import { FiExternalLink } from "react-icons/fi";

const NoteCard1 = ({
  note,
  date,
  noteId,
  userId,
  tagList,
  companylist,
  preCatList,
  customCatList,
  images,
}) => {
  const {
    noteRemoveContext,
    setNoteRemoveContext,
    setNoteIdContext,
    tagsContext,
    setTagsContext,
  } = useEarningsContext();

  const parser = new DOMParser();

  const [expandText, setExpandText] = useState(false);
  const [tagApi, setTagApi] = useState(null);
  const [tagNames, setTagNames] = useState([]);
  const [addTag, setAddTag] = useState(false);
  const [customTag, setCustomTag] = useState(null);
  const [uniqueTags, setUniqueTags] = useState(null);
  const [companyFlag, setCompanyFlag] = useState(true);
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [preCatFlag, setPreCatFlag] = useState(false);
  const [custCatFlat, setCustCatFlag] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [flag, setFlag] = useState(0);
  const [imageLinkOverlayFlag, setImageLinkOverlay] = useState(false);

  const imageRef = useRef(null);
  // Image Link Extraction API
  async function ImageUploadAPI(file) {
    var form_data = new FormData();
    form_data.append("file", file, file.name);
    const headers = { "Content-Type": file.type };
    await axios
      .post("https://transcriptanalyser.com/gis/uploadfile", form_data, headers)
      .then((data) => {
        setNewImages([data["data"]["link"]]);
      });
  }
  const handleFileInput = (e) => {
    e.target.files[0] && ImageUploadAPI(e.target.files[0]);
    imageRef.current.value = null;
    setFlag(flag + 1);
  };
  useEffect(() => {
    setNewImages([]);
  }, [flag]);

  // Actual Image Upload
  useEffect(() => {
    async function imageLinksUpload() {
      const res = await fetch(`https://transcriptanalyser.com/gis/note-img`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note_id: noteId,
          img_list: newImages,
        }),
      });
    }
    newImages[0] &&
      (imageLinksUpload(), setNoteRemoveContext(noteRemoveContext + 1));
  }, [newImages]);

  useEffect(() => {
    setTagNames([]); //in case if we remove tag then whole tagNames will be set again
    tagList[0] &&
      tagList.map((item) => {
        item?.tag_type == "category"
          ? customCatList.map(
              (item1) =>
                item1?.category_id == item?.tag_id &&
                setTagNames((tagNames) => [
                  ...tagNames,
                  {
                    label: item1?.category_name,
                    value: item?.tag_id,
                    category: "category",
                  },
                ])
            )
          : companylist.map(
              (item2) =>
                item2?.FINCODE == item?.tag_id &&
                // your code
                setTagNames((tagNames) => [
                  ...tagNames,
                  {
                    label: item2?.Company_Name,
                    value: item?.tag_id,
                    category: "company",
                  },
                ])
            );
      });
  }, [noteId, tagList]);

  // Unique Tags
  useEffect(() => {
    const key = "value";
    const arrayUniqueByKey = [
      ...new Map(tagNames.map((item) => [item[key], item])).values(),
    ];
    setUniqueTags(arrayUniqueByKey);
    setTagsContext({
      note: null,
      status: true,
    });
  }, [tagNames]);

  // TagRemove API
  async function tagRemove(id, type) {
    const res = await fetch(`https://transcriptanalyser.com/gis/tag-remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: noteId,
        tag_id: id,
        tag_type: type,
      }),
    });
    setTagsContext({
      note: noteId,
      status: false,
    });
    setNoteRemoveContext(noteRemoveContext + 1);
  }

  // Custom Tag API
  async function createCustomTag() {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/tag-custom-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name: customTag,
          user_id: userId,
        }),
      }
    );
    const data = await res.json();
    await addNewTag(data?.key, "category");
    setTagsContext({
      note: noteId,
      status: false,
    });
    setNoteRemoveContext(noteRemoveContext + 1);
  }

  // Add New Tag API
  async function addNewTag(id, type) {
    const res = await fetch(`https://transcriptanalyser.com/gis/tag-add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: noteId,
        tag_id: id,
        tag_type: type,
      }),
    });

    const data = await res.json();

    data?.key == "already_exist"
      ? alert("Tag already exists.")
      : (setNoteRemoveContext(noteRemoveContext + 1),
        setTagsContext({
          note: noteId,
          status: false,
        }),
        setAddTag(false));
    const input = document.getElementById("imageInput");
    // as an array, u have more freedom to transform the file list using array functions.
    const fileListArr = [];
    setNewImages(fileListArr);
  }

  function slideLeft() {
    var slider = document.getElementById("imageDiv" + noteId);
    slider.scrollLeft -= 250;
  }
  function slideRight() {
    var slider = document.getElementById("imageDiv" + noteId);
    slider.scrollLeft += 250;
  }
  return (
    <div>
      {/* Card */}
      <div className="flex flex-col border-2 border-gray-500 rounded-lg h-full overflow-hidden shadow-md relative">
        {images[0] && (
          <div
            className="flex flex-1 gap-1 p-2 w-full overflow-x-auto scroll-smooth scrollbar-hide"
            id={"imageDiv" + noteId}
          >
            {/* Left Scroll */}
            <AiFillCaretLeft
              className="absolute z-10 left-[-10px] top-[55px] opacity-50 hover:opacity-100 text-white cursor-pointer "
              size={50}
              onClick={slideLeft}
            />
            {images?.map((item) => (
              <a
                key={item}
                href={item}
                target="_blank"
                className="min-w-[150px] relative group"
              >
                <div
                  className={`h-[150px] w-[150px] items-center justify-center rounded-lg absolute bg-black/50 hidden group-hover:flex`}
                >
                  <FiExternalLink size={30} className="text-white" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={item}
                  className="h-[150px] w-[150px] rounded-lg"
                  src={item}
                  alt="Image"
                  width="100"
                  height="100"
                ></img>
              </a>
            ))}
            {/* Right Scroll */}
            <AiFillCaretRight
              className="absolute z-10 right-[-10px] top-[55px] opacity-50 hover:opacity-100 text-white cursor-pointer"
              size={50}
              onClick={slideRight}
            />
          </div>
        )}
        <div
          className={`flex w-full ${
            images[0] && "border-t border-black border-dotted"
          }`}
        >
          {/* Date */}
          <div className="py-3 px-1 text-xs font-semibold">
            <p className="text-gray-500">
              {moment.utc(date).format("MMMM Do,")}
            </p>
            <p className="text-gray-500">{moment.utc(date).format("YYYY")}</p>
            <p className="text-gray-500 whitespace-nowrap mt-1">
              {moment.utc(date).format("h:mmA")}
            </p>
          </div>
          {/* Main Card Contents (Tags and Texts) */}
          <div className="text-sm p-2 flex-1 font-semibold">
            {/* Tags */}
            <div className="text-xs font-semibold text-white">
              {/* Applied tags */}
              <div className="flex flex-wrap gap-1">
                {/* Loading Indicator */}
                {tagsContext.note == null && tagsContext?.status == false ? (
                  <p className="text-xs animate-pulse text-black">
                    Loading tags...
                  </p>
                ) : (
                  tagsContext?.note == noteId &&
                  tagsContext?.status == false && (
                    <p className="text-xs animate-pulse text-black">
                      Updating tags...
                    </p>
                  )
                )}
                {uniqueTags?.map((item) => (
                  <div
                    key={item?.value}
                    className="bg-[#1b4a7b] text-center rounded px-1 flex items-center justify-center gap-1"
                  >
                    <p>{item?.label}</p>
                    <p
                      onClick={() => {
                        tagRemove(item?.value, item?.category);
                      }}
                      className="flex items-center h-full justify-center text-center font-bold text-sm text-white hover:text-[#15385d] cursor-pointer"
                    >
                      x
                    </p>
                  </div>
                ))}

                {/* Add New tag */}
                <div
                  onClick={() => setAddTag(true)}
                  className="text-[#15385d] border-2 border-[#15385d] hover:text-[#2563a5] hover:border-[#2563a5] text-center gap-2 rounded font-bold cursor-pointer flex items-center justify-center px-1 group"
                >
                  <span>Add Tags/Images</span>
                  <span>
                    <BiPlus className="bg-[#15385d] group-hover:bg-[#2563a5] text-white font-bold rounded-sm" />
                  </span>
                </div>

                {/* Add New Image
                <div
                  onClick={() => setAddTag(true)}
                  className="text-[#15385d] border-2 border-[#15385d] hover:text-[#2563a5] hover:border-[#2563a5] text-center gap-2 rounded font-bold cursor-pointer flex items-center justify-center px-1 group"
                >
                  <span>Add Image</span>
                  <span>
                    <BiPlus className="bg-[#15385d] group-hover:bg-[#2563a5] text-white font-bold rounded-sm" />
                  </span>
                </div> */}
              </div>
            </div>
            <div className="text-justify text-black">
              {note?.length > 60 ? (
                <div>
                  <span>
                    {!expandText
                      ? `${note.substring(0, 100)}.... `
                      : note + " "}
                  </span>
                  <span
                    onClick={() => setExpandText(!expandText)}
                    className={`text-[#15385d] text-xs font-bold hover:underline cursor-pointer`}
                  >
                    {!expandText ? "View more" : "View less"}
                  </span>
                </div>
              ) : (
                note
              )}
            </div>
          </div>
          {/* Delete Button */}
          <div className="bg-gray-200 py-1 flex items-center cursor-pointer">
            <RiDeleteBin2Line
              onClick={() => {
                setNoteIdContext(noteId);
              }}
              className="text-red-500 hover:text-red-700 "
              size={25}
            />
          </div>
        </div>

        {/* Add Tags */}
        <div>
          <div
            className={`w-full bg-[#0e1e35] text-justify ${
              !addTag && "hidden"
            } p-2 text-sm text-white  flex flex-col gap-2`}
          >
            {/* Category Predefined */}
            <div className="">
              <div className="p-2 bg-gray-200 rounded-md flex flex-col gap-2">
                {/* Close New Note Typing... */}
                <div className="flex justify-between ">
                  {/* Heading */}
                  <h1 className="font-bold text-lg text-[#091e37] underline decoration-red-500 decoration-2 flex-1 text-center pl-4 italic">
                    Add New Tags here
                  </h1>
                  <AiFillCloseCircle
                    onClick={() => setAddTag(false)}
                    size={30}
                    className="text-[#091e37] hover:text-[#1d558e] cursor-pointer"
                  />
                </div>

                {/* Tags */}
                <div className="bg-[#091e37] p-2 rounded-md flex flex-col relative">
                  {/* Tags Select Button */}
                  <div className="flex justify-between border-b-2 mb-2 border-white gap-1 pb-1">
                    {/* Company Button */}
                    <button
                      onClick={() => {
                        setCompanyFlag(true);
                        setPreCatFlag(false);
                        setCustCatFlag(false);
                      }}
                      className={`underline decoration-red-500 decoration-2 mb-1 flex-1 rounded-md ${
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
                      className={`underline decoration-red-500 decoration-2 mb-1 flex-1 rounded-md ${
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
                      className={`underline decoration-red-500 decoration-2 mb-1 flex-1 rounded-md ${
                        custCatFlat
                          ? "bg-white text-[#091e37] font-bold"
                          : "text-white font-semibold "
                      }`}
                    >
                      Custom Tags
                    </button>
                  </div>

                  {/* All Tags */}
                  <div className="">
                    <div className="top-[-1px] w-full left-0">
                      {/* Company Tags */}
                      <div className={`h-full ${!companyFlag && "hidden"}`}>
                        {!companylist?.[0] ? (
                          <h1 className="text-sm">
                            You are no company to select from.
                          </h1>
                        ) : (
                          <Select
                            className="text-[#0d2843] text-sm bg-white font-semibold flex-1"
                            options={companylist}
                            placeholder="Select Companies"
                            getOptionLabel={(option) => option.Company_Name}
                            getOptionValue={(option) => option.FINCODE}
                            onChange={(values) => {
                              values && addNewTag(values.FINCODE, "company");
                            }}
                            searchBy="Company_Name"
                            color="#0d2843"
                            maxMenuHeight={150}
                            menuPosition="fixed"
                            value={() => {}}
                          />
                        )}
                      </div>
                      {/* Predefined Category */}
                      <div
                        className={`h-full flex gap-1 ${
                          !preCatFlag && "hidden"
                        }`}
                      >
                        {!preCatList?.[0] ? (
                          <h1 className="text-sm font-semibold text-white">
                            There are no Predefined Tags to add.
                          </h1>
                        ) : (
                          <Select
                            className="text-[#0d2843] text-sm bg-white font-semibold flex-1"
                            options={preCatList}
                            placeholder="Select predefined tags"
                            getOptionLabel={(option) => option.category_name}
                            getOptionValue={(option) => option.category_id}
                            onChange={(values) => {
                              values &&
                                addNewTag(values.category_id, "category");
                            }}
                            searchBy="category_name"
                            color="#0d2843"
                            maxMenuHeight={150}
                            menuPosition="fixed"
                            value={() => {}}
                          />
                        )}
                      </div>
                      {/* Custom Category */}
                      <div
                        className={`h-full flex gap-1 ${
                          !custCatFlat && "hidden"
                        }`}
                      >
                        {!customCatList?.[0] ? (
                          <h1 className="text-xs text-white">
                            You have not created any Custom Tag.
                          </h1>
                        ) : (
                          <Select
                            className="text-[#0d2843] text-sm bg-white font-semibold flex-1"
                            options={customCatList}
                            placeholder="Select custom tags"
                            getOptionLabel={(option) => option.category_name}
                            getOptionValue={(option) => option.category_id}
                            onChange={(values) => {
                              values &&
                                addNewTag(values.category_id, "category");
                            }}
                            searchBy="category_name"
                            color="#0d2843"
                            maxMenuHeight={150}
                            menuPosition="fixed"
                            value={() => {}}
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
              </div>
            </div>
            {/* Image Upload */}
            <input
              ref={imageRef}
              className="p-1 bg-white text-black w-full rounded-xl"
              type="file"
              placeholder="Upload Image"
              onChange={handleFileInput}
            />
            {/* create custom cat */}
            <div className="flex w-full gap-2 items-center p-1 bg-white rounded-md">
              <input
                onChange={(e) => setCustomTag(e.target.value)}
                value={customTag}
                className="flex-1 text-black font-semibold outline-none"
                type="text"
                placeholder="Type here to create a Custom Tag..."
              />
              <TiTick
                onClick={() => {
                  createCustomTag();
                  setCustomTag("");
                }}
                className=" bg-[#0e1e35] rounded-ful cursor-pointer hover:bg-[#2c67b9]"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard1;
