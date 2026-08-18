import React, { useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";

import Comments from "../Comments/Comments";
import { valueConverter } from "../../utils/helper";
import moment from "moment";

const PlayVideo = ({ width, videoData, videoId, channelData }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="play-video">
      <div className="video-details">
        <div className="video-player-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={videoData?.snippet?.title || "YouTube Video"}
          ></iframe>
        </div>
        <h3>{videoData?.snippet?.title}</h3>
        <div className="other-detail">
          <div className="chanel-detail">
            <div className="channel-img">
              <img
                src={channelData?.snippet?.thumbnails?.medium?.url}
                alt={`${videoData?.snippet?.channelTitle || "Channel"} profile`}
              />
            </div>
            <div className="channel-name-sub">
              <p>
                {videoData ? videoData?.snippet?.channelTitle : "Channel Name"}
              </p>
              <p>
                <span>
                  {valueConverter(
                    parseFloat(channelData?.statistics?.subscriberCount),
                  )}{" "}
                  subscribers
                </span>
              </p>
            </div>
            <div>
              <button style={{ cursor: "pointer" }} type="button">
                Subscribe
              </button>
            </div>
          </div>
          <div className="likes-share-details">
            <div className="likes-detail">
              <img src={like} alt="Like this video" />
              <span>
                {" "}
                {valueConverter(videoData?.statistics?.likeCount)}
              </span>
              <hr />
              <img src={dislike} alt="Dislike this video" />
            </div>
            <div className="share">
              <img src={share} alt="Share" />
              <span>Share</span>
            </div>
            <div className="save">
              <img src={save} alt="Save" />
              <span>Save</span>
            </div>
          </div>
        </div>
        <div className="video-description">
          <p className="view-detail">
            <span>
              {valueConverter(videoData?.statistics?.viewCount)} views
            </span>{" "}
            <span>
              {moment(videoData?.snippet?.publishedAt).fromNow()}
            </span>{" "}
          </p>
          <div className={`description ${showMore ? "description-expanded" : "description-collapsed"}`}>
            <span className="description-text">
              {videoData?.snippet?.description}
            </span>
          </div>
          <button
            className="more"
            onClick={() => setShowMore((prev) => !prev)}
            type="button"
            aria-expanded={showMore}
          >
            {showMore ? "Show less" : "...more"}
          </button>
        </div>
      </div>
      {width >= 1040 ? (
        <Comments
          videoId={videoId}
          commentCount={videoData?.statistics?.commentCount}
        />
      ) : null}
    </div>
  );
};

export default PlayVideo;
