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
import EditBoxModal from './EditBoxModal';
import DeleteBoxModal from './DeleteBoxModal';
import { mockSavingsBoxes } from '../data/mockData';
import { useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const {
    isConnected,
    isPerfectlyAuthenticated,
    user,
    userName,
    address,
    balance,
    error
  } = useWallet();
  const [boxes, setBoxes] = useState([]);
  
  // Fetch from backend whenever user changes/mounts
  useEffect(() => {
    const fetchBoxes = async () => {
      if (!user?.id) {
        console.log('⏳ Esperando autenticación de usuario...');
        return;
      }

      try {
        console.log(`📦 Obteniendo cajas para usuario ${user.id} (${user.name})`);
        const response = await axios.get(`http://localhost:3001/api/boxes?userId=${user.id}`);
        if(response.data.success) {
          setBoxes(response.data.data);
          console.log(`✅ ${response.data.data.length} cajas cargadas`);
        }
      } catch (error) {
        console.error("❌ Error fetching boxes", error);
      }
    };
    fetchBoxes();
  }, [user]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [boxToEdit, setBoxToEdit] = useState(null);
  const [boxToDelete, setBoxToDelete] = useState(null);

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
  const handleCreateBox = async (newBox) => {
    if (!user?.id) {
      alert('Error: Usuario no autenticado');
      return;
    }

    try {
      console.log('🏗️ Creando nueva caja para usuario:', user.id);
      const response = await axios.post('http://localhost:3001/api/boxes', {
        userId: user.id,
        name: newBox.name,
        icon: newBox.icon || newBox.iconType,
        goal: newBox.goal
      });

      if(response.data.success) {
        setBoxes([...boxes, response.data.data]);
        console.log('✅ Caja creada:', response.data.data.name);
      }
    } catch(error) {
      console.error('❌ Error creando caja:', error);
      alert('Error creando caja');
    }
    setIsCreateModalOpen(false);
  };

  // Handler para abrir modal de depósito
  const handleOpenDeposit = (box) => {
    setSelectedBox(box);
    setIsDepositModalOpen(true);
  };

  // Handler para completar depósito
  const handleDepositSuccess = async (depositInfo) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/boxes/${depositInfo.boxId}/deposit`, {
        amount: depositInfo.amount
      });
      if(response.data.success) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) =>
            box.id === depositInfo.boxId
              ? { ...box, currentBalance: response.data.data.currentBalance }
              : box
          )
        );
        console.log('✅ Depósito completado en backend:', response.data.data);
      }
    } catch(e) {
       console.error(e);
       alert('Error deposit');
    }
  };

  // Handler para retirar (placeholder)
  const handleWithdraw = async (box) => {
    const amt = prompt("Monto a retirar:");
    if(!amt || isNaN(amt)) return;
    try {
        const r = await axios.post(`http://localhost:3001/api/boxes/${box.id}/withdraw`, { amount: Number(amt) });
        if(r.data.success) {
            setBoxes(boxes.map(b => b.id === box.id ? { ...b, current_balance: r.data.data.current_balance } : b));
            alert("Retiro exitoso");
        }
    } catch(e) {
        console.error(e);
        alert("Error al retirar");
    }
};

  // Handler para editar cajas
  const handleEdit = (box) => {
    setBoxToEdit(box);
    setIsEditModalOpen(true);
  };

  // Handler para eliminar cajas
  const handleDelete = (box) => {
    setBoxToDelete(box);
    setIsDeleteModalOpen(true);
  };

  // Handler para el éxito de la edición
  const handleEditSuccess = (updatedBox) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === updatedBox.id ? updatedBox : box
      )
    );
    setIsEditModalOpen(false);
    setBoxToEdit(null);
  };

  // Handler para el éxito de la eliminación
  const handleDeleteSuccess = (deletedBoxId) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== deletedBoxId));
    setIsDeleteModalOpen(false);
    setBoxToDelete(null);
  };

  // Mostrar loading o estado de conectividad
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

  if (isConnected && !isPerfectlyAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-3 text-center">
          Configurando tu cuenta...
        </h2>
        <p className="text-gray-300 text-center max-w-md mb-4">
          Estamos creando tu perfil de usuario con la información de tu wallet.
        </p>
        {address && (
          <p className="text-sm text-gray-400 break-all text-center">
            Wallet: {address.slice(0, 8)}...{address.slice(-8)}
          </p>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Bienvenida de usuario */}
      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">¡Hola, {userName}! 👋</h1>
            <p className="text-sm text-gray-300">
              Wallet conectado: {address?.slice(0, 8)}...{address?.slice(-8)} | Plan: {user.plan}
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-sm text-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Conectado a Stellar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Balance Total */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Balance Total</p>
              <p className="text-3xl font-bold text-white">
                MXN$ {totalBalance.toFixed(2)}
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
                MXN$ {totalGoals.toLocaleString()}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
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

      {/* Edit Box Modal */}
      <EditBoxModal
        box={boxToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setBoxToEdit(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Box Modal */}
      <DeleteBoxModal
        box={boxToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBoxToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default Dashboard;
