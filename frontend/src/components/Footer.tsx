import { SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="relative overflow-hidden h-[150px]">
        <div className="relative overflow-hidden h-[150px]">
          <div className="absolute top-0 left-0 w-[200%] h-full animate-wave">
            <svg
              viewBox="0 0 1440 150"
              className="w-1/2 h-full inline-block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,32 C480,96 960,0 1440,32 C1920,64 2400,0 2880,32 L2880,150 L0,150 Z"
                fill="#27272a"
              />
            </svg>
            <svg
              viewBox="0 0 1440 150"
              className="w-1/2 h-full inline-block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,32 C480,96 960,0 1440,32 C1920,64 2400,0 2880,32 L2880,150 L0,150 Z"
                fill="#27272a"
              />
            </svg>
          </div>

          <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-reverse opacity-50">
            <svg
              viewBox="0 0 1440 150"
              className="w-1/2 h-full inline-block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,32 C480,96 960,0 1440,32 C1920,64 2400,0 2880,32 L2880,150 L0,150 Z"
                fill="#27272a"
              />
            </svg>
            <svg
              viewBox="0 0 1440 150"
              className="w-1/2 h-full inline-block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,32 C480,96 960,0 1440,32 C1920,64 2400,0 2880,32 L2880,150 L0,150 Z"
                fill="#27272a"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="relative h-[200px] w-screen bg-zinc-700 px-16 py-12">
        <div>
          <h3 className="text-white font-semibold text-lg">Fredi KGB</h3>
          <div className="flex flex-row gap-3 text-white mt-2">
            <a href="">
              <SiGmail size={24} />
            </a>
            <a href="">
              <FaLinkedin size={24} />
            </a>
            <a href="">
              <FaGithub size={24} />
            </a>
            <a href="">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
        <div className="absolute bottom-2 left-[50%] -translate-x-[50%] text-zinc-500 text-sm">
          Copyright @2025
        </div>
      </div>
    </>
  );
};

export default Footer;
