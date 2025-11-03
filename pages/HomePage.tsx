import React from 'react';
import Hero from '../components/Home/Hero';
import TrendingSongs from '../components/trending-songs/TrendingSongs';
import NewSongs from '../components/new-songs/NewSongs';
import MadeForYou from '../components/made-for-you/MadeForYou';
import MusicPlayer from '../components/MusicPlayer/MusicPlayer';

const HomePage: React.FC = () => {
  return (
    <div>
      <header>
        <Hero />
      </header>
      <div className="pt-10">
        <TrendingSongs />
        <NewSongs />
        <MadeForYou />
      </div>
      <MusicPlayer />
    </div>
  );
};

export default HomePage;
