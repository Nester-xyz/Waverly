import React, { useContext } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import { HiMoon, HiSun } from "react-icons/hi2";
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
          <div className=" mt-40 ml-3 mr-3 text-3xl lato flex gap-96 border-2 items-center rounded-lg">
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
      </div>
    </div>
  );
};

export default Settings;
