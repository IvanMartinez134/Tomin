# 🎯 Tutorial Paso a Paso: Verificar tu Primera Transacción

## ⏱️ Tiempo estimado: 10 minutos

---

## 📱 Paso 1: Iniciar la Aplicación

```bash
cd savings-boxes-app
npm run dev
```

**Resultado esperado:**
```
VITE v5.4.21  ready in 503 ms

➜  Local:   http://localhost:5175/
```

✅ Abre esa URL en tu navegador

---

## 🔐 Paso 2: Conectar tu Wallet

1. **Click en el botón "Connect"** (esquina superior derecha)

2. Se abre el modal de Accesly:
   - **¿Primera vez?** → Click "Sign up" y usa tu email
   - **¿Ya tienes cuenta?** → Click "Login"

3. Accesly creará tu wallet automáticamente

4. **Copia tu dirección Stellar:**
   - Aparece en el header después de conectar
   - Formato: `GABC...XYZ` (acortado)
   - Click para copiar completa o revisa consola

**Ejemplo de dirección:**
```
GDZQHPWVMNYKS3LSOYBFKJZQRXSYUPJ6HKWQ4OWZQXVLNPTYVKLM7TBN
```

✅ **Guarda esta dirección** - la usarás en los siguientes pasos

---

## 💰 Paso 3: Obtener Fondos de Testnet

### Opción A: Stellar Laboratory (Visual)

1. Abre: https://laboratory.stellar.org/#account-creator?network=test

2. Pega tu dirección en el campo

3. Click **"Get test network lumens"**

4. Verás mensaje de éxito:
   ```
   Account successfully funded on the test network
   ```

### Opción B: cURL (Terminal)

```bash
curl "https://friendbot.stellar.org?addr=TU_DIRECCION_AQUI"
```

**Respuesta exitosa:**
```json
{
  "_links": { ... },
  "hash": "abc123...",
  "ledger": 123456,
  ...
}
```

✅ **Ya tienes ~10,000 XLM de testnet**

---

## 🔍 Paso 4: Verificar tus Fondos en Stellar Expert

1. Abre: https://stellar.expert/explorer/testnet

2. Pega tu dirección en el buscador (arriba)

3. Presiona **Enter**

**Deberías ver:**

```
┌─────────────────────────────────────────┐
│  Account: GDZQ...7TBN                   │
├─────────────────────────────────────────┤
│  Balance: 10,000 XLM                    │
│  Operations: 1 (Account created)        │
│  Transactions: 1                        │
└─────────────────────────────────────────┘
```

✅ Guarda esta pestaña abierta - la usarás después

---

## 📦 Paso 5: Crear una Caja de Ahorro

1. **Click en "Nueva Caja"** en el dashboard

2. Completa el formulario:
   - **Nombre:** "Mi Primer Depósito"
   - **Meta:** 100
   - **Emoji:** Elige tu favorito (ej: 🚀)
   - **Color:** Selecciona uno

3. **Click "Crear Caja"**

✅ Tu nueva caja aparece en el dashboard

---

## 💸 Paso 6: Hacer un Depósito

### 🖥️ En la Aplicación:

1. **Click "Depositar"** en tu caja recién creada

2. **Ingresa cantidad:** `5` (o usa botón rápido de $10)

3. **Click "Depositar"**

4. Accesly mostrará un modal de confirmación

5. **Click "Confirm"** en el modal de Accesly

### 📊 En la Consola del Navegador:

**Abre DevTools:** `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

Verás logs como:
```
💰 Iniciando depósito...
📝 Creando transacción de depósito...
Usuario: GDZQ...7TBN
Caja: box-001
Cantidad: 5
✅ Transacción creada: AAAAAgAAAAD...
✍️ Firmando y enviando transacción con Accesly...
✅ Depósito exitoso: {txHash: "abc123def456..."}
```

✅ **COPIA el txHash** - es este: `abc123def456...`

---

## 🔬 Paso 7: Verificar la Transacción en Stellar Expert

### Método 1: Búsqueda Directa

1. En Stellar Expert (que dejaste abierto)

2. **Refresca la página** (`F5`)

3. Verás **"Operations: 2"** (aumentó de 1 a 2)

4. Click en **"Operations"** (pestaña)

5. Verás tu nueva operación:
   ```
   Payment
   From: GDZQ...7TBN (tu wallet)
   To: CCCC...CCCC (vault simulado)
   Amount: 5.0000000 XLM
   ✅ SUCCESS
   ```

### Método 2: Buscar por TX Hash

1. En la barra de búsqueda de Stellar Expert, pega tu TX hash

2. O usa URL directa:
   ```
   https://stellar.expert/explorer/testnet/tx/abc123def456...
   ```

**Detalles de la Transacción:**

```
┌──────────────────────────────────────────────┐
│  Transaction: abc123def456...                │
├──────────────────────────────────────────────┤
│  Status: ✅ SUCCESS                          │
│  Ledger: 123456                              │
│  Time: 2026-03-20 15:30:45 UTC               │
│  Fee: 100 stroops (0.00001 XLM)              │
│  Memo: -                                     │
├──────────────────────────────────────────────┤
│  OPERATIONS (1)                              │
├──────────────────────────────────────────────┤
│  1. Payment                                  │
│     Source: GDZQ...7TBN                      │
│     Destination: CCCC...CCCC                 │
│     Asset: XLM (native)                      │
│     Amount: 5.0000000                        │
└──────────────────────────────────────────────┘
```

✅ **¡Tu transacción está on-chain!**

---

## 🧪 Paso 8: Verificar en Stellar Laboratory (Opcional - Más Técnico)

1. Abre: https://laboratory.stellar.org/#explorer

2. Selecciona **"Operations for Transaction"**

3. Network: **Testnet**

4. Pega tu **TX hash**

5. Click **"Submit"**

**Verás el JSON crudo:**

```json
{
  "_embedded": {
    "records": [
      {
        "id": "123456789012345",
        "type": "payment",
        "type_i": 1,
        "created_at": "2026-03-20T15:30:45Z",
        "transaction_hash": "abc123def456...",
        "source_account": "GDZQ...7TBN",
        "from": "GDZQ...7TBN",
        "to": "CCCC...CCCC",
        "asset_type": "native",
        "amount": "5.0000000"
      }
    ]
  }
}
```

✅ Perfecto para mostrar en demos técnicas

---

## 📊 Paso 9: Verificar tu Balance Actualizado

### En Stellar Expert:

1. Vuelve a tu página de cuenta en Stellar Expert

2. Click en **"Balances"**

**Antes del depósito:**
```
Balance: 10,000.0000000 XLM
```

**Después del depósito:**
```
Balance: 9,994.9999900 XLM
```

**¿Por qué 9,994.99 y no 9,995?**
- Depositaste: 5 XLM
- Fee de la transacción: 0.00001 XLM
- Total gastado: 5.00001 XLM
- Balance: 10,000 - 5.00001 = 9,994.9999900 ✅

---

## 🎯 Paso 10: Verificación Completa con Cuenta de Destino

Para ver que el dinero realmente "llegó" (aunque sea a una dirección simulada):

1. En Stellar Expert, busca la dirección de destino: `CCCC...CCCC`

2. Si esa cuenta existe en testnet, verás el pago recibido

3. Si no existe (porque es placeholder), verás error 404

**Para el hackathon:** Puedes crear una cuenta real de destino:

```bash
# Generar nueva cuenta para simular el vault
curl "https://friendbot.stellar.org?addr=NUEVA_DIRECCION_VAULT"
```

Luego actualiza en `SorobanService.js`:
```javascript
const CONTRACT_ADDRESSES = {
  SAVINGS_VAULT: 'NUEVA_DIRECCION_VAULT', // Cuenta real
};
```

---

## 🎬 Resumen del Flujo Completo

```
1. Conectar Wallet (Accesly)
   ✅ Dirección: GDZQ...7TBN

2. Obtener Fondos (Friendbot)
   ✅ Balance: 10,000 XLM

3. Verificar en Stellar Expert
   ✅ Cuenta visible on-chain

4. Crear Caja en App
   ✅ "Mi Primer Depósito" - Meta: $100

5. Depositar en App
   ✅ 5 XLM → vault simulado

6. Verificar TX en Stellar Expert
   ✅ TX Hash: abc123...
   ✅ Status: SUCCESS
   ✅ Amount: 5.0000000 XLM

7. Verificar Balance Actualizado
   ✅ 9,994.99 XLM
```

---

## 🐛 Troubleshooting

### ❌ "Account not found" en Stellar Expert
**Causa:** No has recibido fondos de Friendbot
**Solución:** Repite el Paso 3

### ❌ "Insufficient balance" al depositar
**Causa:** No tienes suficientes XLM
**Solución:** Usa Friendbot para obtener más

### ❌ No veo el TX hash en consola
**Causa:** DevTools cerrado o error en la transacción
**Solución:** Abre DevTools (`F12`) antes de depositar

### ❌ "Network error" al depositar
**Causa:** Conexión a internet o Stellar Testnet caído
**Solución:** Verifica conexión, intenta más tarde

---

## 💡 Tips para el Demo en el Hackathon

### Setup Pre-Demo:

1. **Cuenta Pre-Fondeada:**
   ```bash
   # Antes del evento
   curl "https://friendbot.stellar.org?addr=TU_DIRECCION"
   ```

2. **Stellar Expert Abierto:**
   - Pestaña 1: Tu cuenta
   - Pestaña 2: Lista para buscar TX

3. **DevTools Abierto:**
   - Console tab visible
   - Logs claros

### Durante el Demo:

1. **Pantalla Dividida:**
   ```
   Izquierda: App (Chrome)
   Derecha: Stellar Expert + DevTools
   ```

2. **Narración:**
   ```
   "Voy a depositar 10 XLM en mi caja de vacaciones..."
   [Click Depositar]

   "Accesly firma la transacción automáticamente..."
   [Modal de Accesly]

   "Y aquí está - confirmada en blockchain"
   [Muestra Stellar Expert]

   "Pueden ver el TX hash, el monto, todo público y verificable"
   [Scrollea en Stellar Expert]
   ```

3. **Bonus Points:**
   - Muestra el JSON en Laboratory
   - Explica las fees
   - Compara balance antes/después

---

## 📚 URLs de Referencia Rápida

| Propósito | URL |
|-----------|-----|
| **Friendbot** | https://laboratory.stellar.org/#account-creator?network=test |
| **Stellar Expert** | https://stellar.expert/explorer/testnet |
| **Laboratory** | https://laboratory.stellar.org/#explorer |
| **Ver TX** | https://stellar.expert/explorer/testnet/tx/{HASH} |
| **Ver Cuenta** | https://stellar.expert/explorer/testnet/account/{ADDRESS} |

---

## ✅ Checklist de Verificación

Marca cada paso conforme lo completes:

- [ ] App iniciada en http://localhost:5175
- [ ] Wallet conectado con Accesly
- [ ] Dirección copiada
- [ ] Fondos recibidos de Friendbot
- [ ] Balance verificado en Stellar Expert
- [ ] Caja de ahorro creada
- [ ] Depósito realizado
- [ ] TX hash copiado de consola
- [ ] TX verificada en Stellar Expert
- [ ] Balance actualizado confirmado

---

## 🏆 ¡Felicidades!

Has completado tu primera transacción verificable en Stellar Testnet usando Accesly.

**Ahora puedes:**
- ✅ Demostrar integraciones reales
- ✅ Verificar transacciones públicamente
- ✅ Mostrar que tu app funciona on-chain
- ✅ Impresionar a los jueces del hackathon

**Próximos pasos opcionales:**
1. Desplegar un smart contract de Soroban real
2. Integrar con DeFindex/Blend (si tienen contratos públicos)
3. Implementar retiros
4. Agregar historial de transacciones

---

**¡A ganar el Hackathon!** 🚀🏆
