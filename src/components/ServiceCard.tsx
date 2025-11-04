import { useState, useEffect } from 'react';
import { Play, Square, RotateCw, Activity, AlertCircle } from 'lucide-react';
import { Service } from '../types';
import { formatUptime, formatTimestamp } from '../utils/mockData';
import { MiniSparkline } from './MiniSparkline';

interface ServiceCardProps {
  service: Service;
  onAction: (serviceId: string, action: 'start' | 'stop' | 'restart') => void;
  theme: 'dark' | 'light';
}

export function ServiceCard({ service, onAction, theme }: ServiceCardProps) {
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);

  useEffect(() => {
    setCpuHistory(prev => {
      const updated = [...prev, service.cpu_usage];
      return updated.slice(-15);
    });
    setMemoryHistory(prev => {
      const updated = [...prev, service.memory_usage];
      return updated.slice(-15);
    });
  }, [service.cpu_usage, service.memory_usage]);

  const statusColor =
    service.status === 'Running'
      ? 'bg-green-500'
      : service.status === 'Paused'
      ? 'bg-yellow-500'
      : 'bg-red-500';

  const hasIssues = service.error_count > 5 || service.cpu_usage > 80 || service.memory_usage > 1000;

  return (
    <div
      className={`rounded-xl p-5 shadow-lg border transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {service.display_name}
            </h3>
            {hasIssues && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {service.name}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            service.status === 'Running'
              ? 'bg-green-500/20 text-green-500'
              : service.status === 'Paused'
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-red-500/20 text-red-500'
          }`}
        >
          {service.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            CPU Usage
          </p>
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {service.cpu_usage.toFixed(1)}%
          </p>
          {cpuHistory.length > 2 && (
            <div className="mt-1 -mb-1">
              <MiniSparkline data={cpuHistory} color={service.cpu_usage > 80 ? '#ef4444' : '#10b981'} height={20} />
            </div>
          )}
        </div>
        <div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Memory
          </p>
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {service.memory_usage.toFixed(0)} MB
          </p>
          {memoryHistory.length > 2 && (
            <div className="mt-1 -mb-1">
              <MiniSparkline data={memoryHistory} color={service.memory_usage > 1000 ? '#f59e0b' : '#3b82f6'} height={20} />
            </div>
          )}
        </div>
        <div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Uptime
          </p>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formatUptime(service.uptime)}
          </p>
        </div>
        <div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Errors (24h)
          </p>
          <p className={`text-sm font-medium ${service.error_count > 5 ? 'text-red-500' : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {service.error_count}
          </p>
        </div>
      </div>

      <div className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Last restart: {formatTimestamp(service.last_restart)}
      </div>

      <div className="flex gap-2">
        {service.status !== 'Running' && (
          <button
            onClick={() => onAction(service.id, 'start')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        )}
        {service.status === 'Running' && (
          <button
            onClick={() => onAction(service.id, 'stop')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}
        {service.status === 'Running' && (
          <button
            onClick={() => onAction(service.id, 'restart')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
