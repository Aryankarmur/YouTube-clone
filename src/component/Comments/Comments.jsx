import { useEffect, useState, useRef } from "react";
import "./Comments.css";
import user_profile from "../../assets/user_profile.jpg";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import moment from "moment";
import { valueConverter } from "../../utils/helper";
import { getCommentThreads } from "../../api/youtubeApi";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Comments = ({ videoId, commentCount }) => {
  const [commentData, setCommentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const fetchComments = async () => {
      try {
        const data = await getCommentThreads({
          videoId,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setCommentData(data?.items || []);
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

    fetchComments();

    return () => controller.abort();
  }, [videoId]);

  if (loading) {
    return <LoadingSpinner size="small" message="Loading comments..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          getCommentThreads({ videoId })
            .then((data) => {
              setCommentData(data?.items || []);
              setLoading(false);
            })
            .catch((err) => {
              setError(err);
              setLoading(false);
            });
        }}
      />
    );
  }

  return (
    <section className="video-comment-section" aria-label="Comments">
      <h4>{valueConverter(commentCount)} Comments</h4>
      <div className="video-comments">
        {commentData && commentData.length > 0
          ? commentData.map((com) => {
              const snippet = com?.snippet?.topLevelComment?.snippet;
              const commentId = com?.id || com?.snippet?.topLevelComment?.id;
              return (
                <div className="comment" key={commentId}>
                  <img
                    src={
                      snippet?.authorProfileImageUrl || user_profile
                    }
                    alt={`${snippet?.authorDisplayName || "User"} profile`}
                  />
                  <div className="comment-detail">
                    <h3>
                      {snippet?.authorDisplayName}{" "}
                      <span>
                        {moment(snippet?.publishedAt).fromNow()}
                      </span>
                    </h3>
                    <p>{snippet?.textOriginal}</p>
                    <div className="comment-action">
                      <img src={like} alt="Like" />
                      <span className="like-count">
                        {snippet?.likeCount}
                      </span>
                      <img src={dislike} alt="Dislike" />
                      <span className="reply">Reply</span>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
};

export default Comments;
