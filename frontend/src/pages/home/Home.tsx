import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { FaAngleRight } from "react-icons/fa";
import Features from "./Features";

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  useGSAP(() => {
    gsap.set("#hero-frame", {
      clipPath: "polygon(9% 7%, 73% 0, 91% 94%, 0% 100%)",
      borderRadius: "0 0 40% 5%",
    });

    gsap.from("#hero-frame", {
      clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-frame",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const handleTimeUpdate = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = e.currentTarget;
    if (video.currentTime >= 8) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden">
        <div id="hero-frame" className="absolute inset-0 overflow-hidden">
          <video
            id="hero-video"
            className="absolute inset-0 w-full h-full object-cover"
            src="/absolute-cinema.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
          />
          <div className="absolute left-4 bottom-8 text-sm text-white">
            <p>
              Wypróbuj nasz kreator za darmo i sprawdź jak <br /> najlepiej
              zoptymalizować instalację fotowoltaiczną
            </p>
          </div>
          <div className="absolute right-4 top-10">
            <h1 className="text-[64px] font-archivo font-semibold text-white">
              Fredi KGB
            </h1>
          </div>
          <button className=" absolute right-16 bottom-8 px-4 py-2 rounded-full bg-white font-semibold cursor-pointer flex gap-2 justify-center items-center">
            Rozpocznij <FaAngleRight size={16} />
          </button>
        </div>
      </div>
      <Features />
    </>
  );
};

export default Home;
