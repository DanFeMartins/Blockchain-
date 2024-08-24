require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Defina suas chaves privadas aqui
const PRIVATE_KEYS = [
    "ddc57d198b244666ceaadd0cf60744664cff7fa7b31e4e668967793888035671",
    "5096e5e598da7f006a601446cc3ea0d62c8f63611f3e3f270bc51e0dab51c27e",
    "0de621fb438ba2f0f26b60a11051ce09d9a39ebfaf1b4a4ca5997dc13b56cd6a", // Exemplo de chave privada
];

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",     // Localhost (default: none)
            port: 7545,            // Standard Ethereum port (default: none)
            network_id: "*",       // Any network (default: none)
        },

        holensky: {
            provider: () => new HDWalletProvider({
                privateKeys: PRIVATE_KEYS,
                providerOrUrl: "https://eth-holesky.g.alchemy.com/v2/wkboEYORoNasSxYtby8hSihEei6XRkun"
            }),
            network_id: 17000,
            gas: 5500000,           // Gas limit (ajustar conforme necessário)
            gasPrice: 20000000000,  // Gas price em wei (20 Gwei)
            confirmations: 2,       // Confirmações a serem aguardadas antes de considerar a transação como finalizada
            timeoutBlocks: 200,     // Tempo de espera máximo (em blocos) para a transação ser confirmada
            skipDryRun: true        // Pular o dry run antes da migração na rede
        },
    },

    mocha: {
        // timeout: 100000
    },

    compilers: {
        solc: {
            version: "0.8.0",      // Versão do compilador Solidity
            settings: { 
                optimizer: {
                    enabled: true,
                    runs: 2000
                }
            }
        }
    },
};
