"use client"

import React, { useState, useEffect, useMemo } from 'react'
import {
  Plus,
  Plane,
  Home,
  Car,
  Heart,
  TrendingUp,
  Settings,
  BarChart3,
  X,
  Wallet,
  Target,
  Sparkles,
  PiggyBank
} from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import SavingsBox from './SavingsBox'
import DepositModal from './DepositModal'
import EditBoxModal from './EditBoxModal'
import DeleteBoxModal from './DeleteBoxModal'
import axios from 'axios'

export default function SavingsDashboard({ onUpgradePlan }) {
  const {
    isConnected,
    isPerfectlyAuthenticated,
    user,
    userName,
    address,
    balance,
    error
  } = useWallet()

  const [showNewBoxModal, setShowNewBoxModal] = useState(false)
  const [newBoxName, setNewBoxName] = useState('')
  const [newBoxIcon, setNewBoxIcon] = useState('plane')
  const [newBoxGoal, setNewBoxGoal] = useState('')
  const [boxes, setBoxes] = useState([])
  const [selectedBox, setSelectedBox] = useState(null)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [boxToEdit, setBoxToEdit] = useState(null)
  const [boxToDelete, setBoxToDelete] = useState(null)

  // Fetch boxes from backend
  useEffect(() => {
    const fetchBoxes = async () => {
      if (!user?.id) {
        console.log('Esperando autenticación de usuario...')
        return
      }

      try {
        console.log(`Obteniendo cajas para usuario ${user.id} (${user.name})`)
        const response = await axios.get(`http://localhost:3001/api/boxes?userId=${user.id}`)

        if (response.data.success) {
          // Transformar datos del backend al formato esperado por SavingsBox
          const transformedBoxes = response.data.data.map(box => ({
            ...box,
            apy: 8.5, // APY por defecto
            color: 'from-cyan-400 to-blue-500', // Color por defecto
            createdAt: box.createdAt || new Date().toISOString()
          }))

          setBoxes(transformedBoxes)
          console.log(`${response.data.data.length} cajas cargadas`)
        }
      } catch (error) {
        console.error("❌ Error fetching boxes", error)
      }
    }
    fetchBoxes()
  }, [user])

  // Simular rendimiento en todas las cajas - SIMPLIFICADO
  // Ahora cada SavingsBox maneja su propio rendimiento
  console.log('Boxes cargadas:', boxes.length, boxes)

  const iconOptions = [
    { id: 'plane', icon: Plane, label: 'Viaje' },
    { id: 'home', icon: Home, label: 'Casa' },
    { id: 'car', icon: Car, label: 'Auto' },
    { id: 'health', icon: Heart, label: 'Salud' },
    { id: 'wallet', icon: Wallet, label: 'General' },
    { id: 'target', icon: Target, label: 'Meta' },
  ]

  const getIcon = (iconId) => {
    const iconMap = {
      plane: Plane,
      home: Home,
      car: Car,
      health: Heart,
      wallet: Wallet,
      target: Target
    }
    return iconMap[iconId] || Wallet
  }

  // Calcular totales
  const totalBalance = useMemo(() => {
    return boxes.reduce((sum, box) => sum + box.currentBalance, 0)
  }, [boxes])

  const totalGoals = useMemo(() => {
    return boxes.reduce((sum, box) => sum + box.goal, 0)
  }, [boxes])

  const handleAddBox = async (e) => {
    e.preventDefault()
    if (!user?.id) {
      alert('Error: Usuario no autenticado')
      return
    }

    if (newBoxName && newBoxGoal) {
      try {
        console.log('Creando nueva caja para usuario:', user.id)
        const response = await axios.post('http://localhost:3001/api/boxes', {
          userId: user.id,
          name: newBoxName.toUpperCase(),
          icon: newBoxIcon,
          goal: parseFloat(newBoxGoal)
        })

        if (response.data.success) {
          const newBox = {
            ...response.data.data,
            apy: 8.5,
            color: 'from-cyan-400 to-blue-500',
            createdAt: new Date().toISOString()
          }
          setBoxes([...boxes, newBox])
          console.log('Caja creada:', response.data.data.name)
        }
      } catch (error) {
        console.error('❌ Error creando caja:', error)
        alert('Error creando caja')
      }

      setNewBoxName('')
      setNewBoxIcon('plane')
      setNewBoxGoal('')
      setShowNewBoxModal(false)
    }
  }

  // Handler para depositar
  const handleDeposit = (box) => {
    setSelectedBox(box)
    setIsDepositModalOpen(true)
  }

  // Handler para el éxito del depósito
  const handleDepositSuccess = async (depositInfo) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/boxes/${depositInfo.boxId}/deposit`, {
        amount: depositInfo.amount
      })
      if (response.data.success) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) =>
            box.id === depositInfo.boxId
              ? { ...box, currentBalance: response.data.data.currentBalance }
              : box
          )
        )
        console.log('Depósito completado en backend:', response.data.data)
      }
    } catch (error) {
      console.error(error)
      alert('Error en depósito')
    }
    setIsDepositModalOpen(false)
    setSelectedBox(null)
  }

  // Handler para retirar
  const handleWithdraw = async (box) => {
    const amount = prompt("Monto a retirar:")
    if (!amount || isNaN(amount)) return

    try {
      const response = await axios.post(`http://localhost:3001/api/boxes/${box.id}/withdraw`, {
        amount: Number(amount)
      })
      if (response.data.success) {
        setBoxes(boxes.map(b =>
          b.id === box.id
            ? { ...b, currentBalance: response.data.data.currentBalance }
            : b
        ))
        alert("Retiro exitoso")
      }
    } catch (error) {
      console.error(error)
      alert("Error al retirar")
    }
  }

  // Handler para editar cajas
  const handleEdit = (box) => {
    setBoxToEdit(box)
    setIsEditModalOpen(true)
  }

  // Handler para eliminar cajas
  const handleDelete = (box) => {
    setBoxToDelete(box)
    setIsDeleteModalOpen(true)
  }

  // Handler para el éxito de la edición
  const handleEditSuccess = (updatedBox) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === updatedBox.id ? {
          ...updatedBox,
          apy: 8.5,
          color: 'from-cyan-400 to-blue-500'
        } : box
      )
    )
    setIsEditModalOpen(false)
    setBoxToEdit(null)
  }

  // Handler para el éxito de la eliminación
  const handleDeleteSuccess = (deletedBoxId) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== deletedBoxId))
    setIsDeleteModalOpen(false)
    setBoxToDelete(null)
  }

  // Mostrar loading si no está conectado
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Wallet size={80} className="text-red-800 mb-6 mx-auto animate-bounce" />
          <h2 className="text-3xl font-bold mb-3">Conecta tu Wallet</h2>
          <p className="text-gray-600 max-w-md">
            Conecta tu wallet con Accesly para acceder a tus cajas de ahorro
          </p>
        </div>
      </div>
    )
  }

  if (isConnected && !isPerfectlyAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
          <h2 className="text-2xl font-bold mb-3">Configurando tu cuenta...</h2>
          <p className="text-gray-600 max-w-md mb-4">
            Estamos creando tu perfil de usuario con la información de tu wallet.
          </p>
          {address && (
            <p className="text-sm text-gray-400 break-all">
              Wallet: {address.slice(0, 8)}...{address.slice(-8)}
            </p>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              ¡Hola, {userName}!
            </h1>
            <p className="text-gray-600 mb-2">
              Dashboard de tus cajas de ahorro inteligentes con rendimiento en Stellar
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Wallet: {address?.slice(0, 8)}...{address?.slice(-8)}</span>
              <span>Plan: {user?.plan}</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Conectado a Stellar</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewBoxModal(true)}
            className="flex items-center gap-2 bg-red-800 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            ¡AGREGAR CAJA!
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Balance Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  MXN$ {totalBalance.toFixed(2)}
                </p>
              </div>
              <PiggyBank size={40} className="text-red-800" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Metas Totales</p>
                <p className="text-3xl font-bold text-gray-900">
                  MXN$ {totalGoals.toLocaleString()}
                </p>
              </div>
              <Target size={40} className="text-red-800" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Cajas Activas</p>
                <p className="text-3xl font-bold text-gray-900">{boxes.length}</p>
              </div>
              <PiggyBank size={40} className="text-red-800" />
            </div>
          </div>
        </div>

        {/* Message if no boxes */}
        {boxes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <PiggyBank size={80} className="text-gray-400 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">No tienes cajas aún</h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera caja de ahorro y empieza a generar rendimiento
            </p>
            <button
              onClick={() => setShowNewBoxModal(true)}
              className="bg-red-800 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Crear Mi Primera Caja
            </button>
          </div>
        ) : (
          /* Savings Boxes Grid - Using SavingsBox component */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {boxes.map((box) => (
              <SavingsBox
                key={box.id}
                box={box}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Optimize Section */}
        {boxes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-red-800" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Optimiza tu ahorro
                  </h3>
                  <p className="text-gray-600">
                    Con el plan <span className="text-red-800 font-semibold">Premium</span> puedes optimizar tus rendimientos y desbloquear beneficios exclusivos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button className="flex items-center justify-center gap-2 bg-red-800 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200">
                  <BarChart3 className="w-4 h-4" />
                  Ver Análisis
                </button>
                <button
                  onClick={onUpgradePlan}
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200">
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-green-50 border border-green-200 px-4 py-2 rounded-full flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-semibold text-sm">RENDIMIENTO ESTIMADO +8.5% Anual</span>
            </div>
          </div>
        )}

        {/* Indicador de rendimiento en tiempo real */}
        {boxes.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-cyan-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-700">
                <strong>Rendimiento activo</strong> - Tus cajas están generando intereses en tiempo real a través de DeFindex y Blend Capital
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Box Modal */}
      {showNewBoxModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-red-900 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Nueva Caja de Ahorro</h3>
                <button
                  onClick={() => setShowNewBoxModal(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddBox} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la caja
                </label>
                <input
                  type="text"
                  value={newBoxName}
                  onChange={(e) => setNewBoxName(e.target.value)}
                  placeholder="Ej: Fondo de emergencia"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta de ahorro (MXN)
                </label>
                <input
                  type="number"
                  value={newBoxGoal}
                  onChange={(e) => setNewBoxGoal(e.target.value)}
                  placeholder="Ej: 50000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ícono
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setNewBoxIcon(option.id)}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          newBoxIcon === option.id
                            ? 'bg-red-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={option.label}
                      >
                        <Icon className="w-5 h-5 mx-auto" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBoxModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-400 text-red-900 rounded-xl font-bold hover:bg-amber-500 transition-all duration-200 hover:shadow-lg"
                >
                  Crear Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {selectedBox && (
        <DepositModal
          box={selectedBox}
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false)
            setSelectedBox(null)
          }}
          onSuccess={handleDepositSuccess}
        />
      )}

      {/* Edit Box Modal */}
      <EditBoxModal
        box={boxToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setBoxToEdit(null)
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Box Modal */}
      <DeleteBoxModal
        box={boxToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setBoxToDelete(null)
        }}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}