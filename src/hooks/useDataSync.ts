import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import { generateMockServices, generateMockLog, updateServiceMetrics } from '../utils/mockData';

export function useDataSync() {
  const {
    services,
    setServices,
    updateService,
    addLog,
    setLogs,
    setWorkflowHistory,
    setConfig,
  } = useStore();

  const fetchServices = useCallback(async () => {
    const { data, error } = await api.services.getAll();
    if (data && Array.isArray(data)) {
      setServices(data);
    } else if (error) {
      console.error('Failed to fetch services:', error);
      if (services.length === 0) {
        const mockServices = generateMockServices(12);
        setServices(mockServices);
      }
    }
  }, [setServices, services.length]);

  const fetchLogs = useCallback(async () => {
    const { data, error } = await api.logs.getAll();
    if (data && Array.isArray(data)) {
      setLogs(data);
    } else if (error) {
      console.error('Failed to fetch logs:', error);
    }
  }, [setLogs]);

  const fetchWorkflows = useCallback(async () => {
    const { data, error } = await api.workflows.getAll();
    if (data && Array.isArray(data)) {
      setWorkflowHistory(data);
    } else if (error) {
      console.error('Failed to fetch workflows:', error);
    }
  }, [setWorkflowHistory]);

  const fetchConfig = useCallback(async () => {
    const { data, error } = await api.config.get();
    if (data) {
      setConfig(data);
    } else if (error) {
      console.error('Failed to fetch config:', error);
    }
  }, [setConfig]);

  const initializeData = useCallback(async () => {
    await Promise.all([
      fetchServices(),
      fetchLogs(),
      fetchWorkflows(),
      fetchConfig(),
    ]);
  }, [fetchServices, fetchLogs, fetchWorkflows, fetchConfig]);

  const updateServiceMetricsLocal = useCallback(() => {
    if (services.length === 0) return;

    for (const service of services) {
      const updates = updateServiceMetrics(service);
      updateService(service.id, updates);

      if (Math.random() < 0.15) {
        const newLog = generateMockLog(service.id);
        addLog(newLog);

        if (newLog.level === 'ERROR' || newLog.level === 'CRITICAL') {
          updateService(service.id, { error_count: service.error_count + 1 });
        }
      }
    }
  }, [services, updateService, addLog]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateServiceMetricsLocal();
    }, 5000);

    return () => clearInterval(interval);
  }, [updateServiceMetricsLocal]);

  return { fetchData: initializeData };
}
