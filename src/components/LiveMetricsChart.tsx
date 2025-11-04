import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SystemMetrics } from '../types';

interface LiveMetricsChartProps {
  metricsHistory: SystemMetrics[];
  theme: 'dark' | 'light';
}

export function LiveMetricsChart({ metricsHistory, theme }: LiveMetricsChartProps) {
  const bgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const chartData = metricsHistory.slice(-20).map((metric) => ({
    time: new Date(metric.timestamp).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    CPU: metric.cpu_usage,
    GPU: metric.gpu_usage || 0,
    RAM: (metric.ram_usage / metric.ram_total) * 100,
  }));

  return (
    <div className={`${bgClass} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-xl font-bold ${textClass} mb-4`}>Live System Metriken</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis
            dataKey="time"
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px',
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="CPU"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="GPU"
            stroke="#A855F7"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="RAM"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
