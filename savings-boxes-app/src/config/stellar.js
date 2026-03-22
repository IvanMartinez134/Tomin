// Configuración de contratos y red
export const STELLAR_CONFIG = {
  // Red
  networkPassphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org",

  // Contratos
  contracts: {
    // Tu contrato Tomin ✅ DESPLEGADO
    TOMIN_VAULT: "CAHED7KFXIWE5LFJBZ5GN52BKSDH7Q3WQ6UR77WVPDVUVQCPNELM35GL",

    // DeFindex CETES (ya deployado)
    DEFINDEX_CETES: "CCCVCAFKMHR7ZQV7UZFRVHUB2MNHAG7ZCA6UDH6I3BMOG2KPI4QF5JHY",

    // USDC Testnet (ya deployado)
    USDC_TOKEN: "CAQCFVLOBK5GIULPNNZPBYEO5N5NCICDWBWQKKQNHR3YHBR4EF4YZ3MT"
  },

  // Wallet testnet para pruebas
  testWallet: "GA36JIOQR7PF4XI2WBFFXCBQ2XNPX52KWA4II7Z2ADSVKQLMJH2Z22OE"
};

// Configuración de Freighter
export const FREIGHTER_CONFIG = {
  isTestnet: true,
  networkPassphrase: STELLAR_CONFIG.networkPassphrase
};