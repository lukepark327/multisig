require("@nomicfoundation/hardhat-toolbox");

require('hardhat-contract-sizer');
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },

  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://api.test.wemix.com",
        gasPrice: 111000000000,
        gasLimit: 100000000,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      gasPrice: 111000000000,
      gasLimit: 100000000,
    },
    wemixtest: {
      url: "https://api.test.wemix.com",
      chainId: 1112,
      gasPrice: 111000000000,
      gasLimit: 100000000,
    },
    wemix: {
      url: "https://api.wemix.com",
      chainId: 1111,
      gasPrice: 111000000000,
      gasLimit: 100000000,
    },
  },

  gasReporter: {
    enabled: true,
    // outputFile: './gasReport',
  },
  contractSizer: {
    runOnCompile: true,
    // outputFile: './contractSize',
  },

  mocha: {
    timeout: 100000000
  },
};
