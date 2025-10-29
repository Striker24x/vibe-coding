import { useState, useRef, useEffect } from 'react';
import { Search, Download, Pause, Play } from 'lucide-react';
import { ServiceLog } from '../types';
import { formatTimestamp } from '../utils/mockData';

interface LogViewerProps {
  logs: ServiceLog[];
  theme: 'dark' | 'light';
}

export function LogViewer({ logs, theme }: LogViewerProps) {
  const [filter, setFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const exportLogs = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level}] ${log.message}`)
      .join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    a.click();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'text-blue-500';
      case 'WARNING':
        return 'text-yellow-500';
      case 'ERROR':
        return 'text-red-500';
      case 'CRITICAL':
        return 'text-red-600 font-bold';
      default:
        return theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-500/10';
      case 'WARNING':
        return 'bg-yellow-500/10';
      case 'ERROR':
        return 'bg-red-500/10';
      case 'CRITICAL':
        return 'bg-red-600/20';
      default:
        return '';
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Live Log Stream
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoScroll
                  ? 'bg-green-500 text-white'
                  : theme === 'dark'
                  ? 'bg-slate-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {autoScroll ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={exportLogs}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      <div
        ref={logContainerRef}
        className={`h-96 overflow-y-auto p-4 space-y-1 font-mono text-sm ${
          theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
        }`}
      >
        {filteredLogs.length === 0 ? (
          <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No logs to display
          </p>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded ${getLevelBg(log.level)} hover:opacity-80 transition-opacity`}
            >
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                [{formatTimestamp(log.timestamp)}]
              </span>{' '}
              <span className={`font-semibold ${getLevelColor(log.level)}`}>
                [{log.level}]
              </span>{' '}
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      <div className={`p-3 border-t ${theme === 'dark' ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-600'} text-sm`}>
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  );
}
