import React, { useState } from 'react'
import { Check, X, Shield, Star, Crown, Sparkles, TrendingUp, Coins } from 'lucide-react'

export default function SubscriptionPlans({ currentPlan = 'premium', onSelectPlan }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const plans = [
    {
      id: 'free',
      tier: 'INICIACIÓN',
      name: 'Plan free',
      price: '$0',
      period: '',
      icon: Star,
      features: [
        { text: '1 caja', included: true },
        { text: '3% ganancia anual', included: true },
        { text: 'Soporte estándar', included: false },
      ],
      buttonText: currentPlan === 'free' ? 'TU PLAN ACTUAL' : 'SELECCIONAR FREE',
      disabled: currentPlan === 'free'
    },
    {
      id: 'premium',
      tier: 'CRECIMIENTO',
      name: 'Plan premium',
      price: '$99',
      period: 'MXN/Mes',
      icon: Crown,
      recommended: true,
      features: [
        { text: '3 cajas', included: true },
        { text: '6% ganancia anual', included: true },
        { text: 'Soporte prioritario', included: true },
      ],
      buttonText: currentPlan === 'premium' ? 'TU PLAN ACTUAL' : 'SELECCIONAR PREMIUM',
      disabled: currentPlan === 'premium'
    },
    {
      id: 'master',
      tier: 'MÁXIMO NIVEL',
      name: 'Plan master',
      price: '$199',
      period: 'MXN/Mes',
      icon: Sparkles,
      features: [
        { text: '5 cajas', included: true },
        { text: '10% ganancia anual', included: true },
        { text: 'Concierge dedicado 24/7', included: true },
      ],
      buttonText: currentPlan === 'master' ? 'TU PLAN ACTUAL' : 'SELECCIONAR MASTER',
      disabled: currentPlan === 'master'
    }
  ]

  const handleSelectPlan = (planId) => {
    if (planId !== currentPlan) {
      if (onSelectPlan) {
        onSelectPlan(planId)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Elige tu nivel de <span className="text-red-800">crecimiento.</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personaliza tu experiencia financiera y maximiza tus rendimientos
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setBillingPeriod('semi')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              billingPeriod === 'semi' 
                ? 'bg-red-800 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            % AHORRA 10% SEMESTRAL
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 ${
              billingPeriod === 'annual' 
                ? 'bg-amber-400 text-red-900' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Star className="w-4 h-4" />
            AHORRA 20% ANUAL
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrent = currentPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.recommended ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-red-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MÁS POPULAR
                    </div>
                  </div>
                )}

                {/* Card Header - Amber/Yellow */}
                <div className="bg-amber-400 p-6">
                  <p className="text-red-900/70 text-xs font-bold tracking-wider mb-1">{plan.tier}</p>
                  <h3 className="text-xl font-bold text-red-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-red-900">{plan.price}</span>
                    {plan.period && (
                      <span className="ml-2 text-red-900/70 text-sm">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Card Body - Red/Dark */}
                <div className="bg-red-900 p-6">
                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-red-900" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <X className="w-3 h-3 text-white/50" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-white' : 'text-white/50'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={plan.disabled}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                      plan.disabled
                        ? 'bg-white/20 text-white/50 cursor-not-allowed'
                        : plan.recommended
                        ? 'bg-amber-400 text-red-900 hover:bg-amber-300 hover:shadow-lg'
                        : 'bg-white text-red-900 hover:bg-gray-100 hover:shadow-lg'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Editorial Commitment */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-800">
            <h3 className="text-lg font-bold text-gray-900 mb-2">COMPROMISO EDITORIAL</h3>
            <p className="text-gray-600 text-sm">
              TOMIN se compromete a mantener los más altos estándares de seguridad bancaria. 
              Tu información y tus ahorros están protegidos con encriptación de grado militar.
            </p>
          </div>

          {/* Right - Security Card */}
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-gray-900" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">
                Tu seguridad es nuestra prioridad número uno.
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
