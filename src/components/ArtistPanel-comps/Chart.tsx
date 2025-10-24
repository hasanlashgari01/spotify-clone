/* ---------- Modern Audience Growth Chart (ECharts — Liquid Neon Glass Blue Edition) ---------- */
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

export const AudienceChart = () => {
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
      data: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisLine: { lineStyle: { color: 'rgba(125,211,252,0.6)' } },
      axisLabel: { color: '#bae6fd', fontWeight: 500, fontSize: 13 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(125,211,252,0.5)' } },
      axisLabel: {
        color: '#a5f3fc',
        formatter: (value: number) => `${(value / 1000).toFixed(0)}k`,
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
        name: 'Followers',
        data: [10200, 12500, 14900, 16200, 18000, 19600, 21100],
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
  }), []);

  return (
    <div className="relative bg-gradient-to-br from-slate-950/80 via-blue-950/40 to-slate-900/80
                    border border-cyan-400/30 backdrop-blur-3xl rounded-[2rem]
                    shadow-[0_0_45px_rgba(56,189,248,0.25)] p-6 mb-10
                    w-full h-[400px] overflow-hidden">

      {/* Glass glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-500/20 via-transparent to-transparent blur-3xl" />

      {/* Title */}
      <h3 className="text-2xl font-semibold mb-5 text-sky-300 drop-shadow-[0_0_10px_#38bdf8]">
        Audience Growth
      </h3>

      {/* Chart */}
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
