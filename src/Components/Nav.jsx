import React, { useState, useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import img from "../img/waverly default.png";
import darkimg from "../img/waverly dark.png";
// import { CgLogOff } from "react-icons/cg";
import { HiMoon, HiSun } from "react-icons/hi2";

import { FiSettings } from "react-icons/fi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Deso from "deso-protocol";
import { useNavigate } from "react-router-dom";
function Nav({ logIn, setSettingActive, menuActive, setMenuActive }) {
  // change this accordingly. Make it props or whatever you wish
  // const [modalOpen, setmodalOpen] = useState(false);
  const { Dark, setDark } = useContext(WaverlyContext);
  const [Switch, setSwitch] = useState(true);
  const [profile, setProfile] = useState(
    "https://images.deso.org/a5306f0faf3e77360a11f4ea79a9a2fd449eca16f4e708e70bd88d8da1e08430.gif"
  );
  const navigate = useNavigate();

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

  const themeToggler = () => {
    setSwitch(!Switch);
    console.log("toggled");
  };

  const DarkToggle = () => {
    setDark(!Dark);
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

        {logIn ? (
          <div className="flex gap-4 items-center">
            {Switch ? (
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
              {Dark ? (
                <div
                  className={`absolute right-5 text-white w-32 bg-[#2d2a2a] shadow-lg border rounded-lg hidden group-hover:block z-50`}
                >
                  <div
                    className="select-none cursor-pointer border-b-[0.1rem] px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 hover:bg-[#FF5733] hover:rounded-t-[0.31rem]"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingActive(true);
                    }}
                  >
                    <CgProfile />
                    Profile
                  </div>
                  <div
                    className="select-none cursor-pointer border-b-[0.1rem] px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 hover:bg-[#FF5733]"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingActive(true);
                    }}
                  >
                    <FiSettings />
                    Settings
                  </div>
                  <div
                    className="select-none cursor-pointer px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 hover:bg-orange-300 hover:rounded-b-[0.31rem]"
                    onClick={handleLogOut}
                  >
                    <RiLogoutCircleRLine />
                    Logout
                  </div>
                </div>
              ) : (
                <div
                  className={`absolute right-5 w-32 bg-white border-3 shadow-lg rounded-lg hidden group-hover:block z-50`}
                >
                  <div
                    className="select-none cursor-pointer border-b-[0.1rem] px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 hover:bg-orange-300 hover:rounded-t-[0.31rem]"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingActive(true);
                    }}
                  >
                    <CgProfile />
                    Profile
                  </div>
                  <div
                    className="select-none cursor-pointer border-b-[0.1rem] px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 hover:bg-orange-300"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingActive(true);
                    }}
                  >
                    <FiSettings />
                    Settings
                  </div>
                  <div
                    className="select-none cursor-pointer px-3 py-1 lato flex items-center gap-2 transition-all ease-in duration-75 hover:bg-orange-300 hover:rounded-b-[0.31rem]"
                    onClick={handleLogOut}
                  >
                    <RiLogoutCircleRLine />
                    Logout
                  </div>
                </div>
              )}

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
