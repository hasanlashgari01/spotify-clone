import { PlusIcon, Expand, SortAsc } from 'lucide-react';
import { SetStateAction, useEffect, useState } from 'react';
import SinglePlaylist from './compose/Single-play';
import DefaultPicture from '../../../public/default-avatar.webp';
import { useMediaQuery } from 'react-responsive';
type MusicProps = {
  setFullimize : React.Dispatch<SetStateAction<boolean>>
}
export const MusicSB = ({setFullimize} :MusicProps) => {
  const [sortText, setSortText] = useState('Recents');

  // ✅ تعیین breakpoint واقعی برای نمایش "Create" در کنار آیکون
  const DontshowCreate = useMediaQuery({  maxWidth: 1521 });
  const Fullimize = useMediaQuery({maxWidth : 1056})
  useEffect(() => {
    setFullimize(Fullimize)
  
    
  }, [])
  
  useEffect(() => {
    setSortText('Recents');
  }, []);

  return (
    <div >
      
      <div className="flex items-center justify-between p-3">
        <h2 className="text-white">Your Library</h2>

        {!Fullimize &&(<div className="flex items-center justify-center gap-2 text-white">
          
          <button className="flex h-12 cursor-pointer items-center justify-center gap-1 rounded-3xl bg-gray-800 px-4 text-center transition-all hover:bg-gray-700">
            <PlusIcon />
            {!DontshowCreate && <span className="mt-1">Create</span>}
          </button>

          
          <button className="cursor-pointer text-gray-300 transition-all hover:text-white">
            <Expand />
          </button>
        </div>)}
      </div>

      
      {!Fullimize && (<div className="flex w-full items-center justify-end p-3">
        <button className="flex cursor-pointer items-center justify-center gap-1 text-gray-300 transition-all hover:text-white">
          <span className="mt-1">{sortText}</span>
          <SortAsc />
        </button>
      </div>)}

      
      <SinglePlaylist
        playlistName="Liked Songs"
        fullimize={Fullimize}
        playlistSongs="Playlist - 17 Songs"
        cover={DefaultPicture}
      />
      <SinglePlaylist
        playlistName="ho3ein"
        fullimize={Fullimize}
        playlistSongs="Playlist - 25 Songs"
        cover={DefaultPicture}
      />
      <SinglePlaylist
        playlistName="fadaei"
        fullimize={Fullimize}
        playlistSongs="Playlist - 14 Songs"
        cover={DefaultPicture}
      />
    </div>
  );
};
