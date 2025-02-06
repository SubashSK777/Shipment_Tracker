import React from "react";
import { motion } from "framer-motion";
import { FiBatteryCharging, FiWifi } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Center from "../animated-components/Center";
import Left from "../animated-components/Left";
import Right from "../animated-components/Right";
import logo from "../assets/logo-hck.svg";
import BG from "../assets/trainBG.jpg";

const Home = () => {
  return (
    <section
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

      }}
      className="w-screen h-screen my-2 mx-auto text-char flex items-start justify-between gap-4"
    >
      <div className="mt-16 w-full flex flex-col items-start justify-between gap-8 md:px-8">
        <div className="flex flex-col gap-2">
          <Center>
            <div className="w-full flex text-white items-center gap-4 font-bold text-6xl">
              Welcome
            </div>
          </Center>
          <Left>
            <h2 className="max-w-lg text-4xl font-bold md:text-4xl text-white">
              Your Gateway to
              <span className="text-white">
                {" "}
                any Destination in the India.
              </span>
            </h2>
          </Left>
        </div>

        <div className="relative">
          <Center>
            <div className="w-full flex items-center gap-4 font-bold text-7xl">
              <img src={logo} alt="" className="w-24 h-24" />
              <span className="tracking-wide text-white">RailCart</span>
            </div>
          </Center>
        </div>
        <div className="">
          <Right>
            <div className="text-lg font-semibold text-white">
              Delivering the right way!! {"\n"}
              <span className=" text-white">Supply and logistics solution</span>
            </div>
          </Right>
        </div>
      </div>
    </section>
  );
};

const HeaderBar = () => {
  return (
    <>
      <div className="absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md bg-neutral-900"></div>
      <div className="absolute right-3 top-2 z-10 flex gap-2">
        <FiWifi className="text-neutral-600" />
        <FiBatteryCharging className="text-neutral-600" />
      </div>
    </>
  );
};

const Screen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-0 grid h-full w-full place-content-center overflow-hidden rounded-[20px] bg-white">
      {/* Example logo from logoispum */}
      <svg
        width="50"
        height="39"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-[#33006F]"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>

      <button
        onClick={() => {
          // navigate("/dashboard")
          window.location.href = "/dashboard";
        }}
        className="absolute bottom-4 left-4 right-4 z-10 rounded-lg border-[1px] bg-white py-2 text-sm font-medium text-[#33006F] backdrop-blur"
      >
        Get Started
      </button>

      {/* <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-char" /> */}
      <div className="absolute -bottom-72 left-[50%] h-96 w-96 -translate-x-[50%] rounded-full bg-[#33006F]" />
    </div>
  );
};

const BounceCard = ({ className, children }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      className={`group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="mx-auto text-center text-3xl font-semibold">{children}</h3>
  );
};

export default Home;
