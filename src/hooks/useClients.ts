import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import { Client } from '../types';

export function useClients() {
  const { clients, setClients, addClient, updateClient } = useStore();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const response = await api.clients.getAll();
    if (response.data) {
      const clientsData = response.data as any[];
      const formattedClients: Client[] = clientsData.map((client) => ({
        ...client,
        id: client._id || client.id,
      }));
      setClients(formattedClients);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.clients.create(clientData);
    if (response.data) {
      const newClient = response.data as any;
      const formattedClient: Client = {
        ...newClient,
        id: newClient._id || newClient.id,
      };
      addClient(formattedClient);
      return formattedClient;
    }
    return null;
  };

  const updateClientData = async (id: string, updates: Partial<Client>) => {
    const response = await api.clients.update(id, updates);
    if (response.data || !response.error) {
      updateClient(id, updates);
      return true;
    }
    return false;
  };

  const deleteClient = async (id: string) => {
    const response = await api.clients.delete(id);
    if (response.data || !response.error) {
      setClients(clients.filter(c => c.id !== id));
      return true;
    }
    return false;
  };

  return {
    clients,
    loadClients,
    createClient,
    updateClient: updateClientData,
    deleteClient,
  };
}
