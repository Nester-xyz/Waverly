import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import Index from "../Components/Index";

const App = (
  <>
    <Index />
  </>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(App);
