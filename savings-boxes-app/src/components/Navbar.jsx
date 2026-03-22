import React from 'react'
import { Shield, LayoutDashboard, CreditCard, Headphones, LogOut, ArrowUp } from 'lucide-react'
import logoImage from '../assets/logo.png'

export default function Navbar({ currentView, setCurrentView, userName = "Ángeles", onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD/CAJAS', icon: LayoutDashboard },
    { id: 'subscription', label: 'SUSCRIPCIÓN', icon: CreditCard },
    { id: 'support', label: 'SOPORTE', icon: Headphones },
  ]

  return (
    <div className="flex">
      {/* Sidebar - White with dark gray text */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-100">
          <div className="w-20 h-20 mx-auto mb-3">
            <img
              src={logoImage}
              alt="Tomin Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-center text-gray-900 font-semibold">¡hola, {userName}!</p>
          <p className="text-center text-gray-500 text-xs uppercase tracking-wider mt-1">PREMIUM</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-l" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-3">
          <button 
            onClick={() => setCurrentView('subscription')}
            className="w-full flex items-center justify-center gap-2 bg-red-900 text-white py-3 rounded-xl font-bold hover:bg-red-800 transition-all duration-200"
          >
            <ArrowUp className="w-4 h-4" />
            UPGRADE PLAN
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 py-2 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-gray-900">Tomin</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{userName}</span>
              <button
                onClick={onLogout}
                className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-all duration-200"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile navigation tabs */}
        <nav className="bg-white border-b border-gray-200 px-2 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-red-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
