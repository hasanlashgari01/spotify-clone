import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Home/Hero';
import TrendingSongs from '../components/trending-songs/TrendingSongs';
import NewSongs from '../components/new-songs/NewSongs';
import MadeForYou from '../components/made-for-you/MadeForYou';
import MusicPlayer from '../components/MusicPlayer/MusicPlayer';

const HomePage: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar/>
        <Hero/>
      </header>
      <div className="bg-[#131a22] pt-10">
      <TrendingSongs />
      <NewSongs/>
      <MusicPlayer/>
    </div>
    </div>
  )
}

export default Home
