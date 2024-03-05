import { MdOutlineGames, MdCloudQueue } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { AiOutlineMessage } from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";

const MobileMenu = () => {
  return (
    <div className="w-full absolute bottom-0 flex justify-center items-center sm:hidden bg-[#1a3c61] text-xl text-white ">
      <div className="flex w-full h-11 items-center gap-[30px] py-3 justify-center">
        <button className="focus:border-red-900 focus:border-b-4 p-1 w-11 flex justify-center">
          <MdOutlineGames />
        </button>
        <button className="focus:border-red-900 focus:border-b-4 p-1 w-11 flex justify-center">
          <MdCloudQueue />
        </button>
        <button className="focus:border-red-900 focus:border-b-4 p-1 w-11 flex justify-center">
          <GoHome />
        </button>
        <button className="focus:border-red-900 focus:border-b-4 p-1 w-11 flex justify-center">
          <AiOutlineMessage />
        </button>
        <button className="focus:border-red-900 focus:border-b-4 p-1 w-11 flex justify-center">
          <BsCardChecklist />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
