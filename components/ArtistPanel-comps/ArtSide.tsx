import { Home, Music, Users, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import {authService , User} from '../../services/authService.ts';
import DefaultPicture from '../../../public/default-avatar.webp'
type Props = {

  setArtist : React.Dispatch<React.SetStateAction<User | null>>;
}
export const ArtistSide = ({setArtist} : Props) => {
  const [active, setActive] = useState('Home');
  const [me , setMe] = useState<User | null>(null)
  const menu = [
    { name: 'Home', icon: <Home className="w-5 h-5" /> },
    { name: 'Music page', icon: <Music className="w-5 h-5" /> },
    { name: 'Audience Stats', icon: <Users className="w-5 h-5" /> },
    { name: 'Concerts', icon: <Calendar className="w-5 h-5" /> },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authService.getUser();
        setArtist(res)
        setMe(res)
      }
      catch (e) {
        console.error(e);
      }
    }
    fetchData();
  })
  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-950 via-sky-950/80 to-indigo-950 border-r border-sky-800/20 shadow-2xl flex flex-col justify-between p-6 backdrop-blur-xl text-slate-200">

      {/* ----- Top Logo Section ----- */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <img
            src={me?.avatar || DefaultPicture}
            alt="profile"
            className="w-12 h-12 rounded-xl object-cover border border-sky-500/30"
          />
          <div>
            <h2 className="font-bold text-lg tracking-wide text-white">{me?.fullName}</h2>
            <p className="text-xs text-sky-400">Artist Panel</p>
          </div>
        </div>

        {/* ----- Menu Items ----- */}
        <nav className="flex flex-col gap-2 w-full">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
                ${
                active === item.name
                  ? 'bg-gradient-to-r from-sky-600/40 to-indigo-700/30 text-sky-300 shadow-inner shadow-sky-900/40 border border-sky-500/20'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <span
                className={`transition-transform duration-200 ${
                  active === item.name ? 'scale-110 text-sky-300' : 'text-sky-200/80'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ----- Bottom User Info ----- */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          <img
            src={me?.avatar || DefaultPicture}
            alt="profile"
            className="w-10 h-10 rounded-xl object-cover border border-sky-500/30"
          />
          <div>
            <p className="text-sm font-medium text-white">{me?.fullName || "Your name"}</p>
            <p className="text-xs text-sky-400">Online</p>
          </div>
        </div>
        <button className="mt-4 w-full py-2 bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-sky-300 rounded-xl text-sm hover:from-sky-500/40 hover:to-indigo-500/40 transition-all cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
};
