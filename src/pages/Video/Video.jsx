import React, { useEffect, useState } from "react";
import "./Video.css";
import PlayVideo from "../../component/PlayVideo/PlayVideo";
import RelatedVideo from "../../component/RelatedVideo/RelatedVideo";
import Comments from "../../component/Comments/Comments";

const Video = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="video-container">
      <PlayVideo width={width} />
      <RelatedVideo />
      {width < 1040 ? <Comments /> : ""}
    </div>
  );
};

export default Video;
