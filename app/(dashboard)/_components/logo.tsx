import Image from "next/image";

export const Logo = () => {
  return (
    <><div className="flex items-center">
      <Image src={"/jntugv.jpeg"} alt="Hero image" width={50} height={50} />
      <h1 className="text-violet-600 font-bold mr-4 ml-4 align-right">JNTU-GV</h1>
    </div>
    <div className="flex items-center">
       <h1 className="text-blue-600 font-bold mr-4 ml-4 align-right pl-12">LMS</h1>
    </div>
    </>
  );
};
