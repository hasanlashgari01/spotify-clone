import Info from '../components/layout/info/Info.tsx';
import { FollowProvider } from '../context/UserFansContext';
import { ArtistMusics } from '../components/ArtistProfile/Artistmusics.tsx';
import { useState } from 'react';
import { DiscoContainer } from '../components/ArtistProfile/Disco/DiscoContainer.tsx';
import { AboutArtist} from '../components/ArtistProfile/about-artist/About.tsx';


const ArtistsProfile = () => {
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState<string>('');
  const [picture, setPicture] = useState<string>('');
  return (
    <FollowProvider>

        <div className="min-h-screen w-full">
          <Info setLoading={setLoading} setBio={setBio} setPicture={setPicture} />
          <ArtistMusics loading={loading}/>
          <DiscoContainer/>
          <AboutArtist bio={bio} picture={picture} />
        </div>

    </FollowProvider>
  );
};

export default ArtistsProfile;
