/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Get the previously deployed nestcoin
  const nestcoin = await ethers.getContract("Nestcoin", deployer);

  console.log("\n 🏵  Deploying Nxt...\n");

  // Deploy the Nxt
  await deploy("Nxt", {
    from: deployer,
    args: [nestcoin.address],
    log: true,
  });

  console.log("\n    ✅ confirming...\n");

  const nxt = await ethers.getContract("Nxt", deployer);

  console.log("\n 🏵  Transfering ownership of Nestcoin to Nxt...\n");

  // Transfer ownership of Nestcoin to Nxt
  const ownershipTransaction = await nestcoin.transferOwnership(nxt.address);

  console.log("\n    ✅ confirming...\n");

  console.log("\n 🏵  Transfering ownership of Nxt to admin...\n");

  // Transfer ownership of Nxt to Admin
  const ownershipTransaction2 = await nxt.transferOwnership(
    "** YOUR FRONTEND ADDRESS **"
  );

  console.log("\n    ✅ confirming...\n");

  await ownershipTransaction2.wait();
};

module.exports.tags = ["Nxt"];
