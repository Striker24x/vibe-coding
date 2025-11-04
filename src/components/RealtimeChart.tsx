import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RealtimeChartProps {
  clientId: string;
  theme: 'dark' | 'light';
}

interface DataPoint {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
}

export function RealtimeChart({ clientId, theme }: RealtimeChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const maxPoints = 20;

    const generateDataPoint = (): DataPoint => {
      const now = new Date();
      return {
        time: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: Math.random() * 100,
        memory: 40 + Math.random() * 50,
        disk: Math.random() * 30,
      };
    };

    const initialData: DataPoint[] = [];
    for (let i = maxPoints; i > 0; i--) {
      const time = new Date(Date.now() - i * 3000);
      initialData.push({
        time: time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: Math.random() * 100,
        memory: 40 + Math.random() * 50,
        disk: Math.random() * 30,
      });
    }
    setData(initialData);

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData, generateDataPoint()];
        if (newData.length > maxPoints) {
          newData.shift();
        }
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [clientId]);

  return (
    <div
      className={`rounded-xl p-5 shadow-lg border transition-all duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700 backdrop-blur-sm'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Real-time System Metrics
          </h3>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Live updates every 3 seconds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Live
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorCpuGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
            opacity={0.5}
          />
          <XAxis
            dataKey="time"
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '10px' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
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
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="CPU %"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="memory"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Memory %"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="disk"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Disk I/O %"
            isAnimationActive={true}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
