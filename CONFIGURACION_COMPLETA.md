# 🚀 Configuración Completa - Smart Contracts Tomin

## 📦 1. Instalación de Freighter Wallet

### Paso 1: Instalar extensión
1. Ve a: https://freighter.app/
2. Haz clic en "Add to Chrome" (o tu navegador)
3. Instala la extensión desde la tienda oficial

### Paso 2: Crear wallet
1. Abre Freighter (icono en la barra del navegador)
2. Selecciona "Create new wallet"
3. **GUARDA TU FRASE SEMILLA** (12 palabras) - muy importante
4. Confirma la frase semilla
5. Crea una contraseña segura

## 🌐 2. Configurar Red Testnet

### Paso 1: Cambiar a Testnet
1. Abre Freighter
2. Haz clic en el menú (3 líneas horizontales)
3. Ve a "Settings" → "Preferences"
4. Cambia "Network" de "Mainnet" a **"Testnet"**
5. Guarda los cambios

### Paso 2: Obtener dirección de testnet
1. En Freighter, copia tu dirección pública (comienza con G...)
2. **Guarda esta dirección** - la necesitaremos

## 💰 3. Obtener Fondos de Testnet

### XLM Testnet (para fees)
1. Ve a: https://laboratory.stellar.org/#account-creator?network=test
2. Pega tu dirección de Freighter
3. Haz clic en "Create Account"
4. Recibirás 10,000 XLM testnet automáticamente

### USDC Testnet (para transacciones)
```bash
# Usar Stellar CLI para agregar USDC trustline y fondos
stellar keys generate alice --network testnet
stellar keys address alice

# Agregar trustline para USDC testnet
stellar contract invoke \
  --id CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT \
  --source alice \
  --network testnet \
  -- \
  mint \
  --to [TU_DIRECCION_FREIGHTER] \
  --amount 100000000
```

## 🔧 4. Desplegar Smart Contracts (Stellar Lab)

### Paso 1: Preparar archivos WASM
```bash
cd tomin-contracts/contracts/tomin-vault
stellar contract build
```

### Paso 2: Usar Stellar Lab Web
1. Ve a: https://laboratory.stellar.org/
2. Selecciona "Testnet" en la esquina superior derecha
3. Ve a "Deploy a Contract"
4. Sube el archivo WASM generado: `target/wasm32-unknown-unknown/release/tomin_vault.wasm`

### Paso 3: Obtener Contract IDs
- **TOMIN_VAULT**: Se generará al desplegar
- **DEFINDEX_CETES**: `CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY`
- **USDC_TOKEN**: `CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT`

## ⚙️ 5. Configurar Variables de Entorno

### Archivo .env (frontend)
```bash
# En savings-boxes-app/.env
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC=https://soroban-testnet.stellar.org
VITE_TOMIN_CONTRACT_ID=[TU_CONTRACT_ID_GENERADO]
VITE_ACCESLY_APP_ID=tu_app_id_actual
```

## 🧪 6. Verificar Configuración

### Paso 1: Verificar Freighter
1. Ve a http://localhost:5180
2. Entra a la app (login con test@tomin.com / password123)
3. Ve a "SMART CONTRACTS"
4. Haz clic en "Conectar Wallet"
5. Debe aparecer popup de Freighter

### Paso 2: Verificar balances
```javascript
// En la consola del navegador
window.freighter.getAddress().then(address => {
  console.log('Dirección:', address);
});
```

### Paso 3: Test de depósito
1. En ContractTester, ingresa monto pequeño (ej: 1 USDC)
2. Haz clic en "Depositar"
3. Confirma la transacción en Freighter
4. Verifica que el balance se actualice

## 🚨 Solución de Problemas Comunes

### Error: "Freighter no encontrado"
- Reinstala la extensión Freighter
- Refresca la página
- Verifica que esté habilitada en el navegador

### Error: "Red incorrecta"
- Verifica que Freighter esté en "Testnet"
- Reinicia Freighter
- Limpia caché del navegador

### Error: "Fondos insuficientes"
- Verifica balance XLM en Freighter (necesitas ~1 XLM para fees)
- Solicita más XLM en el Account Creator
- Verifica trustline de USDC

### Error: "Contract no encontrado"
- Verifica que el Contract ID sea correcto
- Redespliega el contrato si es necesario
- Verifica que estés en la red correcta

## ✅ Lista de Verificación Final

- [ ] Freighter instalado y funcionando
- [ ] Red configurada en Testnet
- [ ] Fondos XLM disponibles (>1 XLM)
- [ ] Trustline USDC configurada
- [ ] Smart contract desplegado
- [ ] Variables de entorno configuradas
- [ ] Aplicación conecta con Freighter
- [ ] Transacciones de prueba funcionan

## 🎯 Próximos Pasos

Una vez completada esta configuración:
1. Prueba depositar 1 USDC
2. Verifica balance en Tomin
3. Prueba retirar fondos
4. Verifica integración con DeFindex CETES

---

**🆘 ¿Necesitas ayuda?**
Si encuentras algún problema, comparte:
- Screenshot del error
- Mensaje de consola del navegador (F12 → Console)
- Estado actual de Freighter (red, balance)