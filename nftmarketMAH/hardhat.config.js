/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
let secrets = require("./secrets");


module.exports = {
  defaultNetwork: 'hardhat',
  
  //defaultNetwork: 'matic',
  //defualtNetwork: 'avalanchefuji',
  //solidity:"0.8.0",

  networks:{

    hardhat:{
      chainId: 1337
    },

    
    ropsten:{
      url: secrets.url,
      accounts: [secrets.key,"5259da882eb1361053a1a5e7e8dddb861901a6ca61f654bb9a25b583a2d9c54d"],
    },


    binance:{
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [secrets.key, "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
    },


    matic:{
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [secrets.PRIVATE_KEY, "5259da882eb1361053a1a5e7e8dddb861901a6ca61f654bb9a25b583a2d9c54d"],
    },

    avalanchefuji:{
      apiKey: "V9G9MPK9YKGKP3FUZCG7S3GU9TKBEE5QKS",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [secrets.key]
    },

    cronosTestnet:{
      url: "https://cronos-testnet-3.crypto.org:8545/",
      chainId: 338,
      accounts: [secrets.key]
    },

    fantomTestnet:{
      url: "https://rpc.testnet.fantom.network/",
      chainId: 0xfa2,
      accounts: [secrets.key]
    },

    iotexTestnet:{
      url: "https://babel-api.testnet.iotex.io",
      chainId: 4690,
      accounts: [secrets.key]
    },
  },

  etherscan:{

     //for etherscan
    apiKey:"P6VCN4BHKZEBDR6YDNEKZUE89DKSZ2E8SX"

    //for bscscan
    //apiKey:"CQZJDB2MZWCMN1NVIVDJ2PSRWA7Q2ZCHFN"

  },

  solidity:{
    compilers: [
      {
        version: "0.8.0",
        settings:{
          optimizer:{
            enabled: true,
            runs: 200
          }
        }
      },
    ],

  }

};
