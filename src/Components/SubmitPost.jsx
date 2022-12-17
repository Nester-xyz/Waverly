import React, { useState } from "react";
// import Deso from "deso-protocol";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import "./Submit.css";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function SubmitPost({ response, toggleSubmit }) {
  const [checkBoxActive, setCheckBoxActive] = useState(false);

  setTimeout(() => {
    document.getElementById("check").checked = true;
    setCheckBoxActive(true);
  }, 700);

  return (
    // main border
    <div className="w-[40rem] h-[25rem] border-red-200 border ">
      <button
        onClick={() => toggleSubmit(false)}
        className=" absolute top-20 left-5 text-3xl  focus:outline-none bg-[#efefef] logout"
      >
        <IoArrowBackCircleOutline />
      </button>
      <div className="w-[40rem]  ">
        <input type="checkbox" id="check" />
        <label id="label" htmlFor="check">
          <div className="check-icon"></div>
        </label>

        <a
          href={`https://diamondapp.com/posts/${response?.submittedTransactionResponse?.PostEntryResponse.PostHashHex}`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            className={`bigbtn absolute gap-2 flex items-center top-[17rem] bg-[#efefef] left-[13.5rem] focus:outline-none  ${
              checkBoxActive ? "block" : "hidden"
            }`}
          >
            <FaExternalLinkAlt /> VIEW POST
          </button>
        </a>
      </div>
    </div>
  );
}
