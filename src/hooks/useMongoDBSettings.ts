import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface MongoDBSettings {
  uri: string;
  database: string;
  collection: string;
}

export function useMongoDBSettings(user: User | null) {
  const [settings, setSettings] = useState<MongoDBSettings>({
    uri: '',
    database: '',
    collection: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('mongodb_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          uri: data.uri,
          database: data.database,
          collection: data.collection
        });
      }
    } catch (err) {
      console.error('Error loading MongoDB settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: MongoDBSettings) => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      const { error } = await supabase
        .from('mongodb_settings')
        .upsert(
          {
            user_id: user.id,
            uri: newSettings.uri,
            database: newSettings.database,
            collection: newSettings.collection
          },
          {
            onConflict: 'user_id',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;

      setSettings(newSettings);
      return true;
    } catch (err) {
      console.error('Error saving MongoDB settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    saveSettings
  };
}