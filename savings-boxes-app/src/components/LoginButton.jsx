/**
 * LoginButton.jsx
 * Botón para conectar/desconectar el wallet con Accesly
 */

import { ConnectButton } from 'accesly';
import { LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const LoginButton = () => {
  const { isConnected, address, disconnect } = useWallet();

  // Formatear dirección para mostrar
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        {/* Mostrar dirección */}
        <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono">{formatAddress(address)}</span>
        </div>

        {/* Botón de desconectar */}
        <button
          onClick={disconnect}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-red-500/30 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Desconectar</span>
        </button>
      </div>
    );
  }

  return (
    <ConnectButton />
  );
};

export default LoginButton;
