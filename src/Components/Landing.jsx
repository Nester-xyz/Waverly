import React from "react";
import "../assets/app.css";

const Landing = () => {
  return (
    <div className="w-[40rem] h-[25rem] border">
      <div className="w-full h-full flex justify-center items-center text-center">
        <div>
          <div className="absolute top-40 left-14  text-3xl text-center welcomewaverly">
            <span id="welcometo">Welcome to </span>Waverly 🌊👋
          </div>
          <button
            className="absolute top-60 left-52 btn focus:outline-none
            bg-[#efefef] bigbtn"
          >
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
