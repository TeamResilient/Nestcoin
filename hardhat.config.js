require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.METAMASK_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
