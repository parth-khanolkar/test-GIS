import { createContext, useContext, useRef, useState } from "react";

const CustomScreenerContext = createContext({});

export const CustomScreenerContextProvider = ({ children }) => {
    const [ screenerAddedFilters,setScreenerAddedFilters ] = useState([]);
    const [ screenerFilterOptions,setScreenerFilterOptions ] = useState([]);
    const [ isApplyButtonDisabled,setIsApplyButtonDisabled ] = useState(true);
    const [ extraOptionsDropdowns, setExtraOptionsDropdowns ] = useState({});

  return (
    <CustomScreenerContext.Provider
      value={{
        screenerAddedFilters,
        setScreenerAddedFilters,
        isApplyButtonDisabled,
        setIsApplyButtonDisabled,
        screenerFilterOptions,
        setScreenerFilterOptions,
        extraOptionsDropdowns, 
        setExtraOptionsDropdowns,

      }}
    >
      {children}
    </CustomScreenerContext.Provider>
  );
};

export const useCustomScreenerContext = () => useContext(CustomScreenerContext);
