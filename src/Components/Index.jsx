import React, { useState, useEffect } from "react";
import Landing from "./Landing";
import LoggedIn from "./LoggedIn";
import "./Index.css";
import Nav from "./Nav";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

function Index() {
    const [logIn, setLogIn] = useState(false);
    const [settingActive, setSettingActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [Dark, setDark] = useState(false);
    const [textBoxActive2, setTextBoxActive2] = useState(false);
    const [shower, setShower] = useState("diamond");

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const isDark = localStorage.getItem("dark");
        const diamondORheart = localStorage.getItem("showerOption");
        if (diamondORheart === "heart") {
            setShower("heart");
        }
        if (diamondORheart === "diamond") {
            setShower("diamond");
        }
        if (isLoggedIn === "true") {
            setLogIn(true);
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
                    logIn,
                    setLogIn,
                }}
            >
                <Router>
                    <div>
                        <Nav
                            logIn={logIn}
                            setSettingActive={setSettingActive}
                            menuActive={menuActive}
                            setMenuActive={setMenuActive}
                            Dark={Dark}
                            setDark={setDark}
                        />
                        <Routes>
                            {logIn ? (
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
                            ) : (
                                <Route exact path="/" element={<Landing logIn={setLogIn} />} />
                            )}
                        </Routes>
                    </div>
                </Router>
            </WaverlyContext.Provider>
        </>
    );
}

export default Index;