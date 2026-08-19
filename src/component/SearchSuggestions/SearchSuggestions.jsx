import "./SearchSuggestions.css";
import { IoSearch } from "react-icons/io5";

/**
 * Dropdown showing live search suggestions.
 * @param {object} props
 * @param {Array} props.suggestions - Array of search result items
 * @param {boolean} props.loading - Whether suggestions are loading
 * @param {boolean} props.visible - Whether to show the dropdown
 * @param {Function} props.onSelect - Called with the selected suggestion title
 * @param {number} props.activeIndex - Currently highlighted index for keyboard nav
 */
const SearchSuggestions = ({ suggestions, loading, visible, onSelect, activeIndex }) => {
  if (!visible) return null;

  if (loading) {
    return (
      <div className="search-suggestions">
        <div className="search-suggestion-item search-suggestion-loading">
          Searching...
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="search-suggestions" role="listbox" aria-label="Search suggestions">
      {suggestions.map((item, index) => {
        const title = item?.snippet?.title || "";
        return (
          <div
            key={item?.id?.videoId || item?.id || index}
            className={`search-suggestion-item ${index === activeIndex ? "search-suggestion-active" : ""}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input blur before click fires
              onSelect(title);
            }}
          >
            <IoSearch className="search-suggestion-icon" />
            <span className="search-suggestion-text">
              {title.length > 60 ? title.slice(0, 60) + "..." : title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SearchSuggestions;
