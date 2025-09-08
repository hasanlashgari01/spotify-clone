import React, { useEffect, useState } from "react";
import { useMusicPlayer } from "../context/MusicPlayerContext";
import { Song } from "../types/song.type";

interface TrackUiItem {
  id: number;
  title: string;
  artist: string;
  cover?: string;
}

const TrackList: React.FC = () => {
  const [tracks, setTracks] = useState<TrackUiItem[]>([]);
  const { playSong, currentTrack, isPlaying } = useMusicPlayer();

  useEffect(() => {
    fetch("song/popular-songs")
      .then((res) => res.json())
      .then((data: Song[]) =>
        setTracks(
          data.map((s) => ({ id: s.id, title: s.title, artist: s.artist.fullName, cover: s.cover }))
        )
      )
      .catch((err) => console.error("Error fetching tracks:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">🎶 Track List</h2>
      <div className="space-y-3">
        {tracks.map((track, idx) => {
          const isActive = currentTrack?.id === track.id;
          return (
            <div
              key={track.id}
              onClick={() =>
                playSong({
                  id: track.id,
                  title: track.title,
                  cover: track.cover || "",
                  duration: 0,
                  status: "published",
                  plays: 0,
                  audioUrl: "",
                  artistId: 0,
                  artist: { id: 0, username: "", fullName: track.artist },
                  createdAt: "",
                  updatedAt: "",
                } as Song, tracks.map((t) => ({
                  id: t.id,
                  title: t.title,
                  cover: t.cover || "",
                  duration: 0,
                  status: "published",
                  plays: 0,
                  audioUrl: "",
                  artistId: 0,
                  artist: { id: 0, username: "", fullName: t.artist },
                  createdAt: "",
                  updatedAt: "",
                }) as unknown as Song))
              }
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
                ${isActive ? "bg-green-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}
              `}
            >
              {/* Cover (اختیاری) */}
              {track.cover && (
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
              )}

              {/* Info */}
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-semibold">{track.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {track.artist}
                </p>
              </div>

              {/* وضعیت پخش */}
              {isActive && isPlaying && (
                <span className="text-sm ml-2 animate-pulse">▶️</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;
