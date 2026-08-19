import "./Sidebar.css";
import { Link } from "react-router-dom";

import home from "../../assets/home.png";
import game_icon from "../../assets/game_icon.png";
import automobiles from "../../assets/automobiles.png";
import sports from "../../assets/sports.png";
import entertainment from "../../assets/entertainment.png";
import tech from "../../assets/tech.png";
import music from "../../assets/music.png";
import blogs from "../../assets/blogs.png";
import news from "../../assets/news.png";
import jack from "../../assets/jack.png";
import simon from "../../assets/simon.png";
import tom from "../../assets/tom.png";
import megan from "../../assets/megan.png";
import cameron from "../../assets/cameron.png";
import { IoMdMenu } from "react-icons/io";
import { useSidebar } from "../../context/SidebarContext";

const Sidebar = ({ category, setCategory }) => {
  const { sidebarState, toggleSidebar } = useSidebar();

  // Map sidebar state to CSS class
  let sidebarClass = "";
  if (sidebarState === "expanded") {
    sidebarClass = "sidebar-expanded";
  } else if (sidebarState === "collapsed") {
    sidebarClass = "sidebar-collapsed";
  } else {
    sidebarClass = "sidebar-hidden";
  }

  const iconStyle =
    sidebarState === "collapsed" ? "side-link-mini" : "side-link";

  return (
    <aside
      className={`sidebar ${sidebarClass}`}
      role="complementary"
      aria-label="Sidebar navigation"
    >
      <div className="nav-left flex-div">
        <button
          className="menu-icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          type="button"
        >
          <IoMdMenu />
        </button>
        <Link to="/" aria-label="YouTube Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="yt-ringo2-svg_sidebar"
            width="105"
            height="20"
            viewBox="0 0 105 20"
            focusable="false"
            aria-hidden="true"
          >
            <g>
              <path
                d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"
                fill="#FF0033"
              ></path>
              <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path>
            </g>
            <text x="32" y="16" fontSize="18" fontWeight="bold" fontFamily="sans-serif" fill="currentColor" letterSpacing="-0.5">YWatch</text>
          </svg>
        </Link>
      </div>
      <div className="shortcut-links">
        <div
          className={`${iconStyle} ${category === 0 ? "active" : ""}`}
          onClick={() => setCategory(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(0)}
        >
          <img src={home} alt="Home" />
          <p>Home</p>
        </div>
        <div
          className={`${iconStyle} ${category === 20 ? "active" : ""}`}
          onClick={() => setCategory(20)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(20)}
        >
          <img src={game_icon} alt="Gaming" />
          <p>Gaming</p>
        </div>
        <div
          className={`${iconStyle} ${category === 2 ? "active" : ""}`}
          onClick={() => setCategory(2)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(2)}
        >
          <img src={automobiles} alt="Automobiles" />
          <p>Automobiles</p>
        </div>
        <div
          className={`${iconStyle} ${category === 17 ? "active" : ""}`}
          onClick={() => setCategory(17)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(17)}
        >
          <img src={sports} alt="Sports" />
          <p>Sports</p>
        </div>
        <div
          className={`${iconStyle} ${category === 24 ? "active" : ""}`}
          onClick={() => setCategory(24)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(24)}
        >
          <img src={entertainment} alt="Entertainment" />
          <p>Entertainment</p>
        </div>
        <div
          className={`${iconStyle} ${category === 28 ? "active" : ""}`}
          onClick={() => setCategory(28)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(28)}
        >
          <img src={tech} alt="Technology" />
          <p>Technology</p>
        </div>
        <div
          className={`${iconStyle} ${category === 10 ? "active" : ""}`}
          onClick={() => setCategory(10)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(10)}
        >
          <img src={music} alt="Music" />
          <p>Music</p>
        </div>
        <div
          className={`${iconStyle} ${category === 22 ? "active" : ""}`}
          onClick={() => setCategory(22)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(22)}
        >
          <img src={blogs} alt="Blogs" />
          <p>Blogs</p>
        </div>
        <div
          className={`${iconStyle} ${category === 25 ? "active" : ""}`}
          onClick={() => setCategory(25)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCategory(25)}
        >
          <img src={news} alt="News" />
          <p>News</p>
        </div>
        <hr />
      </div>
      <div className="subscribed-list">
        <h3 className="h3">Subscriptions</h3>
        <div className={iconStyle}>
          <img src={jack} alt="PewDiePie channel" />
          <p>PewDiePie</p>
        </div>
        <div className={iconStyle}>
          <img src={simon} alt="simonGaja channel" />
          <p>simonGaja</p>
        </div>
        <div className={iconStyle}>
          <img src={tom} alt="KurosawEdit channel" />
          <p>KurosawEdit</p>
        </div>
        <div className={iconStyle}>
          <img src={megan} alt="meganEdits channel" />
          <p>meganEdits</p>
        </div>
        <div className={iconStyle}>
          <img src={cameron} alt="News Daily channel" />
          <p>News Daily</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
