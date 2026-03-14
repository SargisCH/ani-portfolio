import { getProjectById } from "@/lib/actions";
import Image from "next/image";
export const dynamic = "force-dynamic";

export default async function Project({ params }: { params: { id: string } }) {
  const { id } = await params;
  const project = await getProjectById(id);
  return (
    <main>
      <div
        className="box-border w-full min-h-[350px] px-10 lg:px-28 py-12 bg-[#392214] flex flex-col text-white"
        id="ind-about"
      >
        <h1 className="text-4xl mb-10 text-center lg:text-left">
          {project?.title}
        </h1>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="w-full lg:w-2/3">
            <div className="text-md lg:text-lg leading-relaxed">
              {project?.description}
            </div>
          </div>

          <div className="w-full lg:w-1/3 text-lg lg:text-xl space-y-4">
            <div className="flex justify-between border-b border-white/20 pb-2">
              <span className="font-semibold opacity-80">Date</span>
              <span>{project?.date}</span>
            </div>

            {project?.tools && (
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span className="font-semibold opacity-80">Tools used</span>
                <span className="text-right ml-4">{project.tools}</span>
              </div>
            )}

            {project?.location && (
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span className="font-semibold opacity-80">Location</span>
                <span>{project.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#f7f6f1] pt-20 p-6 lg:p-12 flex flex-col lg:flex-row flex-wrap justify-between gap-10">
        {project?.renders.map((renderSrc, index) => (
          <img
            className="w-full lg:w-[calc(50%-20px)] h-auto object-cover rounded-lg shadow-sm"
            key={index}
            src={renderSrc}
            alt={`${project?.title} render ${index + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
