import { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import profile_image from "../../assets/jack.png";
import { IoMdMenu } from "react-icons/io";
import { IoMicOutline, IoSearch, IoCloseOutline, IoArrowBack } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useDebounce } from "../../hooks/useDebounce";
import { getSearchSuggestions } from "../../api/youtubeApi";
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const mobileInputRef = useRef(null);
  const abortRef = useRef(null);

  const debouncedQuery = useDebounce(searchInput, 400);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSuggestionsLoading(true);

    getSearchSuggestions({ query: debouncedQuery, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setSuggestions(data?.items || []);
          setSuggestionsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setSuggestionsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // Submit search — shared handler for desktop + mobile, icon + enter
  const handleSearchSubmit = useCallback(
    (query) => {
      const q = (query || searchInput).trim();
      if (!q) return;
      setShowSuggestions(false);
      setSuggestions([]);
      setMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(q)}`);
    },
    [searchInput, navigate],
  );

  // Select a suggestion
  const handleSelectSuggestion = useCallback(
    (title) => {
      setSearchInput(title);
      setShowSuggestions(false);
      setSuggestions([]);
      setMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(title)}`);
    },
    [navigate],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelectSuggestion(suggestions[activeIndex].snippet?.title);
        } else {
          handleSearchSubmit();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        if (mobileSearchOpen) {
          setMobileSearchOpen(false);
        }
      }
    },
    [activeIndex, suggestions, handleSearchSubmit, handleSelectSuggestion, mobileSearchOpen],
  );

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  return (
    <nav className="flex-div" role="navigation" aria-label="Main navigation">
      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="mobile-search-overlay" ref={searchBoxRef}>
          <button
            className="mobile-search-back"
            onClick={() => setMobileSearchOpen(false)}
            type="button"
            aria-label="Close search"
          >
            <IoArrowBack />
          </button>
          <div className="mobile-search-box">
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {searchInput && (
              <button
                className="search-clear-btn"
                onClick={() => {
                  setSearchInput("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                  mobileInputRef.current?.focus();
                }}
                type="button"
                aria-label="Clear search"
              >
                <IoCloseOutline />
              </button>
            )}
            <button
              className="mobile-search-submit"
              onClick={() => handleSearchSubmit()}
              type="button"
              aria-label="Search"
            >
              <IoSearch />
            </button>
          </div>
          <SearchSuggestions
            suggestions={suggestions}
            loading={suggestionsLoading}
            visible={showSuggestions && searchInput.trim().length >= 2}
            onSelect={handleSelectSuggestion}
            activeIndex={activeIndex}
          />
        </div>
      )}

      <div className="nav-left flex-div">
        <button
          className="menu-icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          type="button"
        >
          <IoMdMenu />
        </button>
        <Link to="/" aria-label="YouTube Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="yt-ringo2-svg_yt9"
            width="105"
            height="20"
            viewBox="0 0 105 20"
            focusable="false"
            aria-hidden="true"
          >
            <g>
              <path
                d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"
                fill="#FF0033"
              ></path>
              <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path>
            </g>
            <text x="32" y="16" fontSize="18" fontWeight="bold" fontFamily="sans-serif" fill="currentColor" letterSpacing="-0.5">YWatch</text>
          </svg>
        </Link>
      </div>
      <div className="nav-middle flex-div" ref={!mobileSearchOpen ? searchBoxRef : undefined}>
        <div className="search-box flex-div">
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search-input"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (searchInput.trim().length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls="search-suggestions-list"
            aria-autocomplete="list"
          />
          {searchInput && (
            <button
              className="search-clear-btn"
              onClick={() => {
                setSearchInput("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              type="button"
              aria-label="Clear search"
            >
              <IoCloseOutline />
            </button>
          )}
          <button
            className="search-icon"
            title="Search"
            onClick={() => handleSearchSubmit()}
            type="button"
            aria-label="Search"
          >
            <IoSearch />
          </button>
        </div>
        <SearchSuggestions
          suggestions={suggestions}
          loading={suggestionsLoading}
          visible={showSuggestions && searchInput.trim().length >= 2}
          onSelect={handleSelectSuggestion}
          activeIndex={activeIndex}
        />
        <button
          className="mic-btn"
          title="Search with your voice"
          type="button"
          aria-label="Search with your voice"
        >
          <IoMicOutline />
        </button>
      </div>
      <div className="nav-right flex-div">
        <div className="search-mini">
          <button
            className="search-icon"
            title="Search"
            type="button"
            aria-label="Search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <IoSearch />
          </button>
          <button
            className="mic-btn"
            title="Search with your voice"
            type="button"
            aria-label="Search with your voice"
          >
            <IoMicOutline />
          </button>
        </div>
        <button className="create-btn" type="button">+ Create</button>
        <button className="create-btn-mini" title="Create" type="button">+</button>
        <button
          className="notification-btn"
          title="Notifications"
          type="button"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            focusable="false"
            aria-hidden="true"
          >
            <path d="M16 19a4 4 0 11-8 0H4.765C3.21 19 2.25 17.304 3.05 15.97l1.806-3.01A1 1 0 005 12.446V8a7 7 0 0114 0v4.446c0 .181.05.36.142.515l1.807 3.01c.8 1.333-.161 3.029-1.716 3.029H16ZM12 3a5 5 0 00-5 5v4.446a3 3 0 01-.428 1.543L4.765 17h14.468l-1.805-3.01A3 3 0 0117 12.445V8a5 5 0 00-5-5Zm-2 16a2 2 0 104 0h-4Z"></path>
          </svg>
        </button>
        <img src={profile_image} alt="User profile" className="user-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
