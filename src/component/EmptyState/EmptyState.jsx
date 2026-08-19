import "./EmptyState.css";

/**
 * Reusable empty-state component for when an API returns valid but zero results.
 * @param {object} props
 * @param {string} [props.message] - Custom message (default provided)
 * @param {string} [props.icon]    - "search" | "video" (default "video")
 */
const EmptyState = ({
  message = "No results found.",
  icon = "video",
}) => {
  return (
    <div className="empty-state-container" role="status">
      <div className="empty-state-icon">
        {icon === "search" ? (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="#909090"
            />
          </svg>
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z"
              fill="#909090"
            />
          </svg>
        )}
      </div>
      <p className="empty-state-message">{message}</p>
    </div>
  );
};

export default EmptyState;
