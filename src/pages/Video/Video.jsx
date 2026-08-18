import React, { useEffect, useState, useRef } from "react";
import "./Video.css";
import PlayVideo from "../../component/PlayVideo/PlayVideo";
import RelatedVideo from "../../component/RelatedVideo/RelatedVideo";
import Comments from "../../component/Comments/Comments";
import { useParams } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useSEO } from "../../hooks/useSEO";
import { getVideoById, getChannelById, getPopularVideos } from "../../api/youtubeApi";
import LoadingSpinner from "../../component/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../component/ErrorMessage/ErrorMessage";

const Video = () => {
  const { width } = useWindowSize();
  const { categoryId, videoId } = useParams();

  const [videoData, setVideoData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  useSEO({
    title: videoData?.snippet?.title || "Video",
    description: videoData?.snippet?.description?.slice(0, 155) || "Watch this video on YouTube",
  });

  // Fetch video details, then channel details
  useEffect(() => {
    if (!videoId) return;

    // Abort previous requests
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setVideoData(null);
    setChannelData(null);

    const fetchData = async () => {
      try {
        // Fetch video details
        const video = await getVideoById(videoId, controller.signal);

        if (controller.signal.aborted) return;

        if (!video) {
          setError({ type: "invalidRequest", message: "Video not found." });
          setLoading(false);
          return;
        }

        setVideoData(video);

        // Fetch channel details if we have a channelId
        if (video?.snippet?.channelId) {
          const channel = await getChannelById(
            video.snippet.channelId,
            controller.signal,
          );
          if (!controller.signal.aborted) {
            setChannelData(channel);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [videoId]);

  // Fetch related videos by category
  useEffect(() => {
    if (!categoryId && categoryId !== 0) return;

    const controller = new AbortController();

    const fetchRelated = async () => {
      try {
        const data = await getPopularVideos({
          category: parseInt(categoryId, 10),
          maxResults: 15,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setRelatedVideos(data?.items || []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          // Non-critical: don't block the page for related videos
          console.warn("Failed to load related videos:", err.message);
        }
      }
    };

    fetchRelated();
    return () => controller.abort();
  }, [categoryId]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading video..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => window.location.reload()}
        fullPage
      />
    );
  }

  return (
    <div className="video-container">
      <PlayVideo
        width={width}
        videoData={videoData}
        videoId={videoId}
        channelData={channelData}
      />
      <RelatedVideo relatedVideos={relatedVideos} width={width} />
      {width < 1040 ? (
        <Comments
          videoId={videoId}
          commentCount={videoData?.statistics?.commentCount}
        />
      ) : null}
    </div>
  );
};

export default Video;
