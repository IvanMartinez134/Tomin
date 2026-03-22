import { useState, useEffect } from 'react';
import { TominContractService } from '../services/contractService.js';

/**
 * Hook para manejar connectionnes con Stellar y contratos Tomin
 */
export const useTominWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [tominBalance, setTominBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const contractService = new TominContractService();

  // Verificar si Freighter está instalado
  const isFreighterAvailable = () => {
    return typeof window !== 'undefined' && !!window.freighter;
  };

  // Conectar wallet
  const connectWallet = async () => {
    if (!isFreighterAvailable()) {
      setError('Freighter wallet no encontrado. Instálalo desde stellar.org');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const address = await contractService.connectWallet();
      setWalletAddress(address);

      // Cargar balances automáticamente
      await loadBalances(address);

      console.log('✅ Wallet conectado exitosamente:', address);
      return true;
    } catch (err) {
      setError(`Error conectando wallet: ${err.message}`);
      console.error('❌ Error en conexión:', err);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setUsdcBalance(0);
    setTominBalance(0);
    setError(null);
  };

  // Cargar balances
  const loadBalances = async (address = walletAddress) => {
    if (!address) return;

    setIsLoading(true);
    try {
      const [usdcBal, tominBal] = await Promise.all([
        contractService.getUSDCBalance(address),
        contractService.getTominBalance(address)
      ]);

      setUsdcBalance(usdcBal);
      setTominBalance(tominBal);
    } catch (err) {
      console.error('❌ Error cargando balances:', err);
      setError(`Error cargando balances: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Depositar en Tomin
  const depositToTomin = async (amountUSDC) => {
    if (!walletAddress) {
      setError('Wallet no conectado');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contractService.depositToTomin(walletAddress, amountUSDC);

      // Recargar balances después del depósito
      await loadBalances();

      console.log('✅ Depósito completado:', result);
      return true;
    } catch (err) {
      setError(`Error en depósito: ${err.message}`);
      console.error('❌ Error en depósito:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Retirar de Tomin
  const withdrawFromTomin = async (amountUSDC) => {
    if (!walletAddress) {
      setError('Wallet no conectado');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contractService.withdrawFromTomin(walletAddress, amountUSDC);

      // Recargar balances después del retiro
      await loadBalances();

      console.log('✅ Retiro completado:', result);
      return true;
    } catch (err) {
      setError(`Error en retiro: ${err.message}`);
      console.error('❌ Error en retiro:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar conexión automáticamente al montar
  useEffect(() => {
    if (isFreighterAvailable()) {
      // Intentar autoconectar si el usuario ya autorizó antes
      // (Freighter mantiene estado de autorización)
      window.freighter?.getAddress()
        .then(({ address }) => {
          if (address) {
            setWalletAddress(address);
            loadBalances(address);
          }
        })
        .catch(() => {
          // Usuario no ha autorizado, no hacer nada
        });
    }
  }, []);

  return {
    // Estado
    walletAddress,
    usdcBalance,
    tominBalance,
    isConnecting,
    isLoading,
    error,
    isFreighterAvailable: isFreighterAvailable(),

    // Acciones
    connectWallet,
    disconnectWallet,
    loadBalances,
    depositToTomin,
    withdrawFromTomin,

    // Utilidades
    clearError: () => setError(null)
  };
};