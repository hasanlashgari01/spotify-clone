import { useState } from 'react';
import SinglePlaylist from './compose/Single-play';
import DefaultPicture from '../../../public/default-avatar.webp';

import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const MusicSB = () => {
  const playlists = [
    { name: 'Liked Songs', songs: 'Playlist - 17 Songs' },
    { name: 'Ho3ein', songs: 'Playlist - 25 Songs' },
    { name: 'Fadaei', songs: 'Playlist - 14 Songs' },
    { name: 'Yas', songs: 'Playlist - 8 Songs' },
    { name: 'Yas', songs: 'Playlist - 8 Songs' },
    { name: 'Yas', songs: 'Playlist - 8 Songs' },
    { name: 'Yas', songs: 'Playlist - 8 Songs' },
    { name: 'Yas', songs: 'Playlist - 8 Songs' },
  ];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex h-screen overflow-hidden transition-all select-none">
      <aside
        className="flex h-full flex-col items-start border-r border-[#1E293B]/60 bg-gradient-to-b from-[#0A1120] via-[#0E1620] to-[#131a22]"
        style={{ width: 90 }}
      >
        <div className="p-2 text-white">
          <motion.button
            whileHover="hover"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm bg-gray-600 p-2 hover:bg-gray-600/90 transition-all"
          >
            <motion.span
              variants={{
                hover: { rotate: 180 },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="inline-block"
            >
              <PlusIcon />
            </motion.span>
          </motion.button>
        </div>
        <div className="flex w-full flex-col items-center gap-1 overflow-x-hidden overflow-y-auto py-3">
          {playlists.map((pl, i) => (
            <SinglePlaylist
              key={i}
              index={i}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              playlistName={pl.name}
              playlistSongs={pl.songs}
              cover={DefaultPicture}
              fullimize={true}
            />
          ))}
        </div>
      </aside>
    </div>
  );
};
