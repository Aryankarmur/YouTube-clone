/**
 * Centralized YouTube Data API v3 Service
 *
 * All YouTube API communication goes through this module.
 * Components should NOT call fetch() directly for YouTube endpoints.
 *
 * NOTE: VITE_ environment variables are embedded in the client bundle
 * and visible in browser DevTools. The API key is NOT secret in a
 * frontend-only app. Restrict the key in Google Cloud Console by:
 *   1. HTTP referrer restrictions
 *   2. API restriction to YouTube Data API v3 only
 *   3. Daily quota limit
 */

const API_BASE_URL =
  import.meta.env.VITE_YOUTUBE_API_BASE_URL ||
  "https://www.googleapis.com/youtube/v3";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// ---------------------------------------------------------------------------
// Custom error class for classified YouTube API errors
// ---------------------------------------------------------------------------

export class YouTubeApiError extends Error {
  /**
   * @param {'network'|'quota'|'invalidKey'|'httpError'|'invalidRequest'|'unknown'} type
   * @param {string} message  User-friendly message
   * @param {number} [status] HTTP status code if available
   * @param {object} [raw]    Raw error payload from the API
   */
  constructor(type, message, status = null, raw = null) {
    super(message);
    this.name = "YouTubeApiError";
    this.type = type;
    this.status = status;
    this.raw = raw;
  }
}

// ---------------------------------------------------------------------------
// Internal: classify and throw a YouTubeApiError from the API JSON response
// ---------------------------------------------------------------------------

function classifyApiError(json, status) {
  const error = json?.error;
  const reason = error?.errors?.[0]?.reason;

  if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
    throw new YouTubeApiError(
      "quota",
      "YouTube API quota exceeded. Please try again later.",
      status,
      json,
    );
  }

  if (status === 400 && reason === "keyInvalid") {
    throw new YouTubeApiError(
      "invalidKey",
      "Invalid YouTube API key. Please check your configuration.",
      status,
      json,
    );
  }

  if (status === 403) {
    throw new YouTubeApiError(
      "invalidKey",
      "Access to the YouTube API was denied. The API key may be invalid or restricted.",
      status,
      json,
    );
  }

  if (status === 400) {
    throw new YouTubeApiError(
      "invalidRequest",
      "The request to YouTube was invalid. Please try again.",
      status,
      json,
    );
  }

  throw new YouTubeApiError(
    "httpError",
    `YouTube API returned an error (${status}).`,
    status,
    json,
  );
}

// ---------------------------------------------------------------------------
// Internal: reusable request function
// ---------------------------------------------------------------------------

/**
 * Makes a GET request to a YouTube API endpoint.
 *
 * @param {string} endpoint  e.g. "/videos", "/search"
 * @param {Record<string, string|number>} params  Query parameters (key is added automatically)
 * @param {AbortSignal} [signal]  Optional AbortSignal for cancellation
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiRequest(endpoint, params = {}, signal) {
  if (!API_KEY) {
    throw new YouTubeApiError(
      "invalidKey",
      "YouTube API key is not configured. Add VITE_YOUTUBE_API_KEY to your .env file.",
    );
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.set("key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  let response;
  try {
    response = await fetch(url.toString(), { signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw err; // Let AbortError bubble up — it's not a real error
    }
    throw new YouTubeApiError(
      "network",
      "Unable to connect to YouTube. Please check your internet connection and try again.",
    );
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    classifyApiError(json || {}, response.status);
  }

  return json;
}

// ---------------------------------------------------------------------------
// Public API methods
// ---------------------------------------------------------------------------

/**
 * Fetch popular/trending videos, optionally filtered by category.
 * Supports pagination via pageToken.
 */
export async function getPopularVideos({
  category = 0,
  pageToken,
  maxResults = 20,
  regionCode = "IN",
  signal,
} = {}) {
  const params = {
    part: "snippet,statistics",
    chart: "mostPopular",
    maxResults,
    regionCode,
  };

  if (category && category !== 0) {
    params.videoCategoryId = category;
  }

  if (pageToken) {
    params.pageToken = pageToken;
  }

  return apiRequest("/videos", params, signal);
}

/**
 * Search for videos by query string.
 * Returns search results (type=video only).
 */
export async function searchVideos({
  query,
  pageToken,
  maxResults = 20,
  regionCode = "IN",
  signal,
} = {}) {
  if (!query || !query.trim()) {
    return { items: [], nextPageToken: null };
  }

  const params = {
    part: "snippet",
    q: query.trim(),
    type: "video",
    maxResults,
    regionCode,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }

  return apiRequest("/search", params, signal);
}

/**
 * Fetch full details for a single video by ID.
 */
export async function getVideoById(videoId, signal) {
  if (!videoId) {
    throw new YouTubeApiError(
      "invalidRequest",
      "Video ID is required.",
    );
  }

  const data = await apiRequest(
    "/videos",
    { part: "snippet,statistics", id: videoId },
    signal,
  );

  return data?.items?.[0] || null;
}

/**
 * Fetch channel details by channel ID.
 */
export async function getChannelById(channelId, signal) {
  if (!channelId) return null;

  const data = await apiRequest(
    "/channels",
    { part: "snippet,statistics", id: channelId },
    signal,
  );

  return data?.items?.[0] || null;
}

/**
 * Fetch comment threads for a video.
 */
export async function getCommentThreads({
  videoId,
  pageToken,
  maxResults = 20,
  signal,
} = {}) {
  if (!videoId) {
    return { items: [], nextPageToken: null };
  }

  const params = {
    part: "snippet,replies",
    videoId,
    maxResults,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }

  return apiRequest("/commentThreads", params, signal);
}

/**
 * Search for videos (used for live suggestions while typing).
 * Same as searchVideos but with a smaller maxResults default.
 */
export async function getSearchSuggestions({
  query,
  maxResults = 8,
  signal,
} = {}) {
  if (!query || query.trim().length < 2) {
    return { items: [] };
  }

  return searchVideos({ query, maxResults, signal });
}
