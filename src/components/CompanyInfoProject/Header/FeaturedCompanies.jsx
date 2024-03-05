import Image from "next/image";
import capri from "../../../assetsCompanyInfo/companieslogo/capri.png";
import fino from "../../../assetsCompanyInfo/companieslogo/fino.png";
import gravita from "../../../assetsCompanyInfo/companieslogo/gravita.png";
import hira from "../../../assetsCompanyInfo/companieslogo/hira.png";
const FeaturedCompanies = () => {
  return (
    <div>
      <h1 className="text-xl text-red-600 font-semibold px-5 py-1 w-full bg-white">
        FEATURED COMPANIES
      </h1>
      <div className="bg-sky-100 px-5 py-2 flex items-center gap-4 overflow-hidden">
        <Image src={capri} alt="capri" height="35" />
        <Image src={fino} alt="fino" height="35" />
        <Image src={gravita} alt="gravita" height="35" />
        <Image src={hira} alt="hira" height="35" />
        <Image src={capri} alt="capri" height="35" />
        <Image src={fino} alt="fino" height="35" />
        <Image src={gravita} alt="gravita" height="35" />
        <Image src={hira} alt="hira" height="35" />
        <Image src={capri} alt="capri" height="35" />
        <Image src={fino} alt="fino" height="35" />
        <Image src={gravita} alt="gravita" height="35" />
        <Image src={hira} alt="hira" height="35" />
      </div>
    </div>
  );
};

export default FeaturedCompanies;
