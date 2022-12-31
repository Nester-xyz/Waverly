import React, { useContext } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import { HiMoon, HiSun } from "react-icons/hi2";
import { BsGithub } from "react-icons/bs";
const Settings = ({ setSettingActive }) => {
  const { Dark, setDark } = useContext(WaverlyContext);
  const themeToggler = () => {
    // setSwitch(!Switch);
    console.log("toggled");
  };

  const DarkToggle = () => {
    setDark(!Dark);
    localStorage.setItem("dark", !Dark);
  };
  return (
    <div className="mt-20 w-[40rem] ">
      <button
        onClick={(e) => {
          console.count("1");
          setSettingActive(false);
        }}
        className={`absolute top-20 left-5 text-3xl  focus:outline-none rounded-full bg-[#efefef] ${
          Dark ? "darktheme hover:border-[#ff7521]" : "logout"
        }`}
      >
        <IoArrowBackCircleOutline />
      </button>
      <div>
        <div>
          <div className=" mt-40 ml-3 mr-3 flex gap-96 border-2 items-center rounded-lg">
            <div className="lato ml-3 text-2xl select-none">Theme Switch:</div>
            {!Dark ? (
              <div
                className="scale-90 rounded-full cursor-pointer "
                onClick={() => {
                  themeToggler();
                  DarkToggle();
                }}
              >
                <HiMoon
                  style={{
                    color: "#151633",
                    fontSize: "40px",
                    padding: "2.5px",
                  }}
                />
              </div>
            ) : (
              <div
                className="scale-90 text-xs rounded-full cursor-pointer"
                onClick={() => {
                  themeToggler();
                  DarkToggle();
                }}
              >
                <HiSun
                  style={{
                    color: "#FDB813",
                    fontSize: "40px",
                    padding: "1px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="select-none mt-2 ml-3 mr-3 border-2 rounded-lg flex">
          <div className="flex gap-[21rem] mt-2 lato text-2xl ml-3 ">
            Want to contribute?
            <a
              className={`${
                Dark ? "text-white" : "text-[#151633]"
              } scale-125 mr-3 cursor-pointer`}
              href="https://github.com/DeWhales-xyz/Waverly"
              onClick="https://github.com/DeWhales-xyz/Waverly"
              target="_blank"
              rel="noreferrer"
            >
              <BsGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
