import { useQuery } from '@tanstack/react-query';
import { httpService } from '../../config/axios';
import { Users, Music, ListMusic, TrendingUp, UserPlus, Music2, Activity, AlertCircle, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type AdminStats = {
  totalUsers: number;
  totalSongs: number;
  totalPlaylists: number;
  newUsersToday: number;
  newSongsToday: number;
  newPlaylistsToday: number;
  activeUsers: number;
  bannedUsers: number;
  chartData?: {
    users: { date: string; count: number }[];
    songs: { date: string; count: number }[];
    playlists: { date: string; count: number }[];
  };
  recentActivity?: {
    type: string;
    description: string;
    time: string;
  }[];
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  subtitle,
  gradient,
}: {
  label: string;
  value: number | string;
  icon: any;
  trend?: number;
  subtitle?: string;
  gradient: string;
}) => {
  const displayValue = typeof value === 'number' ? value.toLocaleString('fa-IR') : value;
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-5 backdrop-blur-sm hover:border-white/20 transition-all group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 blur-3xl rounded-full`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-xl ${gradient} bg-opacity-20`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                isPositive
                  ? 'text-emerald-400 bg-emerald-500/20'
                  : isNegative
                    ? 'text-red-400 bg-red-500/20'
                    : 'text-white/50 bg-white/5'
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${isNegative ? 'rotate-180' : ''} ${trend === 0 ? 'opacity-0' : ''}`}
              />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="text-sm text-white/60 mb-1">{label}</div>
        <div className="text-3xl font-extrabold tracking-wide mb-1">{displayValue}</div>
        {subtitle && <div className="text-xs text-white/40">{subtitle}</div>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await httpService.get<AdminStats>('/admin/stats');
      return data;
    },
    retry: 1,
    refetchInterval: 30000, // هر 30 ثانیه بروزرسانی
  });

  const stats = useMemo(() => {
    if (isLoading || isError || !data) {
      return {
        totalUsers: '—',
        totalSongs: '—',
        totalPlaylists: '—',
        newUsersToday: '—',
        newSongsToday: '—',
        newPlaylistsToday: '—',
        activeUsers: '—',
        bannedUsers: '—',
      };
    }
    return {
      totalUsers: data.totalUsers ?? 0,
      totalSongs: data.totalSongs ?? 0,
      totalPlaylists: data.totalPlaylists ?? 0,
      newUsersToday: data.newUsersToday ?? 0,
      newSongsToday: data.newSongsToday ?? 0,
      newPlaylistsToday: data.newPlaylistsToday ?? 0,
      activeUsers: data.activeUsers ?? 0,
      bannedUsers: data.bannedUsers ?? 0,
    };
  }, [data, isLoading, isError]);

  const chartData = data?.chartData || {
    users: [],
    songs: [],
    playlists: [],
  };

  const pieData = [
    { name: 'Active users', value: stats.activeUsers as number },
    { name: 'Banned users', value: stats.bannedUsers as number },
  ];

  const COLORS = ['#3b82f6', '#ef4444'];

  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-white/60">System overview and key metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          icon={Users}
          trend={5}
          subtitle={`${stats.newUsersToday} new users today`}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          label="Total songs"
          value={stats.totalSongs}
          icon={Music}
          trend={12}
          subtitle={`${stats.newSongsToday} new songs today`}
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          label="Total playlists"
          value={stats.totalPlaylists}
          icon={ListMusic}
          trend={8}
          subtitle={`${stats.newPlaylistsToday} new playlists today`}
          gradient="from-pink-500 to-pink-600"
        />
        <StatCard
          label="Active users"
          value={stats.activeUsers}
          icon={UserPlus}
          subtitle={`${stats.bannedUsers} banned users`}
          gradient="from-emerald-500 to-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Users growth (last 7 days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.users.length > 0 ? chartData.users : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '10px',
                  backdropFilter: 'blur(8px)',
                }}
                labelStyle={{ color: '#7dd3fc' }}
                itemStyle={{ color: '#bae6fd' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Users distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData.filter((d) => d.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '10px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Music2 className="w-5 h-5 text-pink-400" />
            Songs and playlists stats
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'Songs', count: stats.totalSongs as number },
                { name: 'Playlists', count: stats.totalPlaylists as number },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '10px',
                }}
              />
              <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Recent activity
          </h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{activity.description}</div>
                    <div className="text-xs text-white/40 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-white/40">
                <AlertCircle className="w-8 h-8 mb-2" />
                <span className="text-sm">No activity found</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


