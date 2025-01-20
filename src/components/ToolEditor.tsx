import React from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Tool } from '../types';

interface ToolEditorProps {
  tools: Tool[];
  onChange: (tools: Tool[]) => void;
  disabled?: boolean;
}

export function ToolEditor({ tools, onChange, disabled }: ToolEditorProps) {
  const addTool = () => {
    const newTool: Tool = {
      id: crypto.randomUUID(),
      name: '',
      description: 'Describe how and when to use this tool',
      openapi_spec: ''
    };
    onChange([...tools, newTool]);
  };

  const updateTool = (index: number, updates: Partial<Tool>) => {
    const updatedTools = [...tools];
    updatedTools[index] = { ...updatedTools[index], ...updates };
    onChange(updatedTools);
  };

  const removeTool = (index: number) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    onChange(updatedTools);
  };

  const validateJSON = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-secondary">Tools</label>
        <button
          type="button"
          onClick={addTool}
          disabled={disabled}
          className="p-1.5 text-secondary/60 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-secondary/5"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {tools.length === 0 && (
        <div className="text-center py-4 text-secondary/50 bg-secondary/5 rounded-lg">
          <p>No tools added yet. Click the plus button to add a tool.</p>
        </div>
      )}

      <div className="space-y-6">
        {tools.map((tool, index) => (
          <div key={tool.id} className="border border-secondary/20 rounded-lg p-4 bg-secondary/5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-medium text-secondary">Tool #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeTool(index)}
                disabled={disabled}
                className="p-1.5 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary/60 mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  value={tool.name}
                  onChange={(e) => updateTool(index, { name: e.target.value })}
                  disabled={disabled}
                  placeholder="e.g., Food Menu API"
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary/5 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/60 mb-1">
                  Tool Description
                </label>
                <textarea
                  value={tool.description}
                  onChange={(e) => updateTool(index, { description: e.target.value })}
                  disabled={disabled}
                  rows={2}
                  placeholder="Describe how and when the LLM should use this tool"
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary/5 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/60 mb-1">
                  OpenAPI Specification
                </label>
                <textarea
                  value={tool.openapi_spec}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    updateTool(index, { openapi_spec: newValue });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && !validateJSON(value)) {
                      e.target.classList.add('border-red-500');
                    } else {
                      e.target.classList.remove('border-red-500');
                    }
                  }}
                  disabled={disabled}
                  rows={12}
                  placeholder="Paste your OpenAPI specification in JSON format"
                  className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary/5 disabled:cursor-not-allowed font-mono text-sm"
                />
                <p className="mt-1 text-sm text-secondary/50">
                  Paste your OpenAPI 3.x specification in JSON format. The specification will be validated when you finish editing.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {disabled && (
        <div className="bg-accent/5 text-accent p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Please login to edit tools
        </div>
      )}
    </div>
  );
}