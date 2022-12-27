import React, { useState, useContext, useEffect } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import PostOperation from "./PostOperation";
import MintOperation from "./MintOperation";
import TipOperation from "./TipOperation";
import Settings from "./Settings";

// login button
const LoggedIn = ({
  logIn,
  settingActive,
  setSettingActive,
  setMenuActive,
}) => {
  const { dark, setDark } = useContext(WaverlyContext);
  useEffect(() => {
    const isDark = localStorage.getItem("dark");
    if (isDark === true) {
      setDark(true);
    }
  }, [dark]);

  const [submit, setSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const { Dark } = useContext(WaverlyContext);
  let tab;
  if (activeTab === "post")
    tab = <PostOperation submit={submit} setSubmit={setSubmit} />;
  if (activeTab === "mint")
    tab = <MintOperation submit={submit} setSubmit={setSubmit} />;
  if (activeTab === "tip")
    tab = <TipOperation submit={submit} setSubmit={setSubmit} />;
  return (
    <div
      className={`content-start w-[40rem] h-[25rem] border scale  ${
        Dark ? "dark-mode" : "light-mode"
      }`}
      onClick={(e) => {
        e.preventDefault();
        setMenuActive(false);
      }}
    >
      {/* top */}
      {settingActive ? (
        <Settings setSettingActive={setSettingActive} />
      ) : (
        <div>
          {!submit && (
            <div className="w-full grid grid-cols-3 gap-10 mt-20 px-5 pb-2 rounded-lg">
              <button
                onClick={() => setActiveTab("post")}
                className={`select-none
                ${
                  Dark
                    ? `bigbtn-dark ${
                        activeTab === "post"
                          ? `bigbtn-dark-active`
                          : "bigbtn-dark-inactive"
                      }`
                    : ` bigbtn ${
                        activeTab === "post"
                          ? `logout-active bg-[#efefef]`
                          : "bg-[#efefef]"
                      }`
                }
                `}
              >
                POST
              </button>
              <button
                onClick={() => setActiveTab("mint")}
                className={` select-none ${
                  Dark
                    ? `bigbtn-dark ${
                        activeTab === "mint"
                          ? `bigbtn-dark-active`
                          : "bigbtn-dark-inactive"
                      }`
                    : ` bigbtn ${
                        activeTab === "mint"
                          ? `logout-active bg-[#efefef]`
                          : "bg-[#efefef]"
                      }`
                }`}
              >
                MINT
              </button>
              <button
                onClick={() => setActiveTab("tip")}
                className={` select-none ${
                  Dark
                    ? `bigbtn-dark ${
                        activeTab === "tip"
                          ? `bigbtn-dark-active`
                          : "bigbtn-dark-inactive"
                      }`
                    : ` bigbtn ${
                        activeTab === "tip"
                          ? `logout-active bg-[#efefef]`
                          : "bg-[#efefef]"
                      }`
                }`}
              >
                TIP
              </button>
            </div>
          )}
          <div className="overflow-x-hidden overflow-y-auto h-[16.3rem]">
            {tab}
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default LoggedIn;
