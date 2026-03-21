# 🌟 Savings Boxes - MVP Hackathon

MVP de una aplicación de "Cajas de Ahorro" conectada a **DeFindex** y **Blend Capital** en la red **Stellar (Soroban)**.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS
- **Blockchain**: Stellar SDK (@stellar/stellar-sdk)
- **Red**: Stellar Testnet
- **Wallet**: Accesly (placeholders listos para integración)
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# 1. Clonar o navegar al directorio del proyecto
cd savings-boxes-app

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── Dashboard.jsx       # Vista principal con las cajas
│   ├── SavingsBox.jsx      # Componente individual de caja
│   ├── CreateBoxModal.jsx  # Modal para crear cajas
│   ├── DepositModal.jsx    # Modal para depositar
│   └── LoginButton.jsx     # Botón de conexión con Accesly
├── context/
│   └── WalletContext.jsx   # Context de React para el wallet
├── services/
│   ├── WalletService.js    # 🔧 PLACEHOLDER - Integración Accesly
│   └── SorobanService.js   # Funciones para Soroban/Stellar
├── data/
│   └── mockData.js         # Datos simulados para el MVP
├── hooks/
│   └── useYieldSimulator.js # Hook para simular APY en tiempo real
├── App.jsx                 # Componente principal
├── main.jsx                # Punto de entrada
└── index.css               # Estilos globales con Tailwind
```

## 🔑 Características Implementadas

### ✅ Listo para usar:
- ✨ Interfaz mobile-first con Tailwind CSS
- 📱 Dashboard responsivo con stats en tiempo real
- 💰 Creación de cajas de ahorro personalizadas
- 📈 Simulador visual de rendimiento (APY)
- 🎨 Personalización de cajas (emojis y colores)
- 📊 Vista de progreso hacia metas

### 🔧 Placeholders para integrar:
- 🔐 Conexión con Accesly (WalletService.js)
- ✍️ Firma de transacciones con Accesly
- 🔗 Invocación real de contratos Soroban
- 💸 Transacciones reales en Stellar Testnet

## 🔌 Integración de Accesly

### Archivos a actualizar:

**`src/services/WalletService.js`**
Este archivo contiene placeholders marcados con `TODO:` para integrar Accesly:

```javascript
// TODO: Inicializar Accesly
export const initializeAccesly = async () => { ... }

// TODO: Login con Accesly
export const loginWithAccesly = async () => { ... }

// TODO: Firmar transacciones
export const signTransactionWithAccesly = async (xdr) => { ... }
```

### Pasos para integrar:

1. **Instalar SDK de Accesly:**
   ```bash
   npm install @accesly/sdk
   # o el paquete correcto según documentación
   ```

2. **Actualizar `WalletService.js`:**
   - Importa el SDK de Accesly
   - Implementa `loginWithAccesly()` según la documentación
   - Implementa `signTransactionWithAccesly(xdr)` para firma de transacciones

3. **Variables de entorno (opcional):**
   Crea un archivo `.env` si necesitas configuración:
   ```env
   VITE_ACCESLY_API_KEY=tu_api_key
   VITE_STELLAR_NETWORK=testnet
   ```

## 🎮 Uso de la Aplicación

### Flujo de Uso:

1. **Conectar Wallet:**
   - Click en "Conectar con Accesly"
   - Se mostrará una wallet simulada (actualizar con Accesly real)

2. **Crear Caja de Ahorro:**
   - Click en "Nueva Caja"
   - Personaliza: nombre, meta, emoji, color
   - Confirma creación

3. **Depositar Fondos:**
   - Select "Depositar" en una caja
   - Ingresa cantidad
   - Se preparará transacción Soroban → firma → envío

4. **Ver Rendimiento:**
   - El balance incrementa visualmente según APY
   - Simulador activo cada 5 segundos (configurable en `mockData.js`)

## 🎨 Personalización

### Cambiar APY y velocidad de simulación:
**`src/data/mockData.js`**
```javascript
export const APY_CONFIG = {
  base: 8.5,              // APY base en %
  updateIntervalMs: 5000, // Actualizar cada 5 seg
  demoMultiplier: 1000,   // Velocidad de demo
};
```

### Agregar más emojis o colores:
**`src/data/mockData.js`**
```javascript
export const availableEmojis = ['🏖️', '🚨', '💻', ...];
export const availableColors = [
  { name: 'Azul', gradient: 'from-blue-500 to-cyan-500' },
  // Agrega más...
];
```

## 🔗 Contratos Soroban

**`src/services/SorobanService.js`**
```javascript
const CONTRACT_ADDRESSES = {
  SAVINGS_VAULT: 'CCCC...', // TODO: Actualizar con dirección real
  DEFINDEX: 'DDDD...',      // TODO: Actualizar
  BLEND_CAPITAL: 'BBBB...', // TODO: Actualizar
};
```

Actualiza estas direcciones con los contratos desplegados en Stellar Testnet.

## 📱 Mobile-First Design

La aplicación prioriza experiencia móvil:
- Diseño responsivo con breakpoints
- Modals optimizados para pantallas pequeñas
- Botones y textos adaptados a touch
- Stats cards en grid responsivo

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🚀 Próximos Pasos (Post-Hackathon)

- [ ] Integrar Accesly SDK real
- [ ] Desplegar contratos Soroban en testnet
- [ ] Conectar con APIs de DeFindex y Blend Capital
- [ ] Implementar retiros (withdraw)
- [ ] Agregar historial de transacciones
- [ ] Persistencia de datos (localStorage o backend)
- [ ] Notificaciones de transacciones
- [ ] Gráficos de rendimiento histórico

## 📝 Notas Importantes

- **Datos Mockeados**: Todas las cajas y transacciones son simuladas
- **Red Testnet**: Configurado para Stellar Testnet
- **Placeholders**: WalletService.js tiene funciones placeholder listas para Accesly
- **APY Simulado**: El rendimiento se simula visualmente para la demo

## 🤝 Contribuir

Este es un MVP para hackathon. Para contribuir:
1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - libre para usar y modificar

## 🌐 Links Útiles

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/)
- [DeFindex](https://defindex.io)
- [Blend Capital](https://blend.capital)
- [Accesly](https://accesly.io)

## 💬 Contacto

Proyecto creado para Hackathon - [Tu Nombre/Team]

---

**¡Buena suerte en el Hackathon!** 🚀

