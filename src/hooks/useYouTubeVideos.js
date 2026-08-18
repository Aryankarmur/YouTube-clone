import { useState, useEffect, useCallback, useRef } from "react";
import { getPopularVideos } from "../api/youtubeApi";

/**
 * Custom hook for fetching paginated YouTube videos by category.
 * Manages loading, error, pagination, and deduplication.
 *
 * @param {number} category - YouTube video category ID (0 = all)
 * @returns {{ videos, loading, loadingMore, error, hasMore, loadMore, retry }}
 */
export function useYouTubeVideos(category) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Track seen video IDs to prevent duplicates
  const seenIds = useRef(new Set());
  const abortRef = useRef(null);

  // Fetch initial page or reset on category change
  const fetchInitial = useCallback(async () => {
    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setVideos([]);
    setNextPageToken(null);
    setHasMore(true);
    seenIds.current.clear();

    try {
      const data = await getPopularVideos({
        category,
        maxResults: 20,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      const items = data?.items || [];
      const deduped = items.filter((item) => {
        if (seenIds.current.has(item.id)) return false;
        seenIds.current.add(item.id);
        return true;
      });

      setVideos(deduped);
      setNextPageToken(data?.nextPageToken || null);
      setHasMore(!!data?.nextPageToken);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [category]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (loadingMore || !nextPageToken || !hasMore) return;

    const controller = new AbortController();
    setLoadingMore(true);

    try {
      const data = await getPopularVideos({
        category,
        pageToken: nextPageToken,
        maxResults: 20,
        signal: controller.signal,
      });

      const items = data?.items || [];
      const deduped = items.filter((item) => {
        if (seenIds.current.has(item.id)) return false;
        seenIds.current.add(item.id);
        return true;
      });

      setVideos((prev) => [...prev, ...deduped]);
      setNextPageToken(data?.nextPageToken || null);
      setHasMore(!!data?.nextPageToken);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextPageToken, hasMore, category]);

  // Retry after error
  const retry = useCallback(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Fetch on mount and when category changes
  useEffect(() => {
    fetchInitial();

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchInitial]);

  return { videos, loading, loadingMore, error, hasMore, loadMore, retry };
}
