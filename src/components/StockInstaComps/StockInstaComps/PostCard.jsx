import moment from "moment";
import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import {
  FaBookmark,
  FaCommentAlt,
  FaHeart,
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegHeart,
  FaShareAlt,
} from "react-icons/fa";

const PostCard = ({ uid, data, attributes }) => {
  const [like, setLike] = useState(false);
  const [comment, setComment] = useState(false);
  const [save, setSave] = useState(false);
  const [share, setShare] = useState(false);

  // Fetch Like Post
  const fetchLikePost = async () => {
    try {
      const res = await fetch(
        `https://transcriptanalyser.com/stockinsta/like_post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: uid,
            post_id_type: String(data?.id + "-" + data?.type),
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
  // useEffect(() => {
  //   data && fetchLikePost();
  // }, [like]);

  return (
    <div className="bg-white rounded-md shadow-md p-1 sm:px-4 sm:py-2 h-full w-full flex flex-col items-center gap-2">
      {/* HEADING*/}
      <div className="flex w-full gap-2 justify-between text-xs border-b border-gray-200 pb-2">
        {/* Company Logo and Name */}
        <div className="flex  items-center gap-2 flex-[0.3]">
          <div className="bg-[#143b65] flex items-center justify-center p-2 h-8 w-8 flex-shrink-0 rounded-full text-white text-base">
            {String(data?.company).charAt(0)}
          </div>
          <h1 className=" text-gray-500 font-semibold">
            {/* {String(data?.company).substring(0, 20)}
            {String(data?.company).length >= 20 && "..."} */}
            {data?.company}
          </h1>
        </div>

        {/* Type */}
        <div className=" text-gray-500 font-semibold flex items-center justify-center flex-[0.4] uppercase">
          {data?.type == "interview"
            ? "Interview"
            : data?.type == "broker"
            ? "Broker"
            : data?.type == "news"
            ? "News"
            : data?.type == "earning_result"
            ? "Earning Result" + " " + "(" + data?.quarter_name + ")"
            : data?.type == "blog"
            ? "Blog"
            : data?.type == "annoucement"
            ? "Announcement"
            : data?.type == "earning_summary"
            ? "Earning Summary" + " " + "(" + data?.quarter_name + ")"
            : data?.type == "custom"
            ? data?.heading
            : data?.type}
        </div>

        {/* Data/Time */}
        <div className="flex-[0.3] flex items-center justify-end text-[#0D58A8] ">
          {moment(data?.post_datetime).fromNow()}
        </div>
      </div>

      {/* POST CONTENT */}
      <div className="w-full text-justify">
        {data?.type == "interview" ? (
          // INTERVIEW
          <div className="flex flex-col gap-1">
            {/* Video I-frame */}
            <iframe
              src={data?.interview_link}
              className="w-full h-[300px]"
            ></iframe>
            {/* Detailed Link */}
            <div className="flex items-center justify-end ">
              <a
                href={data?.detail_link}
                target="_blank"
                className="text-[13px] font-semibold text-[#143b65] hover:underline underline-offset-2 cursor-pointer"
              >
                View Detailed...
              </a>
            </div>
            {/* Summary */}
            <div className="">
              <h1 className="text-[#143b65] font-semibold underline  underline-offset-2">
                Summary:
              </h1>
              <div className="whitespace-pre-line text-sm">{data?.summary}</div>
            </div>
          </div>
        ) : data?.type == "broker" ? (
          // BROKER
          <div className="flex flex-col gap-1">
            {/* Heading */}
            <div className="text-sm">{data?.heading}</div>
            {/* Link */}
            <div className="flex items-center justify-end ">
              <a
                href={data?.link}
                target="_blank"
                className="text-[13px] font-semibold text-[#143b65] cursor-pointer hover:underline underline-offset-2 "
              >
                View PDF
              </a>
            </div>
          </div>
        ) : data?.type == "news" ? (
          // NEWS
          <div className="flex flex-col gap-1">
            {/* Title */}
            <div className="text-sm">{data?.title}</div>
            {/* Link */}
            <div className="flex items-center justify-end ">
              <a
                href={data?.link}
                target="_blank"
                className="text-[13px] font-semibold text-[#143b65] cursor-pointer hover:underline underline-offset-2 flex gap-1 items-center"
              >
                <span>Source:</span>
                {/* {data?.news_logo && data?.news_logo != "none" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data?.news_logo} alt="logo" className="w-10 h-10" />
                )} */}
                <span>{data?.source}</span>
              </a>
            </div>
          </div>
        ) : data?.type == "earning_result" ? (
          // EARNING RESULT
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              {/* Table */}
              <div className="overflow-none sm:px-[30px] md:px-[60px]">
                <table className="table-fixed w-full text-xs sm:text-sm shadow-md rounded-md overflow-hidden font-[500]">
                  <thead>
                    <tr className="bg-[#143b65] text-white text-left">
                      <td></td>
                      <th className="px-4 py-2 font-semibold">Value</th>
                      <th className="px-4 py-2 font-semibold">QoQ</th>
                      <th className="px-4 py-2 font-semibold">YoY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`bg-[#eaeef5]`}>
                      <td className="px-4 py-2 text-black">Revenue (Rs. cr)</td>
                      <td className={`text-black px-4 py-2`}>
                        {data?.revenue}
                      </td>
                      <td
                        className={`${
                          data?.revenue_growth_qoq > 0
                            ? "text-green-700"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.revenue_growth_qoq > 0 && "+"}
                        {data?.revenue_growth_qoq}%
                      </td>
                      <td
                        className={`${
                          data?.revenue_growth_yoy > 0
                            ? "text-green-700"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.revenue_growth_yoy > 0 && "+"}
                        {data?.revenue_growth_yoy}%
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr className={`bg-white text-black`}>
                      <td className="px-4 py-2">EBITDA (Rs. cr)</td>
                      <td className={`text-black px-4 py-2`}>{data?.ebitda}</td>
                      <td
                        className={`${
                          data?.ebitda_growth_qoq > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.ebitda_growth_qoq > 0 && "+"}
                        {data?.ebitda_growth_qoq}%
                      </td>
                      <td
                        className={`${
                          data?.ebitda_growth_yoy > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.ebitda_growth_yoy > 0 && "+"}
                        {data?.ebitda_growth_yoy > 0 && data?.ebitda_growth_yoy}
                        %
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr className={`bg-[#eaeef5] text-black`}>
                      <td className="px-4 py-2">EBITDA Margin (%)</td>
                      <td className={`text-black px-4 py-2`}>
                        {data?.ebitda_margin}
                      </td>
                      <td
                        className={`${
                          data?.ebitda_margin_growth_qoq > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.ebitda_margin_growth_qoq > 0 && "+"}
                        {data?.ebitda_margin_growth_qoq.toFixed(0)} bps
                      </td>
                      <td
                        className={`${
                          data?.ebitda_margin_growth_yoy > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.ebitda_margin_growth_yoy > 0 && "+"}
                        {data?.ebitda_margin_growth_yoy.toFixed(0)} bps
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr className={`bg-white text-black`}>
                      <td className="px-4 py-2">PAT (Rs. cr)</td>
                      <td className={`text-black px-4 py-2`}>{data?.pat}</td>
                      <td
                        className={`${
                          data?.pat_growth_qoq > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.pat_growth_qoq > 0 && "+"}
                        {data?.pat_growth_qoq}%
                      </td>
                      <td
                        className={`${
                          data?.pat_growth_yoy > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } px-4 py-2`}
                      >
                        {data?.pat_growth_yoy > 0 && "+"}
                        {data?.pat_growth_yoy}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : data?.type == "blog" ? (
          // BLOGS
          <div className="flex flex-col gap-1">
            {/* Title */}
            <div className="text-sm">{data?.title}</div>
            {/* Short Description */}
            <div className="text-sm text-justify ">{data?.ShortDesc}</div>
            {/* Detailed Link */}
            <div className="flex items-center justify-end ">
              <a
                href={data?.detail_link}
                target="_blank"
                className="text-[13px] font-semibold text-[#143b65] hover:underline underline-offset-2 cursor-pointer"
              >
                View Detailed...
              </a>
            </div>
          </div>
        ) : data?.type == "annoucement" ? (
          // ANNOUNCEMENT
          <div className="flex flex-col gap-1">
            {/* Heading */}
            <div className="text-sm">{data?.heading}</div>
            {/* Link */}
            <div className="flex items-center justify-end ">
              <a
                href={data?.pdf_link}
                target="_blank"
                className="text-[13px] font-semibold text-[#143b65] cursor-pointer hover:underline underline-offset-2 "
              >
                View PDF
              </a>
            </div>
          </div>
        ) : data?.type == "earning_summary" ? (
          // EARNING SUMMARY
          <div className="flex flex-col gap-1">
            {/* Summary */}
            <div className="">
              <div className="whitespace-pre-line text-sm ">
                {data?.summary_bullet}
              </div>
            </div>
          </div>
        ) : data?.type == "custom" ? (
          // CUSTOM
          <div className="flex flex-col gap-1">
            <Carousel>
              {[
                ...data?.photo_list.map((s, i) => (
                  <img key={i} src={s} alt="Post Images" className="px-5" />
                )),
              ]}
            </Carousel>
          </div>
        ) : (
          data?.type
        )}
      </div>

      {/* Comments and all */}
      <div className="flex w-full justify-between gap-3 md:px-[100px] px-10 mt-2">
        {/* Like */}
        <div className="flex items-center gap-1">
          {!like ? (
            <FaRegHeart
              onClick={() => setLike(!like)}
              size={25}
              className="cursor-pointer"
            />
          ) : (
            <FaHeart
              onClick={() => setLike(!like)}
              size={25}
              className="text-red-500 cursor-pointer"
            />
          )}
          <p className="text-black font-semibold text-sm">
            {attributes ? (
              <span>
                {like
                  ? attributes?.data?.[String(data?.id + "-" + data?.type)]
                      ?.no_like
                  : attributes?.data?.[String(data?.id + "-" + data?.type)]
                      ?.no_like}
              </span>
            ) : (
              <span className="animate-pulse">...</span>
            )}
          </p>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1">
          {!comment ? (
            <FaRegCommentAlt
              onClick={() => setComment(!comment)}
              size={25}
              className="cursor-pointer"
            />
          ) : (
            <FaCommentAlt
              onClick={() => setComment(!comment)}
              size={25}
              className="text-red-500 cursor-pointer"
            />
          )}
          <p className="text-black font-semibold text-sm">
            {attributes ? (
              <span>
                {
                  attributes?.data?.[String(data?.id + "-" + data?.type)]
                    ?.no_comment
                }
              </span>
            ) : (
              <span className="animate-pulse">...</span>
            )}
          </p>
        </div>

        {/* Save Posts */}
        <div>
          {!save ? (
            <FaRegBookmark
              onClick={() => setSave(!save)}
              size={25}
              className="cursor-pointer"
            />
          ) : (
            <FaBookmark
              onClick={() => setSave(!save)}
              size={25}
              className="text-red-500 cursor-pointer"
            />
          )}
        </div>

        <div>
          <FaShareAlt size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
