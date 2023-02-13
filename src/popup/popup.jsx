import React from "react";
import Landing from "../Components/Landing";
import Nav from "../Components/Nav";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";

const App = (
  <>
    <Nav />
    <Landing />
  </>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(App);
