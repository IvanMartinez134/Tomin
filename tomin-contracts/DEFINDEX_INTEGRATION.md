# Integración DeFindex - Interfaces de Contratos

## DeFindex CETES Vault Interface

Basado en la información de DeFindex, necesito definir las interfaces para interactuar con:

1. **CETES Vault**: `CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY`
2. **CETES Strategy**: `CD2N7YAPXRPZX6L5JJZXJ6TE5B6IXEX5FYBZMB2ZOTYFZYN5VHI5ZOF2`

## Funciones principales requeridas:

### Para Vault:
- `deposit(amount: i128, from: Address, to: Address)` - Depositar en DeFindex
- `withdraw(shares: i128, from: Address, to: Address)` - Retirar de DeFindex
- `balance(address: Address)` - Obtener balance de shares
- `convert_to_shares(amount: i128)` - Convertir USDC a shares
- `convert_to_assets(shares: i128)` - Convertir shares a USDC

### Para Strategy:
- `harvest()` - Ejecutar estrategia de rendimiento
- `pause()/unpause()` - Control de emergencia

## Tokens involucrados:
- **USDC**: Token de depósito (testnet)
- **Shares**: Tokens que representa posición en vault
- **CETES**: Token subyacente que genera rendimiento

## Próximos pasos:
1. Definir traits/interfaces en Soroban
2. Implementar llamadas cross-contract
3. Manejar conversiones de tokens
4. Implementar lógica de harvest automático
5. Testing en testnet con contratos reales