//implement deploy
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so NestcoinContract here is a factory for instances of our Nestcoin contract.
  */
 console.log("deploying Nestcoin contract.......")
    const NestcoinContract = await ethers.getContractFactory("NestCoin");

    // here we deploy the contract
    const deployedNestcoinContract = await NestcoinContract.deploy();

    // Wait for it to finish deploying
  await deployedNestcoinContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 NestCoin Contract Address:",
    deployedNestcoinContract.address
  );

  

  console.log("\n 🏵 deploying Nestdrop contract.......")
  const NestdropContract = await ethers.getContractFactory("Nestdrop")
  const deployedNestdropContract = await NestdropContract.deploy(deployedNestcoinContract.address)

  // Wait for it to finish deploying
  await deployedNestdropContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 Nestdrop Contract Address:",
    deployedNestdropContract.address
  );

  console.log("\n 🏵 transferring all tokens to nestdrop contract")
   
  await deployedNestcoinContract.transfer(
    deployedNestdropContract.address, ethers.utils.parseEther("10000000")
  )

  console.log("\n    ✅ successful tranfer of tokens...\n");



}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
