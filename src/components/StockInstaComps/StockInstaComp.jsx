import React, { useEffect, useState } from "react";
import { BiFilter, BiSearch } from "react-icons/bi";
import { FaBookmark, FaFilter, FaUserCircle } from "react-icons/fa";
import PostCard from "./StockInstaComps/PostCard";

const StockInstaComp = ({ uid }) => {
  // Hooks
  const [data, setData] = useState(null);
  const [postAttributes, setPostAttributes] = useState(null);

  // Fetch Post
  const fetchPost = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/stockinsta/get_post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index_id: 0,
            exchange: "NSE",
            user_id: uid,
            watchlist_id: 0,
            sector: "",
            fincode: 0,
          }),
        }
      );
      const resJson = await res.json();
      setData(resJson);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };
  // Calling Fetch Post
  useEffect(() => {
    fetchPost();
  }, [uid]);

  // Fetch Post Attributes (Likes, Comments)
  const fetchPostAttributes = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/stockinsta/post_attribute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id_type_list: data?.post_data?.map((item) =>
              String(item?.id + "-" + item?.type)
            ),
          }),
        }
      );
      const resJson = await res.json();
      setPostAttributes(resJson);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Calling Fetch Attributes (Likes, Comments)
  useEffect(() => {
    data && fetchPostAttributes();
  }, [data]);

  useEffect(() => {
    console.log(postAttributes);
  }, [postAttributes]);

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-white rounded-md shadow-md p-2 sm:py-2 sm:px-4 border border-gray-200">
        {/* Photo */}
        <div>
          <FaUserCircle size={35} />
        </div>
        {/* Search Bar */}
        <div className="px-2 py-1 border-2 border-gray-300 rounded-md bg-white flex w-full gap-1 items-center justify-between max-w-[400px]">
          <input
            type="text"
            className="outline-none w-full font-semibold"
            placeholder="Search..."
          />
          <BiSearch size={20} />
        </div>
        {/* Filters */}
        <div className="flex items-center justify-between gap-1 md:gap-4 text-[#143b65]">
          <FaFilter size={23} />
          <FaBookmark size={23} />
        </div>
      </div>

      {/* Posts */}
      <div className="h-[calc(100vh-130px)] overflow-y-auto mt-5 flex flex-col gap-4 sm:pr-2 pb-1">
        {data ? (
          data?.post_data?.map((item, index) => (
            <div key={index}>
              <PostCard
                uid={uid}
                data={item}
                attributes={postAttributes ? postAttributes : null}
              />
            </div>
          )) // Loading Animation
        ) : (
          <div
            className={`flex justify-center items-center h-[calc(100vh-200px)]`}
          >
            <span className="relative flex h-[80px] w-[80px]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockInstaComp;
