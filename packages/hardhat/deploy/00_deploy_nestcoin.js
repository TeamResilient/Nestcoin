const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();


  await deploy("NestCoin", {
    from: deployer,
    log: true,
  });
  
  const nestcoin = await ethers.getContract("NestCoin", deployer);

  
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["Exchange"];
