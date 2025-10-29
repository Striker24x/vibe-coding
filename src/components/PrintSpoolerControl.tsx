import { useState } from 'react';
import { Printer, Settings, Save, Loader2, Zap } from 'lucide-react';
import { Service } from '../types';
import { WebhookDiagnostics } from './WebhookDiagnostics';

interface PrintSpoolerControlProps {
  service: Service;
  onWebhookTrigger: (serviceId: string) => Promise<void>;
  onWebhookUpdate: (serviceId: string, webhookUrl: string, enabled: boolean) => Promise<void>;
  theme: 'dark' | 'light';
}

export function PrintSpoolerControl({
  service,
  onWebhookTrigger,
  onWebhookUpdate,
  theme,
}: PrintSpoolerControlProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTriggeringWebhook, setIsTriggeringWebhook] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(service.webhook_url || '');
  const [webhookEnabled, setWebhookEnabled] = useState(service.webhook_enabled || false);

  const handleTriggerWebhook = async () => {
    setIsTriggeringWebhook(true);
    try {
      await onWebhookTrigger(service.id);
    } finally {
      setIsTriggeringWebhook(false);
    }
  };

  const handleSaveConfig = async () => {
    await onWebhookUpdate(service.id, webhookUrl, webhookEnabled);
    setIsConfigOpen(false);
  };

  return (
    <div
      className={`rounded-xl p-6 shadow-lg border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Printer className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Print Spooler Steuerung
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Direkter Webhook-Trigger für {service.display_name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {isConfigOpen && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            theme === 'dark'
              ? 'bg-slate-900/50 border-slate-700'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Webhook Konfiguration
          </h4>
          <div className="space-y-3">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/stop-spooler"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="webhook-enabled"
                  checked={webhookEnabled}
                  onChange={(e) => setWebhookEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="webhook-enabled"
                  className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Webhook aktiviert
                </label>
              </div>
              <button
                onClick={handleSaveConfig}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Speichern
              </button>
            </div>

            {webhookUrl && (
              <WebhookDiagnostics webhookUrl={webhookUrl} theme={theme} />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
          <p
            className={`text-lg font-semibold ${
              service.status === 'Running' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {service.status}
          </p>
        </div>
        <div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Webhook Status
          </p>
          <p
            className={`text-lg font-semibold ${
              service.webhook_enabled ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            {service.webhook_enabled ? 'Aktiv' : 'Inaktiv'}
          </p>
        </div>
      </div>

      {service.webhook_url && (
        <div
          className={`mb-4 p-3 rounded-lg text-xs font-mono ${
            theme === 'dark' ? 'bg-slate-900 text-green-400' : 'bg-gray-100 text-green-700'
          }`}
        >
          {service.webhook_url}
        </div>
      )}

      <button
        onClick={handleTriggerWebhook}
        disabled={!service.webhook_enabled || !service.webhook_url || isTriggeringWebhook}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
          service.webhook_enabled && service.webhook_url
            ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg shadow-orange-500/50'
            : 'bg-gradient-to-r from-gray-600 to-gray-500'
        }`}
      >
        {isTriggeringWebhook ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Webhook wird ausgeführt...
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" />
            Print Spooler Stoppen (Webhook)
          </>
        )}
      </button>

      {!service.webhook_enabled && (
        <p
          className={`mt-3 text-sm text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Bitte konfigurieren Sie die Webhook-URL und aktivieren Sie den Webhook
        </p>
      )}
    </div>
  );
}
