/**
 * mockData.js
 * Datos simulados para el MVP del Hackathon
 */

// Cajas de ahorro de ejemplo
export const mockSavingsBoxes = [
  {
    id: 'box-001',
    name: 'Vacaciones 2026',
    emoji: '🏖️',
    goal: 5000,
    currentBalance: 1250.50,
    createdAt: '2026-01-15',
    color: 'from-blue-500 to-cyan-500',
    vaultId: 'vault-defindex-001',
    apy: 8.5,
  },
  {
    id: 'box-002',
    name: 'Fondo de Emergencia',
    emoji: '🚨',
    goal: 10000,
    currentBalance: 3780.25,
    createdAt: '2025-11-20',
    color: 'from-red-500 to-orange-500',
    vaultId: 'vault-defindex-002',
    apy: 8.5,
  },
  {
    id: 'box-003',
    name: 'Nueva Laptop',
    emoji: '💻',
    goal: 2000,
    currentBalance: 450.75,
    createdAt: '2026-02-01',
    color: 'from-purple-500 to-pink-500',
    vaultId: 'vault-defindex-003',
    apy: 8.5,
  },
];

// Historial de transacciones de ejemplo
export const mockTransactions = [
  {
    id: 'tx-001',
    boxId: 'box-001',
    type: 'deposit',
    amount: 500,
    date: '2026-03-15',
    hash: 'abc123...',
  },
  {
    id: 'tx-002',
    boxId: 'box-002',
    type: 'deposit',
    amount: 1000,
    date: '2026-03-10',
    hash: 'def456...',
  },
  {
    id: 'tx-003',
    boxId: 'box-001',
    type: 'yield',
    amount: 12.50,
    date: '2026-03-12',
    hash: 'ghi789...',
  },
];

// Configuración de APY (Annual Percentage Yield)
export const APY_CONFIG = {
  base: 8.5, // 8.5% APY base
  updateIntervalMs: 5000, // Actualizar cada 5 segundos para la demo
  dailyRate: 8.5 / 365 / 100, // Tasa diaria
  demoMultiplier: 1000, // Multiplicador para demo (hace que se vea el crecimiento rápido)
};

// Emojis disponibles para personalizar cajas
export const availableEmojis = [
  '🏖️', '🚨', '💻', '🏠', '🚗', '🎓', '💍', '🎮',
  '📱', '✈️', '🎸', '📷', '🏋️', '🎨', '📚', '🎭',
  '🌟', '💰', '🎯', '🔥', '⚡', '🌈', '🎁', '🏆',
];

// Colores de gradiente disponibles
export const availableColors = [
  { name: 'Azul', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Rojo', gradient: 'from-red-500 to-orange-500' },
  { name: 'Morado', gradient: 'from-purple-500 to-pink-500' },
  { name: 'Verde', gradient: 'from-green-500 to-emerald-500' },
  { name: 'Amarillo', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'Índigo', gradient: 'from-indigo-500 to-purple-500' },
];

// Información de DeFindex y Blend Capital (para mostrar en UI)
export const protocolInfo = {
  defindex: {
    name: 'DeFindex',
    description: 'Protocolo de índices descentralizados en Stellar',
    tvl: '2,500,000',
  },
  blend: {
    name: 'Blend Capital',
    description: 'Protocolo de lending descentralizado',
    tvl: '5,000,000',
    apy: '8.5%',
  },
};
