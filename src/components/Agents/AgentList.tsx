import React from 'react';
import { Plus, Database, Loader2 } from 'lucide-react';
import type { Agent, User } from '../../types';

interface AgentListProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  currentUser: User | null;
  isLoading: boolean;
  isSaving: boolean;
  isCreatingAgent: boolean;
  newAgentName: string;
  onCreateClick: () => void;
  onSelectAgent: (agent: Agent) => void;
  onCreateAgent: () => void;
  onCancelCreate: () => void;
  onNewAgentNameChange: (name: string) => void;
}

export function AgentList({
  agents,
  selectedAgent,
  currentUser,
  isLoading,
  isSaving,
  isCreatingAgent,
  newAgentName,
  onCreateClick,
  onSelectAgent,
  onCreateAgent,
  onCancelCreate,
  onNewAgentNameChange,
}: AgentListProps) {
  return (
    <div className="bg-primary rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-secondary">Agents</h2>
        <button
          type="button"
          onClick={onCreateClick}
          disabled={isSaving}
          className="p-1.5 text-secondary/60 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-secondary/5"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isCreatingAgent && (
        <div className="mb-4 p-4 bg-secondary/5 rounded-lg">
          <input
            type="text"
            value={newAgentName}
            onChange={(e) => onNewAgentNameChange(e.target.value)}
            placeholder="Enter agent name"
            className="w-full px-3 py-2 border border-secondary/30 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="flex gap-2">
            <button
              onClick={onCreateAgent}
              disabled={isSaving}
              className="flex-1 bg-accent hover:bg-accent/90 text-primary px-3 py-1 rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
            <button
              onClick={onCancelCreate}
              disabled={isSaving}
              className="flex-1 bg-secondary/5 hover:bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-8 text-secondary/50">
          <Database className="w-8 h-8 mx-auto mb-2 text-secondary/40" />
          <p>No agents found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map((agent) => (
            <button
              key={agent.agent_id}
              onClick={() => onSelectAgent(agent)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedAgent?.agent_id === agent.agent_id
                  ? 'bg-accent/5 text-accent'
                  : 'hover:bg-secondary/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{agent.name}</span>
                {agent.created_by === currentUser?.id && (
                  <span className="text-xs text-secondary/50">Owner</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}