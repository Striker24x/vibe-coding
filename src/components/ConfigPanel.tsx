import { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';
import { DashboardConfig } from '../types';

interface ConfigPanelProps {
  config: DashboardConfig | null;
  onSave: (config: Partial<DashboardConfig>) => void;
  theme: 'dark' | 'light';
}

export function ConfigPanel({ config, onSave, theme }: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DashboardConfig>>(
    config || {
      n8n_webhook_url: '',
      ssh_host: '',
      ssh_port: 22,
      alert_threshold_cpu: 80,
      alert_threshold_memory: 85,
      monitoring_interval: 5,
      auto_healing_enabled: true,
    }
  );

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Settings className="w-5 h-5" />
        Settings
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl mx-4 rounded-xl shadow-2xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className={`p-5 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Dashboard Configuration
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              n8n Webhook URL
            </label>
            <input
              type="text"
              value={formData.n8n_webhook_url}
              onChange={(e) => setFormData({ ...formData, n8n_webhook_url: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/self-heal"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                SSH Host
              </label>
              <input
                type="text"
                value={formData.ssh_host}
                onChange={(e) => setFormData({ ...formData, ssh_host: e.target.value })}
                placeholder="localhost"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                SSH Port
              </label>
              <input
                type="number"
                value={formData.ssh_port}
                onChange={(e) => setFormData({ ...formData, ssh_port: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                CPU Alert Threshold (%)
              </label>
              <input
                type="number"
                value={formData.alert_threshold_cpu}
                onChange={(e) =>
                  setFormData({ ...formData, alert_threshold_cpu: parseInt(e.target.value) })
                }
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Memory Alert Threshold (%)
              </label>
              <input
                type="number"
                value={formData.alert_threshold_memory}
                onChange={(e) =>
                  setFormData({ ...formData, alert_threshold_memory: parseInt(e.target.value) })
                }
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Monitoring Interval (seconds)
            </label>
            <input
              type="number"
              value={formData.monitoring_interval}
              onChange={(e) =>
                setFormData({ ...formData, monitoring_interval: parseInt(e.target.value) })
              }
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="auto-healing"
              checked={formData.auto_healing_enabled}
              onChange={(e) =>
                setFormData({ ...formData, auto_healing_enabled: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="auto-healing"
              className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Enable Auto-Healing
            </label>
          </div>
        </div>

        <div className={`p-5 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} flex justify-end gap-3`}>
          <button
            onClick={() => setIsOpen(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
