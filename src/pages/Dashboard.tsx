import React, { useState } from 'react';
import { Settings, Server, Loader2 } from 'lucide-react';
import { Header } from '../components/Header/Header';
import { MongoDBSettingsModal } from '../components/Settings/MongoDBSettingsModal';
import { AgentList } from '../components/Agents/AgentList';
import { AgentEditor } from '../components/Agents/AgentEditor';
import { useAgents } from '../hooks/useAgents';
import { useAuth } from '../hooks/useAuth';
import { useMongoDBSettings } from '../hooks/useMongoDBSettings';
import type { Agent } from '../types';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  const {
    settings: mongoSettings,
    isLoading: isLoadingSettings,
    isSaving: isSavingSettings,
    error: settingsError,
    saveSettings
  } = useMongoDBSettings(user);

  const {
    agents,
    selectedAgent,
    editedAgent,
    isLoading: isLoadingAgents,
    isSaving: isSavingAgent,
    error: agentError,
    setSelectedAgent,
    setEditedAgent,
    createAgent,
    updateAgent,
    setError,
  } = useAgents({
    uri: mongoSettings.uri,
    database: mongoSettings.database,
    collection: mongoSettings.collection,
    currentUser: user,
  });

  const handleCreateAgent = async () => {
    const success = await createAgent(newAgentName);
    if (success) {
      setNewAgentName('');
      setIsCreatingAgent(false);
    }
  };

  const handleSetupMongoDB = async (settings: typeof mongoSettings) => {
    try {
      if (!settings.uri) {
        throw new Error('MongoDB URI is required');
      }
      if (!settings.database || !settings.collection) {
        throw new Error('Database and collection names are required');
      }

      const success = await saveSettings(settings);
      if (success) {
        setShowSettings(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to configure MongoDB');
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-secondary/80">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header
        currentUser={user}
        onShowSettings={() => setShowSettings(true)}
        onLogout={signOut}
      />

      <MongoDBSettingsModal
        isOpen={showSettings}
        settings={mongoSettings}
        error={settingsError}
        isSaving={isSavingSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSetupMongoDB}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!mongoSettings.uri || !mongoSettings.database || !mongoSettings.collection ? (
          <div className="bg-primary rounded-xl shadow-lg p-8 text-center">
            <Server className="w-12 h-12 mx-auto mb-4 text-accent/50" />
            <h2 className="text-xl font-bold text-secondary mb-2">MongoDB Settings Required</h2>
            <p className="text-secondary/80 mb-4">Please configure your MongoDB connection settings to continue.</p>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configure Settings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <AgentList
                agents={agents}
                selectedAgent={selectedAgent}
                currentUser={user}
                isLoading={isLoadingAgents}
                isSaving={isSavingAgent}
                isCreatingAgent={isCreatingAgent}
                newAgentName={newAgentName}
                onCreateClick={() => setIsCreatingAgent(true)}
                onSelectAgent={(agent: Agent) => {
                  setSelectedAgent(agent);
                  setEditedAgent(agent);
                }}
                onCreateAgent={handleCreateAgent}
                onCancelCreate={() => {
                  setIsCreatingAgent(false);
                  setNewAgentName('');
                }}
                onNewAgentNameChange={setNewAgentName}
              />
            </div>

            <div className="col-span-9">
              <AgentEditor
                selectedAgent={selectedAgent}
                editedAgent={editedAgent}
                error={agentError}
                isSaving={isSavingAgent}
                isAuthenticated={!!user}
                onUpdateAgent={updateAgent}
                onAgentChange={(updates) =>
                  setEditedAgent(prev => prev ? { ...prev, ...updates } : null)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}