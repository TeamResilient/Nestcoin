require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
require('solidity-coverage')

dotenv.config();
const defaultNetwork = "rinkeby";


module.exports = {
  solidity: "0.8.10",
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545",
      /*      
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      
      */
    },
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.METAMASK_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
