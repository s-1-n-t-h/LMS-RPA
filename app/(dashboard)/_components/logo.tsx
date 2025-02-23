import Image from "next/image";

export const Logo = () => {
  return (
    <>
      <div className="flex items-center">
        <Image src={"/cg.jpg"} alt="Hero image" width={450} height={50} />
      </div>
      <div className="flex items-center">
        <h1 className="text-blue-600 font-bold mr-4 ml-4 align-right pl-12 pt-10">
          BanKING
        </h1>
      </div>
      {/* <div className="flex items-center">
        <h1 className="text-blue-600 font-bold mr-4 ml-4 align-right pl-12">
          LMS
        </h1>
      </div> */}
    </>
  );
};
