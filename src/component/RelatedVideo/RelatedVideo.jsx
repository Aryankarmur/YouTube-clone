import { useState, useEffect } from "react";
import "./RelatedVideo.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { valueConverter } from "../../utils/helper";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const INITIAL_DISPLAY_COUNT = 8;

const RelatedVideo = ({ relatedVideos, width }) => {
  const [showAll, setShowAll] = useState(false);

  // Reset showAll when viewport crosses above 1023px
  // (desktop shows all videos by default in the sidebar layout)
  useEffect(() => {
    if (width >= 1023) {
      setShowAll(false);
    }
  }, [width]);

  if (!relatedVideos) {
    return (
      <div className="recommendation">
        <LoadingSpinner size="small" message="Loading related videos..." />
      </div>
    );
  }

  if (relatedVideos.length === 0) {
    return null;
  }

  // Determine which videos to show
  const isMobileLayout = width < 1023;
  const videosToShow =
    isMobileLayout && !showAll
      ? relatedVideos.slice(0, INITIAL_DISPLAY_COUNT)
      : relatedVideos;

  const hasMoreToShow =
    isMobileLayout && !showAll && relatedVideos.length > INITIAL_DISPLAY_COUNT;

  return (
    <>
      <div className="recommendation">
        {videosToShow.map((item) => (
          <Link
            to={`/video/${item?.snippet?.categoryId}/${item?.id}`}
            className="rec-card"
            key={item?.id}
          >
            <img
              src={item?.snippet?.thumbnails?.medium?.url}
              alt={item?.snippet?.localized?.title || "Related video thumbnail"}
              loading="lazy"
            />
            <div className="details">
              <h3>
                {width < 1023
                  ? item?.snippet?.localized?.title?.length > 70
                    ? item.snippet.localized.title.slice(0, 70) + "..."
                    : item?.snippet?.localized?.title
                  : item?.snippet?.localized?.title?.length > 27
                    ? item.snippet.localized.title.slice(0, 27) + "..."
                    : item?.snippet?.localized?.title}
              </h3>
              <p className="channel-name">{item?.snippet?.channelTitle}</p>
              <p className="view-detail">
                <span>
                  {valueConverter(item?.statistics?.viewCount)} views
                </span>
                <span>{moment(item?.snippet?.publishedAt).fromNow()}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
      {hasMoreToShow && (
        <div className="show-more">
          <button type="button" onClick={() => setShowAll(true)}>
            Show more
          </button>
        </div>
      )}
    </>
  );
};

export default RelatedVideo;
