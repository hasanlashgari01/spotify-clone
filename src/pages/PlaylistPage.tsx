import PlaylistDeatails from "../components/playlistpage/PlaylistDeatails";
import PlaylistSearch from "../components/playlistpage/PlaylistSearch";
import PlaylistSongs from "../components/playlistpage/PlaylistSongs";
import { useState } from "react";
import { PlaylistSong } from "../services/playlistDetailsService";
const PlaylistPage = () => {
  
  return (
    <>
      <div className="w-full min-h-[100vh] bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
        <PlaylistDeatails />
        <PlaylistSongs />
        <PlaylistSearch />
      </div>
    </>
  );
};

export default PlaylistPage;
