"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { getProjectById } from "@/lib/actions";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Project = {
  id: string;
  title: string;
  thumbs: string[];
  sortIndex: number;
};

type ProjectDetail = {
  title: string;
  description: string;
  id: string;
  thumbs: string[];
  renders: string[];
  location: string;
  date: string;
  tools: string;
};

const PRELOAD_AHEAD = 2;

type LoadSignal = { aborted: boolean; currentImg: HTMLImageElement | null };

function preloadImage(src: string, cache: Set<string>, signal: LoadSignal): Promise<void> {
  if (signal.aborted || cache.has(src)) return Promise.resolve();
  cache.add(src);
  return new Promise((resolve) => {
    const img = new window.Image();
    signal.currentImg = img;
    img.onload = () => { signal.currentImg = null; resolve(); };
    img.onerror = () => { signal.currentImg = null; resolve(); };
    img.src = src;
  });
}

async function preloadSequential(srcs: string[], cache: Set<string>, signal: LoadSignal) {
  for (const src of srcs) {
    if (signal.aborted) break;
    await preloadImage(src, cache, signal);
  }
}

export default function ProjectSliderModal({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadedUpTo, setLoadedUpTo] = useState(PRELOAD_AHEAD);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const preloadCache = useRef<Set<string>>(new Set());
  const loadSignal = useRef<LoadSignal>({ aborted: false, currentImg: null });

  const openSlider = async (id: string) => {
    loadSignal.current = { aborted: false, currentImg: null };
    preloadCache.current = new Set();
    setLoading(true);
    setLoadedUpTo(PRELOAD_AHEAD);
    const data = await getProjectById(id);
    if (data) {
      setActiveProject(data);
      preloadSequential(data.renders.slice(0, PRELOAD_AHEAD), preloadCache.current, loadSignal.current);
    }
    setLoading(false);
  };

  const closeSlider = (fromPopState = false) => {
    loadSignal.current.aborted = true;
    if (loadSignal.current.currentImg) {
      loadSignal.current.currentImg.src = "";
      loadSignal.current.currentImg = null;
    }
    if (!fromPopState) window.history.back();
    setActiveProject(null);
  };

  useEffect(() => {
    if (!activeProject && !loading) return;
    window.history.pushState({ slider: true }, "");
    const onPopState = () => closeSlider(true);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, loading]);

  // realIndex 0 = description, realIndex N = renders[N-1]
  // so next 2 renders to preload are renders[realIndex] and renders[realIndex+1]
  const handleSlideChange = (realIndex: number, renders: string[]) => {
    setLoadedUpTo((prev) => Math.max(prev, realIndex + PRELOAD_AHEAD));
    const toPreload = Array.from({ length: PRELOAD_AHEAD }, (_, i) => renders[realIndex + i]).filter(Boolean) as string[];
    preloadSequential(toPreload, preloadCache.current, loadSignal.current);
  };

  return (
    <>
      <div className="min-h-[850px] bg-[#f7f6f1] flex flex-col">
        {projects
          .sort((a, b) => a.sortIndex - b.sortIndex)
          .map((project) => (
            <div className="mt-6 px-16 md:px-28 lg:px-22" key={project.id}>
              <h2 className="text-4xl text-[#392214]">{project.title}</h2>
              <div className="mt-6 flex w-full flex-col lg:flex-row items-center">
                <div className="flex flex-col lg:flex-row shrink-0 w-full">
                  {project.thumbs.map((thumb, index) => (
                    <div
                      key={index}
                      className="flex lg:mr-5 lg:nth-4:hidden xl:nth-4:flex mt-4 lg:mt-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        className="object-cover w-full lg:w-[300px] block rounded-lg"
                        alt={`preview ${index}`}
                      />
                    </div>
                  ))}
                  <div className="flex items-center">
                    <button
                      className="text-xl hover:underline font-bold text-[#392214] mt-4 lg:mt-0 lg:ml-5 cursor-pointer"
                      onClick={() => openSlider(project.id)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {(loading || activeProject) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => closeSlider()}
        >
          <div
            className="relative w-full h-[100dvh] sm:max-w-4xl sm:h-[90vh] bg-[#f7f6f1] sm:rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 z-10 text-[#392214] font-bold text-xl leading-none hover:opacity-70 bg-[#f7f6f1]/80 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => closeSlider()}
            >
              ✕
            </button>

            {loading && (
              <div className="flex items-center justify-center h-full text-[#392214] text-xl">
                Loading…
              </div>
            )}

            {activeProject && !loading && (
              <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true }}
                navigation
                loop
                onSlideChange={(swiper) => handleSlideChange(swiper.realIndex, activeProject.renders)}
                className="h-full"
                style={
                  {
                    "--swiper-pagination-color": "#392214",
                    "--swiper-navigation-color": "#392214",
                  } as React.CSSProperties
                }
              >
                {/* Slide 0 — description */}
                <SwiperSlide>
                  <div className="h-full overflow-y-auto flex flex-col justify-center"><div className="px-6 py-10 sm:px-16 sm:py-14 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-bold text-[#392214] mb-5">
                      {activeProject.title}
                    </h2>
                    <p className="text-[#392214] text-base leading-relaxed mb-8 whitespace-pre-line">
                      {activeProject.description}
                    </p>
                    <div className="border-t border-[#392214]/30 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#392214] w-full">
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wide mb-1">Date</div>
                        <div>{activeProject.date}</div>
                      </div>
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wide mb-1">Location</div>
                        <div>{activeProject.location}</div>
                      </div>
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wide mb-1">Tools</div>
                        <div>{activeProject.tools}</div>
                      </div>
                    </div>
                  </div></div>
                </SwiperSlide>

                {/* Render slides — only mount image if within loadedUpTo */}
                {activeProject.renders.map((render, index) => {
                  const slideIndex = index + 1;
                  const loaded = slideIndex <= loadedUpTo;
                  return (
                    <SwiperSlide key={index}>
                      <div className="h-full flex items-center justify-center bg-[#f7f6f1]">
                        {loaded ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={render}
                            alt={`render ${index + 1}`}
                            className="max-h-full max-w-full object-contain cursor-zoom-in p-10"
                            onClick={() => setEnlargedImage(render)}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full border-4 border-[#392214]/30 border-t-[#392214] animate-spin" />
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 cursor-zoom-out"
          onClick={() => setEnlargedImage(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enlargedImage}
            alt="enlarged"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
