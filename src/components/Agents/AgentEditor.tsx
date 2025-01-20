import React from 'react';
import { Save, AlertCircle, Loader2, Database } from 'lucide-react';
import { ToolEditor } from '../ToolEditor';
import type { Agent, Tool } from '../../types';

interface AgentEditorProps {
  selectedAgent: Agent | null;
  editedAgent: Agent | null;
  error: string | null;
  isSaving: boolean;
  isAuthenticated: boolean;
  onUpdateAgent: () => void;
  onAgentChange: (updates: Partial<Agent>) => void;
}

export function AgentEditor({
  selectedAgent,
  editedAgent,
  error,
  isSaving,
  isAuthenticated,
  onUpdateAgent,
  onAgentChange,
}: AgentEditorProps) {
  if (!selectedAgent) {
    return (
      <div className="bg-primary rounded-xl shadow-lg p-8 text-center text-secondary/50">
        <Database className="w-12 h-12 mx-auto mb-4 text-secondary/40" />
        <p>Select an agent from the left sidebar to view and edit its configuration.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-secondary">Agent Configuration</h2>
        <div className="flex gap-2">
          <button
            onClick={onUpdateAgent}
            disabled={isSaving || !isAuthenticated}
            className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            Agent Name
          </label>
          <input
            type="text"
            value={editedAgent?.name || ''}
            onChange={(e) => onAgentChange({ name: e.target.value })}
            disabled={!isAuthenticated}
            className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary/5 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            System Prompt
          </label>
          <textarea
            value={editedAgent?.system_prompt || ''}
            onChange={(e) => onAgentChange({ system_prompt: e.target.value })}
            disabled={!isAuthenticated}
            rows={4}
            className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary/5 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-secondary/50">
            The system prompt is used to determine the persona of the agent and the context of the conversation.
          </p>
        </div>

        <ToolEditor
          tools={editedAgent?.tools || []}
          onChange={(tools: Tool[]) => onAgentChange({ tools })}
          disabled={!isAuthenticated}
        />

        {!isAuthenticated && (
          <div className="bg-accent/5 text-accent p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Please login to edit agent configuration
          </div>
        )}
      </div>
    </div>
  );
}