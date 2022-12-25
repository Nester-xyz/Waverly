import React, { useContext } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { WaverlyContext } from "../Contexts/WaverlyContext";

const Settings = ({ setSettingActive }) => {
  const { Dark } = useContext(WaverlyContext);
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
          <div className="ml-[10rem] mt-52 text-3xl lato">
            Nothing to show here 🧡
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
