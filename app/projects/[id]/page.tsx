import { getProjectById } from "@/lib/actions";
import Image from "next/image";
export const dynamic = "force-dynamic";

export default async function Project({ params }: { params: { id: string } }) {
  const { id } = await params;
  const project = await getProjectById(id);
  return (
    <main>
      <div
        className=" 
box-border w-full min-h-[350px] px-10 lg:px-28 py-12 bg-[#392214] items-center flex flex-col lg:flex-row lg:justify-between justify-center"
        id="ind-about"
      >
        <div className="w-[90%] lg:w-[50%] text-white">
          <h1 className="text-4xl">{project?.title}</h1>
          <div className="w-full mt-6 text-md lg:text-lg">
            {project?.description}
          </div>
        </div>
        <div className="w-[90%] lg:w-[35%] mt-20 text-2xl text-white">
          <p className="justify-between flex">
            <span>Date</span>
            <span>{project?.date}</span>
          </p>
          {project?.tools && (
            <p className="justify-between flex">
              <span>Tools used</span>
              <span>{project.tools}</span>
            </p>
          )}
          {project?.location && (
            <p className="justify-between flex">
              <span>Location</span>
              <span>{project.location}</span>
            </p>
          )}
        </div>
      </div>
      <div className="bg-[#f7f6f1] pt-20 p-12 flex flex-col lg:flex-row flex-wrap justify-between gap-5">
        {project?.renders.map((renderSrc, index) => (
          <img
            className="w-full lg:w-[calc(50%-20px)]"
            key={index}
            src={renderSrc}
            alt="Avatar"
            width={100}
            height={20}
          />
        ))}
      </div>
    </main>
  );
}
