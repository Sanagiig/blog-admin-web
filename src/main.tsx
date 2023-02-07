import React from "react";
import ReactDOM from "react-dom/client";
import "resetcss";
// import "antd/dist/antd.min.css"
import "@/assets/styles/global.scss";
import App from "./App";
import {BrowserRouter,HashRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
