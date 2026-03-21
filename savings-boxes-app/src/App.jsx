import React, { useState } from 'react'
import { AcceslyProvider } from 'accesly'
import { WalletProvider, useWallet } from './context/WalletContext'
import Navbar from './components/Navbar'
import SubscriptionPlans from './components/SubscriptionPlans'
import SupportCenter from './components/SupportCenter'
import Dashboard from './components/Dashboard'
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
  const [user, setUser] = useState(null)

  const userName = user?.name || "Ángeles"

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
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
          <Dashboard 
            userName={userName} 
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
