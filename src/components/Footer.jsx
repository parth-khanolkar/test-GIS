import React from "react";
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
const Footer = () => {
  const router = useRouter();
  return (
    <div className="bg-[#f4f7fa] p-4">
      {/* TOP  Section WEB*/}
      <div className="gap-1 items-start hidden sm:flex justify-between">
        {/* LOGO */}
        <div className="flex-[0.25]">
          <Image src={logo} height={116} width={170} alt="Logo" />
          {/* <div className="flex gap-1 lg:hidden">
            <Image src={playstore} height={25} width={80} alt="Logo" />
            <Image src={applestore} height={25} width={80} alt="Logo" />
          </div> */}
        </div>

        {/* Address and Contact */}
        <div className="border-[#000000] text-sm font-semibold flex-[0.6]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Image src={placeholder} height={29} width={29} alt="Logo" />
              <p className="max-w-[500px] ">
                Office: Parinee Crescenzo, Bandra Kurla Complex, B-Wing, 10th
                Floor, Mumbai, Maharashtra 400051, IN
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={contact} height={29} width={29} alt="Logo" />
              <p>+91 22 62640831</p>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-bold border-b border-black">Socials</h1>
          </div>
          <div className="flex gap-2">
            <a href="https://twitter.com/goindiastocks" target="_blank">
              <Image src={twitter} height={29} width={29} alt="Logo" />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=917710971806&text&type=phone_number&app_absent=0"
              target="_blank"
            >
              <Image src={whatsapp} height={29} width={29} alt="Logo" />
            </a>
            <a
              href="https://www.linkedin.com/company/go-india-advisors"
              target="_blank"
            >
              <Image src={linkedin} height={29} width={29} alt="Logo" />
            </a>
            <a href="mailto:hello@goindiaadvisors.com" target="_blank">
              <Image src={gmail} height={29} width={29} alt="Logo" />
            </a>
          </div>
        </div>

        {/* Mobile App Links */}
        {/* <div className="lg:flex gap-1 items-center hidden">
          <Image
            src={mockups}
            height={130}
            width={180}
            alt="Logo"
            className="hidden lg:inline-block"
          />
          <div className="flex md:flex-col gap-2">
            <Image src={playstore} height={36} width={122} alt="Logo" />
            <Image src={applestore} height={36} width={122} alt="Logo" />
          </div>
        </div> */}
      </div>

      {/* TOP Section Mobile */}
      <div className="flex justify-between gap-1 items-start sm:hidden">
        {/* LOGO and App links*/}
        <div className="flex-[0.3]">
          <Image src={logo} height={200} width={200} alt="Logo" />
          {/* <div className="flex flex-wrap gap-1 justify-between">
            <Image src={playstore} height={25} width={170} alt="Logo" />
            <Image src={applestore} height={25} width={170} alt="Logo" />
          </div> */}
        </div>

        {/* Address, Contact and Socials*/}
        <div className="text-xs lg:text-base border-[#000000] flex-[0.5]">
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <Image src={placeholder} height={14} width={14} alt="Logo" />
              <p className="">
                Office: Parinee Crescenzo, Bandra Kurla Complex, B-Wing, 10th
                Floor, Mumbai, Maharashtra 400051, IN
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={contact} height={14} width={14} alt="Logo" />
              <p>+91 22 62640831</p>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="font-bold border-b border-black">Socials</h1>
              </div>
              <div className="flex gap-2">
                <a href="https://twitter.com/goindiastocks" target="_blank">
                  <Image src={twitter} height={29} width={29} alt="Logo" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=917710971806&text&type=phone_number&app_absent=0"
                  target="_blank"
                >
                  <Image src={whatsapp} height={29} width={29} alt="Logo" />
                </a>
                <a
                  href="https://www.linkedin.com/company/go-india-advisors"
                  target="_blank"
                >
                  <Image src={linkedin} height={29} width={29} alt="Logo" />
                </a>
                <a href="mailto:hello@goindiaadvisors.com" target="_blank">
                  <Image src={gmail} height={29} width={29} alt="Logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM Disclaimer*/}
      <div className="text-xs text-justify py-4 px-2">
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

      {/* Bottom most copyright */}
      <div className="text-xs flex justify-center items-center">
        Copyright © 2024 www.goindiastocks.com, all rights are reserved
      </div>
    </div>
  );
};

export default Footer;
