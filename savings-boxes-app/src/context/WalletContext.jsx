/**
 * WalletContext.jsx
 * Context de React para manejar el estado del wallet usando Accesly
 */

import { createContext, useContext } from 'react';
import { useAccesly } from 'accesly';

// Crear el contexto
const WalletContext = createContext(null);

// Hook personalizado para usar el contexto
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet debe usarse dentro de un WalletProvider');
  }
  return context;
};

// Provider del contexto
export const WalletProvider = ({ children }) => {
  // Usar el hook de Accesly directamente
  const acceslyContext = useAccesly();

  // Adaptador para mantener compatibilidad con nuestra API existente
  const value = {
    // Estado del wallet
    isConnected: !!acceslyContext.wallet,
    address: acceslyContext.wallet?.stellarAddress || null,
    publicKey: acceslyContext.wallet?.stellarAddress || null,
    email: acceslyContext.wallet?.email || null,
    balance: acceslyContext.balance || '0',
    isLoading: acceslyContext.loading,
    error: null,

    // Funciones de Accesly
    wallet: acceslyContext.wallet,
    connect: () => {
      // Accesly maneja la conexión a través del ConnectButton
      console.log('Use ConnectButton component to connect');
    },
    disconnect: acceslyContext.disconnect,

    // Firma de transacciones
    signTransaction: async (xdr) => {
      try {
        const result = await acceslyContext.signTransaction(xdr);
        return result.signedXdr;
      } catch (error) {
        console.error('Error firmando transacción:', error);
        throw error;
      }
    },

    // Firma y envía transacciones
    signAndSubmit: async (xdr) => {
      try {
        const result = await acceslyContext.signAndSubmit(xdr);
        return result;
      } catch (error) {
        console.error('Error firmando y enviando transacción:', error);
        throw error;
      }
    },

    // Enviar pagos simples
    sendPayment: acceslyContext.sendPayment,

    // Contexto completo de Accesly para funcionalidades avanzadas
    accesly: acceslyContext,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
