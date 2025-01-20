import React, { useState } from 'react';
import { AlertCircle, Mail, Lock, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (email: string, password: string, isLogin: boolean) => Promise<void>;
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onAuth(email, password, isLogin);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Invalid credentials')) {
          setError(isLogin ? 'Invalid email or password' : 'Failed to create account');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary/50 hover:text-secondary/70 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-3 py-2 border border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            {!isLogin && (
              <p className="mt-1 text-sm text-secondary/50">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isLogin ? 'Login' : 'Create Account'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-secondary/5 hover:bg-secondary/10 text-secondary font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            disabled={isLoading}
            className="text-accent hover:text-accent/90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogin
              ? "Don't have an account? Create one"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}