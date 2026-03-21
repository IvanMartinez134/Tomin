/**
 * EditBoxModal.jsx
 * Modal para editar una caja de ahorro existente
 */

import { useState } from 'react';
import { X, Plane, Home, Car, Heart, Wallet, Target } from 'lucide-react';

const EditBoxModal = ({ box, isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState(box?.name || '');
  const [icon, setIcon] = useState(box?.icon || 'wallet');
  const [goal, setGoal] = useState(box?.goal || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !box) return null;

  const iconOptions = [
    { id: 'plane', icon: Plane, label: 'Viaje' },
    { id: 'home', icon: Home, label: 'Casa' },
    { id: 'car', icon: Car, label: 'Auto' },
    { id: 'health', icon: Heart, label: 'Salud' },
    { id: 'wallet', icon: Wallet, label: 'General' },
    { id: 'target', icon: Target, label: 'Meta' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !goal || parseFloat(goal) <= 0) {
      setError('Por favor completa todos los campos con valores válidos');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/boxes/${box.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon,
          goal: parseFloat(goal)
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Caja actualizada exitosamente:', data.data);
        onSuccess(data.data);
        onClose();
      } else {
        setError(data.message || 'Error al actualizar la caja');
      }
    } catch (err) {
      console.error('❌ Error actualizando caja:', err);
      setError(err.message || 'Error al actualizar la caja');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-800 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Editar Caja de Ahorro</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre de la caja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la caja
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Fondo de emergencia"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Meta de ahorro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta de ahorro (MXN)
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej: 50000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
              min="1"
            />
          </div>

          {/* Selección de icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ícono
            </label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setIcon(option.id)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      icon === option.id
                        ? 'bg-red-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={option.label}
                  >
                    <IconComponent className="w-5 h-5 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Balance info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Balance actual:</strong> MXN$ {box.currentBalance?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              El balance se mantiene igual al editar la caja
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-red-800 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBoxModal;