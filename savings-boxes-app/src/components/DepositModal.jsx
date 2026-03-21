/**
 * DepositModal.jsx
 * Modal para depositar dinero en una caja de ahorro
 */

import { useState } from 'react';
import { X, DollarSign, Loader, Plane, Home, Car, Heart, Wallet, MapPin, Info } from 'lucide-react';

const DepositModal = ({ box, isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Mapear íconos a componentes de Lucide React
  const getIconComponent = (iconId) => {
    const iconMap = {
      plane: Plane,
      home: Home,
      car: Car,
      health: Heart,
      wallet: Wallet,
      target: MapPin
    }
    return iconMap[iconId] || Wallet
  }

  const IconComponent = getIconComponent(box?.icon)

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('💰 Procesando depósito...');

      // Simular un pequeño delay para mejor UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Notificar éxito al componente padre
      onSuccess({
        boxId: box.id,
        amount: parseFloat(amount)
      });

      console.log('✅ Depósito exitoso');

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 animate-fadeIn">
        {/* Header */}
        <div className="bg-red-800 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{box.name}</h2>
              </div>
              <p className="text-red-100 text-sm">
                Balance actual: MXN$ {box.currentBalance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Input de cantidad */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cantidad a depositar (MXN)
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
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                min="0"
                step="0.01"
                disabled={isProcessing}
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mt-3">
              {[100, 500, 1000, 5000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm py-2 rounded-lg transition-colors border border-gray-200"
                  disabled={isProcessing}
                >
                  MXN$ {quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Info sobre el protocolo */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-start gap-2">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                <strong>Tu depósito se invertirá en protocolos DeFi</strong> de Stellar, generando rendimiento
                automático con un APY del {box.apy || 8.5}%
              </span>
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              onClick={handleDeposit}
              disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              className="flex-1 py-3 px-4 bg-red-800 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </div>
  );
};

export default DepositModal;