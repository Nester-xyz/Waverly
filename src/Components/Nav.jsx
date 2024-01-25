import React, { useState, useContext, useEffect } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import img from "../img/waverlydefault.png";
import darkimg from "../img/waverlydark.png";
import { FiSettings } from "react-icons/fi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import {
  getSingleProfile,
  publicKeyToBase58Check,
  identity,
} from "deso-protocol";
import axios from "axios";

function Nav({ setSettingActive, menuActive, setMenuActive }) {
  // change this accordingly. Make it props or whatever you wish
  const [modalOpen, setModalOpen] = useState(false);
  const [pubKey, setPubKey] = useState("");
  const { Dark, setDark } = useContext(WaverlyContext);
  const [username, setUsername] = useState("Waverly");
  const [profile, setProfile] = useState(
    "https://images.deso.org/a5306f0faf3e77360a11f4ea79a9a2fd449eca16f4e708e70bd88d8da1e08430.gif"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("dark");
      if (isDark === "true") {
        setDark(true);
      }
    }
    chrome.storage.local.get("user_key", function (result) {
      console.log(result);
      setPubKey(result.user_key);
      localStorage.setItem("user_key_popup", result.user_key);
    });
    chrome.storage.local.get("jwt_key", function (result) {
      localStorage.setItem("jwt_key_popup", result.jwt_key);
    });
    chrome.storage.local.get("derived_seed_hex", function (result) {
      localStorage.setItem("derived_seed_hex_popup", result.derived_seed_hex);
    });
    chrome.storage.local.get("derived_pub_key", function (result) {
      localStorage.setItem("derived_pub_key_popup", result.derived_pub_key);
    });
  }, [Dark, setDark]);

  const handleLogOut = async () => {
    try {
      localStorage.clear();
      chrome.storage.local.clear(function () {
        console.log("Chrome Storage cleared");
      });
      window.location.reload();
      if (chrome && chrome.action && chrome.action.setPopup) {
        chrome.action.setPopup({ popup: "" });
      } else {
        console.error("Error: browserAction API is not available");
      }
      chrome.tabs.create({ url: "./welcome.html" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`absolute w-[40rem] ${!Dark ? "navbar" : "darknav"}`}>
      <div className="flex justify-between ">
        <nav>
          <img
            src={!Dark ? img : darkimg}
            alt=""
            className="select-none w-36 h-30 mt-1 cursor-pointer"
          />
        </nav>

        <div className="flex gap-4 items-center">
          <div
            className="relative"
            onMouseEnter={() => setModalOpen(true)}
            onMouseLeave={() => setModalOpen(false)}
          >
            <img
              src={`https://node.deso.org/api/v0/get-single-profile-picture/${pubKey}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
              className={`${
                Dark ? "profile-dark" : "logout"
              } select-none w-11 h-11 rounded-full  mr-5 scale-90`}
              alt="prof img"
              onClick={(e) => {
                e.preventDefault();
                setMenuActive(!menuActive);
              }}
            />
            <div
              className={`${
                Dark ? "dark-mode" : ""
              } absolute right-5 w-36 bg-white border-3 shadow-lg rounded-lg ${
                modalOpen ? "block" : "hidden"
              } z-50`}
            >
              <a
                href={`https://www.diamondapp.com/u/${username}`}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={`select-none cursor-pointer border-b-[0.1rem] text-base px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 ${
                    Dark ? "hover:bg-[#f69552]" : "hover:bg-blue-300"
                  } hover:rounded-t-[0.31rem]`}
                  onClick={() => {
                    setSettingActive(false);
                  }}
                >
                  <CgProfile />
                  Profile
                </div>
              </a>
              <div
                className={`select-none cursor-pointer border-b-[0.1rem] text-base px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 ${
                  Dark ? "hover:bg-[#f69552]" : "hover:bg-blue-300"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setModalOpen(false);
                  setSettingActive(true);
                }}
              >
                <FiSettings />
                Settings
              </div>
              <div
                className={`select-none cursor-pointer rounded-b-lg text-base px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 ${
                  Dark ? "hover:bg-[#f69552]" : "hover:bg-blue-300"
                }`}
                onClick={handleLogOut}
              >
                <RiLogoutCircleRLine />
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
