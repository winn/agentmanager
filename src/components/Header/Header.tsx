import React from 'react';
import { Server, LogOut, UserCircle } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  currentUser: User | null;
  onShowSettings: () => void;
  onShowAuth: () => void;
  onLogout: () => void;
}

export function Header({ currentUser, onShowSettings, onShowAuth, onLogout }: HeaderProps) {
  return (
    <div className="bg-primary shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-secondary">BOTNOI AI Agent Manager</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onShowSettings}
            className="text-secondary hover:text-secondary/90 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Server className="w-4 h-4" />
            MongoDB Settings
          </button>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-secondary/60 flex items-center gap-1">
                <UserCircle className="w-4 h-4" />
                {currentUser.email}
              </span>
              <button
                onClick={onLogout}
                className="text-secondary hover:text-secondary/90 p-2 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onShowAuth}
              className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}