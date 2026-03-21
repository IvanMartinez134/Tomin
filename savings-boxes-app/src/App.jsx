import React, { useState, useEffect } from 'react'
import { AcceslyProvider } from 'accesly'
import { WalletProvider, useWallet } from './context/WalletContext'
import Navbar from './components/Navbar'
import SubscriptionPlans from './components/SubscriptionPlans'
import SupportCenter from './components/SupportCenter'
import SavingsDashboard from './components/SavingsDashboard'
import Login from './components/Login'
import Register from './components/Register'

export default function AppWrapper() {
  return (
    <AcceslyProvider
      appId={import.meta.env.VITE_ACCESLY_APP_ID}
      network="testnet"
      theme="light"
    >
      <WalletProvider>
        <App />
      </WalletProvider>
    </AcceslyProvider>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [currentPlan, setCurrentPlan] = useState('premium')

  // Obtener estado del wallet
  const { isPerfectlyAuthenticated, user, userName } = useWallet()

  // Efecto para manejar auto-login cuando el usuario está autenticado con Accesly
  useEffect(() => {
    if (isPerfectlyAuthenticated && user) {
      if (currentView === 'login' || currentView === 'register') {
        console.log('🔐 Auto-redirigiendo a dashboard por autenticación Accesly');
        setCurrentView('dashboard');
      }
    } else {
      // Si no está autenticado y no está en login/register, redirigir a login
      if (currentView !== 'login' && currentView !== 'register') {
        console.log('🔒 Redirigiendo a login - usuario no autenticado');
        setCurrentView('login');
      }
    }
  }, [isPerfectlyAuthenticated, user, currentView])

  const handleLogin = (userData) => {
    console.log('✅ Login exitoso:', userData.name);
    setCurrentView('dashboard')
  }

  const handleRegister = (userData) => {
    console.log('✅ Registro exitoso:', userData.name);
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    console.log('👋 Cerrando sesión...');
    setCurrentView('login')
  }

  const handleSelectPlan = (planId) => {
    setCurrentPlan(planId)
    alert('Plan seleccionado correctamente')
  }

  if (currentView === 'login') {
    return (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setCurrentView('register')} 
      />
    )
  }

  if (currentView === 'register') {
    return (
      <Register 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setCurrentView('login')} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userName={userName}
        onLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-0 pt-24 lg:pt-0 pb-12">
        {currentView === 'dashboard' && (
          <SavingsDashboard
            onUpgradePlan={() => setCurrentView('subscription')}
          />
        )}

        {currentView === 'subscription' && (
          <SubscriptionPlans 
            currentPlan={currentPlan} 
            onSelectPlan={handleSelectPlan} 
          />
        )}

        {currentView === 'support' && (
          <SupportCenter />
        )}
      </main>
    </div>
  )
}
