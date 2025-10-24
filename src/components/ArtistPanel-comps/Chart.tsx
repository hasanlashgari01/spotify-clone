/* ---------- Audience Growth Chart ---------- */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const audienceData = [
  { month: 'Apr', followers: 10200 },
  { month: 'May', followers: 12500 },
  { month: 'Jun', followers: 14900 },
  { month: 'Jul', followers: 16200 },
  { month: 'Aug', followers: 18000 },
  { month: 'Sep', followers: 19600 },
  { month: 'Oct', followers: 21100 },
];

export const AudienceChart = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-10 shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-sky-300">
        Audience Growth
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={audienceData}>
          <defs>
            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#312e81" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="month"

            stroke="#7dd3fc"
            tickLine={false}
            axisLine={true}
          />
          <YAxis
            stroke="#7dd3fc"
            tickLine={false}
            axisLine={true}
            tickFormatter={(val) => `${val / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: '10px',
            }}
            labelStyle={{ color: '#7dd3fc' }}
            itemStyle={{ color: '#bae6fd' }}
          />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="url(#colorFollowers)"
            strokeWidth={3}
            dot={{ r: 5, fill: '#38bdf8', strokeWidth: 2, stroke: '#0f172a' }}
            activeDot={{ r: 7, fill: '#38bdf8', stroke: '#1e3a8a', strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
