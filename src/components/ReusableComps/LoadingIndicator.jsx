import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center">
      <span className="relative flex h-full w-full">
        <span className="animate-ping inline-flex rounded-full bg-[#1a3c61] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-full"></span>
      </span>
    </div>
  );
};

export default LoadingIndicator;
