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
    { name: 'Tataloo', songs: 'Playlist - 30 Songs' },
    { name: 'Sijal', songs: 'Playlist - 15 Songs' },
    { name: 'Underground', songs: 'Playlist - 20 Songs' },
    { name: 'Iranian Rap Mix', songs: 'Playlist - 10 Songs' },

  ];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex h-screen overflow-hidden transition-all select-none">
      <aside
        className="relative flex h-full flex-col items-start border-r border-[#1E3A8A]/50 bg-gradient-to-b from-[#0A1528] via-[#0D1E34] to-[#131a22] shadow-[inset_0_0_60px_#0A1A3A80,0_0_25px_#1E3A8A30] backdrop-blur-sm"
        style={{ width: 95 }}
      >

        <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-[#2563EB]/30 to-transparent blur-2xl pointer-events-none"></div>


        <div className="p-3 text-white w-full flex justify-center">
          <motion.button


            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] hover:shadow-[0_0_20px_#3B82F690] transition-all duration-300 border border-[#3B82F680]"
          >
            <PlusIcon className="text-white" size={24} />
          </motion.button>
        </div>


        <div className="h-[1px] w-10/12 self-center bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent my-2"></div>


        <motion.div
          className="flex w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto py-3 px-1 scrollbar-thin scrollbar-thumb-[#1E3A8A]/60 scrollbar-track-transparent"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.05, delayChildren: 0.2 },
            },
          }}
        >
          {playlists.map((pl, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <SinglePlaylist
                index={i}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
                playlistName={pl.name}
                playlistSongs={pl.songs}
                cover={DefaultPicture}
                fullimize={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* نور پایین برای حس عمق */}
        <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-[#1E3A8A]/40 to-transparent blur-2xl pointer-events-none"></div>
      </aside>
    </div>
  );
};
