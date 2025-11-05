const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const api = {
  clients: {
    getAll: () => request('/clients'),
    getById: (id: string) => request(`/clients/${id}`),
    create: (data: any) => request('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => request(`/clients/${id}`, {
      method: 'DELETE',
    }),
    getServices: (id: string) => request(`/clients/${id}/services`),
    getMetrics: (id: string) => request(`/clients/${id}/metrics`),
  },

  services: {
    getAll: () => request('/monitoring/services'),
    create: (data: any) => request('/monitoring/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => request(`/monitoring/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  logs: {
    getAll: () => request('/monitoring/logs'),
    create: (data: any) => request('/monitoring/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  workflows: {
    getAll: () => request('/monitoring/workflows'),
    create: (data: any) => request('/monitoring/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  config: {
    get: () => request('/monitoring/config'),
    update: (data: any) => request('/monitoring/config', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  monitoring: {
    submit: (data: any) => request('/monitoring/data', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getLatest: () => request('/monitoring/data/latest'),
  },

  webhooks: {
    getConfig: (serviceId: string) => request(`/monitoring/webhooks/config/${serviceId}`),
    saveConfig: (serviceId: string, config: any) => request(`/monitoring/webhooks/config/${serviceId}`, {
      method: 'POST',
      body: JSON.stringify(config),
    }),
  },
};
