import React from "react";
import "./PlayVideo.css";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";

import Comments from "../Comments/Comments";

const PlayVideo = ({width}) => {  
  return (
    <div className="play-video">
      <div className="video-details">
        <div className="video-div">
          <video src={video1} controls></video>
        </div>
        <h3>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
          doloribus veritatis inventore aut modi libero perspiciatis, minima,
          rem at iste incidunt doloremque vero. Autem, perspiciatis veniam.
          Repellendus officia eveniet quidem.
        </h3>
        <div className="other-detail">
          <div className="chanel-detail">
            <div className="channel-img">
              <img src={jack} alt="" />
            </div>
            <div className="channel-name-sub">
              <p>channel Name</p>
              <p>
                <span>124K subscribers</span>
              </p>
            </div>
            <div>
              <button>Subscribe</button>
            </div>
          </div>
          <div className="likes-share-details">
            <div className="likes-detail">
              <img src={like} alt="" />
              <span> 3.4K</span>
              <hr />
              <img src={dislike} alt="" />
            </div>
            <div className="share">
              <img src={share} alt="" />
              <span>Share</span>
            </div>
            <div className="save">
              <img src={save} alt="" />
              <span>Save</span>
            </div>
          </div>
        </div>
        <div className="video-description">
          <p className="view-detail">
            <span>2M views</span> <span>2 years ago</span>{" "}
          </p>
          <div className="description">
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
              facere veritatis eum dicta explicabo sint consequuntur quos illo
              quae asperiores.
            </span>
            <br />
            <span className="more">...more</span>
          </div>
        </div>
      </div>
      {width >= 1040 ? <Comments /> : ""}
    </div>
  );
};

export default PlayVideo;
