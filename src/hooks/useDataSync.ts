import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { generateMockServices, generateMockLog, updateServiceMetrics } from '../utils/mockData';
import { Service, ServiceLog, WorkflowHistory } from '../types';

export function useDataSync() {
  const {
    services,
    setServices,
    updateService,
    addLog,
    setLogs,
    setWorkflowHistory,
    setConfig,
    config,
  } = useStore();

  const fetchData = useCallback(async () => {
    try {
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (servicesData && servicesData.length > 0) {
        setServices(servicesData as Service[]);
      } else {
        const mockServices = generateMockServices(12);
        for (const service of mockServices) {
          await supabase.from('services').insert(service);
        }
        setServices(mockServices);
      }

      const { data: logsData } = await supabase
        .from('service_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (logsData) {
        setLogs(logsData as ServiceLog[]);
      }

      const { data: workflowData } = await supabase
        .from('workflow_history')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (workflowData) {
        setWorkflowHistory(workflowData as WorkflowHistory[]);
      }

      const { data: configData } = await supabase
        .from('dashboard_config')
        .select('*')
        .single();

      if (configData) {
        setConfig(configData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setServices, setLogs, setWorkflowHistory, setConfig]);

  const updateServiceMetricsInDb = useCallback(async () => {
    if (services.length === 0) return;

    for (const service of services) {
      const updates = updateServiceMetrics(service);
      updateService(service.id, updates);

      await supabase
        .from('services')
        .update(updates)
        .eq('id', service.id);

      if (Math.random() < 0.15) {
        const newLog = generateMockLog(service.id);
        addLog(newLog);

        await supabase.from('service_logs').insert(newLog);

        if (newLog.level === 'ERROR' || newLog.level === 'CRITICAL') {
          await supabase
            .from('services')
            .update({ error_count: service.error_count + 1 })
            .eq('id', service.id);

          updateService(service.id, { error_count: service.error_count + 1 });
        }
      }
    }
  }, [services, updateService, addLog]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateServiceMetricsInDb();
    }, 500);

    return () => clearInterval(interval);
  }, [updateServiceMetricsInDb]);

  return { fetchData };
}
