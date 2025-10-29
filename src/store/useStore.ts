import { create } from 'zustand';
import { Service, ServiceLog, WorkflowHistory, DashboardConfig, Alert } from '../types';

interface AppState {
  services: Service[];
  logs: ServiceLog[];
  workflowHistory: WorkflowHistory[];
  config: DashboardConfig | null;
  alerts: Alert[];
  theme: 'dark' | 'light';
  setServices: (services: Service[]) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  addLog: (log: ServiceLog) => void;
  setLogs: (logs: ServiceLog[]) => void;
  addWorkflowHistory: (workflow: WorkflowHistory) => void;
  setWorkflowHistory: (history: WorkflowHistory[]) => void;
  updateWorkflowHistory: (id: string, updates: Partial<WorkflowHistory>) => void;
  setConfig: (config: DashboardConfig) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  removeAlert: (id: string) => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  services: [],
  logs: [],
  workflowHistory: [],
  config: null,
  alerts: [],
  theme: 'dark',

  setServices: (services) => set({ services }),

  updateService: (id, updates) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      ),
    })),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 1000),
    })),

  setLogs: (logs) => set({ logs: logs.slice(0, 1000) }),

  addWorkflowHistory: (workflow) =>
    set((state) => ({
      workflowHistory: [workflow, ...state.workflowHistory],
    })),

  setWorkflowHistory: (history) => set({ workflowHistory: history }),

  updateWorkflowHistory: (id, updates) =>
    set((state) => ({
      workflowHistory: state.workflowHistory.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  setConfig: (config) => set({ config }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [
        {
          ...alert,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        },
        ...state.alerts,
      ],
    })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
}));
