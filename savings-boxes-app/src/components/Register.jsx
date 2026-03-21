import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Globe, DollarSign, ArrowRight, Shield, Award, User, Phone } from 'lucide-react'

export default function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !acceptTerms) return
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    onRegister({ email: formData.email, name: formData.name })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-900 flex-col items-center justify-center relative px-8">
        {/* Logo */}
        <div className="w-40 h-40 bg-red-800 rounded-full flex flex-col items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-red-700">
          <span className="text-white text-2xl font-bold tracking-wider mb-2">TOMIN</span>
          <div className="relative">
            <Globe className="w-14 h-14 text-white" strokeWidth={1.5} />
            <DollarSign className="w-5 h-5 text-amber-400 absolute -top-1 -left-4 animate-pulse" />
            <DollarSign className="w-5 h-5 text-amber-400 absolute -top-1 -right-4 animate-pulse" />
          </div>
        </div>
        <p className="text-white text-center text-lg font-light mb-16">
          Tu salud financiera siempre protegida
        </p>

        {/* Security Badges */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 px-8">
          <div className="flex items-center gap-2 text-red-200 text-sm">
            <Shield className="w-5 h-5" />
            <span>Encriptación AES-256</span>
          </div>
          <div className="flex items-center gap-2 text-red-200 text-sm">
            <Award className="w-5 h-5" />
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-red-900 rounded-full flex flex-col items-center justify-center mb-4">
              <span className="text-white text-lg font-bold tracking-wider mb-1">TOMIN</span>
              <div className="relative">
                <Globe className="w-8 h-8 text-white" strokeWidth={1.5} />
                <DollarSign className="w-3 h-3 text-amber-400 absolute -top-0.5 -left-2" />
                <DollarSign className="w-3 h-3 text-amber-400 absolute -top-0.5 -right-2" />
              </div>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-gray-600 mb-8">
            Comienza a hacer crecer tu dinero hoy mismo
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="María González"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="55 1234 5678"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all duration-200"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Debe tener al menos 8 caracteres, 1 número y 1 símbolo
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-red-900 border-gray-300 rounded focus:ring-red-900"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los{' '}
                <button type="button" className="text-red-900 hover:text-red-700">términos y condiciones</button>
                {' '}y la{' '}
                <button type="button" className="text-red-900 hover:text-red-700">política de privacidad</button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all duration-200 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-8 text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-red-900 font-semibold hover:text-red-700 transition-colors"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
