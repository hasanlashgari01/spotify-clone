import { PanelHome } from '../components/ArtistPanel-comps/HomePage.tsx';
import { ArtistSide } from '../components/ArtistPanel-comps/ArtSide.tsx';
import { useState } from 'react';
import { User} from '../services/authService.ts'
const ArtistPanel = () => {
  const [artist , setArtist] = useState<User | null>(null);
  return (
    <div className="flex h-screen overflow-hidden">

      <div className="w-[20%] h-full sticky top-0 left-0 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-sky-950/80 to-indigo-950 shadow-xl z-10">
        <ArtistSide setArtist={setArtist} />
      </div>


      <div className="w-[80%] h-full overflow-y-auto">
        <PanelHome me={artist}/>
      </div>
    </div>
  );
};

export default ArtistPanel;
