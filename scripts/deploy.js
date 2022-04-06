//implement deploy
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
    const NestcoinContract = await ethers.getContractFactory("NestCoin");

    // here we deploy the contract
    const deployedNestcoinContract = await NestcoinContract.deploy();

    // Wait for it to finish deploying
  await deployedNestcoinContract.deployed();

  // print the address of the deployed contract
  console.log(
    "NestCoin Contract Address:",
    deployedNestcoinContract.address
  );

}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
