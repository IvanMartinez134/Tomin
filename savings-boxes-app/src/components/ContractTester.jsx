import React from 'react';
import { useTominWallet } from '../hooks/useTominWallet.js';

/**
 * Componente de testing para Smart Contracts
 */
export const ContractTester = () => {
  const {
    walletAddress,
    usdcBalance,
    tominBalance,
    isConnecting,
    isLoading,
    error,
    isFreighterAvailable,
    connectWallet,
    disconnectWallet,
    loadBalances,
    depositToTomin,
    withdrawFromTomin,
    clearError
  } = useTominWallet();

  const handleDeposit = async () => {
    const amount = prompt('¿Cuánto USDC quieres depositar?');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      await depositToTomin(parseFloat(amount));
    }
  };

  const handleWithdraw = async () => {
    const amount = prompt('¿Cuánto USDC quieres retirar?');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      await withdrawFromTomin(parseFloat(amount));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🧪 Testing Smart Contracts Tomin
      </h2>

      {/* Estado de Freighter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Estado del Wallet</h3>
        <div className={`p-3 rounded ${isFreighterAvailable
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
        }`}>
          {isFreighterAvailable
            ? '✅ Freighter Wallet disponible'
            : '❌ Freighter Wallet no encontrado'
          }
        </div>

        {!isFreighterAvailable && (
          <p className="text-sm text-gray-600 mt-2">
            Instala Freighter desde{' '}
            <a
              href="https://www.stellar.org/freighter"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              stellar.org/freighter
            </a>
          </p>
        )}
      </div>

      {/* Conectar Wallet */}
      <div className="mb-6">
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting || !isFreighterAvailable}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              isConnecting || !isFreighterAvailable
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isConnecting ? '🔄 Conectando...' : '🔗 Conectar Freighter Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="bg-green-100 p-3 rounded text-green-800">
              ✅ Conectado: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </div>
            <button
              onClick={disconnectWallet}
              className="w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              🔌 Desconectar
            </button>
          </div>
        )}
      </div>

      {/* Balances */}
      {walletAddress && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Balances</h3>
            <button
              onClick={() => loadBalances()}
              disabled={isLoading}
              className={`px-3 py-1 text-sm rounded ${
                isLoading
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {isLoading ? '🔄' : '🔄 Actualizar'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <div className="text-xs text-blue-600 uppercase tracking-wide">USDC Balance</div>
              <div className="text-2xl font-bold text-blue-800">
                ${usdcBalance.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600">En tu wallet</div>
            </div>

            <div className="bg-green-100 p-4 rounded">
              <div className="text-xs text-green-600 uppercase tracking-wide">Tomin Balance</div>
              <div className="text-2xl font-bold text-green-800">
                ${tominBalance.toFixed(2)}
              </div>
              <div className="text-xs text-green-600">Invertido en CETES</div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      {walletAddress && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Acciones DeFi</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDeposit}
              disabled={isLoading}
              className={`py-3 px-4 rounded-lg font-semibold ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              💰 Depositar USDC
            </button>

            <button
              onClick={handleWithdraw}
              disabled={isLoading || tominBalance === 0}
              className={`py-3 px-4 rounded-lg font-semibold ${
                isLoading || tominBalance === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              💸 Retirar USDC
            </button>
          </div>
        </div>
      )}

      {/* Información de Contratos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Información de Contratos</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Red:</strong> Stellar Testnet</div>
          <div><strong>Tomin Vault:</strong> CAVTI...XLBX</div>
          <div><strong>DeFindex CETES:</strong> CCCVC...JHY</div>
          <div><strong>USDC Token:</strong> CAQCF...3MT</div>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>❌ {error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded">
          🔄 Procesando transacción en blockchain...
        </div>
      )}
    </div>
  );
};