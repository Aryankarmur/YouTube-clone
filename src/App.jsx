import React, { useState } from "react";
import Navbar from "./component/Navbar/Navbar";
import Sidebar from "./component/Sidebar/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Video from "./pages/Video/Video";

const App = () => {
  // sidebar css
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith("/video");

  const [sidebar, setSidebar] = useState(isWatchPage ? false : true);

  // Change CSS class names based on the page type and toggle state
  const sidebarClass = isWatchPage
    ? sidebar
      ? ""
      : " sidebar-hidden"
    : sidebar
      ? "sidebar-wide"
      : "sidebar-mini";

  const iconStyle =
    sidebarClass === "sidebar-mini" ? "side-link-mini" : "side-link";

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Sidebar
        sidebar={sidebar}
        setSidebar={setSidebar}
        sidebarClass={sidebarClass}
        iconStyle={iconStyle}
      />
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
    </div>
  );
};

export default App;
