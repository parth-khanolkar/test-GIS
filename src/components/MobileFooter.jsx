import React, { useState } from "react";
import logo from "@/assets/images/logo.png";
import placeholder from "@/assets/Footer_assets/placeholder.png";
import contact from "@/assets/Footer_assets/contact.png";
import twitter from "@/assets/Footer_assets/twitter.png";
import whatsapp from "@/assets/Footer_assets/whatsapp.png";
import linkedin from "@/assets/Footer_assets/linkedin.png";
import gmail from "@/assets/Footer_assets/gmail.png";
import mockups from "@/assets/Footer_assets/mockups.png";
import playstore from "@/assets/Footer_assets/playstore.png";
import applestore from "@/assets/Footer_assets/applestore.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaExternalLinkAlt } from "react-icons/fa";
import { subSeconds } from "date-fns";
import Link from "next/link";

const MobileFooter = () => {
  const [menu, setMenu] = useState(false);
  return (
    <div className="bg-[#f4f7fa] p-2 w-full">
      <div className="flex justify-center">
        <div className="flex items-center justify-center max-w-[900px] w-full">
          <div className="flex gap-[50px] w-full">
            {/* Logo */}
            <div className="hidden sm:inline-block">
              <Image src={logo} height={116} width={170} alt="Logo" />
            </div>

            <div className="flex gap-1 justify-between sm:gap-5 lg:gap-10 items-center w-full text-base md:text-2xl font-semibold">
              <div
                onClick={() => setMenu(!menu)}
                className={`cursor-pointer ${
                  menu == "Disclaimer" && "underline underline-offset-4"
                }`}
              >
                Disclaimer
              </div>
              <Link
                href="/contactus"
                className={`${
                  menu == "Contact" && "underline underline-offset-4"
                }`}
              >
                Contact Us
              </Link>
              <div className="flex gap-2">
                <a href="https://twitter.com/goindiastocks" target="_blank">
                  <Image src={twitter} height={25} width={25} alt="Logo" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=917710971806&text&type=phone_number&app_absent=0"
                  target="_blank"
                >
                  <Image src={whatsapp} height={25} width={25} alt="Logo" />
                </a>
                <a
                  href="https://www.linkedin.com/company/go-india-advisors"
                  target="_blank"
                >
                  <Image src={linkedin} height={25} width={25} alt="Logo" />
                </a>
                <a href="mailto:hello@goindiaadvisors.com" target="_blank">
                  <Image src={gmail} height={25} width={25} alt="Logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${!menu && "hidden"} text-xs text-justify py-4 px-2`}>
        Disclaimer: The information on this website has been collected from
        certain public sources. GoIndia Advisors LLP believes that the
        information it uses comes from reliable sources, but does not guarantee
        the accuracy or completeness of this information, which is subject to
        change without notice, and nothing in this document shall be construed
        as such a guarantee. Employees involved in this service may hold
        positions in the companies mentioned in the services/information. We
        disclaim any liability arising from use of information contained on this
        website. Nothing herein shall constitute or be construed as an offering
        of financial instruments or as investment advice or recommendations by
        GoIndia Advisors LLP. The Site may include advertisements and links to
        external sites and co-branded pages which GoIndia Advisors LLP does not
        endorse and cannot accept any responsibility or liability for loss or
        damage suffered by the intended viewer. GoIndia Advisors LLP is unable
        to exercise control over the security or content of information passing
        over the network or via the Service, and GoIndia Advisors LLP hereby
        excludes all liability of any kind for the transmission or reception of
        infringing or unlawful information of whatever nature.
      </div>

      <div className="flex justify-center items-center text-xs">
        Copyright © 2024 www.goindiastocks.com, all rights are reserved
      </div>
    </div>
  );
};

export default MobileFooter;
