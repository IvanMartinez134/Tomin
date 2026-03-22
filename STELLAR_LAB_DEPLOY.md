# 🚀 Deploy Manual - Stellar Lab

## 📋 Información para Deploy

### 🔧 Datos del Contrato
- **WASM Hash:** `83695c039af74ab0bf054bd0e065891e00809b4ed7c7bf6760002172fde0ea80`
- **Source Account:** `GA36JIOQR7PF4XI2WBFFXCBQ2XNPX52KWA4II7Z2ADSVKQLMJH2Z22OE` (alice)
- **Salt:** `0000000000000001`

### 🏗️ Parámetros del Constructor
```json
{
  "admin": "GA36JIOQR7PF4XI2WBFFXCBQ2XNPX52KWA4II7Z2ADSVKQLMJH2Z22OE",
  "cetes_vault": "CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY",
  "usdc_token": "CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT",
  "commission_rate": 1000
}
```

### 📱 Contract ID Esperado
- **Contract ID:** `CAVTIWT76ONP2L3WLQGJILHNXC3337TX33QIEDMO6AMUPTCUMP2XSLBX`

## 🌐 Pasos en Stellar Lab

### 1. Ve a Stellar Lab
**URL:** https://laboratory.stellar.org/#txbuilder?network=test

### 2. Configurar Transaction Builder
- **Source Account:** `GA36JIOQR7PF4XI2WBFFXCBQ2XNPX52KWA4II7Z2ADSVKQLMJH2Z22OE`
- **Base Fee:** 100
- **Network:** Test

### 3. Agregar Operación: Create Contract
- **Operation Type:** Create Contract
- **Wasm Hash:** `83695c039af74ab0bf054bd0e065891e00809b4ed7c7bf6760002172fde0ea80`
- **Address:** Generar con salt `0000000000000001`

### 4. Agregar Operación: Invoke Contract (Constructor)
- **Operation Type:** Invoke Contract
- **Contract ID:** [El generado en paso 3]
- **Function:** `__constructor`
- **Arguments:**
  - admin: `SC_ADDRESS` → `GA36JIOQR7PF4XI2WBFFXCBQ2XNPX52KWA4II7Z2ADSVKQLMJH2Z22OE`
  - cetes_vault: `SC_ADDRESS` → `CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY`
  - usdc_token: `SC_ADDRESS` → `CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT`
  - commission_rate: `SC_U32` → `1000`

### 5. Firmar y Enviar
- Click "Sign with Freighter" o usar secret key: `SBWUC3D654DIRYEB65BXHLTVI6CEQ3FXBPE6FGPPIPCNHOS7H2OKFL3K`
- Submit to Network

### 6. Verificar
**Stellar Explorer:** https://stellar.expert/explorer/testnet/contract/CAVTIWT76ONP2L3WLQGJILHNXC3337TX33QIEDMO6AMUPTCUMP2XSLBX

---

## ⚡ Alternativa: CLI con Workaround

Si prefieres CLI, puedes crear aliases temporales:

```bash
# Crear aliases para los contract IDs
stellar keys add --name cetes_vault --address CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY
stellar keys add --name usdc_token --address CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT

# Luego deploy
stellar contract deploy \
  --wasm-hash 83695c039af74ab0bf054bd0e065891e00809b4ed7c7bf6760002172fde0ea80 \
  --source alice \
  --network testnet \
  --salt 0000000000000001 \
  -- --admin alice \
     --cetes_vault cetes_vault \
     --usdc_token usdc_token \
     --commission_rate 1000
```

## 🎯 Resultado Esperado
Una vez deployado correctamente, tu contrato estará en:
- **Contract ID:** `CAVTIWT76ONP2L3WLQGJILHNXC3337TX33QIEDMO6AMUPTCUMP2XSLBX`
- **Admin:** Alice
- **Integrado con:** DeFindex CETES + USDC
- **Commission:** 10% solo sobre ganancias