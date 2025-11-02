import { useEffect, useMemo, useState } from 'react';
import { Music, TrendingUp, Users, UploadCloud } from 'lucide-react';
import { AudienceChart } from './Chart.tsx';
import { User } from '../../services/authService.ts';

import {useFetchArtistSongs} from '../../hooks/useArtistSongs.ts';
import { useFollow } from '../../context/UserFansContext.tsx';

import {DNA} from 'react-loader-spinner'
type Props = {
  me: User | null;
};
export const PanelHome = ({ me }: Props) => {
  const {count} = useFollow();
  const {data , isLoading} = useFetchArtistSongs();

;

  const latests = useMemo(() => {
    return data?.slice(0, 3);
  }, [data]);
  const totalUniquePlays = useMemo(() => {
    const unique = new Map<string, number>();

    data?.forEach(song => {
      if (!unique.has(song.title)) {
        unique.set(song.title, song.plays);
      }
    });

    // جمع کل plays یکتا
    return Array.from(unique.values()).reduce((sum, val) => sum + val, 0);
  }, [data]);
  const [artistname, setArtistname] = useState<string>('Your name');
  useEffect(() => {
    setArtistname(me?.fullName ? me.fullName : '');
  }, [me]);
  if (isLoading) return <div className="h-full w-full flex flex-col justify-center items-center">
    <DNA dnaColorOne={"#05339C"} dnaColorTwo={"#1055C9"} ></DNA>
  </div>;
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-900 p-10 font-[Poppins] text-slate-100">
      {/* Header */}
      <div className="mb-10 flex flex-col items-center justify-between md:flex-row">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-sky-400">{artistname}</span>
          </h2>
          <h4 className="text-slate-400">
            Quickly check your account overview
          </h4>
        </div>
        <div className="mt-5 flex items-center gap-3 md:mt-0">
          <span className="rounded-xl border border-sky-500/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-300 backdrop-blur-sm">
            ● Online
          </span>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold shadow-lg transition hover:opacity-90">
            <UploadCloud className="h-4 w-4" /> Upload
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Releases"
          value={`${data?.length}`}
          desc="Total tracks & artworks"
          icon={<Music className="text-sky-300" />}
        />
        <StatCard
          title="Plays (Lifetime)"
          value={`${totalUniquePlays}`}
          desc="Recent traction"
          icon={<TrendingUp className="text-sky-300" />}
        />
        <StatCard
          title="Followers"
          value={`${count.followers}`}
          desc="Your growing fanbase"
          icon={<Users className="text-sky-300" />}
        />
      </div>

      <AudienceChart />
      {/* Latest Releases */}
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
        <h3 className="mb-4 text-xl font-semibold text-sky-300">
          Latest Releases
        </h3>
        <div className="space-y-4">
          {latests?.map((item, i) => (
            <div key={i} className="cursor-pointer">
              <ReleaseRow title={item.title} plays={`${item.plays}`} date={item.createdAt} src={item.cover}></ReleaseRow>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Quote */}
      <div className="mt-16 text-center text-sm text-sky-300/70 italic">
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-900/50">
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-xl bg-sky-500/20 p-2">{icon}</div>
        <h3 className="font-semibold text-sky-200">{title}</h3>
      </div>
      <div className="text-3xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{desc}</div>
    </div>
  );
}

function ReleaseRow({
  src,
  title,
  plays,
  date,
}: {
  src : string;
  title: string;
  plays: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 font-semibold shadow-inner">
          <img src={src} alt="Music Picture" className="rounded-xl"/>
        </div>
        <div>
          <div className="font-semibold text-white">{title}</div>
          <div className="text-sm text-slate-400">{date.split("T").shift()}</div>
        </div>
      </div>
      <div className="text-sm text-sky-300">{plays} plays</div>
    </div>
  );
}
