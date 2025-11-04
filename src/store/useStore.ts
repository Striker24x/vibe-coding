import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, Service, ServiceLog, WorkflowHistory, DashboardConfig, Alert, SystemMetrics } from '../types';

interface AppState {
  clients: Client[];
  selectedClientId: string | null;
  services: Service[];
  logs: ServiceLog[];
  workflowHistory: WorkflowHistory[];
  config: DashboardConfig | null;
  alerts: Alert[];
  theme: 'dark' | 'light';
  clientMetrics: Record<string, SystemMetrics[]>;
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  selectClient: (id: string | null) => void;
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
  addMetrics: (clientId: string, metrics: SystemMetrics) => void;
  getClientMetrics: (clientId: string) => SystemMetrics[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      clients: [],
      selectedClientId: null,
      services: [],
      logs: [],
      workflowHistory: [],
      config: null,
      alerts: [],
      theme: 'dark',
      clientMetrics: {},

      setClients: (clients) => set({ clients }),

      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, client],
        })),

      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
          ),
        })),

      selectClient: (id) => set({ selectedClientId: id }),

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

      addMetrics: (clientId, metrics) =>
        set((state) => ({
          clientMetrics: {
            ...state.clientMetrics,
            [clientId]: [
              ...(state.clientMetrics[clientId] || []),
              metrics,
            ].slice(-100),
          },
        })),

      getClientMetrics: (clientId) => {
        const state = get();
        return state.clientMetrics[clientId] || [];
      },
    }),
    {
      name: 'maintenance-dashboard-storage',
    }
  )
);
