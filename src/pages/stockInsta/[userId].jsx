import StockInstaComp from "@/components/StockInstaComps/StockInstaComp";
import { useInfoContext } from "@/context/info";
import React from "react";

const StockInsta = () => {
  const { uid } = useInfoContext();
  return (
    <div className="text-black h-[calc(100vh-51px)] w-full bg-[#f4f7fa] p-1 sm:pr-5 sm:pl-1 sm:pt-2 flex justify-center">
      <div className="max-w-[750px] flex-1">
        <StockInstaComp uid={uid} />
      </div>
    </div>
  );
};

export default StockInsta;
