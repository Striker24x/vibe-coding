import { useEffect } from 'react';
import { Server, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useStore } from './store/useStore';
import { useDataSync } from './hooks/useDataSync';
import { useSelfHealing } from './hooks/useSelfHealing';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { ServiceCard } from './components/ServiceCard';
import { LogViewer } from './components/LogViewer';
import { MetricsChart } from './components/MetricsChart';
import { SelfHealButton } from './components/SelfHealButton';
import { WorkflowHistoryPanel } from './components/WorkflowHistory';
import { ConfigPanel } from './components/ConfigPanel';
import { StatsCard } from './components/StatsCard';
import { PrintSpoolerControl } from './components/PrintSpoolerControl';

function App() {
  const { services, logs, workflowHistory, config, theme, toggleTheme, updateService, setConfig, addAlert } = useStore();
  const { fetchData } = useDataSync();
  const { triggerSelfHeal } = useSelfHealing();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  }, [theme]);

  const handleServiceAction = async (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    const service = services.find((s) => s.id === serviceId);
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

    await supabase.from('services').update(updates).eq('id', serviceId);
    updateService(serviceId, updates);

    await supabase.from('service_logs').insert({
      id: `log-${Date.now()}`,
      service_id: serviceId,
      level: 'INFO',
      message: `Service ${action} initiated by user`,
      timestamp: new Date().toISOString(),
    });

    addAlert({
      type: 'success',
      title: 'Action Completed',
      message,
    });
  };

  const handleConfigSave = async (newConfig: Partial<typeof config>) => {
    try {
      await supabase
        .from('dashboard_config')
        .update({ ...newConfig, updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      setConfig({ ...config, ...newConfig } as typeof config);

      addAlert({
        type: 'success',
        title: 'Configuration Saved',
        message: 'Dashboard settings have been updated',
      });
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save configuration',
      });
    }
  };

  const handleWebhookTrigger = async (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service || !service.webhook_url || !service.webhook_enabled) {
      addAlert({
        type: 'error',
        title: 'Webhook Fehler',
        message: 'Webhook ist nicht konfiguriert oder deaktiviert',
      });
      return;
    }

    window.location.href = service.webhook_url;
  };

  const handleWebhookUpdate = async (serviceId: string, webhookUrl: string, enabled: boolean) => {
    try {
      await supabase
        .from('services')
        .update({ webhook_url: webhookUrl, webhook_enabled: enabled })
        .eq('id', serviceId);

      updateService(serviceId, { webhook_url: webhookUrl, webhook_enabled: enabled });

      addAlert({
        type: 'success',
        title: 'Webhook Konfiguration',
        message: 'Webhook-Einstellungen wurden gespeichert',
      });
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Speichern Fehlgeschlagen',
        message: 'Webhook-Einstellungen konnten nicht gespeichert werden',
      });
    }
  };

  const runningServices = services.filter((s) => s.status === 'Running').length;
  const criticalServices = services.filter((s) => s.error_count > 5 || s.cpu_usage > 80).length;
  const avgCpu = services.length > 0
    ? services.reduce((sum, s) => sum + s.cpu_usage, 0) / services.length
    : 0;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        servicesRunning={runningServices}
        totalServices={services.length}
      />

      <Toast />

      {criticalServices > 0 && (
        <div className="container mx-auto px-6 mt-4">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Critical Alert</h3>
                <p className="text-sm">
                  {criticalServices} service{criticalServices !== 1 ? 's' : ''} require immediate attention
                </p>
              </div>
            </div>
            <SelfHealButton services={services} onTrigger={triggerSelfHeal} theme={theme} />
          </div>
        </div>
      )}

      <main className="container mx-auto px-6 py-6 space-y-6">
        {services.find((s) => s.name === 'spooler') && (
          <PrintSpoolerControl
            service={services.find((s) => s.name === 'spooler')!}
            onWebhookTrigger={handleWebhookTrigger}
            onWebhookUpdate={handleWebhookUpdate}
            theme={theme}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Services"
            value={services.length}
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

        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Service Monitor
          </h2>
          <div className="flex items-center gap-3">
            <ConfigPanel config={config} onSave={handleConfigSave} theme={theme} />
            {criticalServices === 0 && (
              <SelfHealButton services={services} onTrigger={triggerSelfHeal} theme={theme} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onAction={handleServiceAction}
              theme={theme}
            />
          ))}
        </div>

        <MetricsChart services={services} theme={theme} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LogViewer logs={logs} theme={theme} />
          <WorkflowHistoryPanel history={workflowHistory} services={services} theme={theme} />
        </div>
      </main>
    </div>
  );
}

export default App;
