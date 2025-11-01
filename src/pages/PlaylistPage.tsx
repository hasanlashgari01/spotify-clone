import PlaylistDeatails from '../components/playlistpage/PlaylistDeatails';
import PlaylistSongs from '../components/playlistpage/PlaylistSongs';
import { useEffect, useRef, useState } from 'react';
import { getMe } from '../services/meService';
import { playlistService } from '../services/playlistService';
import { PlaylistSong } from '../services/playlistDetailsService';

const PlaylistPage = () => {
  const [owner, setOwner] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [, setCanSearch] = useState<boolean | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);
  const [playlistId, setPlaylistId] = useState<number | null>(null);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);

  const playlistSongsRef = useRef<(() => void | Promise<void>) | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!owner) return;

    const fetchData = async () => {
      try {
        const data = await getMe();
        if (owner === data.sub) {
          setCanSearch(true);
          setIsOwner(true);
        } else {
          setCanSearch(false);
          setIsOwner(false);
        }
      } catch (err) {
        console.error('Error checking owner:', err);
      }
    };

    fetchData();
  }, [owner]);

  useEffect(() => {
    if (!playlistId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const query = searchText.trim();

      if (!query) {
        if (playlistSongsRef.current) {
          await playlistSongsRef.current();
        }
        return;
      }

      try {
        const res = await playlistService.Search(playlistId.toString(), query);
        setSongs(Array.isArray(res?.songs) ? res!.songs : []);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, playlistId]);

  return (
    <div className="min-h-[100vh] w-full bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#131a22_100%)]">
      <PlaylistDeatails
        setOwner={setOwner}
        search={searchText}
        setSearch={setSearchText}
        setReady={setReady}
        setPlaylistId={setPlaylistId}
      />

      {ready && (
        <PlaylistSongs
          playlistSongsRef={playlistSongsRef}
          isOwner={isOwner}
          search={searchText}
          songs={songs}
        />
      )}
    </div>
  );
};

export default PlaylistPage;
