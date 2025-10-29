import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  theme: 'dark' | 'light';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, color, theme, trend }: StatsCardProps) {
  return (
    <div
      className={`rounded-xl p-5 shadow-lg border transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {title}
      </h3>
      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
