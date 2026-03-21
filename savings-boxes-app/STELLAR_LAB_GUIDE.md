# 🔬 Guía: Verificar Transacciones en Stellar Lab

## 📋 Tabla de Contenidos
1. [Estado Actual de las Transacciones](#estado-actual)
2. [Verificar en Stellar Expert (Más Fácil)](#stellar-expert)
3. [Verificar en Stellar Laboratory](#stellar-laboratory)
4. [Obtener Fondos de Testnet](#fondos-testnet)
5. [Qué Verás en las Transacciones](#qué-verás)
6. [Próximo Nivel: Desplegar Contrato Real](#contrato-real)

---

## 🎯 Estado Actual de las Transacciones

### Lo que SE ESTÁ ENVIANDO ahora:
```javascript
// src/services/SorobanService.js - línea ~50
const transaction = new StellarSdk.TransactionBuilder(account, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    StellarSdk.Operation.payment({
      destination: CONTRACT_ADDRESSES.SAVINGS_VAULT,
      asset: StellarSdk.Asset.native(),
      amount: amount.toString(),
    })
  )
  .setTimeout(180)
  .build();
```

**Actualmente:** Envía un **payment** simple de XLM (no invoca contratos Soroban)

---

## 🌟 Opción 1: Stellar Expert (Recomendado - Más Fácil)

### Paso 1: Conectar tu Wallet con Accesly
```bash
cd savings-boxes-app
npm run dev
```
1. Abre http://localhost:5175
2. Click en "Connect"
3. Login o Sign up
4. **Copia tu dirección Stellar** (aparece en el header)

### Paso 2: Ver tu Cuenta en Stellar Expert
1. Abre: https://stellar.expert/explorer/testnet
2. Pega tu dirección en el buscador
3. Presiona Enter

### Paso 3: Ver Historial de Transacciones
Verás:
- **Operations**: Lista de todas las operaciones
- **Payments**: Pagos enviados/recibidos
- **Effects**: Efectos de cada transacción
- **Signers**: Firmantes de tu cuenta

### Paso 4: Hacer un Depósito y Verificar
1. En la app → Click "Depositar" en cualquier caja
2. Ingresa cantidad (ej: 10)
3. Click "Depositar"
4. Copia el **transaction hash** de la consola
5. Pega en Stellar Expert: `https://stellar.expert/explorer/testnet/tx/{TX_HASH}`

### Qué Verás:
```
Transaction: abc123...
Status: ✅ SUCCESS
Operations:
  └─ Payment
     Source: Tu dirección
     Destination: CCCCC... (simulando vault)
     Asset: XLM
     Amount: 10.0000000
```

---

## 🔬 Opción 2: Stellar Laboratory (Más Técnico)

### URL: https://laboratory.stellar.org

### 1. Ver Información de tu Cuenta

#### Paso 1: Ir a "Explore Endpoints"
1. Abre: https://laboratory.stellar.org/#explorer
2. Selecciona **"Accounts"**
3. Network: **Testnet**

#### Paso 2: Consultar tu Cuenta
1. En "Account ID" pega tu dirección de Accesly
2. Click "Submit"

#### Verás:
```json
{
  "id": "GABC123...",
  "account_id": "GABC123...",
  "sequence": "123456789",
  "balances": [
    {
      "balance": "9989.9999900",
      "asset_type": "native"
    }
  ],
  "signers": [...],
  "data": {},
  ...
}
```

### 2. Ver Transacciones de tu Cuenta

#### Paso 1: Ir a "Transactions for Account"
1. En el menú: **"Transactions for Account"**
2. Pega tu dirección
3. Click "Submit"

#### Verás:
```json
{
  "_embedded": {
    "records": [
      {
        "id": "abc123...",
        "hash": "def456...",
        "created_at": "2026-03-20T...",
        "source_account": "GABC123...",
        "fee_charged": "100",
        "operation_count": 1,
        "successful": true
      }
    ]
  }
}
```

### 3. Ver Detalles de una Transacción Específica

#### Paso 1: Ir a "Operations for Transaction"
1. Copia el **transaction hash** de la consola de tu app
2. En Laboratory: **"Operations for Transaction"**
3. Pega el hash
4. Click "Submit"

#### Verás:
```json
{
  "_embedded": {
    "records": [
      {
        "type": "payment",
        "from": "GABC123...",
        "to": "CCCCC...",
        "asset_type": "native",
        "amount": "10.0000000"
      }
    ]
  }
}
```

---

## 💰 Obtener Fondos de Testnet (Friendbot)

### Opción 1: Desde Stellar Laboratory
1. Abre: https://laboratory.stellar.org/#account-creator?network=test
2. Pega tu dirección de Accesly
3. Click "Get test network lumens"
4. Recibirás 10,000 XLM de testnet

### Opción 2: Usando Friendbot directamente
```bash
curl "https://friendbot.stellar.org?addr=TU_DIRECCION_AQUI"
```

### Verificar que Recibiste los Fondos:
1. Vuelve a Stellar Expert
2. Refresca la página
3. Verás tu nuevo balance

---

## 🔍 Qué Verás Actualmente vs. Con Contratos

### Actualmente (Payment Simple):
```json
{
  "type": "payment",
  "from": "GABC123...",        // Tu wallet
  "to": "CCCCC...",            // Dirección placeholder
  "asset_type": "native",
  "amount": "10.0000000"
}
```

### Con Soroban Smart Contract (Futuro):
```json
{
  "type": "invoke_host_function",
  "function": "HostFunctionTypeHostFunctionTypeInvokeContract",
  "parameters": [
    {
      "type": "Address",
      "value": "GABC123..."    // Tu wallet
    },
    {
      "type": "Symbol",
      "value": "deposit"        // Función del contrato
    },
    {
      "type": "I128",
      "value": "10000000"       // Cantidad (con 7 decimales)
    }
  ],
  "contract_id": "CCCCCC...",  // ID del contrato real
  "auth": [...]
}
```

---

## 🚀 Próximo Nivel: Desplegar un Smart Contract Real

Si quieres llevar esto al siguiente nivel con un contrato REAL de Soroban:

### 1. Instalar Soroban CLI
```bash
# Windows (usando WSL o Git Bash)
cargo install --locked soroban-cli

# macOS/Linux
brew install soroban-cli
```

### 2. Crear un Contrato Simple de Savings Box
```rust
// savings_box/src/lib.rs
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, Symbol};

#[contract]
pub struct SavingsBox;

#[contractimpl]
impl SavingsBox {
    // Depositar en una caja
    pub fn deposit(env: Env, user: Address, box_id: Symbol, amount: i128) -> i128 {
        let key = (user.clone(), box_id.clone());

        // Leer balance actual
        let current: i128 = env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(0);

        // Actualizar balance
        let new_balance = current + amount;
        env.storage()
            .persistent()
            .set(&key, &new_balance);

        new_balance
    }

    // Obtener balance de una caja
    pub fn get_balance(env: Env, user: Address, box_id: Symbol) -> i128 {
        let key = (user, box_id);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(0)
    }
}
```

### 3. Compilar el Contrato
```bash
cd savings_box
soroban contract build
```

### 4. Desplegar a Testnet
```bash
# Configurar identidad
soroban keys generate alice --network testnet

# Obtener fondos
soroban keys fund alice --network testnet

# Desplegar
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/savings_box.wasm \
  --source alice \
  --network testnet
```

Te dará un **Contract ID** como: `CCDEFGHIJK...`

### 5. Actualizar tu App con el Contract ID Real
```javascript
// src/services/SorobanService.js
const CONTRACT_ADDRESSES = {
  SAVINGS_VAULT: 'CCDEFGHIJK...',  // Tu contrato real
};

// Crear operación para invocar el contrato
export const createDepositTransaction = async (userPublicKey, boxId, amount) => {
  const account = await server.loadAccount(userPublicKey);

  // Crear contrato de Soroban
  const contract = new StellarSdk.Contract(CONTRACT_ADDRESSES.SAVINGS_VAULT);

  // Construir operación de invocación
  const operation = contract.call(
    'deposit',
    StellarSdk.nativeToScVal(userPublicKey, { type: 'address' }),
    StellarSdk.nativeToScVal(boxId, { type: 'symbol' }),
    StellarSdk.nativeToScVal(amount * 10000000, { type: 'i128' })
  );

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',  // Soroban necesita más fee
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(operation)
    .setTimeout(180)
    .build();

  return transaction.toXDR();
};
```

---

## 📊 Verificar Invocación de Contrato en Laboratory

### Una vez que tengas el contrato desplegado:

#### 1. Ver el Contrato
1. Abre: https://laboratory.stellar.org/#explorer
2. Selecciona **"Contract Data"**
3. Pega tu Contract ID
4. Click "Submit"

#### 2. Leer Estado del Contrato
```bash
# Usando Soroban CLI
soroban contract invoke \
  --id CCDEFGHIJK... \
  --source alice \
  --network testnet \
  -- \
  get_balance \
  --user GABC123... \
  --box_id "vacaciones"
```

#### 3. Ver en Stellar Expert
1. Busca tu transacción
2. Verás: **"Invoke Host Function"**
3. Detalles de los parámetros pasados
4. Resultado de la invocación

---

## 🎯 Guía Rápida de Testing

### Test Completo con la App Actual:

#### 1. Preparación
```bash
# Terminal 1: Iniciar app
cd savings-boxes-app
npm run dev
```

#### 2. Conectar Wallet
1. Abre http://localhost:5175
2. Click "Connect" → Login/Signup
3. Copia tu dirección (ej: `GABC123...XYZ`)

#### 3. Obtener Fondos
```bash
curl "https://friendbot.stellar.org?addr=GABC123...XYZ"
```

#### 4. Verificar Fondos en Stellar Expert
1. Abre: https://stellar.expert/explorer/testnet
2. Busca tu dirección
3. Verás: Balance ~10,000 XLM

#### 5. Hacer Depósito en la App
1. Click "Depositar" en una caja
2. Ingresa: 10
3. Click "Depositar"
4. Accesly firmará y enviará
5. Copia el **TX hash** de la consola

#### 6. Verificar Transacción
**Opción A - Stellar Expert (Fácil):**
```
https://stellar.expert/explorer/testnet/tx/{TX_HASH}
```

**Opción B - Laboratory (Técnico):**
1. https://laboratory.stellar.org/#explorer
2. "Operations for Transaction"
3. Pega TX hash
4. Ver detalles JSON

---

## 🔬 Comandos Útiles de Verificación

### Ver tu Account desde Terminal:
```bash
curl "https://horizon-testnet.stellar.org/accounts/GABC123...XYZ"
```

### Ver Transacciones desde Terminal:
```bash
curl "https://horizon-testnet.stellar.org/accounts/GABC123...XYZ/transactions"
```

### Ver Operaciones desde Terminal:
```bash
curl "https://horizon-testnet.stellar.org/accounts/GABC123...XYZ/operations"
```

---

## 📝 Checklist de Verificación

### ✅ Verificación Básica (Actual):
- [ ] Wallet conectado con Accesly
- [ ] Dirección visible en la app
- [ ] Fondos recibidos desde Friendbot
- [ ] Depósito realizado desde la app
- [ ] TX hash obtenido en consola
- [ ] TX verificada en Stellar Expert
- [ ] Operation de tipo "payment" visible

### ✅ Verificación Avanzada (Con Contrato):
- [ ] Contrato Soroban desplegado
- [ ] Contract ID agregado a SorobanService.js
- [ ] Invocación de contrato desde la app
- [ ] TX hash de tipo "invoke_host_function"
- [ ] Estado del contrato actualizado
- [ ] Balance leído desde el contrato

---

## 🎓 Recursos Adicionales

### Documentación:
- **Stellar Laboratory**: https://laboratory.stellar.org/
- **Stellar Expert**: https://stellar.expert/
- **Soroban Docs**: https://soroban.stellar.org/
- **Horizon API**: https://developers.stellar.org/api/horizon

### Tutoriales:
- **Soroban Hello World**: https://soroban.stellar.org/docs/getting-started/hello-world
- **Deploy Smart Contract**: https://soroban.stellar.org/docs/getting-started/deploy-to-testnet

### Tools:
- **Friendbot (Testnet Faucet)**: https://laboratory.stellar.org/#account-creator?network=test
- **Soroban CLI**: https://soroban.stellar.org/docs/getting-started/setup

---

## 💡 Tips para el Demo

### Durante la Presentación:

1. **Prepara una Pantalla Dividida:**
   - Izquierda: Tu app
   - Derecha: Stellar Expert en tu dirección

2. **Storyline:**
   ```
   "Voy a hacer un depósito de 10 XLM..."
   → Click "Depositar"
   → Accesly firma
   "Aquí está el TX hash"
   → Pega en Stellar Expert
   "Y ahí está, confirmado en blockchain"
   ```

3. **Muestra el JSON:**
   - Laboratory → Operations for Transaction
   - Muestra los detalles técnicos

4. **Compara con Smart Contracts:**
   ```
   "Actualmente es un payment simple,
   pero la arquitectura permite cambiar esto
   a una invocación de contrato en 10 líneas de código"
   ```

---

## 🏆 Resumen Ejecutivo

| Acción | Herramienta | URL |
|--------|------------|-----|
| Ver cuenta | Stellar Expert | https://stellar.expert/explorer/testnet |
| Ver TX details | Stellar Expert | https://stellar.expert/explorer/testnet/tx/{hash} |
| Consultar API | Stellar Lab | https://laboratory.stellar.org/#explorer |
| Obtener fondos | Friendbot | https://laboratory.stellar.org/#account-creator |
| Deploy contrato | Soroban CLI | `soroban contract deploy` |

---

**¡Ahora puedes verificar cada transacción en blockchain!** 🚀

Para el hackathon, esto te permite **demostrar** que:
1. ✅ Las transacciones son REALES
2. ✅ Van a Stellar Testnet
3. ✅ Son verificables públicamente
4. ✅ La arquitectura está lista para contratos Soroban

**Siguiente paso opcional:** Desplegar un contrato simple de Soroban y conectarlo.
