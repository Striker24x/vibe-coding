import { Cpu, HardDrive, Activity, Network } from 'lucide-react';
import { SystemMetrics } from '../types';

interface SystemMetricsPanelProps {
  metrics: SystemMetrics | null;
  theme: 'dark' | 'light';
}

export function SystemMetricsPanel({ metrics, theme }: SystemMetricsPanelProps) {
  const bgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  if (!metrics) {
    return (
      <div className={`${bgClass} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-xl font-bold ${textClass} mb-4`}>System Metrics</h3>
        <p className={mutedClass}>Keine Metriken verfügbar</p>
      </div>
    );
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const ramPercentage = (metrics.ram_usage / metrics.ram_total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={`${bgClass} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className={`text-2xl font-bold ${getUsageColor(metrics.cpu_usage)}`}>
            {metrics.cpu_usage.toFixed(1)}%
          </span>
        </div>
        <h4 className={`font-medium ${textClass}`}>CPU</h4>
        <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              metrics.cpu_usage >= 80 ? 'bg-red-500' :
              metrics.cpu_usage >= 60 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(metrics.cpu_usage, 100)}%` }}
          />
        </div>
      </div>

      {metrics.gpu_usage !== undefined && (
        <div className={`${bgClass} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${getUsageColor(metrics.gpu_usage)}`}>
              {metrics.gpu_usage.toFixed(1)}%
            </span>
          </div>
          <h4 className={`font-medium ${textClass}`}>GPU</h4>
          <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.gpu_usage >= 80 ? 'bg-red-500' :
                metrics.gpu_usage >= 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(metrics.gpu_usage, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className={`${bgClass} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className={`text-2xl font-bold ${getUsageColor(ramPercentage)}`}>
            {ramPercentage.toFixed(1)}%
          </span>
        </div>
        <h4 className={`font-medium ${textClass}`}>RAM</h4>
        <p className={`text-xs ${mutedClass} mb-2`}>
          {(metrics.ram_usage / 1024).toFixed(1)} GB / {(metrics.ram_total / 1024).toFixed(1)} GB
        </p>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              ramPercentage >= 80 ? 'bg-red-500' :
              ramPercentage >= 60 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(ramPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className={`${bgClass} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
            <Network className="w-6 h-6 text-white" />
          </div>
        </div>
        <h4 className={`font-medium ${textClass} mb-3`}>Netzwerk</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={mutedClass}>Upload</span>
            <span className={textClass}>{(metrics.network_upload / 1024).toFixed(1)} MB/s</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className={mutedClass}>Download</span>
            <span className={textClass}>{(metrics.network_download / 1024).toFixed(1)} MB/s</span>
          </div>
        </div>
      </div>

      {metrics.drives.map((drive) => (
        <div key={drive.name} className={`${bgClass} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${getUsageColor(drive.percentage)}`}>
              {drive.percentage.toFixed(1)}%
            </span>
          </div>
          <h4 className={`font-medium ${textClass}`}>Laufwerk {drive.name}</h4>
          <p className={`text-xs ${mutedClass} mb-2`}>
            {(drive.used / 1024).toFixed(1)} GB / {(drive.total / 1024).toFixed(1)} GB
          </p>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                drive.percentage >= 80 ? 'bg-red-500' :
                drive.percentage >= 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(drive.percentage, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
