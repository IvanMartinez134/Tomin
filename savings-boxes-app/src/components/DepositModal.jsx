/**
 * DepositModal.jsx
 * Modal para depositar dinero en una caja de ahorro
 */

import { useState } from 'react';
import { X, DollarSign, Loader } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import * as SorobanService from '../services/SorobanService';

const DepositModal = ({ box, isOpen, onClose, onSuccess }) => {
  const { publicKey, signAndSubmit } = useWallet();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('💰 Iniciando depósito...');

      // 1. Crear transacción de depósito
      const unsignedXdr = await SorobanService.createDepositTransaction(
        publicKey,
        box.id,
        amount
      );

      // 2. Firmar y enviar con Accesly (todo en uno)
      console.log('✍️ Firmando y enviando transacción con Accesly...');
      const result = await signAndSubmit(unsignedXdr);

      console.log('✅ Depósito exitoso:', result);

      // Notificar éxito
      onSuccess({
        boxId: box.id,
        amount: parseFloat(amount),
        hash: result.txHash,
      });

      // Limpiar y cerrar
      setAmount('');
      onClose();
    } catch (err) {
      console.error('❌ Error en depósito:', err);
      setError(err.message || 'Error al procesar el depósito');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{box.emoji}</span>
              <h2 className="text-2xl font-bold">{box.name}</h2>
            </div>
            <p className="text-gray-300 text-sm">
              Balance actual: ${box.currentBalance.toFixed(2)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Input de cantidad */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Cantidad a depositar
          </label>
          <div className="relative">
            <DollarSign
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field pl-12 text-lg"
              min="0"
              step="0.01"
              disabled={isProcessing}
            />
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 mt-3">
            {[10, 50, 100, 500].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-lg transition-colors border border-white/10"
                disabled={isProcessing}
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Info sobre el protocolo */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            💡 <strong>Tu depósito se invertirá en DeFindex</strong>, generando rendimiento
            en Blend Capital con un APY del {box.apy}%
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            onClick={handleDeposit}
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader size={20} className="animate-spin" />
                Procesando...
              </>
            ) : (
              'Depositar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
