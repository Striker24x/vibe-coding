import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Client, MonitoringTemplate } from '../types';

interface ClientSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (client: Client) => void;
  onDelete: (clientId: string) => void;
  client: Client;
  theme: 'dark' | 'light';
}

export function ClientSettingsModal({ isOpen, onClose, onUpdate, onDelete, client, theme }: ClientSettingsModalProps) {
  const [name, setName] = useState(client.name);
  const [ipAddress, setIpAddress] = useState(client.ip_address);
  const [os, setOs] = useState<'Windows' | 'Linux' | 'macOS'>(client.operating_system);
  const [template, setTemplate] = useState<MonitoringTemplate>(client.monitoring_template);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(client.name);
      setIpAddress(client.ip_address);
      setOs(client.operating_system);
      setTemplate(client.monitoring_template);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ipAddress) return;

    const updatedClient: Client = {
      ...client,
      name,
      ip_address: ipAddress,
      operating_system: os,
      monitoring_template: template,
    };

    onUpdate(updatedClient);
    onClose();
  };

  const handleDelete = () => {
    onDelete(client.id);
    onClose();
  };

  if (!isOpen) return null;

  const bgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50';
  const borderClass = theme === 'dark' ? 'border-slate-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-opacity-20 border-gray-500">
          <h2 className={`text-2xl font-bold ${textClass}`}>Client Einstellungen</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
          >
            <X className={textClass} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Client Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Server-01"
              className={`w-full px-4 py-2 ${inputBg} ${borderClass} border rounded-lg ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              IP Adresse
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="z.B. 192.168.1.100"
              className={`w-full px-4 py-2 ${inputBg} ${borderClass} border rounded-lg ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Betriebssystem
            </label>
            <select
              value={os}
              onChange={(e) => setOs(e.target.value as 'Windows' | 'Linux' | 'macOS')}
              className={`w-full px-4 py-2 ${inputBg} ${borderClass} border rounded-lg ${textClass} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="Windows">Windows</option>
              <option value="Linux">Linux</option>
              <option value="macOS">macOS</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${textClass}`}>
              Monitoring Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(template).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setTemplate({ ...template, [key]: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className={`capitalize ${textClass}`}>
                    {key === 'cpu' ? 'CPU' :
                     key === 'gpu' ? 'GPU' :
                     key === 'ram' ? 'RAM' :
                     key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-opacity-20 border-gray-500 pt-6">
            <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Danger Zone</h3>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Client löschen
              </button>
            ) : (
              <div className="space-y-3">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`flex-1 px-4 py-2 border ${borderClass} rounded-lg ${textClass} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Endgültig löschen
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${borderClass} rounded-lg ${textClass} hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
