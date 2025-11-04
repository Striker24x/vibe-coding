import { Monitor, Circle, ChevronRight } from 'lucide-react';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
  onClick: (clientId: string) => void;
  theme: 'dark' | 'light';
}

export function ClientCard({ client, onClick, theme }: ClientCardProps) {
  const bgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  const statusColors = {
    online: 'text-green-500',
    offline: 'text-red-500',
    warning: 'text-yellow-500',
  };

  const activeMonitoring = Object.entries(client.monitoring_template)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key.toUpperCase())
    .join(', ');

  return (
    <div
      onClick={() => onClick(client.id)}
      className={`${bgClass} rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border border-opacity-10 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${textClass}`}>{client.name}</h3>
            <p className={`text-sm ${mutedClass}`}>{client.operating_system}</p>
          </div>
        </div>
        <ChevronRight className={mutedClass} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${mutedClass}`}>Status</span>
          <div className="flex items-center gap-2">
            <Circle className={`w-2 h-2 fill-current ${statusColors[client.status]}`} />
            <span className={`text-sm font-medium capitalize ${textClass}`}>
              {client.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${mutedClass}`}>IP Adresse</span>
          <span className={`text-sm font-mono ${textClass}`}>{client.ip_address}</span>
        </div>

        <div className="pt-3 border-t border-opacity-10 border-gray-500">
          <span className={`text-xs ${mutedClass} block mb-1`}>Monitoring:</span>
          <span className={`text-xs ${textClass}`}>{activeMonitoring}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={mutedClass}>Last Seen</span>
          <span className={mutedClass}>
            {new Date(client.last_seen).toLocaleString('de-DE')}
          </span>
        </div>
      </div>
    </div>
  );
}
