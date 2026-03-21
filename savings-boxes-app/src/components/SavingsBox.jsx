/**
 * SavingsBox.jsx
 * Componente para mostrar una caja de ahorro individual
 */

import { TrendingUp, Target, Edit, Trash2, Plane, Home, Car, Heart, Wallet, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

const SavingsBox = ({ box, onDeposit, onWithdraw, onEdit, onDelete }) => {
  console.log('SavingsBox renderizando:', box.name, box.currentBalance, box.goal, box.icon)

  // Estado local para el balance que incluye simulación de rendimiento
  const [displayBalance, setDisplayBalance] = useState(box.currentBalance);

  // Actualizar balance cuando cambie el prop
  useEffect(() => {
    setDisplayBalance(box.currentBalance);
  }, [box.currentBalance]);

  // Simulador de rendimiento simple
  useEffect(() => {
    if (!box.currentBalance || box.currentBalance <= 0) return;

    const interval = setInterval(() => {
      setDisplayBalance(prev => {
        const increment = prev * (box.apy / 100) * (1 / (365 * 24 * 60 * 6)); // Actualizar cada 10 segundos
        return prev + increment;
      });
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [box.currentBalance, box.apy]);

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

  const IconComponent = getIconComponent(box.icon)

  // Calcular progreso hacia la meta
  const progress = Math.min((displayBalance / box.goal) * 100, 100);

  // Calcular cuánto falta
  const remaining = Math.max(box.goal - displayBalance, 0);

  // Calcular ganancia anual estimada
  const yearlyGain = displayBalance * (box.apy / 100);
  const projectedBalance = displayBalance + yearlyGain;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header amarillo/naranja */}
      <div className="bg-gradient-to-r from-orange-400 to-yellow-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">{box.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete && onDelete(box)}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Trash2 size={16} className="text-white" />
          </button>
          <button
            onClick={() => onEdit && onEdit(box)}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Edit size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Saldo Actual */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-2">Saldo Actual</p>
          <p className="text-3xl font-bold text-red-900">
            ${displayBalance.toFixed(2)} MXN
          </p>
          <p className="text-green-600 text-sm mt-1">
            +${yearlyGain.toFixed(2)} este año
          </p>
        </div>

        {/* Progreso hacia la meta */}
        <div className="mb-6">
          <p className="text-gray-800 font-semibold text-sm mb-3">Progreso hacia tu meta</p>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-gray-600 text-sm">
            ${displayBalance.toFixed(0)} de ${box.goal.toLocaleString()} MXN ({progress.toFixed(0)}%)
          </p>
        </div>

        {/* Rendimiento Anual */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 text-sm mb-1">Rendimiento Anual</p>
          <p className="text-red-900 font-bold text-lg mb-2">
            {box.apy}% - Plan Premium
          </p>
          <p className="text-gray-600 text-sm">
            Proyección a 1 año: ${projectedBalance.toFixed(2)} MXN
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={() => onDeposit(box)}
            className="flex-1 bg-red-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-900 text-xs font-bold">↓</span>
            </div>
            Depositar
          </button>
          <button
            onClick={() => onWithdraw(box)}
            className="flex-1 border-2 border-red-900 text-red-900 font-semibold py-3 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <div className="w-5 h-5 border-2 border-red-900 rounded-full flex items-center justify-center">
              <span className="text-red-900 text-xs font-bold">↑</span>
            </div>
            Retirar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingsBox;