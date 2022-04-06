/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  console.log("\n 🏵  Deploying Nestcoin...\n");

  await deploy("Nestcoin", {
    from: deployer,
    log: true,
  });

  console.log("\n    ✅ confirming...\n");

  const nestcoin = await ethers.getContract("Nestcoin", deployer);
};

module.exports.tags = ["Nestcoin"];
