import { createContext, useContext, useRef, useState } from "react";

const WatchlistContext = createContext({});

export const WatchlistContextProvider = ({ children }) => {

    const [watchlist,setWatchlist] = useState({});
    const [watchlistArray,setWatchlistArray] = useState([]);
    const [tableData,setTableData] = useState([]);
    const [notificationCount,setNotificationCount] = useState(0);

    const [refreshWatchlist,setRefreshWatchlist] = useState(true);

    const companyGraphModalRef = useRef(null);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        setWatchlist,
        watchlistArray,
        setWatchlistArray,
        tableData,
        setTableData,
        refreshWatchlist,
        setRefreshWatchlist,
        notificationCount,
        setNotificationCount,

        companyGraphModalRef

      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlistContext = () => useContext(WatchlistContext);
