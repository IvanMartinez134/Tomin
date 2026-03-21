/**
 * CreateBoxModal.jsx
 * Modal para crear una nueva caja de ahorro
 */

import { useState } from 'react';
import { X, Target } from 'lucide-react';
import { availableEmojis, availableColors } from '../data/mockData';

const CreateBoxModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(availableEmojis[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name || !goal || parseFloat(goal) <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const newBox = {
      id: `box-${Date.now()}`,
      name,
      emoji: selectedEmoji,
      goal: parseFloat(goal),
      currentBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
      color: selectedColor.gradient,
      vaultId: `vault-defindex-${Date.now()}`,
      apy: 8.5,
    };

    onCreate(newBox);

    // Limpiar formulario
    setName('');
    setGoal('');
    setSelectedEmoji(availableEmojis[0]);
    setSelectedColor(availableColors[0]);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Crear Nueva Caja de Ahorro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nombre de la caja */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Nombre de tu caja
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej: Vacaciones 2026, Nueva Laptop..."
            className="input-field"
            maxLength={30}
          />
        </div>

        {/* Meta de ahorro */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Meta de ahorro
          </label>
          <div className="relative">
            <Target
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="0.00"
              className="input-field pl-12"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Selección de emoji */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Elige un emoji
          </label>
          <div className="grid grid-cols-8 gap-2">
            {availableEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`text-3xl p-3 rounded-lg transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-white/20 ring-2 ring-cyan-400 scale-110'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Selección de color */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Elige un color
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`p-4 rounded-lg transition-all ${
                  selectedColor.name === color.name
                    ? 'ring-2 ring-white scale-105'
                    : ''
                }`}
              >
                <div
                  className={`h-12 rounded-lg bg-gradient-to-r ${color.gradient} mb-2`}
                />
                <p className="text-sm text-center">{color.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Vista previa */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/20">
          <p className="text-sm text-gray-400 mb-3">Vista previa:</p>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{selectedEmoji}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{name || 'Nombre de tu caja'}</h3>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className={`h-full bg-gradient-to-r ${selectedColor.gradient} rounded-full`}
                  style={{ width: '30%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info sobre APY */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-200">
            🌟 <strong>Tu caja generará 8.5% APY</strong> automáticamente a través de
            DeFindex y Blend Capital en Stellar.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || !goal || parseFloat(goal) <= 0}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear Caja
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoxModal;
