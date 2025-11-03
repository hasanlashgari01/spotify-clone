import { useEffect, useState } from 'react';
import { Music, TrendingUp, Users, UploadCloud } from 'lucide-react';
import { AudienceChart } from './Chart.tsx';
import { User} from '../../services/authService.ts'
type Props = {
  me : User | null
}
export const PanelHome = ({me} : Props) => {
  const [artistname, setArtistname] = useState<string>('Your name');
  useEffect(() => {
    setArtistname(me?.fullName ? me.fullName : '');
  } , [me])
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-900 text-slate-100 p-10 font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-sky-400">{artistname}</span>
          </h2>
          <h4 className="text-slate-400">Quickly check your account overview</h4>
        </div>
        <div className="flex items-center gap-3 mt-5 md:mt-0">
          <span className="text-sm bg-sky-400/10 border border-sky-500/30 text-sky-300 px-4 py-2 rounded-xl backdrop-blur-sm">
            ● Online
          </span>
          <button className="flex items-center gap-2 text-sm bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 rounded-xl font-semibold shadow-lg hover:opacity-90 transition">
            <UploadCloud className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Releases"
          value="12"
          desc="Total tracks & artworks"
          icon={<Music className="text-sky-300" />}
        />
        <StatCard
          title="Plays (7d)"
          value="8,742"
          desc="Recent traction"
          icon={<TrendingUp className="text-sky-300" />}
        />
        <StatCard
          title="Followers"
          value="14.6k"
          desc="Your growing fanbase"
          icon={<Users className="text-sky-300" />}
        />
      </div>

      <AudienceChart />
      {/* Latest Releases */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-10 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-sky-300">
          Latest Releases
        </h3>
        <div className="space-y-4">
          <ReleaseRow title="Midnight Sky" plays="2.1k" date="Oct 12, 2025" />
          <ReleaseRow title="Deep Night" plays="1.8k" date="Sep 28, 2025" />
          <ReleaseRow title="Echoes" plays="3.6k" date="Aug 01, 2025" />
        </div>
      </div>

      {/* Motivation Quote */}
      <div className="text-center text-sky-300/70 italic text-sm mt-16">
        “Art isn’t finished until someone feels it.” — Reza Pishro
      </div>
    </div>
  );
};

/* ---------- Subcomponents ---------- */
function StatCard({
                    title,
                    value,
                    desc,
                    icon,
                  }: {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-lg hover:shadow-sky-900/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-sky-500/20">{icon}</div>
        <h3 className="text-sky-200 font-semibold">{title}</h3>
      </div>
      <div className="text-3xl font-extrabold text-white">{value}</div>
      <div className="text-slate-400 text-sm mt-1">{desc}</div>
    </div>
  );
}

function ReleaseRow({
                      title,
                      plays,
                      date,
                    }: {
  title: string;
  plays: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center font-semibold shadow-inner">
          🎵
        </div>
        <div>
          <div className="font-semibold text-white">{title}</div>
          <div className="text-xs text-slate-400">{date}</div>
        </div>
      </div>
      <div className="text-sky-300 text-sm">{plays} plays</div>
    </div>
  );
}
