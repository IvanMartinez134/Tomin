"use client"

import React, { useState } from 'react'
import { 
  Plus, 
  Plane, 
  Home, 
  Car, 
  Heart,
  TrendingUp,
  Settings,
  BarChart3,
  ArrowUpRight,
  X,
  Wallet,
  Target,
  Sparkles
} from 'lucide-react'

export default function SavingsDashboard({ userName = "Ángeles", onUpgradePlan }) {
  const [showNewBoxModal, setShowNewBoxModal] = useState(false)
  const [newBoxName, setNewBoxName] = useState('')
  const [newBoxIcon, setNewBoxIcon] = useState('plane')
  const [newBoxGoal, setNewBoxGoal] = useState('')

  const [savingsBoxes, setSavingsBoxes] = useState([
    { id: 1, name: 'VIAJE', icon: 'plane', balance: 6780 },
    { id: 2, name: 'CARRO', icon: 'car', balance: 6780 },
    { id: 3, name: 'CASA', icon: 'home', balance: 6780 },
    { id: 4, name: 'SALUD', icon: 'health', balance: 6780 },
  ])

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

  const totalBalance = savingsBoxes.reduce((sum, box) => sum + box.balance, 0)

  const handleAddBox = (e) => {
    e.preventDefault()
    if (newBoxName && newBoxGoal) {
      const newBox = {
        id: Date.now(),
        name: newBoxName.toUpperCase(),
        icon: newBoxIcon,
        balance: 0
      }
      setSavingsBoxes([...savingsBoxes, newBox])
      setNewBoxName('')
      setNewBoxIcon('plane')
      setNewBoxGoal('')
      setShowNewBoxModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              ¡hola, {userName}!
            </h1>
            <p className="text-gray-600">
              Bienvenida a tu curaduría financiera. Aquí tienes el estado actual de tus cajas de ahorro.
            </p>
          </div>
          <button
            onClick={() => setShowNewBoxModal(true)}
            className="flex items-center gap-2 bg-red-800 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            ¡AGREGAR!
          </button>
        </div>

        {/* Savings Boxes Grid - Amber/Gold Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {savingsBoxes.map((box) => {
            const Icon = getIcon(box.icon)

            return (
              <div
                key={box.id}
                className="bg-amber-400 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative p-6"
              >
                {/* Background decorative icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Icon className="w-24 h-24 text-red-900" />
                </div>

                {/* Small icon in corner */}
                <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-900" />
                </div>

                {/* Box name */}
                <h3 className="text-lg font-bold text-red-900 mb-2">{box.name}</h3>

                {/* Balance */}
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-red-900">
                    $6,780.00
                  </p>
                  <span className="text-red-900/70 font-medium">MXN</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Optimize Section */}
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
                  Con el plan <span className="text-red-800 font-semibold">Premium Curator</span> puedes optimizar tus rendimientos y desbloquear beneficios exclusivos.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button className="flex items-center justify-center gap-2 bg-red-800 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200">
                <BarChart3 className="w-4 h-4" />
                Ver Análisis
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200">
                <Settings className="w-4 h-4" />
                Configuración
              </button>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute top-4 right-4 bg-green-50 border border-green-200 px-4 py-2 rounded-full flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-semibold text-sm">RENDIMIENTO ESTIMADO +8.4% Anual</span>
          </div>
        </div>
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
    </div>
  )
}
