/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
{/* const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Get the previously deployed nestcoin
  const nestcoin = await ethers.getContract("NestCoin", deployer);

  console.log("\n 🏵  Deploying Nestdrop...\n");

  // Deploy the Nxt
  await deploy("Nestdrop", {
    from: deployer,
    args: [nestcoin.address],
    log: true,
  });

  console.log("\n    ✅ confirming...\n");

  const nestdrop = await ethers.getContract("Nestdrop", deployer);

  console.log("\n 🏵  Transfering ownership of NestCoin to Nestdrop...\n");

  // Transfer ownership of Nestcoin to Nestdrop
  const ownershipTransaction = await nestcoin.transferOwnership(nestdrop.address);
   

  console.log("\n    ✅ confirming...\n");

  console.log("\n 🏵  Transfering ownership of Nestdrop to admin...\n");

  // Transfer ownership of Nestdrop to Admin
  const ownershipTransaction2 = await nestdrop.transferOwnership(
    "0x20497F37a8169c8C9fA09411F8c2CFB7c90dE5d1"
  );

  const assignAdmin = await nestdrop.assignAdmin(
    "0x20497F37a8169c8C9fA09411F8c2CFB7c90dE5d1"
  );

  console.log("\n    ✅ confirming...\n");

  await ownershipTransaction2.wait();
};

module.exports.tags = ["Nestdrop"]; */}


// deploy/01_deploy_vendor.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // You might need the previously deployed yourToken:
  const nestcoin = await ethers.getContract("NestCoin", deployer);

  // Todo: deploy the vendor
   await deploy("Nestdrop", {
     from: deployer,
     args: [nestcoin.address], // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    log: true,
   });
  
  

   console.log("\n    ✅ confirming...\n");

   const nestdrop = await ethers.getContract("Nestdrop", deployer);

  // Todo: transfer the tokens to the vendor
   console.log("\n 🏵  Sending all 10000000 tokens to the nestdrop...\n");
  
   const transferTransaction = await nestcoin.transfer(
     nestdrop.address,
    ethers.utils.parseEther("10000000")
   );

    const assignAdmin = await nestdrop.assignAdmin(
      "0x20497F37a8169c8C9fA09411F8c2CFB7c90dE5d1"
    );
  //console.log("\n    ✅ confirming...\n");
  //await sleep(5000); // wait 5 seconds for transaction to propagate

  // ToDo: change address to your frontend address vvvv
   console.log("\n 🤹  Sending ownership to frontend address...\n")
   const ownershipTransaction = await nestdrop.transferOwnership(
     "0x20497F37a8169c8C9fA09411F8c2CFB7c90dE5d1"
   );
   console.log("\n    ✅ confirming...\n");
   const ownershipResult = await ownershipTransaction.wait();

  // ToDo: Verify your contract with Etherscan for public chains
  // if (chainId !== "31337") {
  //   try {
  //     console.log(" 🎫 Verifing Contract on Etherscan... ");
  //     await sleep(5000); // wait 5 seconds for deployment to propagate
  //     await run("verify:verify", {
  //       address: vendor.address,
  //       contract: "contracts/Vendor.sol:Vendor",
  //       contractArguments: [yourToken.address],
  //     });
  //   } catch (e) {
  //     console.log(" ⚠️ Failed to verify contract on Etherscan ");
  //   }
  // }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["Nestdrop"];