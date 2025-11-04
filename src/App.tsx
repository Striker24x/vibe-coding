import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from './store/useStore';
import { useDataSync } from './hooks/useDataSync';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { AddClientModal } from './components/AddClientModal';
import { ClientCard } from './components/ClientCard';
import { ClientDashboard } from './components/ClientDashboard';
import { ClientSettingsModal } from './components/ClientSettingsModal';
import { Client } from './types';

function App() {
  const { clients, selectedClientId, theme, toggleTheme, addClient, updateClient, selectClient, addAlert, setClients } = useStore();
  const { fetchData } = useDataSync();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedSettingsClient, setSelectedSettingsClient] = useState<Client | null>(null);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  }, [theme]);

  const handleAddClient = (clientData: Omit<Client, 'id' | 'status' | 'last_seen' | 'created_at' | 'updated_at'>) => {
    const newClient: Client = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      status: clientData.is_demo ? 'online' : 'offline',
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addClient(newClient);

    addAlert({
      type: 'success',
      title: 'Client hinzugefügt',
      message: `${newClient.name} wurde erfolgreich hinzugefügt`,
    });
  };

  const handleClientClick = (clientId: string) => {
    selectClient(clientId);
  };

  const handleBackToOverview = () => {
    selectClient(null);
  };

  const handleSettingsClick = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedSettingsClient(client);
      setShowSettingsModal(true);
    }
  };

  const handleUpdateClient = (updatedClient: Client) => {
    updateClient(updatedClient.id, updatedClient);
    addAlert({
      type: 'success',
      title: 'Client aktualisiert',
      message: `${updatedClient.name} wurde erfolgreich aktualisiert`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setClients(clients.filter((c) => c.id !== clientId));
    addAlert({
      type: 'success',
      title: 'Client gelöscht',
      message: `${client?.name || 'Client'} wurde erfolgreich gelöscht`,
    });
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  if (selectedClient) {
    return (
      <>
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          servicesRunning={0}
          totalServices={0}
        />
        <Toast />
        <ClientDashboard
          client={selectedClient}
          onBack={handleBackToOverview}
          theme={theme}
        />
      </>
    );
  }

  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        servicesRunning={0}
        totalServices={clients.length}
      />

      <Toast />

      <main className="container mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${textClass}`}>Client Übersicht</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Verwalten Sie Ihre Monitoring-Clients
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Client hinzufügen
          </button>
        </div>

        {clients.length === 0 ? (
          <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-12 text-center`}>
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-2`}>
                Keine Clients vorhanden
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Fügen Sie Ihren ersten Client hinzu, um mit dem Monitoring zu beginnen
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ersten Client hinzufügen
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={handleClientClick}
                onSettingsClick={handleSettingsClick}
                theme={theme}
              />
            ))}
          </div>
        )}
      </main>

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddClient}
        theme={theme}
      />

      {selectedSettingsClient && (
        <ClientSettingsModal
          isOpen={showSettingsModal}
          onClose={() => {
            setShowSettingsModal(false);
            setSelectedSettingsClient(null);
          }}
          onUpdate={handleUpdateClient}
          onDelete={handleDeleteClient}
          client={selectedSettingsClient}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;
