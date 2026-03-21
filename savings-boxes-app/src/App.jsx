/**
 * App.jsx
 * Componente principal de la aplicación Savings Boxes
 */

import { AcceslyProvider } from 'accesly';
import { WalletProvider } from './context/WalletContext';
import LoginButton from './components/LoginButton';
import Dashboard from './components/Dashboard';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <AcceslyProvider
      appId={import.meta.env.VITE_ACCESLY_APP_ID}
      network="testnet"
      theme="dark"
    >
      <WalletProvider>
        <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-lg bg-white/5 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Logo y título */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={32} className="text-cyan-400" />
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Savings Boxes
                    </h1>
                    <p className="text-xs text-gray-400">
                      Powered by DeFindex & Blend Capital
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de login */}
              <LoginButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-12">
          <Dashboard />
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-lg bg-white/5 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <span>© 2026 Savings Boxes</span>
                <span className="hidden sm:inline">|</span>
                <span>Hackathon MVP</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://defindex.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  DeFindex ↗
                </a>
                <a
                  href="https://blend.capital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Blend Capital ↗
                </a>
                <a
                  href="https://stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Stellar ↗
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
    </AcceslyProvider>
  );
}

export default App;
