import React from "react";
import "./RelatedVideo.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { valueConverter } from "../../utils/helper";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const RelatedVideo = ({ relatedVideos, width }) => {
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

  return (
    <>
      <div className="recommendation">
        {relatedVideos.map((item) => (
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
                {width < 1040
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
      <div className="show-more">
        <button type="button">Show more</button>
      </div>
    </>
  );
};

export default RelatedVideo;
