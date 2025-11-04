import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { ServiceLog } from '../types';

interface LiveActivityFeedProps {
  logs: ServiceLog[];
  theme: 'dark' | 'light';
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  message: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  isNew: boolean;
}

export function LiveActivityFeed({ logs, theme }: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (logs.length === 0) return;

    const latestLogs = logs.slice(0, 10).map((log) => ({
      id: log.id,
      icon: getIcon(log.level),
      message: log.message,
      timestamp: new Date(log.timestamp).toLocaleTimeString('de-DE'),
      level: log.level,
      isNew: false,
    }));

    setActivities(latestLogs);
  }, []);

  useEffect(() => {
    if (logs.length === 0 || activities.length === 0) return;

    const latestLog = logs[0];
    const existingActivity = activities.find(a => a.id === latestLog.id);

    if (!existingActivity) {
      const newActivity: ActivityItem = {
        id: latestLog.id,
        icon: getIcon(latestLog.level),
        message: latestLog.message,
        timestamp: new Date(latestLog.timestamp).toLocaleTimeString('de-DE'),
        level: latestLog.level,
        isNew: true,
      };

      setActivities((prev) => {
        const updated = [newActivity, ...prev.slice(0, 9)];
        setTimeout(() => {
          setActivities((current) =>
            current.map((item) =>
              item.id === newActivity.id ? { ...item, isNew: false } : item
            )
          );
        }, 1000);
        return updated;
      });
    }
  }, [logs]);

  const getIcon = (level: string) => {
    switch (level) {
      case 'INFO':
        return <Info className="w-4 h-4" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4" />;
      case 'CRITICAL':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getColorClasses = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'WARNING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ERROR':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div
      className={`rounded-xl p-5 shadow-lg border h-full ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Live Activity Feed
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Warte auf Aktivitäten...
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-500 ${
                activity.isNew ? 'scale-105 animate-pulse' : 'scale-100'
              } ${getColorClasses(activity.level)} ${
                theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="mt-0.5">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {activity.message}
                </p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#1e293b' : '#f1f5f9'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#475569' : '#cbd5e1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
}
