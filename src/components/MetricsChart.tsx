import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Service } from '../types';

interface MetricsChartProps {
  services: Service[];
  theme: 'dark' | 'light';
}

export function MetricsChart({ services, theme }: MetricsChartProps) {
  const runningServices = services.filter((s) => s.status === 'Running');

  const data = runningServices.slice(0, 6).map((service) => ({
    name: service.display_name.substring(0, 15),
    cpu: parseFloat(service.cpu_usage.toFixed(1)),
    memory: parseFloat((service.memory_usage / 10).toFixed(1)),
  }));

  return (
    <div
      className={`rounded-xl p-5 shadow-lg border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Service Metrics Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="name"
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981' }}
            name="CPU %"
          />
          <Line
            type="monotone"
            dataKey="memory"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
            name="Memory (x10 MB)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
