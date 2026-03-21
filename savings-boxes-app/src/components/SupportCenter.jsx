import React, { useState } from 'react'
import { 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  Phone, 
  Shield,
  ChevronRight,
  Send,
  Wifi
} from 'lucide-react'

export default function SupportCenter() {
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  })
  const [showContactForm, setShowContactForm] = useState(false)

  const supportOptions = [
    {
      id: 'help',
      title: 'Ayuda',
      description: 'Preguntas frecuentes y tutoriales',
      icon: HelpCircle,
    },
    {
      id: 'contact',
      title: 'Contáctanos',
      description: 'Habla con un asesor especializado',
      icon: MessageSquare,
    },
    {
      id: 'report',
      title: 'Reportar un problema',
      description: 'Notifica errores técnicos o de seguridad',
      icon: AlertTriangle,
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Mensaje enviado correctamente. Te contactaremos pronto.')
    setContactForm({ subject: '', message: '' })
    setShowContactForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soporte</h1>
          <p className="text-gray-600">
            Estamos aquí para asegurar que tu experiencia financiera sea impecable.
          </p>
        </div>

        {/* Support Options */}
        <div className="space-y-4 mb-8">
          {supportOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => option.id === 'contact' && setShowContactForm(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex items-center justify-between transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-gray-500 text-sm">{option.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            )
          })}
        </div>

        {/* Emergency Button - Red Wine Color */}
        <div className="bg-red-900 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">Emergencia (Llamar)</h3>
                <span className="bg-amber-400 text-red-900 text-xs font-bold px-2 py-0.5 rounded">
                  PRIORITARIO
                </span>
              </div>
              <p className="text-white/70 text-sm">
                Asistencia inmediata 24/7 para tu cuenta
              </p>
            </div>
          </div>
          <button className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200">
            <Phone className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Footer Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-red-800" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Asistencia Personalizada</h3>
              <p className="text-gray-600 text-sm">
                TOMIN se compromete a brindarte el mejor servicio. Nuestro equipo de expertos 
                está disponible para resolver todas tus dudas y garantizar tu tranquilidad financiera.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm font-medium">ESTADO DEL SISTEMA</span>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 text-sm font-medium">
                  Todos los servicios operando normalmente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-red-900 p-6">
                <h3 className="text-xl font-bold text-white">Contáctanos</h3>
                <p className="text-white/70 text-sm">Envíanos tu mensaje</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Escribe el asunto"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Escribe tu mensaje..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-red-800 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
