import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import Index from "../Components/Index";
import '../assets/app.css'

const App = (
  <>
    <Index />
  </>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(App);
