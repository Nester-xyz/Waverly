import React from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const Settings = ({ setSettingActive }) => {
  return (
    <div className="mt-20 w-[40rem] ">
      <button
        onClick={(e) => {
          console.count("1");
          setSettingActive(false);
        }}
        className=" absolute top-20 left-5 text-3xl  focus:outline-none bg-[#efefef] logout"
      >
        <IoArrowBackCircleOutline />
      </button>
      <div>
        <div>
          <div className="ml-10 mt-48 lato">Settings</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
