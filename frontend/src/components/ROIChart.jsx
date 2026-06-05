import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const ROIChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    date: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(
      new Date(item.date)
    ),
    roi: item.roiAmount
  }));

  if (chartData.length === 0) {
    return <p className="empty-state">ROI history will appear after the first cron run.</p>;
  }

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1877f2" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" />
          <XAxis dataKey="date" tick={{ fill: '#526070', fontSize: 12 }} />
          <YAxis tick={{ fill: '#526070', fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'ROI']}
            contentStyle={{ borderRadius: 8, border: '1px solid #d8dee9' }}
          />
          <Area
            type="monotone"
            dataKey="roi"
            stroke="#1877f2"
            strokeWidth={3}
            fill="url(#roiGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ROIChart;
