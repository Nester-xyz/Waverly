import React, { useState, useContext, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import { HiMoon, HiSun } from "react-icons/hi2";
import { BsGithub } from "react-icons/bs";
import { BsFillHeartFill } from "react-icons/bs";
import { IoDiamondSharp } from "react-icons/io5";
import { AiOutlineDown } from "react-icons/ai";
const Settings = ({
  setSettingActive,
  shower,
  setShower,
  activeTab,
  setActiveTab,
}) => {
  const [menuActive, setMenuActive] = useState(false);
  const { Dark, setDark } = useContext(WaverlyContext);
  const themeToggler = () => {
    // setSwitch(!Switch);
    console.log("toggled");
  };

  const DarkToggle = () => {
    setDark(!Dark);
    localStorage.setItem("dark", !Dark);
  };

  useEffect(() => {
    console.log(menuActive);
  }, [menuActive]);

  return (
    <div
      className="mt-20 w-[40rem] select-none "
      onClick={() => {
        setMenuActive(false);
      }}
    >
      <button
        onClick={(e) => {
          console.count("1");
          setSettingActive(false);
        }}
        className={`absolute top-20 left-5 text-3xl  focus:outline-none rounded-full bg-[#efefef] ${Dark ? "darktheme hover:border-[#ff7521]" : "logout"
          }`}
      >
        <IoArrowBackCircleOutline />
      </button>
      {/* back btn ends here */}

      <div
        onClick={() => {
          if (menuActive) {
            setMenuActive(false);
          }
        }}
      >
        <div className="mt-40 text-2xl lato">
          {/* shower toggeler */}
          <div className="flex  justify-between items-center mx-3 border-2 py-1 px-2 rounded-lg">
            <div className="lato">Change Shower:</div>
            <div
              className="group relative"
              onMouseEnter={() => setMenuActive(true)}
              onMouseLeave={() => setMenuActive(false)}
            >
              <div
                className={`border pl-3 flex gap-2 relative items-center px-2 ${Dark ? "hover:border-[#f69552]" : "hover:border-blue-400"
                  }`}
                onClick={() => {
                  setMenuActive(!menuActive);
                }}
              >
                <div className="capitalize lato">{shower}</div>{" "}
                <AiOutlineDown />
              </div>
              <div
                className={`divide-y absolute w-full  top-8 border ${Dark ? "bg-[#444]" : "bg-white"
                  } ${menuActive ? "block" : "hidden"} text-lg`}
              >
                <div
                  className={`cursor-pointer px-2 flex items-center gap-2 ${Dark ? "hover:bg-[#f69552]" : "hover:bg-blue-300"
                    }`}
                  onClick={() => {
                    setShower("heart");
                    if (activeTab === "tip") {
                      setActiveTab("heart");
                      localStorage.setItem("showerOption", "heart")
                    }
                  }}
                >
                  <div className="text-sm">
                    <BsFillHeartFill />
                  </div>
                  <div className="lato">Heart</div>
                </div>
                <div
                  className={`cursor-pointer px-2 flex items-center gap-2 ${Dark ? "hover:bg-[#f69552]" : "hover:bg-blue-300"
                    }`}
                  onClick={() => {
                    setShower("diamond");
                    if (activeTab === "heart") {
                      setActiveTab("tip");
                      localStorage.setItem("showerOption", "diamond")
                    }
                  }}
                >
                  <div className="text-sm">
                    <IoDiamondSharp />
                  </div>
                  <div className="lato">Diamond</div>
                </div>
              </div>
            </div>
          </div>

          {/* theme toggle */}
          <div
            className="flex justify-between items-center border-2 rounded-lg px-2 mx-3 py-0.5 my-2 cursor-pointer"
            onClick={() => {
              setMenuActive(false);
              themeToggler();
              DarkToggle();
            }}
          >
            <div className="select-none lato">Theme Switch:</div>
            {/* icons */}
            <div className="px-3">
              {!Dark ? (
                <div>
                  {" "}
                  <HiMoon
                    style={{
                      color: "#151633",
                      fontSize: "40px",
                      padding: "2.5px",
                    }}
                  />
                </div>
              ) : (
                <div>
                  {" "}
                  <HiSun
                    style={{
                      color: "#FDB813",
                      fontSize: "40px",
                      padding: "1px",
                    }}
                  />{" "}
                </div>
              )}
            </div>
          </div>

          {/* github handle */}
          <div className="border-2 rounded-lg lato mx-3 px-3 py-1 select-none">
            <a
              className={`flex justify-between items-center ${Dark ? "text-white" : "text-[#151633]"
                }`}
              href="https://github.com/DeWhales-xyz/Waverly"
              onClick="https://github.com/DeWhales-xyz/Waverly"
              target="_blank"
              rel="noreferrer"
            >
              <div className="lato">Want to contribute?</div>
              <div className="text-3xl mr-3">
                <BsGithub />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
