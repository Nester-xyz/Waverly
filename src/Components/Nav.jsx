import React, { useState, useContext, useEffect } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import img from "../img/waverlydefault.png";
import darkimg from "../img/waverlydark.png";
// import { CgLogOff } from "react-icons/cg";

import { FiSettings } from "react-icons/fi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Deso from "deso-protocol";
import { useNavigate } from "react-router-dom";
function Nav({ logIn, setSettingActive, menuActive, setMenuActive }) {
  // change this accordingly. Make it props or whatever you wish
  // const [modalOpen, setmodalOpen] = useState(false);
  const { Dark, setDark } = useContext(WaverlyContext);
  // const [Switch, setSwitch] = useState(true);
  const [username, setUsername] = useState("Waverly");
  const [profile, setProfile] = useState(
    "https://images.deso.org/a5306f0faf3e77360a11f4ea79a9a2fd449eca16f4e708e70bd88d8da1e08430.gif"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("dark");
      if (isDark === "true") {
        setDark(true);
      }
    }
  }, [Dark, setDark]);

  const handleLogOut = async () => {
    try {
      const deso = new Deso();
      const request = localStorage.getItem("deso_user_key");
      const response = await deso.identity.logout(request);
      localStorage.setItem("isLoggedIn", !response);
      localStorage.setItem("user_key", "");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  async function getProfileImage() {
    try {
      const pub_key = localStorage.getItem("user_key");
      const deso = new Deso();
      const request1 = {
        PublicKeyBase58Check: pub_key,
      };
      const response1 = await deso.user.getSingleProfile(request1);
      const request2 = pub_key;
      const response2 = await deso.user.getSingleProfilePicture(request2);
      setUsername(response1.Profile.Username);
      if (response1.Profile.ExtraData != null) {
        if (response1.Profile.ExtraData.NFTProfilePictureUrl != null) {
          setProfile(response1.Profile.ExtraData.NFTProfilePictureUrl);
        } else {
          setProfile(response2);
        }
      } else {
        setProfile(response2);
      }
    } catch (error) {
      console.error(error);
    }
  }

  logIn && getProfileImage();

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

        {logIn ? (
          <div className="flex gap-4 items-center">
            <div className="relative group">
              <img
                src={profile}
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
                } absolute right-5 w-36 bg-white border-3 shadow-lg rounded-lg hidden group-hover:block z-50`}
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

              {/* </div>
                  <div>
                    <button onClick={handleLogOut} className="logout mr-5  scale-90">
                      <IconContext.Provider
                        value={{ color: "#ff7521", size: "27px" }}
                      >
                        <CgLogOff style={{ size: "200px" }} />
                      </IconContext.Provider>
                    </button> */}
            </div>
          </div>
        ) : (
          " "
        )}
      </div>
    </div>
  );
}

export default Nav;

// test
