require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

/**
 @type import('hardhat/config').HardhatUserConfig
**/

module.exports = {
  paths: {
    // se enrutan las fuentes del blockchain
    sources: './src/blockchain/hardhat/contracts',
    tests: './src/blockchain/hardhat/test',
    cache: './src/blockchain/hardhat/cache',
    artifacts: './src/blockchain/hardhat/artifacts'
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: {
        url: process.env.RINKEBY_RPC_URL,
        blockNumber: 1439000
      }
    },
    localhost: {},
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true
    }
  },
  solidity: '0.8.9'
}
