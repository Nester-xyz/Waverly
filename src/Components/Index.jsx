import React, { useState, useEffect } from "react";
import Landing from "./Landing";
import LoggedIn from "./LoggedIn";
import "./Index.css";
import Nav from "./Nav";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

function Index() {
  const [settingActive, setSettingActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [Dark, setDark] = useState(false);
  const [textBoxActive2, setTextBoxActive2] = useState(false);
  const [shower, setShower] = useState("diamond");
  const [tipLevel, setTipLevel] = useState("1");

  useEffect(() => {
    const isDark = localStorage.getItem("dark");
    const diamondORheart = localStorage.getItem("showerOption");
    if (diamondORheart === "heart") {
      setShower("heart");
    }
    if (diamondORheart === "diamond") {
      setShower("diamond");
    }
    if (isDark === true) {
      setDark(true);
    }
  }, []);

  return (
    <>
      <WaverlyContext.Provider
        value={{
          Dark,
          setDark,
          setSettingActive,
          textBoxActive2,
          setTextBoxActive2,
          tipLevel,
          setTipLevel,
        }}
      >
        <Router>
          <div>
            <Nav
              setSettingActive={setSettingActive}
              menuActive={menuActive}
              setMenuActive={setMenuActive}
              Dark={Dark}
              setDark={setDark}
            />
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <LoggedIn
                    settingActive={settingActive}
                    setSettingActive={setSettingActive}
                    menuActive={menuActive}
                    setMenuActive={setMenuActive}
                    Dark={Dark}
                    setDark={setDark}
                    shower={shower}
                    setShower={setShower}
                  />
                }
              />
            </Routes>
          </div>
        </Router>
      </WaverlyContext.Provider>
    </>
  );
}

export default Index;
