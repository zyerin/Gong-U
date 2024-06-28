const HDWalletProvider = require('@truffle/hdwallet-provider');
const NETWORK_ID = '1001';
const GASLIMIT = '20000000';
const URL = 'https://api.baobab.klaytn.net:8651';
const PRIVATE_KEY = '0xc3c839559b5b1e29ecf710873054d63aab9293ec7c6460e24fe65f43badc3842';

module.exports = {
  networks: {
    klaytn: {
      provider: () => new HDWalletProvider({
        privateKeys: [PRIVATE_KEY],
        providerOrUrl: URL,
      }),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },

  compilers: {
    solc: {
      version: "0.8.0", // Use the specified version
    }
  }
};
