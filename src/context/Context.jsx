import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const EarningsContext = createContext({});

export const EarningsContextProvider = ({ children }) => {
  const router = useRouter();

  const setValuesToDefault = () => {
    console.log("Router Changed");
    // alert("Router Changed");
    setPreviousMenu(true);
    setUpcoming([]);
    setPrevious([]);
    setSector([]);
    setDetails([]);
    setChatFincode("");
    setSelectedCompanyName("");
    setCalendarIdContext("");
    setDetailsPage(false);
    setLoadingContext(false);
    setScrollValue(0);
    setStockGptUrl("");
    setWidgets({
      transcripts: true,
      results: false,
      broker: false,
      ppt: false,
      summary: false,
      sentiment: false,
      infopack: false,
    });
    setAudioFile(null);
    setEpsChangeMin(null);
    setEpsChangeMax(null);
    setMinValContext(epsChangeMin);
    setMaxValContext(epsChangeMax);
    setWatchDrop([]);
    setWatchFincode([]);
    setFetchCounter(0);
    setSelectedText("");
    setNoteRemoveContext(0);
    setNoteFlag(false);
    setNoteIdContext(null);
    setTagsContext({
      note: null,
      status: false,
    });
    setCompDropdown(null);
    setQuarterDropdown(null);
    setCompPayload(null);
    setQuarterPayload(null);
    setCompReload(null);
    setQuartReload(null);
    setFlagReload(0);
    setDetailedNotes(false);
    setReloadNotes(0);
    setMasterNotesFlag(false);
    setTest(0);
    setCompFilter(null);
    setEditIsOn(false);
    setOutside(false);
    setNoteEditID(null);
    setNoteIsSaving(false);
    setNoteIsSavingID(null);
    setCurrentNoteText("");
    setDefaultCompanyForDetailedNotes({
      Company_Name: "",
      FINCODE: "",
    });
    setCounterEarnings(1);
    setDefaultQuart(null);
    setLoadingflag(true);
  };

  const [isWithinPage, setIsWithinPage] = useState(false);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    setIsWithinPage(true);
    if (isWithinPage) {
      setValuesToDefault();
      console.log("In Context setValuesToDefault");
    }
    return () => setIsWithinPage(false);
  }, [router.pathname]);

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     // Check if the user is leaving the '/catch' page
  //     if ((router.pathname === '/earningcalls' || router.pathname === '/earningcalls/[uid]') && (!window.location.href.includes('/earningcalls') || !window.location.href.includes('/earningcalls/[uid]'))) {
  //       setValuesToDefault();
  //       // Reset other states as needed
  //     }
  //   };

  //   router.events.on('routeChangeStart', handleRouteChange);

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, [router.events]);

  const [previousMenu, setPreviousMenu] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [sector, setSector] = useState([]);
  const [details, setDetails] = useState([]);
  const [chatFincode, setChatFincode] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [calendarIdContext, setCalendarIdContext] = useState("");
  const [detailsPage, setDetailsPage] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  const [stockGptUrl, setStockGptUrl] = useState("");
  const [widgets, setWidgets] = useState({
    transcripts: true,
    results: false,
    broker: false,
    ppt: false,
    summary: false,
    sentiment: false,
    infopack: false,
  });
  const [audioFile, setAudioFile] = useState(null);
  const [epsChangeMin, setEpsChangeMin] = useState(null);
  const [epsChangeMax, setEpsChangeMax] = useState(null);
  const [minValContext, setMinValContext] = useState(null);
  const [maxValContext, setMaxValContext] = useState(null);
  const [watchDrop, setWatchDrop] = useState([]);
  const [watchFincode, setWatchFincode] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [noteRemoveContext, setNoteRemoveContext] = useState(0);
  const [noteFlag, setNoteFlag] = useState(false);
  const [noteIdContext, setNoteIdContext] = useState(null);
  const [tagsContext, setTagsContext] = useState({
    note: null,
    status: false,
  });
  const [compDropdown, setCompDropdown] = useState(null);
  const [quarterDropdown, setQuarterDropdown] = useState(null);
  const [compPayload, setCompPayload] = useState(null);
  const [quarterPayload, setQuarterPayload] = useState(null);
  const [compReload, setCompReload] = useState(null);
  const [quartReload, setQuartReload] = useState(null);
  const [flagReload, setFlagReload] = useState(0);
  const [detailedNotes, setDetailedNotes] = useState(false);
  const [reloadNotes, setReloadNotes] = useState(0);
  const [masterNotesFlag, setMasterNotesFlag] = useState(false);
  const [test, setTest] = useState(0);
  const [compFilter, setCompFilter] = useState(null);
  const [editIsOn, setEditIsOn] = useState(false);
  const [outside, setOutside] = useState(false);
  const [noteEditID, setNoteEditID] = useState(null);

  const [noteIsSaving, setNoteIsSaving] = useState(false);
  const [noteIsSavingID, setNoteIsSavingID] = useState(null);
  const [currentNoteText, setCurrentNoteText] = useState("");
  const [defaultCompanyForDetailedNotes, setDefaultCompanyForDetailedNotes] =
    useState({
      Company_Name: "",
      FINCODE: "",
    });

  const [counterEarnings, setCounterEarnings] = useState(1);
  const [defaultQuart, setDefaultQuart] = useState(null);
  const [loadingFlag, setLoadingflag] = useState(true);

  // NEW API FILTERS
  const [sectorFilter, setSectorFilter] = useState(null);
  const [watchFilter, setWatchFilter] = useState(null);

  return (
    <EarningsContext.Provider
      value={{
        previousMenu,
        setPreviousMenu,
        upcoming,
        setUpcoming,
        previous,
        setPrevious,
        sector,
        setSector,
        widgets,
        setWidgets,
        details,
        setDetails,
        chatFincode,
        setChatFincode,
        selectedCompanyName,
        setSelectedCompanyName,
        detailsPage,
        setDetailsPage,
        calendarIdContext,
        setCalendarIdContext,
        loadingContext,
        setLoadingContext,
        scrollValue,
        setScrollValue,
        audioFile,
        setAudioFile,
        epsChangeMin,
        epsChangeMax,
        setEpsChangeMax,
        setEpsChangeMin,
        minValContext,
        setMinValContext,
        maxValContext,
        setMaxValContext,
        watchDrop,
        setWatchDrop,
        watchFincode,
        setWatchFincode,
        stockGptUrl,
        setStockGptUrl,
        fetchCounter,
        setFetchCounter,
        selectedText,
        setSelectedText,
        noteRemoveContext,
        setNoteRemoveContext,
        noteIdContext,
        setNoteIdContext,
        noteFlag,
        setNoteFlag,
        tagsContext,
        setTagsContext,
        compDropdown,
        setCompDropdown,
        quarterDropdown,
        setQuarterDropdown,
        compPayload,
        setCompPayload,
        quarterPayload,
        setQuarterPayload,
        compReload,
        setCompReload,
        quartReload,
        setQuartReload,
        flagReload,
        setFlagReload,
        detailedNotes,
        setDetailedNotes,
        reloadNotes,
        setReloadNotes,
        masterNotesFlag,
        setMasterNotesFlag,
        test,
        setTest,
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
        counterEarnings,
        setCounterEarnings,
        defaultQuart,
        setDefaultQuart,
        loadingFlag,
        setLoadingflag,
        watchFilter,
        setWatchFilter,
        sectorFilter,
        setSectorFilter,
      }}
    >
      {children}
    </EarningsContext.Provider>
  );
};

export const useEarningsContext = () => useContext(EarningsContext);
