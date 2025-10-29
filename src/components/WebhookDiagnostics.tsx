import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2, Activity } from 'lucide-react';

interface WebhookDiagnosticsProps {
  webhookUrl: string;
  theme: 'dark' | 'light';
}

export function WebhookDiagnostics({ webhookUrl, theme }: WebhookDiagnosticsProps) {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<{
    urlValid: boolean;
    serverReachable: boolean | null;
    corsEnabled: boolean | null;
    responseTime: number | null;
    errorDetails: string | null;
  }>({
    urlValid: false,
    serverReachable: null,
    corsEnabled: null,
    responseTime: null,
    errorDetails: null,
  });

  const testConnection = async () => {
    setIsTestingConnection(true);
    const results = {
      urlValid: false,
      serverReachable: null as boolean | null,
      corsEnabled: null as boolean | null,
      responseTime: null as number | null,
      errorDetails: null as string | null,
    };

    try {
      const url = new URL(webhookUrl);
      results.urlValid = true;
    } catch {
      results.urlValid = false;
      results.errorDetails = 'Ungültige URL-Format';
      setDiagnosticResults(results);
      setIsTestingConnection(false);
      return;
    }

    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      results.responseTime = Date.now() - startTime;
      results.serverReachable = true;
      results.corsEnabled = true;

      if (!response.ok) {
        results.errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      results.responseTime = Date.now() - startTime;
      results.serverReachable = false;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          results.errorDetails = 'Timeout - Server antwortet nicht innerhalb von 10 Sekunden';
        } else if (error.message.includes('CORS')) {
          results.corsEnabled = false;
          results.errorDetails = 'CORS-Fehler - n8n Webhook muss CORS aktiviert haben';
        } else if (error.message.includes('Failed to fetch')) {
          results.errorDetails = 'Netzwerkfehler - Server nicht erreichbar oder SSL-Problem';
        } else {
          results.errorDetails = error.message;
        }
      }
    }

    setDiagnosticResults(results);
    setIsTestingConnection(false);
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Activity className="w-5 h-5 text-gray-400" />;
    if (status) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div
      className={`rounded-lg p-4 border ${
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-700'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Webhook-Diagnose
        </h4>
        <button
          onClick={testConnection}
          disabled={isTestingConnection || !webhookUrl}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Teste...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              Verbindung testen
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            URL-Format gültig
          </span>
          {getStatusIcon(diagnosticResults.urlValid)}
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Server erreichbar
          </span>
          {getStatusIcon(diagnosticResults.serverReachable)}
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            CORS aktiviert
          </span>
          {getStatusIcon(diagnosticResults.corsEnabled)}
        </div>
        {diagnosticResults.responseTime !== null && (
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Antwortzeit
            </span>
            <span
              className={`text-sm font-medium ${
                diagnosticResults.responseTime < 1000
                  ? 'text-green-500'
                  : diagnosticResults.responseTime < 3000
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {diagnosticResults.responseTime}ms
            </span>
          </div>
        )}
      </div>

      {diagnosticResults.errorDetails && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-500 mb-1">Fehlerdetails:</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                {diagnosticResults.errorDetails}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`mt-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
        <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          <strong>Tipps zur Fehlerbehebung:</strong>
        </p>
        <ul className={`text-xs mt-2 space-y-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          <li>• Stellen Sie sicher, dass Ihr n8n-Server läuft</li>
          <li>• Prüfen Sie, ob die Webhook-URL korrekt ist</li>
          <li>• n8n muss CORS in den Einstellungen aktiviert haben</li>
          <li>• Überprüfen Sie Ihre Firewall-Einstellungen</li>
          <li>• Bei HTTPS: SSL-Zertifikat muss gültig sein</li>
        </ul>
      </div>
    </div>
  );
}
