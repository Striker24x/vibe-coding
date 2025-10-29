import { CheckCircle, XCircle, Clock, Terminal } from 'lucide-react';
import { WorkflowHistory } from '../types';
import { formatTimestamp } from '../utils/mockData';
import { Service } from '../types';

interface WorkflowHistoryProps {
  history: WorkflowHistory[];
  services: Service[];
  theme: 'dark' | 'light';
}

export function WorkflowHistoryPanel({ history, services, theme }: WorkflowHistoryProps) {
  const getServiceName = (serviceId: string | null) => {
    if (!serviceId) return 'Unknown Service';
    const service = services.find((s) => s.id === serviceId);
    return service ? service.display_name : 'Unknown Service';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-5 border-b border-slate-700">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Self-Healing Workflow History
        </h2>
      </div>

      <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No workflow executions yet
          </p>
        ) : (
          history.map((workflow) => (
            <div
              key={workflow.id}
              className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-900/50 border-slate-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {getStatusIcon(workflow.resolution_status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {getServiceName(workflow.service_id)}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                        workflow.resolution_status
                      )}`}
                    >
                      {workflow.resolution_status}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {workflow.problem_identified}
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}
                  >
                    Started: {formatTimestamp(workflow.started_at)}
                    {workflow.completed_at &&
                      ` • Completed: ${formatTimestamp(workflow.completed_at)}`}
                  </p>
                </div>
              </div>

              {workflow.commands_executed && workflow.commands_executed.length > 0 && (
                <div
                  className={`mt-3 p-3 rounded border ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-4 h-4 text-blue-500" />
                    <span
                      className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Executed Commands:
                    </span>
                  </div>
                  <div className="space-y-1">
                    {workflow.commands_executed.map((cmd, idx) => (
                      <div
                        key={idx}
                        className={`text-xs font-mono p-2 rounded ${
                          theme === 'dark' ? 'bg-slate-900 text-green-400' : 'bg-gray-100 text-green-700'
                        }`}
                      >
                        {cmd}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
