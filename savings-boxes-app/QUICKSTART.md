# ⚡ Quick Start - Savings Boxes MVP

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Instalación

```bash
cd savings-boxes-app
npm install
npm run dev
```

✅ La aplicación estará en: **http://localhost:5173**

### 2️⃣ ¿Qué verás?

1. **Pantalla de Bienvenida** con botón "Conectar con Accesly"
2. Después de conectar: **Dashboard** con 3 cajas de ahorro de ejemplo
3. **Balances aumentando en tiempo real** (simulador de APY activado)

### 3️⃣ Funcionalidades para Probar

✅ **Conectar Wallet** → Click en "Conectar con Accesly" (usa mock data por ahora)
✅ **Ver Cajas** → Dashboard muestra 3 cajas pre-creadas
✅ **Crear Nueva Caja** → Click en "Nueva Caja", personaliza y crea
✅ **Depositar** → Click en "Depositar" en cualquier caja, ingresa monto
✅ **Ver Rendimiento** → Observa cómo los balances incrementan automáticamente

### 4️⃣ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 5173)
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar linter
```

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `src/services/WalletService.js` | 🔧 **INTEGRAR ACCESLY AQUÍ** |
| `src/services/SorobanService.js` | Funciones para Soroban/Stellar |
| `src/data/mockData.js` | Datos simulados, APY config |
| `src/components/Dashboard.jsx` | Vista principal |
| `ACCESLY_INTEGRATION.md` | Guía detallada de integración |

## 🔧 Próximos Pasos de Integración

### Paso 1: Instalar SDK de Accesly
```bash
npm install @accesly/sdk
# Consulta documentación oficial para el paquete correcto
```

### Paso 2: Actualizar WalletService.js

Busca los comentarios `// TODO:` y reemplaza con código real de Accesly:

```javascript
// src/services/WalletService.js

// TODO: Importar SDK
import Accesly from '@accesly/sdk';

// TODO: Inicializar
export const initializeAccesly = async () => {
  const accesly = new Accesly({ network: 'testnet' });
  await accesly.init();
  return accesly;
};

// TODO: Login
export const loginWithAccesly = async () => {
  const result = await accesly.login();
  return {
    publicKey: result.publicKey,
    address: result.address,
  };
};

// TODO: Firmar
export const signTransactionWithAccesly = async (xdr) => {
  const signedXdr = await accesly.signTransaction(xdr);
  return signedXdr;
};
```

### Paso 3: Actualizar Direcciones de Contratos

```javascript
// src/services/SorobanService.js

const CONTRACT_ADDRESSES = {
  SAVINGS_VAULT: 'TU_DIRECCIÓN_AQUÍ',
  DEFINDEX: 'TU_DIRECCIÓN_AQUÍ',
  BLEND_CAPITAL: 'TU_DIRECCIÓN_AQUÍ',
};
```

## 🎨 Personalización Rápida

### Cambiar APY de Simulación

```javascript
// src/data/mockData.js
export const APY_CONFIG = {
  base: 8.5,              // Cambiar % de APY
  updateIntervalMs: 5000, // Frecuencia de actualización (ms)
  demoMultiplier: 1000,   // Velocidad de demo (mayor = más rápido)
};
```

### Agregar Más Emojis

```javascript
// src/data/mockData.js
export const availableEmojis = [
  '🏖️', '🚨', '💻', '🏠', '🚗', '🎓',
  // Agrega más aquí
];
```

### Cambiar Colores

```javascript
// src/data/mockData.js
export const availableColors = [
  { name: 'Tu Color', gradient: 'from-red-500 to-pink-500' },
  // Agrega más aquí
];
```

## ⚠️ Troubleshooting

### Error: `EADDRINUSE: address already in use`
**Solución:** Puerto 5173 ocupado. Cambia en `vite.config.js` o mata el proceso:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Error: Tailwind styles not loading
**Solución:** Verifica que `index.css` tenga las directivas de Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Error: Module not found
**Solución:** Reinstala dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Estado del Proyecto

### ✅ Completado
- [x] Configuración de Vite + React + Tailwind
- [x] Componentes UI responsivos (mobile-first)
- [x] Sistema de cajas de ahorro
- [x] Simulador de rendimiento APY
- [x] Modals para crear cajas y depositar
- [x] Context de React para wallet
- [x] Placeholders para Accesly
- [x] Servicios para Soroban

### 🔧 Pendiente (Integración Real)
- [ ] SDK de Accesly instalado
- [ ] Login real con Accesly
- [ ] Firma de transacciones con Accesly
- [ ] Contratos Soroban desplegados
- [ ] Transacciones reales en Stellar Testnet
- [ ] Integración con DeFindex/Blend APIs

## 🎯 Para el Demo del Hackathon

### Lo que funciona AHORA:
1. ✅ UI completa y funcional
2. ✅ Flujo visual de usuario completo
3. ✅ Simulación de rendimiento en tiempo real
4. ✅ Creación y gestión de cajas
5. ✅ Responsive design (mobile-first)

### Lo que necesitas integrar:
1. 🔧 Conexión real con Accesly
2. 🔧 Contratos Soroban desplegados
3. 🔧 Transacciones reales en testnet

## 📚 Documentación Adicional

- **README.md** - Documentación completa del proyecto
- **ACCESLY_INTEGRATION.md** - Guía paso a paso para Accesly
- **package.json** - Dependencias y scripts

## 🆘 Ayuda Rápida

**¿La app no inicia?**
→ `rm -rf node_modules package-lock.json && npm install`

**¿Cómo integrar Accesly?**
→ Lee `ACCESLY_INTEGRATION.md`

**¿Cómo cambiar el APY?**
→ Edita `src/data/mockData.js`

**¿Cómo agregar más cajas de ejemplo?**
→ Agrega elementos al array en `src/data/mockData.js`

## 💡 Tips para el Hackathon

1. **Demo Primero, Código Después**: La UI ya funciona. Enfócate en integrar Accesly.

2. **Usa los Logs**: Los servicios tienen `console.log` útiles. Abre DevTools.

3. **Mock Data es tu Amigo**: Puedes demostrar el concepto sin blockchain funcionando.

4. **Mobile Preview**: Prueba en mobile con DevTools (Cmd+Shift+M / Ctrl+Shift+M)

5. **Datos Persistentes**: Considera agregar `localStorage` para no perder cajas al recargar.

---

## 🎉 ¡Listo para Hackear!

Tienes un MVP funcional con:
- ✨ UI bella y responsiva
- 📦 Arquitectura limpia y separada
- 🔧 Placeholders listos para integración
- 📈 Simulación visual impresionante

**¡Ahora integra Accesly y gana el Hackathon!** 🚀

---

**Comandos Esenciales:**

```bash
# Iniciar desarrollo
npm run dev

# Build
npm run build

# Si algo falla
rm -rf node_modules package-lock.json && npm install
```

**URL del proyecto:** http://localhost:5173

**Contacto:** [Tu nombre/email para el equipo]
