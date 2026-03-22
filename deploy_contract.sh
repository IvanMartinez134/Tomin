#!/bin/bash
# Script de Deploy Automático - Tomin Vault Contract

echo "🚀 Iniciando deploy del Smart Contract Tomin Vault..."

# Compilar el contrato
echo "📦 Compilando contrato..."
cd tomin-contracts/contracts/tomin-vault
stellar contract build

if [ $? -ne 0 ]; then
    echo "❌ Error compilando el contrato"
    exit 1
fi

echo "✅ Contrato compilado exitosamente"

# Deploy del contrato
echo "🌐 Desplegando en Stellar Testnet..."
CONTRACT_ID=$(stellar contract deploy \
    --source alice \
    --network testnet \
    --wasm ../../target/wasm32v1-none/release/tomin_vault.wasm)

if [ $? -ne 0 ]; then
    echo "❌ Error desplegando el contrato"
    exit 1
fi

echo "✅ Contrato desplegado exitosamente!"
echo "📋 CONTRACT ID: $CONTRACT_ID"

# Actualizar archivo .env
echo "🔧 Actualizando configuración..."
cd ../../../savings-boxes-app

# Hacer backup del .env actual
cp .env .env.backup

# Actualizar VITE_TOMIN_CONTRACT_ID
sed -i "s/VITE_TOMIN_CONTRACT_ID=PENDIENTE_DEPLOY/VITE_TOMIN_CONTRACT_ID=$CONTRACT_ID/g" .env

echo "✅ Configuración actualizada!"
echo ""
echo "🎉 ¡Deploy completado!"
echo "📋 Nuevo Contract ID: $CONTRACT_ID"
echo "📁 Archivo .env actualizado automáticamente"
echo ""
echo "🔄 Próximos pasos:"
echo "1. Reinicia el frontend: npm run dev"
echo "2. Ve a SMART CONTRACTS en la app"
echo "3. Conecta tu wallet Freighter"
echo "4. ¡Prueba las transacciones!"