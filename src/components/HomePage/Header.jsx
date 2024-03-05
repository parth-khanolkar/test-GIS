import React, { useEffect, useState } from "react";
import FeaturedCompaniesScroll from "./FeatureCompaniesScroll";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import SideBar from "./SideBar";
import Link from "next/link";
import { BsFillBellFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import Navbar from "../GlobalComponents/Navbar";

const Header = () => {
  const [userName, setUserName] = useState(null);
  const [uid, setUid] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    var uidLocal = window?.localStorage?.getItem("UserId");
    var uNameLocal = window?.localStorage?.getItem("UserName");
    uidLocal ? setUid(uidLocal) : setUid(0);
    uNameLocal ? setUserName(uNameLocal) : setUserName(null);
  }, []);

  return (
    <>
      <div className="sticky top top-0 z-10">
        <FeaturedCompaniesScroll />
      </div>
    </>
  );
};

export default Header;
