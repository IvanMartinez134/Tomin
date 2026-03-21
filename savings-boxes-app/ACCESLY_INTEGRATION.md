# 🔐 Guía de Integración de Accesly

Este documento proporciona una guía detallada para integrar Accesly en la aplicación Savings Boxes.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:
- [ ] SDK/API key de Accesly (si es necesario)
- [ ] Documentación oficial de Accesly
- [ ] Acceso a la red Stellar Testnet

## 📂 Archivos a Modificar

### 1. `src/services/WalletService.js` (Principal)

Este es el archivo más importante para la integración. Contiene placeholders listos.

#### Función: `initializeAccesly()`

```javascript
export const initializeAccesly = async () => {
  try {
    // TODO: Reemplazar con código real de Accesly

    // Ejemplo esperado:
    // import Accesly from '@accesly/sdk';
    // const accesly = new Accesly({
    //   network: 'testnet',
    //   apiKey: import.meta.env.VITE_ACCESLY_API_KEY
    // });
    // await accesly.init();
    // walletState.acceslyInstance = accesly;

    return true;
  } catch (error) {
    console.error('Error inicializando Accesly:', error);
    throw error;
  }
};
```

#### Función: `loginWithAccesly()`

```javascript
export const loginWithAccesly = async () => {
  try {
    // TODO: Reemplazar con código real de Accesly

    // Ejemplo esperado:
    // const result = await walletState.acceslyInstance.login();
    //
    // walletState.isConnected = true;
    // walletState.publicKey = result.publicKey;
    // walletState.address = result.address;

    // return {
    //   publicKey: result.publicKey,
    //   address: result.address,
    // };

    // ACTUALMENTE: Devuelve datos mock
    const mockPublicKey = 'GABC...XYZ';
    const mockAddress = 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    walletState.isConnected = true;
    walletState.publicKey = mockPublicKey;
    walletState.address = mockAddress;

    return {
      publicKey: mockPublicKey,
      address: mockAddress,
    };
  } catch (error) {
    console.error('Error en login con Accesly:', error);
    throw error;
  }
};
```

#### Función: `signTransactionWithAccesly(xdr)`

```javascript
export const signTransactionWithAccesly = async (xdr) => {
  try {
    // TODO: Reemplazar con código real de Accesly

    // Ejemplo esperado:
    // const signedXdr = await walletState.acceslyInstance.signTransaction(xdr);
    // return signedXdr;

    // ACTUALMENTE: Devuelve el mismo XDR (sin firma real)
    console.log('✍️ [PLACEHOLDER] Firmando transacción...');
    return xdr;
  } catch (error) {
    console.error('Error firmando transacción:', error);
    throw error;
  }
};
```

### 2. Variables de Entorno (opcional)

Si Accesly requiere API keys u otra configuración, crea un archivo `.env` en la raíz:

```env
# .env
VITE_ACCESLY_API_KEY=your_api_key_here
VITE_ACCESLY_NETWORK=testnet
```

Luego accede a ellas:
```javascript
const apiKey = import.meta.env.VITE_ACCESLY_API_KEY;
```

## 🔄 Flujo de Autenticación

```
┌─────────────────────┐
│  Usuario hace clic  │
│  "Conectar Accesly" │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  LoginButton.jsx    │
│  llama connect()    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  WalletContext.jsx  │
│  ejecuta connect()  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  WalletService.js    │
│  loginWithAccesly()  │ ← 🔧 AQUÍ INTEGRAS ACCESLY
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Accesly SDK         │
│  autentica usuario   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Devuelve:           │
│  - publicKey         │
│  - address           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Estado actualizado  │
│  en WalletContext    │
└──────────────────────┘
```

## 🔗 Flujo de Transacciones

```
┌─────────────────────┐
│  Usuario deposita   │
│  en una caja        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  DepositModal.jsx   │
│  handleDeposit()    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  SorobanService.js  │
│  createDeposit...() │ ← Crea XDR sin firmar
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  WalletContext.jsx   │
│  signTransaction()   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  WalletService.js    │
│  signTransactionW... │ ← 🔧 AQUÍ FIRMAS CON ACCESLY
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Accesly SDK         │
│  firma el XDR        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  SorobanService.js   │
│  submitTransaction() │ ← Envía a Stellar
└──────────────────────┘
```

## 🧪 Testing de la Integración

### Paso 1: Conexión Básica

```javascript
// Test manual en la consola del navegador
import * as WalletService from './services/WalletService';

// Inicializar
await WalletService.initializeAccesly();

// Login
const result = await WalletService.loginWithAccesly();
console.log('Connected:', result.address);
```

### Paso 2: Firma de Transacción

```javascript
// Test de firma
const dummyXDR = 'AAAAAgAAAAD...'; // XDR de prueba
const signedXDR = await WalletService.signTransactionWithAccesly(dummyXDR);
console.log('Signed XDR:', signedXDR);
```

### Paso 3: Flujo Completo

1. Inicia la app: `npm run dev`
2. Abre DevTools Console
3. Click en "Conectar con Accesly"
4. Verifica que se muestre tu dirección
5. Intenta crear una caja y depositar
6. Verifica logs en consola

## ⚠️ Errores Comunes

### Error: "Accesly is not defined"
**Solución:** Asegúrate de instalar el SDK: `npm install @accesly/sdk`

### Error: "Cannot read property 'login' of undefined"
**Solución:** Verifica que `initializeAccesly()` se ejecute antes de `loginWithAccesly()`

### Error: "Invalid XDR"
**Solución:** Verifica que la transacción se esté construyendo correctamente en `SorobanService.js`

### Error: "Network mismatch"
**Solución:** Asegúrate de que Accesly y Stellar SDK usen la misma red (testnet)

## 📚 Recursos Útiles

- [Accesly Documentation](#) - TODO: Agregar link real
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Soroban Docs](https://soroban.stellar.org/)

## ✅ Checklist de Integración

- [ ] Instalar SDK de Accesly
- [ ] Implementar `initializeAccesly()`
- [ ] Implementar `loginWithAccesly()`
- [ ] Implementar `signTransactionWithAccesly()`
- [ ] Configurar variables de entorno (si es necesario)
- [ ] Testing: Conexión de wallet
- [ ] Testing: Firma de transacciones
- [ ] Testing: Flujo completo de depósito
- [ ] Manejo de errores y casos edge
- [ ] UI feedback para usuario (loading, errores, éxito)

## 💡 Tips

1. **Logs en Desarrollo**: Los placeholders actuales tienen logs útiles. Mantenlos durante el desarrollo.

2. **Estado del Wallet**: El estado se maneja en `walletState` dentro de `WalletService.js` y se propaga a través de `WalletContext`.

3. **Desconexión**: Si Accesly tiene un método de logout, agrégalo en `disconnectWallet()`.

4. **Persistencia**: Considera usar `localStorage` para recordar la sesión del usuario.

5. **Testing con Mock**: Puedes mantener los mocks para testing y usar una flag de entorno:
   ```javascript
   const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
   ```

## 🎯 Resultado Final

Una vez integrado Accesly correctamente, el usuario podrá:
- ✅ Conectar su wallet con Accesly sin configuración manual
- ✅ Ver su dirección Stellar en la UI
- ✅ Firmar transacciones con su wallet de Accesly
- ✅ Depositar en cajas de ahorro con transacciones reales
- ✅ Ver saldos y rendimientos reales

## 🆘 Soporte

Si tienes problemas con la integración:
1. Revisa la documentación oficial de Accesly
2. Verifica los logs en la consola del navegador
3. Asegúrate de que la red Stellar Testnet esté funcionando
4. Contacta al soporte de Accesly si es necesario

---

**¡Buena suerte con la integración!** 🚀
