import axios from "axios";
import { createContext, useContext, useRef, useState } from "react";
import { useInfoContext } from "./info";

const BulkBlockContext = createContext({});

export const BulkBlockContextProvider = ({ children }) => {
    const { uid } = useInfoContext();

    const [currentFollowing, setCurrentFollowing] = useState([]);
    const [ minMCapVal, setMinMCapVal ] = useState(0);
    const [ maxMCapVal, setMaxMCapVal ] = useState(50000);
    const [ sectorFilter,setSectorFilter ] = useState(null);
    const [ starHolderFilter,setStarHolderFilter ] = useState(null);
    const [ bulkBlockFilter,setBULKBLOCKFilter ] = useState(null);
    const [ applyFilter,setApplyFilter ] = useState(true);

    const getCurrentFollowing = async () => {
      if(uid !== -1){
        try {
          const response = await axios.post(`https://transcriptanalyser.com/bulkblockdeals/current_following`,{
            user_id:uid
          });
          
          setCurrentFollowing(response.data.client_names);
        } catch (error) {
          console.log("Error in getCurrentFollowing: ",error);
        }
        }
        
    }

    //For Economy Page
    const [ indicatorId,setIndicatorId ] = useState(null);
    const [ indicatorDatasetId,setIndicatorDatasetId ] = useState(null);
    const [ isEconomyGraphModalOpen,setIsEconomyGraphModalOpen ] = useState(false);

    const openEconomyGraphModal = () => { setIsEconomyGraphModalOpen(true); }
    const closeEconomyGraphModal = () => { setIsEconomyGraphModalOpen(false); }
    
  return (
    <BulkBlockContext.Provider
      value={{
        currentFollowing, 
        setCurrentFollowing,
        getCurrentFollowing,
        minMCapVal, 
        setMinMCapVal,
        maxMCapVal, 
        setMaxMCapVal,
        sectorFilter,
        setSectorFilter,
        starHolderFilter,
        setStarHolderFilter,
        bulkBlockFilter,
        setBULKBLOCKFilter,
        applyFilter,
        setApplyFilter,

        //For Economy Page
        indicatorId,
        setIndicatorId,
        indicatorDatasetId,
        setIndicatorDatasetId,
        isEconomyGraphModalOpen,
        setIsEconomyGraphModalOpen,
        openEconomyGraphModal,
        closeEconomyGraphModal

      }}
    >
      {children}
    </BulkBlockContext.Provider>
  );
};

export const useBulkBlockContext = () => useContext(BulkBlockContext);
