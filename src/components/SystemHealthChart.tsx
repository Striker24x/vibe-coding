import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Service } from '../types';

interface SystemHealthChartProps {
  services: Service[];
  theme: 'dark' | 'light';
}

export function SystemHealthChart({ services, theme }: SystemHealthChartProps) {
  const statusData = [
    {
      name: 'Running',
      count: services.filter(s => s.status === 'Running').length,
      color: '#10b981',
    },
    {
      name: 'Stopped',
      count: services.filter(s => s.status === 'Stopped').length,
      color: '#ef4444',
    },
    {
      name: 'Paused',
      count: services.filter(s => s.status === 'Paused').length,
      color: '#f59e0b',
    },
  ];

  const healthData = [
    {
      name: 'Healthy',
      count: services.filter(s => s.error_count < 5 && s.cpu_usage < 70).length,
      color: '#10b981',
    },
    {
      name: 'Warning',
      count: services.filter(s => (s.error_count >= 5 && s.error_count < 10) || (s.cpu_usage >= 70 && s.cpu_usage < 85)).length,
      color: '#f59e0b',
    },
    {
      name: 'Critical',
      count: services.filter(s => s.error_count >= 10 || s.cpu_usage >= 85).length,
      color: '#ef4444',
    },
  ];

  const hasData = services.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        className={`rounded-xl p-5 shadow-lg border ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Service Status
        </h3>
        {!hasData ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Keine Daten verfügbar
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
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
              <Bar dataKey="count" name="Services" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        className={`rounded-xl p-5 shadow-lg border ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          System Health
        </h3>
        {!hasData ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Keine Daten verfügbar
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthData}>
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
              <Bar dataKey="count" name="Services" radius={[8, 8, 0, 0]}>
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
