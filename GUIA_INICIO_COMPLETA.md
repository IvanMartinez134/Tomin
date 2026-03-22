# 🚀 Guía Completa de Inicio - Tomin DeFi App

## 📱 1. Iniciar la Aplicación

### 🎨 Frontend (React + Vite)

```bash
# Navegar al directorio del frontend
cd savings-boxes-app

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar en modo desarrollo
npm run dev

# Otros comandos útiles:
npm run build    # Compilar para producción
npm run preview  # Vista previa de build de producción
npm run lint     # Verificar código con ESLint
```

**URL:** http://localhost:5173 (Vite development server)

### 🔧 Backend (Express + SQLite)

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor (necesitas agregar el script)
node server.js
# O agrega en package.json: "start": "node server.js"
```

**URL:** http://localhost:3001 (API endpoints)

**Datos de prueba:**
- Email: `test@tomin.com`
- Password: `password123`

---

## 🏗️ 2. Smart Contracts (Soroban/Stellar)

### 📦 Prerrequisitos

```bash
# Instalar Stellar CLI y Rust
curl --proto '=https' --tlsv1.2 -sSf https://install.stellar.org | sh

# Verificar instalación
stellar --version
```

### 🔨 Compilar Contratos

```bash
# Navegar al directorio de contratos
cd tomin-contracts

# Compilar todos los contratos
stellar contract build

# Compilar contrato específico
cd contracts/tomin-vault
stellar contract build
```

### 🚀 Deploy en Testnet

```bash
# Configurar network (solo primera vez)
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generar identidad (solo primera vez)
stellar keys generate --global alice --network testnet

# Obtener testnet tokens
stellar keys fund alice --network testnet

# Deploy del contrato
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tomin_vault.wasm \
  --source alice \
  --network testnet

# Inicializar contrato
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source alice \
  --network testnet \
  -- __constructor \
  --admin <ADMIN_ADDRESS> \
  --cetes_vault CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY \
  --usdc_token CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT \
  --commission_rate 1000
```

---

## 🔍 3. Verificación en Testnet Stellar

### 🌟 Stellar Expert (Principal)

**URL:** https://stellar.expert/explorer/testnet

📍 **Verificar Contratos:**
1. Ir a la sección "Contracts"
2. Buscar por Contract ID
3. Ver: código WASM, invocaciones, storage

📍 **Verificar Wallets:**
1. Buscar por dirección Stellar (GD...)
2. Ver: balance, historial, tokens
3. Ejemplo: `GD6WW5V9U4UMNH42OGHGRU3LCZPYKXHCL7D2HGPVQGHASH3REF6QROAU`

### 🛠️ Herramientas Alternativas

#### 1. StellarChain.io
```
https://testnet.stellarchain.io
- Explorer más visual
- Mejor para principiantes
```

#### 2. Stellar CLI (Línea de comandos)
```bash
# Ver balance de cuenta
stellar keys address alice --network testnet

# Ver detalles de cuenta
stellar account get-details alice --network testnet

# Ver contratos deployados
stellar contract id wasm --wasm target/wasm32-unknown-unknown/release/tomin_vault.wasm

# Invocar función de solo lectura
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source alice \
  --network testnet \
  -- get_balance \
  --user <USER_ADDRESS>
```

#### 3. Freighter Wallet (Browser)
```
- Instalar extensión Freighter
- Cambiar a Testnet
- Ver transacciones y contratos
```

---

## 📋 4. Direcciones de Contratos DeFindex (Testnet)

### 🏛️ CETES Vault (Principal)
```
Contract ID: CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY
Strategy:    CD2N7YAPXRPZX6L5JJZXJ6TE5B6IXEX5FYBZMB2ZOTYFZYN5VHI5ZOF2
```

### 💰 Tokens Principales
```
USDC: CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT
XLM:  Nativo (no contract needed)
```

### 🔗 Enlaces de Verificación Rápida
```bash
# Ver CETES Vault
https://stellar.expert/explorer/testnet/contract/CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY

# Ver USDC Token
https://stellar.expert/explorer/testnet/asset/USDC-CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT

# Ver cualquier dirección wallet
https://stellar.expert/explorer/testnet/account/<STELLAR_ADDRESS>
```

---

## 🛡️ 5. Testing & Debugging

### 🧪 Tests de Contratos
```bash
cd tomin-contracts/contracts/tomin-vault

# Ejecutar tests
cargo test

# Tests con logs detallados
cargo test -- --nocapture
```

### 🔄 Reinicio Completo (Manual Test)
```bash
# 1. Parar todo
# Ctrl+C en todas las terminales

# 2. Limpiar y reiniciar
cd backend && node server.js &
cd savings-boxes-app && npm run dev &

# 3. Recompilar contratos si es necesario
cd tomin-contracts && stellar contract build
```

---

## 📱 6. Flujo de Usuario Completo

1. **Usuario conecta wallet** (Freighter/Accesly)
2. **Frontend** obtiene dirección Stellar
3. **Backend** crea/autentica usuario automáticamente
4. **Frontend** muestra dashboard con cajas
5. **Usuario deposita** → **Smart Contract** invierte en DeFindex
6. **Tomin cobra comisión** solo sobre ganancias
7. **Usuario retira** fondos + rendimientos

---

## 🆘 Troubleshooting

### ❌ Problemas Comunes

**Frontend no inicia:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend no conecta:**
```bash
# Verificar puerto 3001 disponible
netstat -an | findstr 3001
```

**Contract deploy falla:**
```bash
# Verificar balance de testnet
stellar keys fund alice --network testnet

# Verificar network configurada
stellar network list
```

**Wallet no aparece en explorer:**
```bash
# Verificar que tiene fondos XLM mínimos
# Todas las cuentas Stellar necesitan 0.5 XLM mínimo
```

---

## 📞 Comandos de Verificación Rápida

```bash
# ✅ Verificar que todo funciona
curl http://localhost:3001/api/boxes?userId=1
stellar account get-details alice --network testnet
```

**¡Todo listo para usar Tomin DeFi! 🎉**