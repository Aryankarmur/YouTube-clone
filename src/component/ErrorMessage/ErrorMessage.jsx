import React from "react";
import "./ErrorMessage.css";

/**
 * User-friendly error messages mapped from YouTubeApiError types.
 */
const ERROR_MESSAGES = {
  network:
    "Unable to connect. Please check your internet connection and try again.",
  quota:
    "YouTube API quota has been exceeded. The daily limit has been reached — please try again tomorrow.",
  invalidKey:
    "There is a problem with the YouTube API configuration. Please contact the site administrator.",
  invalidRequest: "The request was invalid. Please try again.",
  httpError: "Something went wrong while loading content. Please try again.",
  unknown: "An unexpected error occurred. Please try again.",
};

/**
 * Reusable error message component.
 * @param {object} props
 * @param {import('../api/youtubeApi').YouTubeApiError|Error|string} props.error
 * @param {Function} [props.onRetry] - If provided, shows a Retry button
 * @param {boolean} [props.fullPage] - If true, centers vertically
 */
const ErrorMessage = ({ error, onRetry, fullPage = false }) => {
  let message;

  if (typeof error === "string") {
    message = error;
  } else if (error?.type && ERROR_MESSAGES[error.type]) {
    message = ERROR_MESSAGES[error.type];
  } else if (error?.message) {
    message = error.message;
  } else {
    message = ERROR_MESSAGES.unknown;
  }

  return (
    <div
      className={`error-message-container ${fullPage ? "error-message-fullpage" : ""}`}
      role="alert"
    >
      <div className="error-message-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            fill="#909090"
          />
        </svg>
      </div>
      <p className="error-message-text">{message}</p>
      {onRetry && (
        <button
          className="error-message-retry"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
