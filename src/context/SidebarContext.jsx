import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sidebar state model:
 *   "expanded"  — full sidebar with text labels (home page default)
 *   "collapsed" — mini sidebar with icons only (home page toggled)
 *   "hidden"    — completely hidden (video page default)
 *
 * Route-based defaults:
 *   /          → expanded
 *   /search    → expanded
 *   /video/*   → hidden
 */

const SidebarContext = createContext(null);

/** Determine the correct default sidebar state for a given pathname. */
function getDefaultState(pathname, isMobile) {
  if (isMobile) return "hidden";
  if (pathname.startsWith("/video")) return "hidden";
  return "expanded";
}

export function SidebarProvider({ children }) {
  const location = useLocation();
  const [sidebarState, setSidebarState] = useState(() =>
    getDefaultState(location.pathname, window.innerWidth <= 768),
  );

  // Reset sidebar state when the route changes
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setSidebarState(getDefaultState(location.pathname, isMobile));
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    setSidebarState((prev) => {
      const isMobile = window.innerWidth <= 768;
      const isVideoPage = location.pathname.startsWith("/video");

      if (isMobile) {
        // Mobile: toggle between hidden ↔ expanded (overlay)
        return prev === "hidden" ? "expanded" : "hidden";
      }

      if (isVideoPage) {
        // Video page: toggle between hidden ↔ expanded
        return prev === "hidden" ? "expanded" : "hidden";
      }

      // Home/Search: toggle between expanded ↔ collapsed
      return prev === "expanded" ? "collapsed" : "expanded";
    });
  }, [location.pathname]);

  const value = {
    sidebarState,
    setSidebarState,
    toggleSidebar,
    isExpanded: sidebarState === "expanded",
    isCollapsed: sidebarState === "collapsed",
    isHidden: sidebarState === "hidden",
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export default SidebarContext;
