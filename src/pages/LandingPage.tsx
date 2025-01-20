import React from 'react';
import { Bot, Shield, Zap } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';

export function LandingPage() {
  const [showAuth, setShowAuth] = React.useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async (email: string, password: string, isLogin: boolean) => {
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <nav className="bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold text-secondary">BOTNOI AI Agent Manager</h1>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Manage Your AI Agents with Ease
          </h1>
          <p className="text-xl text-secondary/80 max-w-2xl mx-auto">
            Create, configure, and manage your AI agents in one place. Streamline your workflow
            and boost productivity with our powerful agent management platform.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="mt-8 bg-accent hover:bg-accent/90 text-primary px-6 py-3 rounded-lg text-lg font-semibold"
          >
            Start Managing Agents
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-primary p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Intelligent Agents
            </h3>
            <p className="text-secondary/80">
              Create and customize AI agents with specific roles and capabilities
              to handle various tasks efficiently.
            </p>
          </div>

          <div className="bg-primary p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Secure Management
            </h3>
            <p className="text-secondary/80">
              Manage your agents securely with user authentication and
              role-based access control.
            </p>
          </div>

          <div className="bg-primary p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Powerful Tools
            </h3>
            <p className="text-secondary/80">
              Equip your agents with powerful tools and integrations to
              enhance their capabilities.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-secondary text-primary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Company Info */}
            <div>
              <img 
                src="https://framerusercontent.com/images/8nD4Qw2ptZWzswRgdZ14NbcWN0.png" 
                alt="BOTNOI Group Logo"
                className="h-8 mb-6"
              />
              <p className="text-primary/60 text-sm">
                Thailand's No.1 AI Technology Service
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://botnoigroup.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-accent transition-colors"
                  >
                    BOTNOI Group
                  </a>
                </li>
                <li>
                  <a 
                    href="https://botnoigroup.com/aboutus" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-accent transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a 
                    href="https://botnoigroup.com/contact" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-accent transition-colors"
                  >
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://botnoi.ai"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-accent transition-colors"
                  >
                    BOTNOI Chatbot
                  </a>
                </li>
                <li>
                  <a 
                    href="https://voice.botnoi.ai"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-primary/80 hover:text-accent transition-colors"
                  >
                    BOTNOI Voice
                  </a>
                </li>
                <li>
                  <a 
                    href="https://vcastbotnoi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-accent transition-colors"
                  >
                    BOTNOI Vcast
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-primary/10 text-center text-primary/60">
            <p>© 2017 Botnoi Group</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}