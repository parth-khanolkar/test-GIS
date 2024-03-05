import Footer from "@/components/Footer";
import MobileFooter from "@/components/MobileFooter";
import TechnicalScreen from "@/components/TechnicalScreenComps/TechnicalScreen";
import React from "react";

const TechnicalScreenPage = () => {
  return (
    <div className="overflow-x-hidden ">
      <div
        className={`overflow-y-auto bg-[#f4f7fa] overflow-x-hidden h-[calc(100vh-86px)] sm:pr-5 sm:pl-1 sm:pt-2 `}
      >
        <div className="">
          <TechnicalScreen />
        </div>
        <footer className="pt-4">
          <MobileFooter />
        </footer>
      </div>
    </div>
  );
};

export default TechnicalScreenPage;
