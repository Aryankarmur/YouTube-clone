import React from 'react'
import "./Home.css"
import Feed from '../../component/Feed/Feed';

const Home = ({sidebar}) => {
  const homeMain_class = sidebar?"home-mini":"home-max";
  return (
    <div className={`home-main ${homeMain_class}`}>
      <Feed/>
    </div>
  )
}

export default Home