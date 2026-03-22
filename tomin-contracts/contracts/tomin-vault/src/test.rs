#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::StellarAssetClient,
    Address, Env
};

#[test]
fn test_constructor() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let cetes_vault = Address::generate(&env);
    let usdc_token = Address::generate(&env);

    let contract_id = env.register(TominVault, (
        admin.clone(),
        cetes_vault.clone(),
        usdc_token.clone(),
        1000u32 // 10% commission
    ));

    let client = TominVaultClient::new(&env, &contract_id);

    // Verificar que el contrato se inicializó correctamente
    assert_eq!(client.get_total_commissions(), 0i128);
}

#[test]
fn test_deposit_and_balance() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let cetes_vault = Address::generate(&env);

    // Crear token USDC mock
    let usdc_token = env.register_stellar_asset_contract_v2(admin.clone()).address();
    let usdc_stellar_client = StellarAssetClient::new(&env, &usdc_token);

    // Dar balance inicial al usuario (mint USDC)
    let deposit_amount = 100_0000000i128; // 100 USDC (7 decimales)
    usdc_stellar_client.mint(&user, &deposit_amount);

    // Crear contrato Tomin
    let contract_id = env.register(TominVault, (
        admin.clone(),
        cetes_vault.clone(),
        usdc_token.clone(),
        1000u32 // 10% commission
    ));

    let client = TominVaultClient::new(&env, &contract_id);

    // Depositar
    client.deposit(&user, &deposit_amount);

    // Verificar balance
    assert_eq!(client.get_balance(&user), deposit_amount);
}

#[test]
fn test_withdraw() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let cetes_vault = Address::generate(&env);

    // Crear token USDC mock
    let usdc_token = env.register_stellar_asset_contract_v2(admin.clone()).address();
    let usdc_stellar_client = StellarAssetClient::new(&env, &usdc_token);

    // Dar balance inicial al usuario (mint USDC)
    let deposit_amount = 100_0000000i128; // 100 USDC
    usdc_stellar_client.mint(&user, &deposit_amount);

    // Crear contrato Tomin
    let contract_id = env.register(TominVault, (
        admin.clone(),
        cetes_vault.clone(),
        usdc_token.clone(),
        1000u32 // 10% commission
    ));

    let client = TominVaultClient::new(&env, &contract_id);

    // Depositar
    client.deposit(&user, &deposit_amount);

    // Intentar retirar una cantidad pequeña
    let withdraw_amount = 10_0000000i128; // 10 USDC

    // El retiro debería funcionar (aunque sin ganancias reales no habrá comisión)
    client.withdraw(&user, &withdraw_amount);

    // Verificar balance restante
    let expected_balance = deposit_amount - withdraw_amount;
    assert_eq!(client.get_balance(&user), expected_balance);
}

#[test]
fn test_admin_commission_withdrawal() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let cetes_vault = Address::generate(&env);
    let usdc_token = env.register_stellar_asset_contract_v2(admin.clone()).address();

    // Crear contrato Tomin
    let contract_id = env.register(TominVault, (
        admin.clone(),
        cetes_vault.clone(),
        usdc_token.clone(),
        1000u32 // 10% commission
    ));

    let client = TominVaultClient::new(&env, &contract_id);

    // Inicialmente no hay comisiones
    assert_eq!(client.get_total_commissions(), 0i128);

    // Admin puede retirar comisiones (aunque sean 0)
    let withdrawn = client.withdraw_commissions(&admin);
    assert_eq!(withdrawn, 0i128);
}
