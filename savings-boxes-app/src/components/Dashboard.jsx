/**
 * Dashboard.jsx
 * Vista principal del dashboard con las cajas de ahorro
 */

import { useState, useMemo } from 'react';
import { Plus, PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useMultipleBoxesYield } from '../hooks/useYieldSimulator';
import SavingsBox from './SavingsBox';
import CreateBoxModal from './CreateBoxModal';
import DepositModal from './DepositModal';
import { mockSavingsBoxes } from '../data/mockData';

const Dashboard = () => {
  const { isConnected } = useWallet();
  const [boxes, setBoxes] = useState(mockSavingsBoxes);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Simular rendimiento en todas las cajas
  const boxesWithYield = useMultipleBoxesYield(boxes, isConnected);

  // Calcular totales
  const totalBalance = useMemo(() => {
    return boxesWithYield.reduce((sum, box) => sum + box.currentBalance, 0);
  }, [boxesWithYield]);

  const totalGoals = useMemo(() => {
    return boxes.reduce((sum, box) => sum + box.goal, 0);
  }, [boxes]);

  // Handler para crear nueva caja
  const handleCreateBox = (newBox) => {
    setBoxes([...boxes, newBox]);
    console.log('✅ Nueva caja creada:', newBox);
  };

  // Handler para abrir modal de depósito
  const handleOpenDeposit = (box) => {
    setSelectedBox(box);
    setIsDepositModalOpen(true);
  };

  // Handler para completar depósito
  const handleDepositSuccess = (depositInfo) => {
    // Actualizar balance de la caja
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === depositInfo.boxId
          ? { ...box, currentBalance: box.currentBalance + depositInfo.amount }
          : box
      )
    );
    console.log('✅ Depósito completado:', depositInfo);
  };

  // Handler para retirar (placeholder)
  const handleWithdraw = (box) => {
    console.log('Retirar de:', box.name);
    alert('Funcionalidad de retiro próximamente');
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Wallet size={80} className="text-cyan-400 mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold mb-3 text-center">
          Bienvenido a Savings Boxes
        </h2>
        <p className="text-gray-300 text-center max-w-md mb-8">
          Conecta tu wallet con Accesly para empezar a crear tus cajas de ahorro
          y generar rendimiento en Stellar.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>DeFindex</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Blend Capital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>8.5% APY</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Balance Total */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Balance Total</p>
              <p className="text-3xl font-bold text-white">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
            <PiggyBank size={40} className="text-cyan-400" />
          </div>
        </div>

        {/* Metas Totales */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Metas Totales</p>
              <p className="text-3xl font-bold text-white">
                ${totalGoals.toLocaleString()}
              </p>
            </div>
            <TrendingUp size={40} className="text-purple-400" />
          </div>
        </div>

        {/* Cajas Activas */}
        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Cajas Activas</p>
              <p className="text-3xl font-bold text-white">{boxes.length}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>
      </div>

      {/* Header de Cajas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Mis Cajas de Ahorro</h2>
          <p className="text-gray-300 text-sm mt-1">
            Generando rendimiento automático con DeFindex y Blend Capital
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Nueva Caja
        </button>
      </div>

      {/* Grid de Cajas */}
      {boxes.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">No tienes cajas aún</h3>
          <p className="text-gray-300 mb-6">
            Crea tu primera caja de ahorro y empieza a generar rendimiento
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Crear Mi Primera Caja
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boxesWithYield.map((box) => (
            <SavingsBox
              key={box.id}
              box={box}
              onDeposit={handleOpenDeposit}
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>
      )}

      {/* Indicador de rendimiento en tiempo real */}
      {boxes.length > 0 && (
        <div className="mt-8 card bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-green-200">
              <strong>Rendimiento activo</strong> - Tus cajas están generando intereses
              en tiempo real
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateBoxModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBox}
      />

      {selectedBox && (
        <DepositModal
          box={selectedBox}
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false);
            setSelectedBox(null);
          }}
          onSuccess={handleDepositSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
