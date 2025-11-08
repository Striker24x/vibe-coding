const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/monitoring';

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
  services: {
    getAll: () => request('/services'),
    create: (data: any) => request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  logs: {
    getAll: () => request('/logs'),
    create: (data: any) => request('/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  workflows: {
    getAll: () => request('/workflows'),
    create: (data: any) => request('/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  config: {
    get: () => request('/config'),
    update: (data: any) => request('/config', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  monitoring: {
    submit: (data: any) => request('/data', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getLatest: () => request('/data/latest'),
  },

  webhooks: {
    getConfig: (serviceId: string) => request(`/webhooks/config/${serviceId}`),
    saveConfig: (serviceId: string, config: any) => request(`/webhooks/config/${serviceId}`, {
      method: 'POST',
      body: JSON.stringify(config),
    }),
  },
};
