import React from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { valueConverter } from "../../utils/helper";
import moment from "moment";
import { useYouTubeVideos } from "../../hooks/useYouTubeVideos";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

const Feed = ({ category }) => {
  const { videos, loading, loadingMore, error, hasMore, loadMore, retry } =
    useYouTubeVideos(category);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading: loading || loadingMore,
  });

  if (loading) {
    return <LoadingSpinner fullPage message="Loading videos..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={retry} fullPage />;
  }

  if (videos.length === 0) {
    return <EmptyState message="No videos found for this category." />;
  }

  return (
    <>
      <div className="feed">
        {videos.map((item) => (
          <Link
            to={`/video/${item?.snippet?.categoryId}/${item?.id}`}
            className="card"
            key={item?.id}
          >
            <div className="img-div">
              <img
                src={item?.snippet?.thumbnails?.medium?.url}
                alt={item?.snippet?.title || "Video thumbnail"}
                loading="lazy"
              />
            </div>
            <div className="detail-div">
              <h2>
                {item?.snippet?.title?.length > 70
                  ? `${item.snippet.title.slice(0, 70)}...`
                  : item?.snippet?.title}
              </h2>
              <h3>{item?.snippet?.channelTitle}</h3>
              <p>
                {valueConverter(item?.statistics?.viewCount)} views &bull;{" "}
                {moment(item?.snippet?.publishedAt).fromNow()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="feed-sentinel">
          {loadingMore && <LoadingSpinner size="small" />}
        </div>
      )}
    </>
  );
};

export default Feed;
