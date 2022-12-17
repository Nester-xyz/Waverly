import React, { useState, useEffect } from "react";
import Landing from "./Components/Landing";
import LoggedIn from "./Components/LoggedIn";
import Nav from "./Components/Nav";

import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import Settings from "./Components/Settings";

function App() {
  const [logIn, setLogIn] = useState(false);
  const [settingActive, setSettingActive] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setLogIn(true);
    }
  }, []);

  return (
    <>
      <Router>
        <div>
          <Nav logIn={logIn} setSettingActive={setSettingActive} />

          <Routes>
            {logIn ? (
              <Route
                exact
                path="/"
                element={
                  <LoggedIn
                    settingActive={settingActive}
                    setSettingActive={setSettingActive}
                  />
                }
              />
            ) : (
              <Route exact path="/" element={<Landing logIn={setLogIn} />} />
            )}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
