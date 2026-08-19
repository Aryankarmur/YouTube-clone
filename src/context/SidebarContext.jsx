import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sidebar state model:
 *   "expanded"  — full sidebar with text labels (home page default)
 *   "collapsed" — mini sidebar with icons only (home page toggled)
 *   "hidden"    — completely hidden (video page default, mobile default)
 *
 * Route-based defaults:
 *   /          → expanded (desktop), hidden (mobile)
 *   /search    → expanded (desktop), hidden (mobile)
 *   /video/*   → hidden
 *
 * Breakpoints (consistent with existing CSS):
 *   <= 768px   → mobile  (sidebar hidden by default)
 *   769-1040px → medium  (sidebar collapsed on home/search)
 *   > 1040px   → desktop (sidebar expanded on home/search)
 */

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1040;

const SidebarContext = createContext(null);

/** Determine the correct default sidebar state for a pathname + viewport width. */
function getDefaultState(pathname, viewportWidth) {
  if (viewportWidth <= MOBILE_BREAKPOINT) return "hidden";
  if (pathname.startsWith("/video")) return "hidden";
  if (viewportWidth <= DESKTOP_BREAKPOINT) return "collapsed";
  return "expanded";
}

export function SidebarProvider({ children }) {
  const location = useLocation();
  const [sidebarState, setSidebarState] = useState(() =>
    getDefaultState(location.pathname, window.innerWidth),
  );

  // Track whether the user has manually toggled during this "session"
  // at the current breakpoint zone, so we don't override their choice
  // unless the breakpoint actually changes.
  const prevBreakpointZone = useRef(getBreakpointZone(window.innerWidth));
  const userToggled = useRef(false);

  // Reset sidebar state when the route changes
  useEffect(() => {
    userToggled.current = false;
    setSidebarState(getDefaultState(location.pathname, window.innerWidth));
  }, [location.pathname]);

  // Respond to viewport resize — auto-transition at breakpoint boundaries
  useEffect(() => {
    let rafId = null;

    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const newZone = getBreakpointZone(window.innerWidth);
        const oldZone = prevBreakpointZone.current;

        // Only auto-change state when the breakpoint zone actually changes
        if (newZone !== oldZone) {
          prevBreakpointZone.current = newZone;
          userToggled.current = false;
          setSidebarState(
            getDefaultState(location.pathname, window.innerWidth),
          );
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    userToggled.current = true;
    setSidebarState((prev) => {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
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

/** Map viewport width to a zone identifier for breakpoint crossing detection. */
function getBreakpointZone(width) {
  if (width <= MOBILE_BREAKPOINT) return "mobile";
  if (width <= DESKTOP_BREAKPOINT) return "medium";
  return "desktop";
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export default SidebarContext;
