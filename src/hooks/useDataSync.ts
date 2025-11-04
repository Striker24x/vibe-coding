import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { generateMockServices, generateMockLog, updateServiceMetrics } from '../utils/mockData';

export function useDataSync() {
  const {
    services,
    setServices,
    updateService,
    addLog,
  } = useStore();

  const initializeData = useCallback(() => {
    if (services.length === 0) {
      const mockServices = generateMockServices(12);
      setServices(mockServices);
    }
  }, [services.length, setServices]);

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
    }, 500);

    return () => clearInterval(interval);
  }, [updateServiceMetricsLocal]);

  return { fetchData: initializeData };
}
