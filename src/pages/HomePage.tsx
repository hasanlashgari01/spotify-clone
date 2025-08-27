import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Home/Hero'
import TrendingSongs from '../components/trending-songs/TrendingSongs'
const Home: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar/>
        <Hero/>
      </header>
      <div className="bg-[#131a22] pt-10">
      <TrendingSongs />
    </div>
    </div>
  )
}

export default Home
