import { useEffect, useRef, useState } from 'react';
import PlaylistDeatails from '../components/playlistpage/PlaylistDeatails';
import PlaylistSearch from '../components/playlistpage/PlaylistSearch';
import PlaylistSongs from '../components/playlistpage/PlaylistSongs';
import { getMe } from '../services/meService';

const PlaylistPage = () => {
  const [owner, setOwner] = useState<number | null>(null);
  const [isOwner , setIsOwner] = useState<boolean | null>(null);
  const [search, setSearch] = useState<boolean | null>(null);

  const playlistSongsRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!owner) return;
    const fetchData = async () => {
      const data = await getMe();
      if (owner === data.sub) {setSearch(true); setIsOwner(true)}
      else {setSearch(false); setIsOwner(false)}
    };
    fetchData();
  }, [owner]);

  return (
    <div className="min-h-[100vh] w-full bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
      <PlaylistDeatails setOwner={setOwner} />

      

      <PlaylistSongs refFetch={playlistSongsRef} isOwner={isOwner} />
      {search && <PlaylistSearch refFetch={playlistSongsRef} />}
    </div>
  );
};

export default PlaylistPage;
