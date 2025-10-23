import Info from '../components/layout/info/Info.tsx';
import { FollowProvider } from '../context/UserFansContext';
import { ArtistMusics } from '../components/ArtistProfile/Artistmusics.tsx';
import { useState } from 'react';

const ArtistsProfile = () => {
  const [loading, setLoading] = useState(true);

  return (
    <FollowProvider>

        <div className="min-h-screen w-full">
          <Info setLoading={setLoading} />
          <ArtistMusics loading={loading}/>
        </div>

    </FollowProvider>
  );
};

export default ArtistsProfile;
