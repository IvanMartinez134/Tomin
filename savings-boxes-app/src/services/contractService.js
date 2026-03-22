import * as StellarSDK from '@stellar/stellar-sdk';
const {
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Account
} = StellarSDK;
import { STELLAR_CONFIG } from '../config/stellar.js';

// Servidor RPC de Soroban
const rpcServer = new StellarSDK.SorobanRpc.Server(STELLAR_CONFIG.rpcUrl);

/**
 * Servicio para interactuar con los Smart Contracts de Tomin
 */
export class TominContractService {
  constructor() {
    this.rpcServer = rpcServer;
    this.networkPassphrase = STELLAR_CONFIG.networkPassphrase;
  }

  /**
   * Conectar con wallet Freighter
   */
  async connectWallet() {
    try {
      if (!window.freighter) {
        throw new Error('Freighter wallet no encontrado. Instálalo desde stellar.org');
      }

      const { address } = await window.freighter.getAddress();

      if (!address) {
        throw new Error('No se pudo obtener la dirección de Freighter');
      }

      console.log('✅ Wallet conectado:', address);
      return address;
    } catch (error) {
      console.error('❌ Error conectando wallet:', error);
      throw error;
    }
  }

  /**
   * Obtener balance de USDC de una dirección
   */
  async getUSDCBalance(userAddress) {
    try {
      const contract = new Contract(STELLAR_CONFIG.contracts.USDC_TOKEN);

      // Crear transacción de solo lectura
      const account = await this.rpcServer.getAccount(userAddress);
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(contract.call('balance', userAddress))
        .setTimeout(30)
        .build();

      // Simular para obtener resultado
      const simulation = await this.rpcServer.simulateTransaction(transaction);

      if (simulation.error) {
        throw new Error(`Error simulando transacción: ${simulation.error}`);
      }

      // Parsear resultado
      const balance = simulation.result?.retval?.value || '0';
      const balanceFormatted = parseInt(balance) / 10000000; // USDC tiene 7 decimales

      return balanceFormatted;
    } catch (error) {
      console.error('❌ Error obteniendo balance USDC:', error);
      return 0;
    }
  }

  /**
   * Obtener balance de usuario en el contrato Tomin
   */
  async getTominBalance(userAddress) {
    try {
      const contract = new Contract(STELLAR_CONFIG.contracts.TOMIN_VAULT);

      const account = await this.rpcServer.getAccount(userAddress);
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(contract.call('get_balance', userAddress))
        .setTimeout(30)
        .build();

      const simulation = await this.rpcServer.simulateTransaction(transaction);

      if (simulation.error) {
        throw new Error(`Error obteniendo balance Tomin: ${simulation.error}`);
      }

      const balance = simulation.result?.retval?.value || '0';
      const balanceFormatted = parseInt(balance) / 10000000; // USDC 7 decimales

      return balanceFormatted;
    } catch (error) {
      console.error('❌ Error obteniendo balance Tomin:', error);
      return 0;
    }
  }

  /**
   * Depositar USDC en el vault Tomin
   */
  async depositToTomin(userAddress, amountUSDC) {
    try {
      if (!window.freighter) {
        throw new Error('Freighter wallet no disponible');
      }

      const contract = new Contract(STELLAR_CONFIG.contracts.TOMIN_VAULT);
      const amountStroops = Math.floor(amountUSDC * 10000000); // Convertir a 7 decimales

      // Obtener cuenta del usuario
      const account = await this.rpcServer.getAccount(userAddress);

      // Crear transacción
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(contract.call('deposit', userAddress, amountStroops))
        .setTimeout(30)
        .build();

      // Simular transacción
      const simulation = await this.rpcServer.simulateTransaction(transaction);

      if (simulation.error) {
        throw new Error(`Error simulando depósito: ${simulation.error}`);
      }

      // Preparar para firma
      const preparedTransaction = StellarSDK.SorobanRpc.assembleTransaction(transaction, simulation).build();

      // Firmar con Freighter
      const signedXDR = await window.freighter.signTransaction(
        preparedTransaction.toXDR(),
        {
          networkPassphrase: this.networkPassphrase,
          accountToSign: userAddress
        }
      );

      const signedTransaction = TransactionBuilder.fromXDR(signedXDR, this.networkPassphrase);

      // Enviar transacción
      const result = await this.rpcServer.sendTransaction(signedTransaction);

      console.log('✅ Depósito exitoso:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en depósito:', error);
      throw error;
    }
  }

  /**
   * Retirar USDC del vault Tomin
   */
  async withdrawFromTomin(userAddress, amountUSDC) {
    try {
      if (!window.freighter) {
        throw new Error('Freighter wallet no disponible');
      }

      const contract = new Contract(STELLAR_CONFIG.contracts.TOMIN_VAULT);
      const amountStroops = Math.floor(amountUSDC * 10000000);

      const account = await this.rpcServer.getAccount(userAddress);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(contract.call('withdraw', userAddress, amountStroops))
        .setTimeout(30)
        .build();

      const simulation = await this.rpcServer.simulateTransaction(transaction);

      if (simulation.error) {
        throw new Error(`Error simulando retiro: ${simulation.error}`);
      }

      const preparedTransaction = StellarSDK.SorobanRpc.assembleTransaction(transaction, simulation).build();

      const signedXDR = await window.freighter.signTransaction(
        preparedTransaction.toXDR(),
        {
          networkPassphrase: this.networkPassphrase,
          accountToSign: userAddress
        }
      );

      const signedTransaction = TransactionBuilder.fromXDR(signedXDR, this.networkPassphrase);
      const result = await this.rpcServer.sendTransaction(signedTransaction);

      console.log('✅ Retiro exitoso:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en retiro:', error);
      throw error;
    }
  }

  /**
   * Verificar estado de la red testnet
   */
  async checkNetworkHealth() {
    try {
      const health = await this.rpcServer.getHealth();
      console.log('🌐 Estado de red Stellar testnet:', health);
      return health;
    } catch (error) {
      console.error('❌ Error verificando red:', error);
      throw error;
    }
  }
}