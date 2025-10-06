import PlaylistDetails from "../components/playlistpage/PlaylistDetails";
import PlaylistSearch from "../components/playlistpage/PlaylistSearch";
import PlaylistSongs from "../components/playlistpage/PlaylistSongs";
import { useEffect, useRef, useState } from "react";
import { getMe } from "../services/meService";

const PlaylistPage = () => {
  const [owner, setOwner] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [canSearch, setCanSearch] = useState<boolean | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);

  const playlistSongsRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!owner) return;
    const fetchData = async () => {
      const data = await getMe();
      if (owner === data.sub) {
        setCanSearch(true);
        setIsOwner(true);
      } else {
        setCanSearch(false);
        setIsOwner(false);
      }
    };
    fetchData();
  }, [owner]);

  return (
    <div className="min-h-[100vh] w-full bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
      <PlaylistDetails
        setOwner={setOwner}
        search={searchText}
        setSearch={setSearchText}
        setReady={setReady}
      />

      {ready && (
        <>
          <PlaylistSongs
            refFetch={playlistSongsRef}
            isOwner={isOwner}
            search={searchText}
          />
          {canSearch && <PlaylistSearch refFetch={playlistSongsRef} />}
        </>
      )}
    </div>
  );
};

export default PlaylistPage;
