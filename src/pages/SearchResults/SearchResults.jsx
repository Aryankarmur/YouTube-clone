import React, { useEffect } from "react";
import "./SearchResults.css";
import { useSearchParams, Link } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useSEO } from "../../hooks/useSEO";
import { useSidebar } from "../../context/SidebarContext";
import LoadingSpinner from "../../component/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../component/ErrorMessage/ErrorMessage";
import EmptyState from "../../component/EmptyState/EmptyState";
import moment from "moment";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, loading, loadingMore, error, hasMore, search, loadMore } =
    useSearch();
  const { sidebarState } = useSidebar();

  useSEO({
    title: query ? `Search results for "${query}"` : "Search",
    description: query
      ? `YouTube search results for "${query}"`
      : "Search for videos on YouTube",
  });

  // Trigger search when query param changes
  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading: loading || loadingMore,
  });

  // Determine sidebar-aware layout class
  let layoutClass = "";
  if (sidebarState === "expanded") {
    layoutClass = "search-sidebar-expanded";
  } else if (sidebarState === "collapsed") {
    layoutClass = "search-sidebar-collapsed";
  } else {
    layoutClass = "search-sidebar-hidden";
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Searching..." />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} onRetry={() => search(query)} fullPage />
    );
  }

  if (!loading && results.length === 0 && query) {
    return (
      <EmptyState
        icon="search"
        message={`No results found for "${query}". Try different keywords.`}
      />
    );
  }

  if (!query) {
    return (
      <EmptyState
        icon="search"
        message="Type a search query to find videos."
      />
    );
  }

  return (
    <div className={`search-results-page ${layoutClass}`}>
      <h1 className="search-results-heading">
        Search results for &ldquo;{query}&rdquo;
      </h1>
      <div className="search-results-list">
        {results.map((item) => {
          const videoId = item?.id?.videoId || item?.id;
          const snippet = item?.snippet;
          return (
            <Link
              to={`/video/0/${videoId}`}
              className="search-result-card"
              key={videoId}
            >
              <div className="search-result-thumbnail">
                <img
                  src={snippet?.thumbnails?.medium?.url}
                  alt={snippet?.title || "Video thumbnail"}
                  loading="lazy"
                />
              </div>
              <div className="search-result-details">
                <h2 className="search-result-title">{snippet?.title}</h2>
                <p className="search-result-meta">
                  <span>{snippet?.channelTitle}</span>
                  <span>{moment(snippet?.publishedAt).fromNow()}</span>
                </p>
                <p className="search-result-description">
                  {snippet?.description?.length > 120
                    ? snippet.description.slice(0, 120) + "..."
                    : snippet?.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="search-results-sentinel">
          {loadingMore && <LoadingSpinner size="small" />}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
