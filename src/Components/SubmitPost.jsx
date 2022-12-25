import React, { useState, useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
// import Deso from "deso-protocol";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import "./Submit.css";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function SubmitPost({ response, toggleSubmit }) {
  const [checkBoxActive, setCheckBoxActive] = useState(false);
  const { Dark } = useContext(WaverlyContext);

  setTimeout(() => {
    document.getElementById("check").checked = true;
    setCheckBoxActive(true);
  }, 700);

  return (
    // main border
    <div className="w-[40rem]   ">
      <button
        onClick={() => toggleSubmit(false)}
        className={`absolute top-20 left-5 text-3xl rounded-full focus:outline-none  ${
          Dark ? "darktheme hover:border-orange-400" : "logout"
        }`}
      >
        <IoArrowBackCircleOutline />
      </button>
      <div className="w-[56rem] -mt-12 -ml-28">
        <input type="checkbox" id="check" />
        <label id="label" htmlFor="check">
          <div className="check-icon"></div>
        </label>
        <div className="">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://diamondapp.com/posts/${response?.submittedTransactionResponse?.PostEntryResponse.PostHashHex}`}
            onClick={`https://diamondapp.com/posts/${response?.submittedTransactionResponse?.PostEntryResponse.PostHashHex}`}
          >
            <button
              className={`absolute gap-2 flex items-center select-none top-[17rem] ${
                Dark
                  ? "bigbtn-dark hover:border-[#ff7521] border-2"
                  : "bigbtn bg-[#efefef]"
              } left-[13.5rem] focus:outline-none  ${
                checkBoxActive ? "block" : "hidden"
              }`}
            >
              <FaExternalLinkAlt /> VIEW POST
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
