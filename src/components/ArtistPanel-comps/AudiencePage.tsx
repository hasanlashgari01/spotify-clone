import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useFollow } from '../../context/UserFansContext.tsx';
import { useFetchArtistSongs } from '../../hooks/useArtistSongs.ts';
import { DNA } from 'react-loader-spinner';
import { Song } from '../../types/song.type.ts';
import { User } from '../../services/authService.ts';

type Props = {
  me: User | null;
};

export const AudiencePage = ({ me }: Props) => {
  const { count } = useFollow();
  const { data: songs = [], isLoading } = useFetchArtistSongs();

  const [limit, setLimit] = useState<number | 'all'>(10);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'radar' | 'scatter'>('line');
  const [smooth, setSmooth] = useState(true);
  const [colorTheme, setColorTheme] = useState<'sky' | 'violet' | 'emerald'>('sky');
  const [artistname, setArtistname] = useState<string>('Your name');
  const [refreshKey, setRefreshKey] = useState(0);
  const [dynamicHeight, setDynamicHeight] = useState(450);

  useEffect(() => {
    if (me?.fullName) setArtistname(me.fullName);
  }, [me]);

  useEffect(() => {
    // افزایش ارتفاع چارت بر اساس طول تایتل‌ها
    const avgTitleLength =
      songs.reduce((sum, s) => sum + (s.title?.length || 0), 0) / (songs.length || 1);
    const newHeight = Math.min(700, Math.max(450, avgTitleLength * 12 + 400));
    setDynamicHeight(newHeight);
  }, [songs, limit]);

  const limitedSongs = useMemo(() => {
    if (limit === 'all') return songs;
    return songs.slice(0, limit);
  }, [songs, limit]);

  const totalUniquePlays = useMemo(() => {
    const unique = new Map<string, number>();
    songs.forEach(song => {
      if (!unique.has(song.title)) unique.set(song.title, song.plays);
    });
    return Array.from(unique.values()).reduce((sum, val) => sum + val, 0);
  }, [songs]);

  const colorSets = {
    sky: ['#38bdf8', '#3b82f6', '#0ea5e9'],
    violet: ['#a78bfa', '#8b5cf6', '#7c3aed'],
    emerald: ['#34d399', '#10b981', '#059669'],
  }[colorTheme];

  const option = useMemo(() => {
    const baseSeries = {
      name: 'Plays',
      data: limitedSongs.map((song: Song) => song.plays || 0),
      type: chartType === 'area' ? 'line' : chartType,
      smooth,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: true,
      itemStyle: {
        color: colorSets[0],
        borderColor: '#0f172a',
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: colorSets[1],
      },
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: colorSets[0] },
          { offset: 0.5, color: colorSets[1] },
          { offset: 1, color: colorSets[2] },
        ]),
        shadowBlur: 25,
        shadowColor: 'rgba(56,189,248,0.6)',
      },
      areaStyle:
        chartType === 'area'
          ? {
            opacity: 0.45,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${colorSets[0]}66` },
              { offset: 0.7, color: `${colorSets[1]}22` },
              { offset: 1, color: 'rgba(15,23,42,0)' },
            ]),
          }
          : undefined,
      animationDuration: 1500,
      animationEasing: 'quartOut',
    };

    return {
      backgroundColor: 'transparent',
      grid: { top: 40, left: 40, right: 40, bottom: 60 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10,20,40,0.9)',
        borderColor: `${colorSets[1]}88`,
        textStyle: { color: '#e0f2fe', fontSize: 13 },
        axisPointer: { type: 'line', lineStyle: { color: colorSets[1] } },
      },
      radar:
        chartType === 'radar'
          ? {
            indicator: limitedSongs.map((song: Song) => ({
              name: song.title,
              max: Math.max(...limitedSongs.map(s => s.plays || 100)),
            })),
          }
          : undefined,
      xAxis:
        chartType !== 'radar'
          ? {
            type: 'category',
            data: limitedSongs.map((song: Song) => song.title || 'Unknown'),
            axisLabel: {
              show: limitedSongs.length <= 20, // 👈 وقتی بالای 20 آهنگ باشه label ها مخفی می‌شن
              color: '#bae6fd',
              rotate: 25,
              fontSize: 11,
            },
            axisLine: { lineStyle: { color: 'rgba(125,211,252,0.6)' } },
            axisTick: { alignWithLabel: true },
          }
          : undefined,
      yAxis:
        chartType !== 'radar'
          ? {
            type: 'value',
            axisLabel: { color: '#a5f3fc' },
            splitLine: {
              lineStyle: { color: 'rgba(56,189,248,0.08)', type: 'dashed' },
            },
          }
          : undefined,
      series:
        chartType === 'radar'
          ? [
            {
              type: 'radar',
              data: [
                {
                  value: limitedSongs.map(s => s.plays || 0),
                  name: 'Plays',
                },
              ],
            },
          ]
          : [baseSeries],
    };
  }, [limitedSongs, chartType, smooth, colorSets]);

  if (isLoading)
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <DNA height={140} width={140} dnaColorOne="#05339C" dnaColorTwo="#1055C9" />
        <p className="mt-4 text-sky-400 font-medium">Loading audience data...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="bg-slate-900/70 border border-sky-400/20 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-sky-300 mb-1">{artistname}</h2>
          <p className="text-sky-200/70 text-sm">
            Total Fans: <span className="text-sky-400 font-semibold">{count.followers}</span> •
            Total Plays: <span className="text-sky-400 font-semibold">{totalUniquePlays}</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900/60 border border-cyan-400/30 backdrop-blur-xl p-4 rounded-2xl gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sky-300 font-medium">Show:</label>
          {[10, 20, 60, 'all'].map(n => (
            <button
              key={n}
              onClick={() => setLimit(n as never)}
              className={`px-3 py-1 rounded-xl text-sm font-semibold transition cursor-pointer ${
                limit === n
                  ? 'bg-sky-500 text-white shadow-[0_0_10px_#38bdf8]'
                  : 'bg-slate-800 text-sky-300 hover:bg-sky-700/40'
              }`}
            >
              {n === 'all' ? 'All Songs' : n}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sky-300 font-medium">Chart Type:</label>
          {['line', 'bar', 'area', 'radar', 'scatter'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type as never)}
              className={`px-3 py-1 rounded-xl text-sm font-semibold capitalize transition cursor-pointer ${
                chartType === type
                  ? 'bg-sky-500 text-white shadow-[0_0_10px_#38bdf8]'
                  : 'bg-slate-800 text-sky-300 hover:bg-sky-700/40'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sky-300 font-medium">Theme:</label>
          {['sky', 'violet', 'emerald'].map(t => (
            <button
              key={t}
              onClick={() => setColorTheme(t as never)}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                colorTheme === t ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ background: colorSets[0] }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSmooth(!smooth)}
            className={`px-3 py-1 rounded-xl text-sm font-semibold cursor-pointer ${
              smooth ? 'bg-emerald-500/80' : 'bg-slate-800 text-sky-300'
            }`}
          >
            {smooth ? 'Smooth ON' : 'Smooth OFF'}
          </button>

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="px-3 py-1 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 transition text-white cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Chart */}
      <div
        className="relative bg-gradient-to-br from-slate-950/80 via-blue-950/40 to-slate-900/80 border border-cyan-400/30 backdrop-blur-3xl rounded-[2rem] shadow-[0_0_45px_rgba(56,189,248,0.25)] p-6 mb-10 w-full overflow-hidden transition-all duration-300"
        style={{ height: `${dynamicHeight}px` }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-sky-300">
          Audience Stats ({limit === 'all' ? 'All Songs' : `${limit} latest songs`})
        </h3>
        <ReactECharts
          key={refreshKey}
          option={option}
          style={{ width: '100%', height: '85%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
};
