import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for infinite scroll using IntersectionObserver.
 * Attaches an observer to a sentinel element ref.
 *
 * @param {object} options
 * @param {Function} options.onLoadMore  - Called when sentinel becomes visible
 * @param {boolean}  options.hasMore     - Whether there are more items to load
 * @param {boolean}  options.loading     - Whether a request is currently in progress
 * @param {string}   [options.rootMargin] - IntersectionObserver rootMargin (default "200px")
 * @returns {React.RefObject} sentinelRef - Attach this ref to a div at the bottom of your list
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  rootMargin = "200px",
}) {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, loading],
  );

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!sentinelRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin,
    });

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, hasMore, rootMargin]);

  return sentinelRef;
}
