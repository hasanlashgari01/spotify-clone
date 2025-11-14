// src/pages/admin/Analytics.tsx
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

type AnalyticsResponse = {
  usersDaily: { date: string; newUsers: number; activeUsers: number }[];
  songsDaily: { date: string; newSongs: number; plays: number }[];
  playlistsDaily: { date: string; newPlaylists: number; likes: number }[];
};

const mockData: AnalyticsResponse = {
  usersDaily: [
    { date: '2023-10-01', newUsers: 150, activeUsers: 200 },
    { date: '2023-10-02', newUsers: 200, activeUsers: 250 },
    { date: '2023-10-03', newUsers: 180, activeUsers: 220 },
    // ... more data for 30 days
  ],
  songsDaily: [
    { date: '2023-10-01', newSongs: 10, plays: 500 },
    { date: '2023-10-02', newSongs: 12, plays: 600 },
    { date: '2023-10-03', newSongs: 8, plays: 550 },
    // ... more data for 30 days
  ],
  playlistsDaily: [
    { date: '2023-10-01', newPlaylists: 5, likes: 150 },
    { date: '2023-10-02', newPlaylists: 6, likes: 180 },
    { date: '2023-10-03', newPlaylists: 4, likes: 170 },
    // ... more data for 30 days
  ],
};

const Analytics = () => {
  const { data = mockData, isLoading = false, isError = false } = useQuery<AnalyticsResponse>({
    queryKey: ['admin-analytics'],
    queryFn: () => {
      // You can replace this with an actual API request if needed
      return mockData;
    },
    retry: 1,
  });

  const usersDaily = useMemo(() => data?.usersDaily ?? [], [data]);
  const songsDaily = useMemo(() => data?.songsDaily ?? [], [data]);
  const playlistsDaily = useMemo(() => data?.playlistsDaily ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Activity className="w-4 h-4" />
          <span>{isLoading ? 'Loading…' : isError ? 'Error' : 'Updated'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            New vs Active users (30 days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usersDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)' }} />
              <Line type="monotone" dataKey="newUsers" name="New users" stroke="#3b82f6" />
              <Line type="monotone" dataKey="activeUsers" name="Active users" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Songs growth & plays (30 days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={songsDaily}>
              <defs>
                <linearGradient id="colorNewSongs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f472b6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f472b6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)' }} />
              <Area type="monotone" dataKey="newSongs" name="New songs" stroke="#a78bfa" fill="url(#colorNewSongs)" />
              <Area type="monotone" dataKey="plays" name="Plays" stroke="#f472b6" fill="url(#colorPlays)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Playlists growth & likes (30 days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={playlistsDaily}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)' }} />
            <Line type="monotone" dataKey="newPlaylists" name="New playlists" stroke="#22c55e" />
            <Line type="monotone" dataKey="likes" name="Likes" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
