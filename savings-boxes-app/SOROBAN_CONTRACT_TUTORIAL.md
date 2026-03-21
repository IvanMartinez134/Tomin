# 🚀 Bonus: Desplegar tu Primer Smart Contract Soroban

## 📋 Objetivo
Desplegar un contrato real de "Savings Box" en Stellar Testnet y conectarlo con tu app.

**Tiempo estimado:** 30-45 minutos

---

## 🛠️ Prerequisitos

### 1. Instalar Rust
```bash
# Windows (PowerShell como admin)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Instalar target wasm32
```bash
rustup target add wasm32-unknown-unknown
```

### 3. Instalar Soroban CLI
```bash
cargo install --locked soroban-cli --features opt
```

**Verificar instalación:**
```bash
soroban --version
# Output: soroban 20.x.x
```

---

## 📝 Paso 1: Crear el Proyecto

```bash
cd /c/Users/death/OneDrive/Escritorio/Hakaton
soroban contract init savings-box-contract
cd savings-box-contract
```

**Estructura creada:**
```
savings-box-contract/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   └── test.rs
└── Makefile
```

---

## 💻 Paso 2: Escribir el Contrato

Abre `src/lib.rs` y reemplaza todo el contenido:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec};

// Estructura de datos para una caja de ahorro
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SavingsBox {
    pub owner: Address,
    pub name: Symbol,
    pub goal: i128,
    pub balance: i128,
    pub apy: i128, // APY en puntos base (850 = 8.5%)
}

// Símbolo para la clave de datos
const BOXES: Symbol = symbol_short!("BOXES");

#[contract]
pub struct SavingsBoxContract;

#[contractimpl]
impl SavingsBoxContract {
    /// Crear una nueva caja de ahorro
    pub fn create_box(
        env: Env,
        owner: Address,
        box_id: Symbol,
        name: Symbol,
        goal: i128,
    ) -> SavingsBox {
        // Verificar que el owner autorizó la transacción
        owner.require_auth();

        let new_box = SavingsBox {
            owner: owner.clone(),
            name,
            goal,
            balance: 0,
            apy: 850, // 8.5% APY por defecto
        };

        // Guardar la caja
        let key = (owner, box_id);
        env.storage().persistent().set(&key, &new_box);

        new_box
    }

    /// Depositar en una caja de ahorro
    pub fn deposit(
        env: Env,
        owner: Address,
        box_id: Symbol,
        amount: i128,
    ) -> i128 {
        // Verificar autenticación
        owner.require_auth();

        // Obtener la caja
        let key = (owner.clone(), box_id);
        let mut savings_box: SavingsBox = env.storage()
            .persistent()
            .get(&key)
            .expect("Box not found");

        // Actualizar balance
        savings_box.balance += amount;

        // Guardar actualización
        env.storage().persistent().set(&key, &savings_box);

        savings_box.balance
    }

    /// Retirar de una caja de ahorro
    pub fn withdraw(
        env: Env,
        owner: Address,
        box_id: Symbol,
        amount: i128,
    ) -> i128 {
        owner.require_auth();

        let key = (owner.clone(), box_id);
        let mut savings_box: SavingsBox = env.storage()
            .persistent()
            .get(&key)
            .expect("Box not found");

        // Verificar fondos suficientes
        if savings_box.balance < amount {
            panic!("Insufficient balance");
        }

        savings_box.balance -= amount;
        env.storage().persistent().set(&key, &savings_box);

        savings_box.balance
    }

    /// Obtener información de una caja
    pub fn get_box(
        env: Env,
        owner: Address,
        box_id: Symbol,
    ) -> SavingsBox {
        let key = (owner, box_id);
        env.storage()
            .persistent()
            .get(&key)
            .expect("Box not found")
    }

    /// Listar todas las cajas de un usuario
    pub fn get_all_boxes(
        env: Env,
        owner: Address,
    ) -> Vec<SavingsBox> {
        // Nota: En producción, necesitarías un índice más sofisticado
        // Este es un ejemplo simplificado
        Vec::new(&env)
    }
}

#[cfg(test)]
mod test;
```

---

## 🏗️ Paso 3: Compilar el Contrato

```bash
soroban contract build
```

**Output exitoso:**
```
   Compiling savings-box-contract v0.0.0
    Finished release [optimized] target(s) in 45.2s
```

**WASM generado en:**
```
target/wasm32-unknown-unknown/release/savings_box_contract.wasm
```

---

## 🔑 Paso 4: Configurar Identidad para Testnet

```bash
# Generar nueva identidad
soroban keys generate alice --network testnet

# Ver tu dirección
soroban keys address alice
```

**Output:**
```
GDKZW...ABC123
```

**Nota:** Esta es una dirección diferente a la de Accesly. Úsala solo para desplegar.

---

## 💰 Paso 5: Obtener Fondos para Desplegar

```bash
soroban keys fund alice --network testnet
```

**Output:**
```
Successfully funded alice with 10000 XLM
```

---

## 🚀 Paso 6: Desplegar a Stellar Testnet

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/savings_box_contract.wasm \
  --source alice \
  --network testnet
```

**Output (GUARDA ESTE ID):**
```
CDZQHPWVMNYKS3LSOYBFKJZQRXSYUPJ6HKWQ4OWZQXVLNPTYVKLM7TBN
```

✅ **¡Tu contrato está desplegado!**

---

## 🔧 Paso 7: Probar el Contrato desde CLI

### Crear una caja:
```bash
soroban contract invoke \
  --id CDZQHPWVMNYKS3LSOYBFKJZQRXSYUPJ6HKWQ4OWZQXVLNPTYVKLM7TBN \
  --source alice \
  --network testnet \
  -- \
  create_box \
  --owner GDKZW...ABC123 \
  --box_id "vacaciones" \
  --name "Vacaciones2026" \
  --goal 5000
```

### Depositar:
```bash
soroban contract invoke \
  --id CDZQ...7TBN \
  --source alice \
  --network testnet \
  -- \
  deposit \
  --owner GDKZW...ABC123 \
  --box_id "vacaciones" \
  --amount 1000
```

### Ver la caja:
```bash
soroban contract invoke \
  --id CDZQ...7TBN \
  --source alice \
  --network testnet \
  -- \
  get_box \
  --owner GDKZW...ABC123 \
  --box_id "vacaciones"
```

**Output:**
```rust
SavingsBox {
    owner: Address(GDKZW...ABC123),
    name: Symbol("Vacaciones2026"),
    goal: 5000,
    balance: 1000,
    apy: 850,
}
```

---

## 🔌 Paso 8: Conectar el Contrato con tu App

### Actualizar SorobanService.js:

```javascript
// src/services/SorobanService.js
import * as StellarSdk from '@stellar/stellar-sdk';

// ⚠️ ACTUALIZA CON TU CONTRACT ID REAL
const CONTRACT_ADDRESSES = {
  SAVINGS_VAULT: 'CDZQHPWVMNYKS3LSOYBFKJZQRXSYUPJ6HKWQ4OWZQXVLNPTYVKLM7TBN',
};

const STELLAR_NETWORK = 'TESTNET';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const sorobanServer = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);

/**
 * Crear transacción para depositar en el contrato Soroban REAL
 */
export const createDepositTransaction = async (userPublicKey, boxId, amount) => {
  try {
    console.log('📝 Creando transacción para contrato Soroban...');

    // 1. Cargar cuenta
    const account = await server.loadAccount(userPublicKey);

    // 2. Crear contrato
    const contract = new StellarSdk.Contract(CONTRACT_ADDRESSES.SAVINGS_VAULT);

    // 3. Preparar parámetros
    const params = [
      new StellarSdk.Address(userPublicKey).toScVal(), // owner
      StellarSdk.nativeToScVal(boxId, { type: 'symbol' }), // box_id
      StellarSdk.nativeToScVal(Math.floor(amount * 10000000), { type: 'i128' }), // amount (con 7 decimales)
    ];

    // 4. Construir operación
    const operation = contract.call('deposit', ...params);

    // 5. Construir transacción
    let transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // 6. Preparar la transacción (simular primero)
    transaction = await sorobanServer.prepareTransaction(transaction);

    console.log('✅ Transacción Soroban preparada');
    return transaction.toXDR();
  } catch (error) {
    console.error('❌ Error creando transacción Soroban:', error);
    throw error;
  }
};

/**
 * Crear una nueva caja en el contrato
 */
export const createBoxInContract = async (userPublicKey, boxId, name, goal) => {
  try {
    const account = await server.loadAccount(userPublicKey);
    const contract = new StellarSdk.Contract(CONTRACT_ADDRESSES.SAVINGS_VAULT);

    const params = [
      new StellarSdk.Address(userPublicKey).toScVal(),
      StellarSdk.nativeToScVal(boxId, { type: 'symbol' }),
      StellarSdk.nativeToScVal(name, { type: 'symbol' }),
      StellarSdk.nativeToScVal(Math.floor(goal * 10000000), { type: 'i128' }),
    ];

    const operation = contract.call('create_box', ...params);

    let transaction = new StellarSdk.TransactionBuilder(account, {
      fee: '100000', // Soroban necesita más fee
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    transaction = await sorobanServer.prepareTransaction(transaction);
    return transaction.toXDR();
  } catch (error) {
    console.error('Error creando caja en contrato:', error);
    throw error;
  }
};

/**
 * Obtener info de una caja desde el contrato
 */
export const getBoxFromContract = async (userPublicKey, boxId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ADDRESSES.SAVINGS_VAULT);

    const params = [
      new StellarSdk.Address(userPublicKey).toScVal(),
      StellarSdk.nativeToScVal(boxId, { type: 'symbol' }),
    ];

    const operation = contract.call('get_box', ...params);

    // Simular la llamada
    const account = await server.loadAccount(userPublicKey);
    let transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const result = await sorobanServer.simulateTransaction(transaction);

    // Parsear resultado
    if (result.results && result.results[0]) {
      return StellarSdk.scValToNative(result.results[0].xdr);
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo caja del contrato:', error);
    throw error;
  }
};

export { CONTRACT_ADDRESSES, STELLAR_NETWORK, HORIZON_URL };
```

---

## 🎯 Paso 9: Actualizar CreateBoxModal

```javascript
// src/components/CreateBoxModal.jsx
import { useWallet } from '../context/WalletContext';
import * as SorobanService from '../services/SorobanService';

const CreateBoxModal = ({ isOpen, onClose, onCreate }) => {
  const { publicKey, signAndSubmit } = useWallet();
  // ... resto del código

  const handleCreate = async () => {
    if (!name || !goal || parseFloat(goal) <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    try {
      // 1. Crear box ID único
      const boxId = `box_${Date.now()}`;

      // 2. Crear transacción para el contrato
      const xdr = await SorobanService.createBoxInContract(
        publicKey,
        boxId,
        name.replace(/\s/g, ''), // Sin espacios para Symbol
        parseFloat(goal)
      );

      // 3. Firmar y enviar con Accesly
      const result = await signAndSubmit(xdr);

      console.log('✅ Caja creada en blockchain:', result);

      // 4. Crear representación local también
      const newBox = {
        id: boxId,
        name,
        emoji: selectedEmoji,
        goal: parseFloat(goal),
        currentBalance: 0,
        createdAt: new Date().toISOString().split('T')[0],
        color: selectedColor.gradient,
        vaultId: `vault-defindex-${Date.now()}`,
        apy: 8.5,
        onChain: true, // Marcador de que está en blockchain
      };

      onCreate(newBox);
      onClose();
    } catch (error) {
      console.error('Error creando caja:', error);
      alert('Error creando caja: ' + error.message);
    }
  };

  // ... resto del código
};
```

---

## 🧪 Paso 10: Probar el Flujo Completo

### 1. Iniciar la App
```bash
npm run dev
```

### 2. Conectar con Accesly
- Login con tu cuenta existente

### 3. Crear Caja (irá a blockchain)
- Click "Nueva Caja"
- Completa formulario
- ⚠️ Puede tardar 5-10 segundos (espera del contrato)

### 4. Verificar en Stellar Expert
```
https://stellar.expert/explorer/testnet/tx/{TX_HASH}
```

**Verás:**
```
Operation Type: invoke_host_function
Contract: CDZQ...7TBN
Function: create_box
Status: ✅ SUCCESS
```

### 5. Depositar (también a blockchain)
- Click "Depositar"
- Ingresa cantidad
- Espera confirmación

### 6. Verificar en Stellar Expert
**Ahora verás:**
```
Operation Type: invoke_host_function
Function: deposit
Parameters:
  - owner: GABC...XYZ
  - box_id: box_1234567890
  - amount: 10000000 (10 XLM con 7 decimales)
```

---

## 📊 Comparación: Antes vs. Después

### Antes (Payment Simple):
```json
{
  "type": "payment",
  "from": "GABC...XYZ",
  "to": "CCCC...CCC",
  "amount": "10.0000000"
}
```

### Después (Soroban Contract):
```json
{
  "type": "invoke_host_function",
  "contract_id": "CDZQ...7TBN",
  "function": "deposit",
  "parameters": [
    { "type": "Address", "value": "GABC...XYZ" },
    { "type": "Symbol", "value": "box_123" },
    { "type": "I128", "value": "10000000" }
  ]
}
```

---

## 🎓 Comandos Útiles

### Ver estado del contrato:
```bash
soroban contract invoke \
  --id CDZQ...7TBN \
  --source alice \
  --network testnet \
  -- \
  get_box \
  --owner GABC...XYZ \
  --box_id "box_123"
```

### Optimizar WASM (producción):
```bash
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/savings_box_contract.wasm
```

### Actualizar contrato:
```bash
# Recompilar
soroban contract build

# Redesplegar (genera nuevo contract ID)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/savings_box_contract.wasm \
  --source alice \
  --network testnet
```

---

## 🏆 Checklist de Éxito

- [ ] Rust instalado
- [ ] Soroban CLI instalado
- [ ] Contrato compilado
- [ ] Identidad creada y fondeada
- [ ] Contrato desplegado a testnet
- [ ] Contract ID copiado
- [ ] SorobanService.js actualizado
- [ ] CreateBoxModal actualizado
- [ ] Caja creada en blockchain
- [ ] TX verificada en Stellar Expert
- [ ] Depósito realizado en blockchain
- [ ] TX de invocación verificada

---

## 💡 Tips para el Hackathon

### Si completas esto:
1. **Diferenciador clave:** Pocos equipos tienen contratos reales
2. **Demo impresionante:** Muestra invocaciones de contrato reales
3. **Puntos técnicos:** Arquitectura completa Web3

### En la presentación:
```
"No es solo UI - tenemos un smart contract real de Soroban
desplegado en testnet que gestiona las cajas de ahorro.

Cada depósito es una invocación de contrato verificable.

[Muestra Stellar Expert con invoke_host_function]

La arquitectura está lista para integrar con DeFindex/Blend
reemplazando este contrato por sus vaults."
```

---

## 🔗 Recursos Adicionales

- **Soroban Docs:** https://soroban.stellar.org/docs
- **Soroban by Example:** https://soroban.stellar.org/docs/learn/examples
- **Contract SDK:** https://docs.rs/soroban-sdk/latest/soroban_sdk/

---

## 🎯 Próximos Pasos (Opcional)

1. **Agregar eventos al contrato:**
   ```rust
   env.events().publish((symbol_short!("DEPOSIT"),), (owner, amount));
   ```

2. **Implementar APY real:**
   - Time-based interest calculation
   - Integration con Blend Capital

3. **Upgradeable contracts:**
   - Deploy con `--wasm-hash` para actualizaciones

4. **Frontend más robusto:**
   - Leer todas las cajas desde contrato
   - Cache local con refresh

---

**¡Ahora tienes un smart contract REAL!** 🎉🚀

Tu aplicación es oficialmente una **dApp completa** con:
- ✅ Autenticación custodial (Accesly)
- ✅ Smart contract desplegado (Soroban)
- ✅ Transacciones on-chain reales
- ✅ UI profesional

**Esto te pone en el top 10% de proyectos de hackathon.** 🏆
