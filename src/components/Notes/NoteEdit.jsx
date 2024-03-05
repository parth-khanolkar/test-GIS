import { useEarningsContext } from "@/context/Context";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

const NoteEdit = () => {
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
    height: 600,
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
  } = useEarningsContext();

  //   HOOKS
  const [localNote, setLocalNote] = useState("");
  const [isFirstFlag, setIsFirstFlag] = useState(0);

  // Change NOTE HTML
  async function changeNoteHtmlFunc(id, html) {
    const res = await fetch(
      `https://transcriptanalyser.com/gis/note-edit-html2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note_id: id,
          note_html: html,
        }),
      }
    );
    setReloadNotes(reloadNotes + 1);
  }
  // USE EFFECTS
  useEffect(() => {
    isFirstFlag == 0 &&
      (setLocalNote(currentNoteText), setIsFirstFlag(isFirstFlag + 1));
  }, [currentNoteText]);

  // Highlighting text Feature
  useEffect(() => {
    if (
      selectedText?.length > 0 &&
      localNote == "<p><br></p>" &&
      editIsOn &&
      isFirstFlag > 0
    ) {
      setLocalNote(selectedText);
      setSelectedText(null);
    } else if (selectedText?.length > 0 && editIsOn && isFirstFlag > 0) {
      setLocalNote(localNote + "<br/>" + selectedText);
      setSelectedText(null);
    }
  }, [selectedText]);

  return (
    <div key={noteEditID}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 relative border-b-2 border-[#14395d] p-1">
          <div className="text-[#091e37] hover:text-white hover:bg-[#14395d]/95 hover:rounded-md cursor-pointer absolute">
            <BsArrowLeft
              onClick={() => {
                setNoteEditID(null);
                changeNoteHtmlFunc(noteEditID, localNote);
                setCurrentNoteText("");
                setEditIsOn(false);
                setNoteIsSaving(true);
                setNoteIsSavingID(noteEditID);
              }}
              size={35}
            />
          </div>
          {/* Companies*/}
          <div className="flex-1 flex justify-center text-2xl font-bold text-[#27496a] underline decoration-red-600 italic">
            Note Edit
          </div>
        </div>
        <div className="overflow-y-scroll h-[calc(100vh-130px)] px-1">
          {/* Loaded Note Information */}
          <JoditEditor
            config={config}
            value={localNote}
            tabIndex={5}
            onBlur={(content) => {
              setLocalNote(content);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEdit;
