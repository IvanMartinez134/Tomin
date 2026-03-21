/**
 * WalletContext.jsx
 * Context de React para manejar el estado del wallet usando Accesly y autenticación
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { useAccesly } from 'accesly';
import axios from 'axios';

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

  // Estado local para usuario autenticado
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Función para autenticar/crear usuario con Accesly
  const authenticateWithAccesly = async (walletData) => {
    if (!walletData?.stellarAddress) {
      throw new Error('No se encontró dirección de Stellar en el wallet');
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      console.log('🔐 Autenticando con Accesly:', walletData.stellarAddress);

      const response = await axios.post('http://localhost:3001/api/auth/accesly', {
        stellarAddress: walletData.stellarAddress,
        email: walletData.email,
        walletData: walletData
      });

      if (response.data.success) {
        setUser(response.data.user);
        console.log('✅ Usuario autenticado:', response.data.user.name);

        // Guardar token si es necesario
        if (response.data.token) {
          localStorage.setItem('accesly_token', response.data.token);
        }

        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Error en autenticación');
      }
    } catch (error) {
      console.error('❌ Error en autenticación con Accesly:', error);
      setAuthError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Efectos para manejar cambios en el estado del wallet
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (acceslyContext.wallet && !user && !authLoading) {
        try {
          await authenticateWithAccesly(acceslyContext.wallet);
        } catch (error) {
          console.error('Error auto-autenticando:', error);
        }
      }
    };

    handleWalletConnection();
  }, [acceslyContext.wallet, user, authLoading]);

  // Función personalizada de desconexión
  const handleDisconnect = async () => {
    try {
      await acceslyContext.disconnect();
      setUser(null);
      setAuthError(null);
      localStorage.removeItem('accesly_token');
      console.log('🔌 Wallet desconectado y usuario cerrado');
    } catch (error) {
      console.error('Error desconectando:', error);
    }
  };

  // Función para login tradicional (mantener compatibilidad)
  const loginWithCredentials = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('traditional_token', response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      setAuthError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Adaptador para mantener compatibilidad con nuestra API existente
  const value = {
    // Estado del wallet y autenticación
    isConnected: !!acceslyContext.wallet,
    isPerfectlyAuthenticated: !!acceslyContext.wallet && !!user,
    address: acceslyContext.wallet?.stellarAddress || null,
    publicKey: acceslyContext.wallet?.stellarAddress || null,
    email: acceslyContext.wallet?.email || user?.email || null,
    balance: acceslyContext.balance || '0',
    isLoading: acceslyContext.loading || authLoading,
    error: authError || acceslyContext.error,

    // Usuario autenticado
    user: user,
    userName: user?.name || 'Usuario',
    userPlan: user?.plan || 'free',

    // Funciones de Accesly
    wallet: acceslyContext.wallet,
    connect: () => {
      console.log('Use ConnectButton component to connect');
    },
    disconnect: handleDisconnect,

    // Funciones de autenticación
    authenticateWithAccesly,
    loginWithCredentials,
    logout: handleDisconnect,

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
