const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const nestcoin = await ethers.getContract("NestCoin", deployer);

  await deploy("Exchange", {
    from: deployer,
    args: [nestcoin.address], 
    log: true,
  });
  
  const exchange = await ethers.getContract("Exchange", deployer);

  
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["Exchange"];

