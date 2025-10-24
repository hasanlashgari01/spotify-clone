import Info from '../components/layout/info/Info.tsx';
import { FollowProvider } from '../context/UserFansContext';
import { ArtistMusics } from '../components/ArtistProfile/Artistmusics.tsx';
import { useState } from 'react';
import { DiscoContainer } from '../components/ArtistProfile/Disco/DiscoContainer.tsx';
import { AboutArtist} from '../components/ArtistProfile/about-artist/About.tsx';

const ArtistsProfile = () => {
  const [loading, setLoading] = useState(true);

  return (
    <FollowProvider>

        <div className="min-h-screen w-full">
          <Info setLoading={setLoading} />
          <ArtistMusics loading={loading}/>
          <DiscoContainer/>
          <AboutArtist/>
        </div>

    </FollowProvider>
  );
};

export default ArtistsProfile;
