import React from 'react';
import { Server, Save, AlertCircle, Database, Loader2 } from 'lucide-react';

interface MongoDBSettings {
  uri: string;
  database: string;
  collection: string;
}

interface MongoDBSettingsModalProps {
  isOpen: boolean;
  settings: MongoDBSettings;
  error: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (settings: MongoDBSettings) => void;
}

export function MongoDBSettingsModal({
  isOpen,
  settings,
  error,
  isSaving,
  onClose,
  onSave,
}: MongoDBSettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Database className="w-5 h-5" />
            MongoDB Settings
          </h2>
          <button
            onClick={onClose}
            className="text-secondary/50 hover:text-secondary/70"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              MongoDB URI
            </label>
            <input
              type="password"
              value={localSettings.uri}
              onChange={(e) => setLocalSettings({ ...localSettings, uri: e.target.value })}
              placeholder="mongodb://username:password@host:port"
              className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isSaving}
            />
            <p className="mt-1 text-sm text-secondary/50">
              Your MongoDB connection string (stored securely)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Database Name
            </label>
            <input
              type="text"
              value={localSettings.database}
              onChange={(e) => setLocalSettings({ ...localSettings, database: e.target.value })}
              placeholder="your_database"
              className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Collection Name
            </label>
            <input
              type="text"
              value={localSettings.collection}
              onChange={(e) => setLocalSettings({ ...localSettings, collection: e.target.value })}
              placeholder="your_collection"
              className="w-full px-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isSaving}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onSave(localSettings)}
              disabled={isSaving}
              className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-secondary/5 hover:bg-secondary/10 text-secondary font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}