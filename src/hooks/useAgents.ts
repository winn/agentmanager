import { useState, useEffect } from 'react';
import { fetchData, insertOne, updateOne } from '../lib/mongodb';
import type { Agent, User } from '../types';

interface UseAgentsProps {
  uri: string;
  database: string;
  collection: string;
  currentUser: User | null;
}

export function useAgents({ uri, database, collection, currentUser }: UseAgentsProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editedAgent, setEditedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async () => {
    if (!uri || !database || !collection) return;

    try {
      setIsLoading(true);
      const result = await fetchData(uri, database.toLowerCase(), collection.toLowerCase());
      setAgents(result);
      
      // If we have a selected agent, update it with the latest data
      if (selectedAgent) {
        const updatedSelectedAgent = result.find(a => a.agent_id === selectedAgent.agent_id);
        if (updatedSelectedAgent) {
          setSelectedAgent(updatedSelectedAgent);
          setEditedAgent(updatedSelectedAgent);
        }
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load agents');
      console.error('Error loading agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createAgent = async (name: string) => {
    if (!name.trim()) {
      setError('Agent name is required');
      return false;
    }

    if (!currentUser) {
      setError('Please login first');
      return false;
    }

    const newAgent: Omit<Agent, '_id'> = {
      agent_id: crypto.randomUUID(),
      name,
      system_prompt: 'You are a helpful agent',
      tools: [],
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      setIsSaving(true);
      await insertOne(uri, database.toLowerCase(), collection.toLowerCase(), newAgent);
      await loadAgents();
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to create agent:', err);
      setError('Failed to create agent');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateAgent = async () => {
    if (!editedAgent || !editedAgent.agent_id) {
      console.error('No agent selected or missing agent_id');
      setError('Invalid agent data');
      return false;
    }

    if (!currentUser) {
      setError('Please login first');
      return false;
    }

    try {
      setIsSaving(true);
      console.log('Updating agent:', editedAgent);

      // Store history if prompt or tools changed
      if (selectedAgent) {
        const promptChanged = selectedAgent.system_prompt !== editedAgent.system_prompt;
        const toolsChanged = JSON.stringify(selectedAgent.tools) !== JSON.stringify(editedAgent.tools);

        if (promptChanged || toolsChanged) {
          await insertOne(uri, database.toLowerCase(), 'prompt_history', {
            agent_id: editedAgent.agent_id,
            user_id: currentUser.id,
            old_prompt: promptChanged ? selectedAgent.system_prompt : undefined,
            new_prompt: promptChanged ? editedAgent.system_prompt : undefined,
            old_tools: toolsChanged ? selectedAgent.tools : undefined,
            new_tools: toolsChanged ? editedAgent.tools : undefined,
            modified_at: new Date().toISOString(),
            type: promptChanged && toolsChanged ? 'both' : (promptChanged ? 'prompt' : 'tools')
          });
        }
      }

      // Prepare update data
      const updateData = {
        name: editedAgent.name,
        system_prompt: editedAgent.system_prompt,
        tools: editedAgent.tools,
        updated_at: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      // Perform update using agent_id instead of _id
      const result = await updateOne(
        uri,
        database.toLowerCase(),
        collection.toLowerCase(),
        { agent_id: editedAgent.agent_id },
        { $set: updateData }
      );

      console.log('Update result:', result);

      setSelectedAgent(editedAgent);
      await loadAgents();
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to update agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to update agent');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (uri && database && collection) {
      loadAgents();
    }
  }, [uri, database, collection]);

  return {
    agents,
    selectedAgent,
    editedAgent,
    isLoading,
    isSaving,
    error,
    setSelectedAgent,
    setEditedAgent,
    createAgent,
    updateAgent,
    setError,
  };
}