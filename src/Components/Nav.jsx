import React from "react";

//trying to import one icon from react-icons
//throws error like module not found
import { FaBeer } from "react-icons/fa";
import img from "../img/waverlydefault.png";

const Nav = () => {
  return (
    <div className={`absolute w-[40rem]`}>
      <div className="flex justify-between ">
        <nav>
          <img
            src={img}
            alt=""
            className="select-none w-36 h-30 mt-1 cursor-pointer"
          />
          <FaBeer />
        </nav>
      </div>
    </div>
  );
};

export default Nav;
