import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { songService } from '../../services/songService.ts';
import { useQuery } from '@tanstack/react-query';
import { Song } from '../../types/song.type.ts';

export const AudienceChart = () => {
  // مرحله ۱: گرفتن داده
  const { data: songs = [], isLoading } = useQuery<Song[], Error>({
    queryKey: ["mysongs"],
    queryFn: async () => await songService.getMySongs()
  });

  // مرحله ۲: فقط ۵ تا اول یا تاپ ۵
  const topFive = useMemo(() => {
    return songs.slice(0, 8);
  }, [songs]);

  // مرحله ۳: ساخت option فقط وقتی داده اومده
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { top: 20, left: 40, right: 40, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8,15,35,0.9)',
      borderColor: 'rgba(56,189,248,0.5)',
      borderWidth: 1.2,
      textStyle: { color: '#e0f2fe', fontSize: 13 },
      shadowBlur: 20,
      shadowColor: 'rgba(56,189,248,0.4)',
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#7dd3fc', width: 2 },
      },
    },
    xAxis: {
      type: 'category',
      data: topFive.map(song => song.title), // 🔥 از همون topFive استفاده کن
      axisLine: { lineStyle: { color: 'rgba(125,211,252,0.6)' } },
      axisLabel: { color: '#bae6fd', fontWeight: 500, fontSize: 13 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(125,211,252,0.5)' } },
      axisLabel: {
        color: '#a5f3fc',
        formatter: (value: number) => `${(value).toFixed(0)}`,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(56,189,248,0.08)',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'Plays',
        data: topFive.map(song => song.plays), // 👈 داده از songs میاد
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 9,
        showSymbol: true,
        itemStyle: {
          color: '#38bdf8',
          borderColor: '#0f172a',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: '#38bdf8',
        },
        lineStyle: {
          width: 2,
          shadowBlur: 35,
          shadowColor: 'rgba(56,189,248,0.6)',
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#60a5fa' },
            { offset: 0.5, color: '#3b82f6' },
            { offset: 1, color: '#0ea5e9' },
          ]),
        },
        areaStyle: {
          opacity: 0.45,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(56,189,248,0.45)' },
            { offset: 0.7, color: 'rgba(56,189,248,0.08)' },
            { offset: 1, color: 'rgba(15,23,42,0)' },
          ]),
        },
        emphasis: {
          scale: true,
          itemStyle: {
            color: '#7dd3fc',
            borderColor: '#1e3a8a',
            borderWidth: 4,
            shadowBlur: 25,
            shadowColor: '#38bdf8',
          },
        },
        animationDuration: 1800,
        animationEasing: 'cubicIn',
      },
    ],
  }), [topFive]);

  // مرحله ۴: هندل لودینگ
  if (isLoading) return <p className="text-sky-300">Loading chart...</p>;

  return (
    <div className="relative bg-gradient-to-br from-slate-950/80 via-blue-950/40 to-slate-900/80
                    border border-cyan-400/30 backdrop-blur-3xl rounded-[2rem]
                    shadow-[0_0_45px_rgba(56,189,248,0.25)] p-6 mb-10
                    w-full h-[400px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-sky-500/20 via-transparent to-transparent blur-3xl" />
      <h3 className="text-2xl font-semibold mb-5 text-sky-300 drop-shadow-[0_0_10px_#38bdf8]">
        Audience Growth (Latest 8 musics)
      </h3>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '85%' }}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};
