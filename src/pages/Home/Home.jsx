import React from "react";
import "./Home.css";
import Feed from "../../component/Feed/Feed";
import { useSidebar } from "../../context/SidebarContext";
import { useSEO } from "../../hooks/useSEO";

const Home = ({ category }) => {
  const { sidebarState } = useSidebar();

  useSEO({
    title: null, // Use default "YouTube" title
    description: "Watch trending and popular videos on YouTube",
  });

  let homeMainClass = "";
  if (sidebarState === "expanded") {
    homeMainClass = "home-sidebar-expanded";
  } else if (sidebarState === "collapsed") {
    homeMainClass = "home-sidebar-collapsed";
  } else {
    homeMainClass = "home-sidebar-hidden";
  }

  return (
    <main className={`home-main ${homeMainClass}`}>
      <Feed category={category} />
    </main>
  );
};

export default Home;