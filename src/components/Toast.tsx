import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Toast() {
  const { alerts, removeAlert } = useStore();

  useEffect(() => {
    alerts.forEach((alert) => {
      const timer = setTimeout(() => {
        removeAlert(alert.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [alerts, removeAlert]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border animate-slide-in ${
            alert.type === 'error'
              ? 'bg-red-500/90 border-red-400 text-white'
              : alert.type === 'warning'
              ? 'bg-yellow-500/90 border-yellow-400 text-gray-900'
              : alert.type === 'success'
              ? 'bg-green-500/90 border-green-400 text-white'
              : 'bg-blue-500/90 border-blue-400 text-white'
          }`}
        >
          {alert.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          {alert.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {alert.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <p className="text-sm opacity-90">{alert.message}</p>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
