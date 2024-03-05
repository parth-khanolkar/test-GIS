import React, { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCaretLeft,
  FaCaretRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Carousel = ({ children: slides }) => {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  const goto = (i) => setCurr(i);

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      {/* Left Right Button */}
      <div className="absolute inset-[-20px] flex items-center justify-between p-4">
        <button
          onClick={prev}
          className=" text-[#143b65]/50 hover:text-[#143b65]"
        >
          <FaChevronLeft size={30} />
        </button>
        <button
          onClick={next}
          className=" text-[#143b65]/50 hover:text-[#143b65]"
        >
          <FaChevronRight size={30} />
        </button>
      </div>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <div
              key={i}
              onClick={() => goto(i)}
              className={`transition-all cursor-pointer  bg-[#143b65] rounded-full flex-shrink-0 ${
                curr === i ? "p-0.5 w-2 h-2" : "bg-opacity-50 w-1.5 h-1.5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
