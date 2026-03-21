/**
 * CreateBoxModal.jsx
 * Modal para crear una nueva caja de ahorro
 */

import { useState } from 'react';
import { X, Target, Plane, Home, Car, Heart, Wallet, MapPin, Sparkles } from 'lucide-react';
import { availableColors } from '../data/mockData';

const CreateBoxModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('plane');
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  // Opciones de iconos disponibles
  const availableIcons = [
    { id: 'plane', icon: Plane, label: 'Viaje' },
    { id: 'home', icon: Home, label: 'Casa' },
    { id: 'car', icon: Car, label: 'Auto' },
    { id: 'health', icon: Heart, label: 'Salud' },
    { id: 'wallet', icon: Wallet, label: 'General' },
    { id: 'target', icon: MapPin, label: 'Meta' },
  ];

  // Función para obtener el componente de icono
  const getIconComponent = (iconId) => {
    const iconMap = {
      plane: Plane,
      home: Home,
      car: Car,
      health: Heart,
      wallet: Wallet,
      target: MapPin
    };
    return iconMap[iconId] || Wallet;
  };

  const IconComponent = getIconComponent(selectedIcon);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name || !goal || parseFloat(goal) <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const newBox = {
      id: `box-${Date.now()}`,
      name,
      icon: selectedIcon, // Usar icon en lugar de emoji
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
    setSelectedIcon('plane');
    setSelectedColor(availableColors[0]);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-blue-900 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Crear Nueva Caja de Ahorro</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Nombre de la caja */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de tu caja
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Vacaciones 2026, Nueva Laptop..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              maxLength={30}
            />
          </div>

          {/* Meta de ahorro */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta de ahorro (MXN)
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
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Selección de icono */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Elige un ícono
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedIcon(option.id)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      selectedIcon === option.id
                        ? 'bg-blue-800 text-white scale-110'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={option.label}
                  >
                    <Icon className="w-5 h-5 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selección de color */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Elige un color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedColor.name === color.name
                      ? 'ring-2 ring-blue-500 scale-105'
                      : ''
                  }`}
                >
                  <div
                    className={`h-12 rounded-lg bg-gradient-to-r ${color.gradient} mb-2`}
                  />
                  <p className="text-sm text-center text-gray-700">{color.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Vista previa:</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{name || 'Nombre de tu caja'}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-full bg-gradient-to-r ${selectedColor.gradient} rounded-full`}
                    style={{ width: '30%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info sobre APY */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-start gap-2">
              <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                <strong>Tu caja generará 8.5% APY</strong> automáticamente a través de
                DeFindex y Blend Capital en Stellar.
              </span>
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!name || !goal || parseFloat(goal) <= 0}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear Caja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBoxModal;