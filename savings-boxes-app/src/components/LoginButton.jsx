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
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono text-gray-700">{formatAddress(address)}</span>
        </div>

        {/* Botón de desconectar */}
        <button
          onClick={disconnect}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-900 font-semibold px-4 py-2 sm:px-4 sm:py-2 rounded-xl border border-red-200 transition-all duration-200"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline text-sm">Salir</span>
        </button>
      </div>
    );
  }

  return (
    <ConnectButton />
  );
};

export default LoginButton;
