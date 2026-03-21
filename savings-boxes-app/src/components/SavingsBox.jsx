/**
 * SavingsBox.jsx
 * Componente para mostrar una caja de ahorro individual
 */

import { TrendingUp, Target } from 'lucide-react';
import { useYieldSimulator } from '../hooks/useYieldSimulator';

const SavingsBox = ({ box, onDeposit, onWithdraw }) => {
  // Simular el rendimiento en tiempo real
  const currentBalance = useYieldSimulator(
    box.currentBalance,
    box.apy,
    true // Activar simulador
  );

  // Calcular progreso hacia la meta
  const progress = Math.min((currentBalance / box.goal) * 100, 100);

  // Calcular cuánto falta
  const remaining = Math.max(box.goal - currentBalance, 0);

  return (
    <div className="card hover:scale-105 transition-all duration-300 cursor-pointer">
      {/* Header con emoji y nombre */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{box.emoji}</div>
          <div>
            <h3 className="text-xl font-bold text-white">{box.name}</h3>
            <div className="flex items-center gap-2 text-green-300 text-sm mt-1">
              <TrendingUp size={14} />
              <span>{box.apy}% APY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance actual */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-1">Balance Actual</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          ${currentBalance.toFixed(2)}
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <Target size={14} />
            <span>Meta: ${box.goal.toLocaleString()}</span>
          </div>
          <span className="text-sm font-semibold text-cyan-400">
            {progress.toFixed(1)}%
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${box.color} transition-all duration-500 rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Texto de cuánto falta */}
        {remaining > 0 && (
          <p className="text-gray-400 text-xs mt-2">
            Faltan ${remaining.toFixed(2)} para tu meta
          </p>
        )}
        {remaining === 0 && (
          <p className="text-green-400 text-xs mt-2 font-semibold">
            🎉 ¡Meta alcanzada!
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onDeposit(box)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Depositar
        </button>
        <button
          onClick={() => onWithdraw(box)}
          className="flex-1 bg-white/10 backdrop-blur-lg text-white font-semibold py-2 px-4 rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-200"
        >
          Retirar
        </button>
      </div>

      {/* Footer con fecha de creación */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-400 text-xs">
          Creada el {new Date(box.createdAt).toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
};

export default SavingsBox;
