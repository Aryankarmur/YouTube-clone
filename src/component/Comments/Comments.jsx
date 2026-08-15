import React from 'react'
import "./Comments.css";
import user_profile from "../../assets/user_profile.jpg";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";

const Comments = () => {
  return (
    <div className="video-comment-section">
        <h4>27K Comments</h4>
        <div className="video-comments">
            <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            {/* extra comments */}
           <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            <div className="comment">
                <img src={user_profile} alt="" />
                <div className="comment-detail">
                    <h3>jenidJohnson <span>2 days ago</span> </h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, ad!</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span className="like-count">127</span>
                        <img src={dislike} alt="" />
                        <span className="reply">Reply</span>
                    </div>
                </div>
            </div>
            {/* end hear */}
        </div>
      </div>
  )
}

export default Comments