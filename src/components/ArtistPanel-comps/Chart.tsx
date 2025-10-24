import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useEffect, useState, useRef } from 'react';

export const AudienceChart = () => {
  const [animate, setAnimate] = useState(true);
  const mounted = useRef(false);

  const audienceData = [
    { month: 'Apr', followers: 10200 },
    { month: 'May', followers: 12500 },
    { month: 'Jun', followers: 14900 },
    { month: 'Jul', followers: 16200 },
    { month: 'Aug', followers: 18000 },
    { month: 'Sep', followers: 19600 },
    { month: 'Oct', followers: 21100 },
  ];

  useEffect(() => {
    // فقط بار اول انیمیت کن
    if (!mounted.current) {
      mounted.current = true;
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 1200); // بعد از انیمیشن اولیه خاموشش کن
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-10 shadow-xl w-full h-[380px] overflow-hidden">
      <h3 className="text-xl font-semibold mb-4 text-sky-300">
        Audience Growth
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={audienceData}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <defs>
            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#312e81" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            stroke="#7dd3fc"
            tickLine={false}
            axisLine={true}
            tickMargin={10}
          />

          <YAxis
            stroke="#7dd3fc"
            tickLine={false}
            axisLine={true}
            tickFormatter={(val) => `${val / 1000}k`}
            tickMargin={10}
          />

          <Tooltip
            contentStyle={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: '10px',
              backdropFilter: 'blur(8px)',
            }}
            labelStyle={{ color: '#7dd3fc' }}
            itemStyle={{ color: '#bae6fd' }}
          />

          <Line
            type="monotone"
            dataKey="followers"
            stroke="url(#colorFollowers)"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: '#38bdf8',
              strokeWidth: 2,
              stroke: '#0f172a',
            }}
            activeDot={{
              r: 7,
              fill: '#38bdf8',
              stroke: '#1e3a8a',
              strokeWidth: 3,
            }}
            isAnimationActive={animate}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
