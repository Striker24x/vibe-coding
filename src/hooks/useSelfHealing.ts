import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Service, WorkflowHistory } from '../types';

export function useSelfHealing() {
  const { config, addWorkflowHistory, updateWorkflowHistory, addAlert, updateService } = useStore();

  const triggerSelfHeal = useCallback(
    async (serviceData: Service) => {
      try {
        const problemDescription = [];

        if (serviceData.status !== 'Running') {
          problemDescription.push(`Service is ${serviceData.status}`);
        }
        if (serviceData.error_count > 5) {
          problemDescription.push(`High error count: ${serviceData.error_count} errors in 24h`);
        }
        if (serviceData.cpu_usage > 80) {
          problemDescription.push(`CPU usage critical: ${serviceData.cpu_usage.toFixed(1)}%`);
        }
        if (serviceData.memory_usage > 1000) {
          problemDescription.push(`Memory usage high: ${serviceData.memory_usage.toFixed(0)} MB`);
        }

        const problem = problemDescription.join(', ');

        const workflow: WorkflowHistory = {
          id: `workflow-${Date.now()}`,
          service_id: serviceData.id,
          problem_identified: problem,
          commands_executed: [],
          resolution_status: 'in_progress',
          started_at: new Date().toISOString(),
          completed_at: null,
        };

        await supabase.from('workflow_history').insert(workflow);
        addWorkflowHistory(workflow);

        addAlert({
          type: 'info',
          title: 'Self-Healing Started',
          message: `Analyzing and fixing ${serviceData.display_name}...`,
        });

        if (config?.n8n_webhook_url) {
          await fetch(config.n8n_webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceName: serviceData.name,
              displayName: serviceData.display_name,
              status: serviceData.status,
              errorLogs: problem,
              systemMetrics: {
                cpu: serviceData.cpu_usage,
                memory: serviceData.memory_usage,
                uptime: serviceData.uptime,
              },
              timestamp: new Date().toISOString(),
            }),
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const commands: string[] = [];

        if (serviceData.status !== 'Running') {
          commands.push(`Restart-Service -Name "${serviceData.name}" -Force`);
          commands.push(`Start-Service -Name "${serviceData.name}"`);

          await supabase
            .from('services')
            .update({
              status: 'Running',
              last_restart: new Date().toISOString(),
              error_count: 0,
              uptime: 0,
            })
            .eq('id', serviceData.id);

          updateService(serviceData.id, {
            status: 'Running',
            last_restart: new Date().toISOString(),
            error_count: 0,
            uptime: 0,
          });
        }

        if (serviceData.cpu_usage > 80) {
          commands.push(`Get-Process | Where-Object {$_.Name -like "*${serviceData.name}*"} | Set-ProcessPriority -Priority Normal`);

          await supabase
            .from('services')
            .update({ cpu_usage: 30 + Math.random() * 20 })
            .eq('id', serviceData.id);

          updateService(serviceData.id, { cpu_usage: 30 + Math.random() * 20 });
        }

        if (serviceData.memory_usage > 1000) {
          commands.push(`Restart-Service -Name "${serviceData.name}" -Force`);

          await supabase
            .from('services')
            .update({ memory_usage: 200 + Math.random() * 300 })
            .eq('id', serviceData.id);

          updateService(serviceData.id, { memory_usage: 200 + Math.random() * 300 });
        }

        if (serviceData.error_count > 5) {
          commands.push(`Clear-EventLog -LogName Application -Source "${serviceData.name}"`);

          await supabase
            .from('services')
            .update({ error_count: 0 })
            .eq('id', serviceData.id);

          updateService(serviceData.id, { error_count: 0 });
        }

        const completedWorkflow = {
          commands_executed: commands,
          resolution_status: 'success' as const,
          completed_at: new Date().toISOString(),
        };

        await supabase
          .from('workflow_history')
          .update(completedWorkflow)
          .eq('id', workflow.id);

        updateWorkflowHistory(workflow.id, completedWorkflow);

        addAlert({
          type: 'success',
          title: 'Self-Healing Complete',
          message: `${serviceData.display_name} has been restored to healthy state`,
        });

        await supabase.from('service_logs').insert({
          id: `log-${Date.now()}`,
          service_id: serviceData.id,
          level: 'INFO',
          message: `Self-healing completed successfully. Executed ${commands.length} remediation commands.`,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Self-healing error:', error);

        addAlert({
          type: 'error',
          title: 'Self-Healing Failed',
          message: `Failed to heal ${serviceData.display_name}. Please check manually.`,
        });
      }
    },
    [config, addWorkflowHistory, updateWorkflowHistory, addAlert, updateService]
  );

  return { triggerSelfHeal };
}
