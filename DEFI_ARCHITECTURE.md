# Arquitectura DeFi - Tomin x DeFindex Integration

## Flujo del Sistema

```
Cliente → Tomin App → Tomin Smart Contract → DeFindex CETES Vault → Rendimiento Real
```

## Componentes

### 1. Frontend (React)
- **Ubicación**: `savings-boxes-app/src`
- **Función**: Interfaz de usuario para depósitos/retiros
- **Integración**: Conecta con Freighter wallet y Tomin Contract

### 2. Tomin Smart Contract (Soroban)
- **Función**: Intermediario que maneja comisiones y conecta con DeFindex
- **Responsabilidades**:
  - Recibir depósitos de usuarios
  - Invertir en DeFindex CETES Vault
  - Calcular y cobrar comisiones
  - Manejar retiros
  - Distribuir ganancias

### 3. DeFindex Integration
- **CETES Vault**: `CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY`
- **Strategy**: `CD2N7YAPXRPZX6L5JJZXJ6TE5B6IXEX5FYBZMB2ZOTYFZYN5VHI5ZOF2`
- **Función**: Proporciona rendimiento real basado en CETES mexicanos

## Modelo de Comisiones

### Estructura de Fees
1. **Fee de Performance**: X% de las ganancias generadas
2. **Fee de Management**: Y% anual del capital gestionado
3. **Split**:
   - Usuario: 90% de ganancias
   - Tomin: 10% de gananias (configurable)

### Cálculo de Comisiones
```rust
// Ejemplo en Soroban
let profit = current_balance - initial_deposit;
let tomin_commission = profit * COMMISSION_RATE / 100;
let user_profit = profit - tomin_commission;
```

## Contracts en Testnet

### DeFindex Contracts
- **CETES Vault**: `CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY`
- **USDC Vault**: `CD2PEGKINIBLUXMSVQUG35B3I25ZUYKZHEKWWORGKQZ7BZMJS4I4HOTF`
- **XLM Vault**: `CDDBGKBC7LH4KIYQ2M7KAY62NFI5ETMCWQVJP6ABVEXAX6VZDHZFARCJ`
- **CETES Strategy**: `CD2N7YAPXRPZX6L5JJZXJ6TE5B6IXEX5FYBZMB2ZOTYFZYN5VHI5ZOF2`

### Blend Contracts (Respaldo)
- **Pool Factory V2**: `CCGRTXMGQDMHN6NPQTQZGITFPIWM3EZF7F3LIGCP3VN46ASZQ6XWSVX4`
- **CETES Pool**: `CBWD3Q5OGREVJI2I5F3FN36ZTMYXJXOY2IVCPJNTU7KFVX62KBPE5RB3`

## Configuración de Red
- **Red**: Stellar Testnet
- **RPC**: `https://soroban-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **Explorer**: `https://testnet.steexp.com`

## Casos de Uso

### Depósito
1. Usuario deposita MXN en su caja de ahorro
2. Tomin convierte a USDC/XLM
3. Tomin deposita en DeFindex CETES Vault
4. Usuario recibe representación de su inversión

### Retiro
1. Usuario solicita retiro
2. Tomin retira proporcional de DeFindex
3. Tomin calcula ganancias y comisiones
4. Tomin transfiere neto al usuario

### Rendimiento Automático
- DeFindex genera rendimiento en tiempo real
- El balance del usuario se actualiza automáticamente
- Las comisiones se acumulan para Tomin

## Ventajas del Sistema
1. **Rendimiento Real**: Basado en CETES mexicanos reales
2. **Transparencia**: Todo on-chain en Stellar
3. **Automatización**: Sin intervención manual
4. **Escalabilidad**: Múltiples usuarios, una sola inversión grande
5. **Regulación**: CETES son instrumentos regulados

## Riesgos y Mitigaciones
1. **Smart Contract Risk**: Auditoría de contratos
2. **Protocol Risk**: Diversificación entre DeFindex y Blend
3. **Slippage Risk**: Límites de retiro diarios
4. **Regulatory Risk**: Compliance con regulaciones mexicanas