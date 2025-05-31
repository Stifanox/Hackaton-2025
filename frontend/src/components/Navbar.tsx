import { SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="fixed left-4 top-64 z-50">
      <div className="flex flex-col px-1 py-3 bg-white/30 backdrop-blur-sm shadow-lg rounded-full">
        <nav className="flex flex-col gap-2 px-2 items-center text-zinc-300">
          <a href="" className="block py-1 border-b-[1px]">
            <SiGmail size={24} />
          </a>
          <a href="" className="block py-1">
            <SiGmail size={24} />
          </a>
          <a href="" className="block py-1">
            <FaLinkedin size={24} />
          </a>
          <a href="" className="block py-1">
            <FaGithub size={24} />
          </a>
          <a href="" className="block py-1">
            <FaInstagram size={24} />
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
