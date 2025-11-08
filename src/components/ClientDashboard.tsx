import { useEffect } from 'react';
import { ArrowLeft, Server, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Client } from '../types';
import { useStore } from '../store/useStore';
import { ServiceCard } from './ServiceCard';
import { LogViewer } from './LogViewer';
import { MetricsChart } from './MetricsChart';
import { StatsCard } from './StatsCard';
import { WorkflowHistoryPanel } from './WorkflowHistory';
import { SystemHealthChart } from './SystemHealthChart';

interface ClientDashboardProps {
  client: Client;
  onBack: () => void;
  theme: 'dark' | 'light';
}

export function ClientDashboard({ client, onBack, theme }: ClientDashboardProps) {
  const { services, logs, workflowHistory, updateService, addAlert } = useStore();

  const clientServices = services.filter((s) => s.client_id === client.id);

  const handleServiceAction = async (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    const service = clientServices.find((s) => s.id === serviceId);
    if (!service) return;

    let newStatus: 'Running' | 'Stopped' | 'Paused' = service.status;
    let message = '';

    switch (action) {
      case 'start':
        newStatus = 'Running';
        message = `${service.display_name} started successfully`;
        break;
      case 'stop':
        newStatus = 'Stopped';
        message = `${service.display_name} stopped`;
        break;
      case 'restart':
        newStatus = 'Running';
        message = `${service.display_name} restarted`;
        break;
    }

    const updates = {
      status: newStatus,
      last_restart: action === 'restart' ? new Date().toISOString() : service.last_restart,
      uptime: action === 'stop' ? 0 : service.uptime,
    };

    updateService(serviceId, updates);

    addAlert({
      type: 'success',
      title: 'Action Completed',
      message,
    });
  };

  const runningServices = clientServices.filter((s) => s.status === 'Running').length;
  const criticalServices = clientServices.filter((s) => s.error_count > 5 || s.cpu_usage > 80).length;
  const avgCpu = clientServices.length > 0
    ? clientServices.reduce((sum, s) => sum + s.cpu_usage, 0) / clientServices.length
    : 0;

  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-slate-800' : 'bg-white';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 mb-6 ${textClass} hover:opacity-70 transition-opacity`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück zur Übersicht</span>
        </button>

        <div className={`${cardBg} rounded-xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>{client.name}</h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {client.ip_address} • {client.operating_system}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              client.status === 'online' ? 'bg-green-500/20 text-green-500' :
              client.status === 'offline' ? 'bg-red-500/20 text-red-500' :
              'bg-yellow-500/20 text-yellow-500'
            }`}>
              <span className="capitalize font-medium">{client.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Services"
            value={clientServices.length}
            icon={Server}
            color="blue"
            theme={theme}
          />
          <StatsCard
            title="Running Services"
            value={runningServices}
            icon={Activity}
            color="green"
            theme={theme}
          />
          <StatsCard
            title="Critical Issues"
            value={criticalServices}
            icon={AlertTriangle}
            color="red"
            theme={theme}
          />
          <StatsCard
            title="Avg CPU Usage"
            value={`${avgCpu.toFixed(1)}%`}
            icon={TrendingUp}
            color="yellow"
            theme={theme}
          />
        </div>

        <h2 className={`text-2xl font-bold ${textClass} mb-4`}>Services</h2>

        {clientServices.length === 0 ? (
          <div className={`${cardBg} rounded-xl shadow-lg p-12 text-center`}>
            <Server className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Keine Services für diesen Client gefunden
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {clientServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAction={handleServiceAction}
                  theme={theme}
                />
              ))}
            </div>

            <MetricsChart services={clientServices} theme={theme} />

            <div className="mt-6">
              <SystemHealthChart services={clientServices} theme={theme} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <LogViewer logs={logs} theme={theme} />
              <WorkflowHistoryPanel history={workflowHistory} services={clientServices} theme={theme} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
