import React from "react";
import "./LoadingSpinner.css";

/**
 * Reusable loading spinner component.
 * @param {object} props
 * @param {boolean} [props.fullPage] - If true, centers in viewport. Otherwise inline.
 * @param {string}  [props.size]     - "small" | "medium" | "large" (default "medium")
 * @param {string}  [props.message]  - Optional text below the spinner
 */
const LoadingSpinner = ({ fullPage = false, size = "medium", message }) => {
  return (
    <div
      className={`loading-spinner-container ${fullPage ? "loading-spinner-fullpage" : ""}`}
      role="status"
      aria-label="Loading"
    >
      <div className={`loading-spinner loading-spinner-${size}`}>
        <div className="loading-spinner-bar"></div>
      </div>
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
