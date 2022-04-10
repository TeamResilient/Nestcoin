//implement test
const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract;
let firstcontract;

describe("NestCoin", function(){
    it("should deploy the nestcoin and nestdrop contract to the testnet", async function(){
        console.log("deploying Nestcoin contract.......")
    const NestcoinContract = await ethers.getContractFactory("NestCoin");
    const deployedNestcoinContract = await NestcoinContract.deploy();
    firstcontract = await deployedNestcoinContract.deployed();
        console.log(
            "\n 🏵 NestCoin Contract Address:",
            deployedNestcoinContract.address
        );

        

  

    console.log("\n 🏵 deploying Nestdrop contract.......")
    const NestdropContract = await ethers.getContractFactory("Nestdrop")
    const deployedNestdropContract = await NestdropContract.deploy(deployedNestcoinContract.address)
    await deployedNestcoinContract.deployed();
    console.log(
        "\n 🏵 Nestdrop Contract Address:",
        deployedNestdropContract.address
    );

    console.log("\n 🏵 transferring all tokens to nestdrop contract")
   
    await deployedNestcoinContract.transfer(
        deployedNestdropContract.address, ethers.utils.parseEther("10000000")
    )

    console.log("\n    ✅ successful tranfer of tokens...\n");

   contract = await deployedNestdropContract.deployed();

    })

    

    it("Should be able to mint token to contract address", async function(){
        const [ owner] = await ethers.getSigners(); 
        await firstcontract.connect(owner).mint(contract.address,  ethers.utils.parseEther("10000000"));
    })

});

describe("Admins()", function(){

    

    it("Should be able to add, remove Admins", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        console.log('\t', " Admin Address: ", owner.address);
        assignAdmin = await contract.connect(owner).assignAdmin(secondAccount.address);
        const txResult = await assignAdmin.wait();
        expect(txResult.status).to.equal(1);
        removeAdmin = await contract.connect(owner).removeAdmin(secondAccount.address);
        const txResult2 = await removeAdmin.wait();
        expect(txResult2.status).to.equal(1);
        console.log("Revert if address is not an admin");
        await expect(contract.connect(owner).removeAdmin(thirdAccount.address)).to.be.revertedWith("Address is not an admin.");
    
    })
});



describe("Reward", function(){

    it("Admin that has been removed should not be able to reward", async function(){
        const [ owner, secondAccount] = await ethers.getSigners();
        await contract.connect(owner).assignAdmin(secondAccount.address);
        await contract.connect(owner).removeAdmin(secondAccount.address);
        await expect(contract.connect(secondAccount).airdrop(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2,2])).to.be.revertedWith("Only Admin Has Access!");

    });

    it("Should not be able to reward if loyal customer array and amount array are not equal.",async function(){
        const [ owner, secondAccount] = await ethers.getSigners();
        await contract.connect(owner).assignAdmin(secondAccount.address);
        await contract.connect(owner).removeAdmin(secondAccount.address);
        await expect(contract.connect(owner).airdrop(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2])).to.be.revertedWith("Array Lengths must be equal.");
    });


    it("Should be able to airdrop tokens to addresses", async function(){
        const [ owner] = await ethers.getSigners();
        const airdrop = await contract.connect(owner).airdrop(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2,2]);
        const result = await airdrop.wait();
        expect(result.status).to.equal(1);
    });

    it("Should not be able to airdrop more that 200 tokens", async function(){
        signers = [];
        rewards = [];
        [signer1, signer2]  = await ethers.getSigners(); 
        for (let i = 0; i < 150; i++){
            signers.push(signer1.address);
            signers.push(signer2.address);
            rewards.push(2);
            rewards.push(3);
        }
        const [ owner] = await ethers.getSigners();
        await expect(contract.connect(owner).airdrop(signers,rewards)).to.be.revertedWith("sorry, maximum number of addresses on a list cannot be more than 200");
    });

    it("Cant revert airdrop more than balance", async function(){
        signers = [];
        rewards = [];
        [signer1, signer2]  = await ethers.getSigners(); 
            signers.push(signer1.address);
            rewards.push(ethers.utils.parseEther("30000000"));

        const [ owner] = await ethers.getSigners();
        await expect(contract.connect(owner).airdrop(signers,rewards)).to.be.revertedWith("transfer amount exceeds balance")
    });



    it("Contract Should be able to Self Destruct", async function(){
        const [ owner] = await ethers.getSigners();
        const kill = await contract.connect(owner).kill();
        const txResult = await kill.wait();
        expect(txResult.status).to.equal(1);
    });

    it("None admin should not be able to self destruct contract", async function(){
        const [ owner, secondAccount] = await ethers.getSigners();
        await contract.connect(owner).assignAdmin(secondAccount.address);
        await contract.connect(owner).removeAdmin(secondAccount.address);
        expect(contract.connect(secondAccount).kill()).to.be.revertedWith("Only Admin Has Access!");
    });


    


});
