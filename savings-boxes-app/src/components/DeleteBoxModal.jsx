/**
 * DeleteBoxModal.jsx
 * Modal para confirmar la eliminación de una caja de ahorro
 */

import { useState } from 'react';
import { X, AlertTriangle, Trash2, Plane, Home, Car, Heart, Wallet, MapPin } from 'lucide-react';

const DeleteBoxModal = ({ box, isOpen, onClose, onSuccess }) => {
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

  if (!isOpen || !box) return null;

  const canDelete = box.currentBalance === 0;

  const handleDelete = async () => {
    if (!canDelete) {
      setError(`No puedes eliminar una caja con dinero. Retira los MXN$ ${box.currentBalance.toFixed(2)} primero.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/boxes/${box.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Caja eliminada exitosamente');
        onSuccess(box.id);
        onClose();
      } else {
        setError(data.message || 'Error al eliminar la caja');
      }
    } catch (err) {
      console.error('❌ Error eliminando caja:', err);
      setError(err.message || 'Error al eliminar la caja');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 p-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Eliminar Caja</h2>
              <p className="text-gray-600 text-sm mt-1">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Información de la caja */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{box.name}</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Meta: MXN$ {box.goal?.toLocaleString()}</p>
              <p>Balance actual: MXN$ {box.currentBalance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Validación de balance */}
          {!canDelete && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-700 font-semibold">No se puede eliminar</p>
                  <p className="text-red-600 text-sm">
                    Esta caja tiene un balance de MXN$ {box.currentBalance?.toFixed(2)}.
                    Primero debes retirar todo el dinero antes de poder eliminarla.
                  </p>
                </div>
              </div>
            </div>
          )}

          {canDelete && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ¿Estás seguro de que quieres eliminar <strong>"{box.name}"</strong>?
                Esta acción eliminará permanentemente la caja y todo su historial.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Eliminando...</span>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Eliminar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoxModal;