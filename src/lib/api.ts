import { supabase } from './supabase';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const api = {
  clients: {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return { data: data || [] };
      } catch (error) {
        console.error('Error fetching clients:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    getById: async (id: string): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        return { data: data || undefined };
      } catch (error) {
        console.error('Error fetching client:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    create: async (clientData: any): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert([{
            ...clientData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) throw error;
        return { data };
      } catch (error) {
        console.error('Error creating client:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    update: async (id: string, updates: any): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data };
      } catch (error) {
        console.error('Error updating client:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    delete: async (id: string): Promise<ApiResponse<any>> => {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { data: { message: 'Client deleted successfully' } };
      } catch (error) {
        console.error('Error deleting client:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    getServices: async (id: string): Promise<ApiResponse<any[]>> => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('client_id', id);

        if (error) throw error;
        return { data: data || [] };
      } catch (error) {
        console.error('Error fetching services:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    getMetrics: async (id: string): Promise<ApiResponse<any[]>> => {
      try {
        const { data, error } = await supabase
          .from('system_metrics')
          .select('*')
          .eq('client_id', id)
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) throw error;
        return { data: data || [] };
      } catch (error) {
        console.error('Error fetching metrics:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
  },

  services: {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return { data: [] };
    },
    create: async (data: any): Promise<ApiResponse<any>> => {
      return { data };
    },
    update: async (id: string, data: any): Promise<ApiResponse<any>> => {
      return { data };
    },
  },

  logs: {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return { data: [] };
    },
    create: async (data: any): Promise<ApiResponse<any>> => {
      return { data };
    },
  },

  workflows: {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return { data: [] };
    },
    create: async (data: any): Promise<ApiResponse<any>> => {
      return { data };
    },
  },

  config: {
    get: async (): Promise<ApiResponse<any>> => {
      return { data: {} };
    },
    update: async (data: any): Promise<ApiResponse<any>> => {
      return { data };
    },
  },

  monitoring: {
    submit: async (data: any): Promise<ApiResponse<any>> => {
      return { data };
    },
    getLatest: async (): Promise<ApiResponse<any>> => {
      return { data: {} };
    },
  },

  webhooks: {
    getConfig: async (serviceId: string): Promise<ApiResponse<any>> => {
      return { data: {} };
    },
    saveConfig: async (serviceId: string, config: any): Promise<ApiResponse<any>> => {
      return { data: config };
    },
  },
};
