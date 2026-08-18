import { useState, useCallback, useRef } from "react";
import { searchVideos } from "../api/youtubeApi";

/**
 * Custom hook for searching YouTube videos with pagination.
 * Handles loading, error, abort, deduplication, and pagination.
 *
 * @returns {{ results, loading, loadingMore, error, hasMore, search, loadMore, reset }}
 */
export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const nextPageTokenRef = useRef(null);
  const currentQueryRef = useRef("");
  const abortRef = useRef(null);
  const seenIds = useRef(new Set());

  /** Start a new search (resets previous results). */
  const search = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    currentQueryRef.current = query.trim();
    seenIds.current.clear();

    setLoading(true);
    setError(null);
    setResults([]);
    setHasMore(false);

    try {
      const data = await searchVideos({
        query: query.trim(),
        maxResults: 20,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      const items = data?.items || [];
      const deduped = items.filter((item) => {
        const id = item?.id?.videoId || item?.id;
        if (seenIds.current.has(id)) return false;
        seenIds.current.add(id);
        return true;
      });

      setResults(deduped);
      nextPageTokenRef.current = data?.nextPageToken || null;
      setHasMore(!!data?.nextPageToken);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  /** Load next page of results for the current query. */
  const loadMore = useCallback(async () => {
    if (loadingMore || !nextPageTokenRef.current || !currentQueryRef.current)
      return;

    setLoadingMore(true);

    try {
      const data = await searchVideos({
        query: currentQueryRef.current,
        pageToken: nextPageTokenRef.current,
        maxResults: 20,
      });

      const items = data?.items || [];
      const deduped = items.filter((item) => {
        const id = item?.id?.videoId || item?.id;
        if (seenIds.current.has(id)) return false;
        seenIds.current.add(id);
        return true;
      });

      setResults((prev) => [...prev, ...deduped]);
      nextPageTokenRef.current = data?.nextPageToken || null;
      setHasMore(!!data?.nextPageToken);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  /** Reset all search state. */
  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setResults([]);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setHasMore(false);
    nextPageTokenRef.current = null;
    currentQueryRef.current = "";
    seenIds.current.clear();
  }, []);

  return { results, loading, loadingMore, error, hasMore, search, loadMore, reset };
}
