import { useState } from 'react';
import { Printer, Settings, Save, Loader2, Play, Square } from 'lucide-react';
import { Service } from '../types';
import { WebhookDiagnostics } from './WebhookDiagnostics';

interface PrintSpoolerControlProps {
  service: Service;
  onStartWebhook: (serviceId: string) => Promise<void>;
  onStopWebhook: (serviceId: string) => Promise<void>;
  onWebhookUpdate: (
    serviceId: string,
    startUrl: string,
    startEnabled: boolean,
    stopUrl: string,
    stopEnabled: boolean
  ) => Promise<void>;
  theme: 'dark' | 'light';
}

export function PrintSpoolerControl({
  service,
  onStartWebhook,
  onStopWebhook,
  onWebhookUpdate,
  theme,
}: PrintSpoolerControlProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTriggeringStart, setIsTriggeringStart] = useState(false);
  const [isTriggeringStop, setIsTriggeringStop] = useState(false);
  const [startWebhookUrl, setStartWebhookUrl] = useState(service.start_webhook_url || '');
  const [startWebhookEnabled, setStartWebhookEnabled] = useState(service.start_webhook_enabled || false);
  const [stopWebhookUrl, setStopWebhookUrl] = useState(service.stop_webhook_url || '');
  const [stopWebhookEnabled, setStopWebhookEnabled] = useState(service.stop_webhook_enabled || false);

  const handleTriggerStart = async () => {
    setIsTriggeringStart(true);
    try {
      await onStartWebhook(service.id);
    } finally {
      setIsTriggeringStart(false);
    }
  };

  const handleTriggerStop = async () => {
    setIsTriggeringStop(true);
    try {
      await onStopWebhook(service.id);
    } finally {
      setIsTriggeringStop(false);
    }
  };

  const handleSaveConfig = async () => {
    await onWebhookUpdate(service.id, startWebhookUrl, startWebhookEnabled, stopWebhookUrl, stopWebhookEnabled);
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
          <div className="space-y-4">
            <div className={`p-3 rounded-lg border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'
            }`}>
              <h5 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                Start Webhook
              </h5>
              <div className="space-y-2">
                <input
                  type="text"
                  value={startWebhookUrl}
                  onChange={(e) => setStartWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/start-spooler"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="start-webhook-enabled"
                    checked={startWebhookEnabled}
                    onChange={(e) => setStartWebhookEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-green-500 focus:ring-2 focus:ring-green-500"
                  />
                  <label
                    htmlFor="start-webhook-enabled"
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Start Webhook aktiviert
                  </label>
                </div>
                {startWebhookUrl && (
                  <WebhookDiagnostics webhookUrl={startWebhookUrl} theme={theme} />
                )}
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'
            }`}>
              <h5 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                Stop Webhook
              </h5>
              <div className="space-y-2">
                <input
                  type="text"
                  value={stopWebhookUrl}
                  onChange={(e) => setStopWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/stop-spooler"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="stop-webhook-enabled"
                    checked={stopWebhookEnabled}
                    onChange={(e) => setStopWebhookEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-red-500 focus:ring-2 focus:ring-red-500"
                  />
                  <label
                    htmlFor="stop-webhook-enabled"
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Stop Webhook aktiviert
                  </label>
                </div>
                {stopWebhookUrl && (
                  <WebhookDiagnostics webhookUrl={stopWebhookUrl} theme={theme} />
                )}
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Speichern
            </button>
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
              (service.start_webhook_enabled || service.stop_webhook_enabled) ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            {(service.start_webhook_enabled || service.stop_webhook_enabled) ? 'Aktiv' : 'Inaktiv'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleTriggerStart}
          disabled={!service.start_webhook_enabled || !service.start_webhook_url || isTriggeringStart}
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            service.start_webhook_enabled && service.start_webhook_url
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
              : 'bg-gradient-to-r from-gray-600 to-gray-500'
          }`}
        >
          {isTriggeringStart ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Starte...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Starten
            </>
          )}
        </button>

        <button
          onClick={handleTriggerStop}
          disabled={!service.stop_webhook_enabled || !service.stop_webhook_url || isTriggeringStop}
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            service.stop_webhook_enabled && service.stop_webhook_url
              ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-r from-gray-600 to-gray-500'
          }`}
        >
          {isTriggeringStop ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Stoppe...
            </>
          ) : (
            <>
              <Square className="w-5 h-5" />
              Stoppen
            </>
          )}
        </button>
      </div>

      {(!service.start_webhook_enabled && !service.stop_webhook_enabled) && (
        <p
          className={`mt-3 text-sm text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Bitte konfigurieren Sie die Webhook-URLs und aktivieren Sie die Webhooks
        </p>
      )}
    </div>
  );
}
