import { getProjects } from "@/lib/actions";
import Image from "next/image";
import ProjectSliderModal from "./ProjectSliderModal";

export const dynamic = "force-dynamic";

export default async function SliderPage() {
  const projects = (await getProjects()) ?? [];

  return (
    <main>
      <div
        className="bg-blend-overlay relative flex min-h-[350px] p-[30px] bg-[#392214] flex-col justify-center pt-[50px] xl:pt-[120px] pb-[50px] bg-cover bg-no-repeat bg-[0%_30%]"
        id="about"
      >
        <div className="flex flex-col xl:flex-row items-center xl:border-t xl:border-gray-500 justify-between px-[50px]">
          <div className="w-full xl:w-[65%] flex-col lg:flex-row flex xl:justify-between lg:justify-center gap-10">
            <div className="flex flex-col items-center">
              <Image
                className="xl:-mt-20 w-[200px] h-[200px] bg-white rounded-full object-cover"
                src="/ani2.png"
                alt="Avatar"
                width={100}
                height={20}
                priority
              />
              <span className="mt-4 text-white text-xl text-center font-bold">
                <div>Ani Stepanyan</div>
                <div>Interior designer</div>
              </span>
            </div>
            <span className="text-white mt-5 w-full text-center lg:text-left lg:w-[520px]">
              I&apos;m Ani, an aspiring Interior Designer from Armenia with a Diploma
              in Painting. I&apos;m excited to explore new experiences in this
              sphere. If you are interested in learning more about my work,
              discussing a potential project, or have any questions or comments,
              please feel free to contact me.
              <div className="mt-2">
                <span className="font-bold">Email: </span>
                anistepanyan.design@gmail.com
              </div>
              <div>
                <span className="font-bold">Behance: </span>
                behance.net/anistepanyan3
              </div>
            </span>
          </div>

          <div className="lg:-mt-20 xl:mt-3 text-white lg:ml-16 xl:ml-0">
            <div className="mt-2 font-bold text-center lg:text-left">
              WHAT I BRING TO THE TABLE:
            </div>
            <div className="pl-2 mt-2 mb-2 text-center lg:text-left">
              <div>- 3ds Max</div>
              <div>- High-quality rendering with Corona Renderer</div>
              <div>- Precise 2D drafting with AutoCAD</div>
              <div>- Smooth coordination with clients and contractors</div>
              <div>- Thoughtful material and finish selection</div>
            </div>
          </div>
        </div>
      </div>

      <ProjectSliderModal projects={projects} />
    </main>
  );
}
