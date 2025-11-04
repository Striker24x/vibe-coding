import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Service } from '../types';
import { useState } from 'react';

interface MetricsChartProps {
  services: Service[];
  theme: 'dark' | 'light';
}

export function MetricsChart({ services, theme }: MetricsChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const runningServices = services.filter((s) => s.status === 'Running');

  const data = runningServices.slice(0, 8).map((service) => ({
    name: service.display_name.substring(0, 15),
    cpu: parseFloat(service.cpu_usage.toFixed(1)),
    memory: parseFloat((service.memory_usage / 10).toFixed(1)),
    disk: parseFloat(service.disk_io.toFixed(1)),
    errors: service.error_count,
  }));

  const hasData = data.length > 0 && data.some(d => d.cpu > 0 || d.memory > 0);

  return (
    <div
      className={`rounded-xl p-5 shadow-lg border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Service Metrics Overview
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'area'
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <div className={`text-6xl mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              📊
            </div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Keine aktiven Services zum Anzeigen
            </p>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Visualisierungen werden angezeigt, sobald Services laufen
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="name"
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                style={{ fontSize: '11px' }}
                angle={-15}
                textAnchor="end"
                height={60}
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
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCpu)"
                name="CPU %"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMemory)"
                name="Memory (x10 MB)"
              />
              <Area
                type="monotone"
                dataKey="disk"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDisk)"
                name="Disk I/O"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="name"
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                style={{ fontSize: '11px' }}
                angle={-15}
                textAnchor="end"
                height={60}
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
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="CPU %"
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Memory (x10 MB)"
              />
              <Line
                type="monotone"
                dataKey="disk"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
                name="Disk I/O"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
