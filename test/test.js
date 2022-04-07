//implement test
const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract;

describe("NestCoin", function(){
    it("should be deployed to the testnet", async function(){
        const NestcoinContract = await ethers.getContractFactory("NestcoinReward");
        const [ owner ] = await ethers.getSigners();
        const deployedNestcoinContract = await NestcoinContract.connect(owner).deploy();
        contract = await deployedNestcoinContract.deployed();

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
        await expect(contract.connect(secondAccount).dispatchRewards(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2,2])).to.be.revertedWith("Only Admin Has Access!");

    });

    it("Should not be able to reward if loyal customer array and amount array are not equal.",async function(){
        const [ owner, secondAccount] = await ethers.getSigners();
        await contract.connect(owner).assignAdmin(secondAccount.address);
        await contract.connect(owner).removeAdmin(secondAccount.address);
        await expect(contract.connect(owner).dispatchRewards(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2])).to.be.revertedWith("Array Lengths must be equal.");
    });


    it("Should be able to airdrop tokens to addresses", async function(){
        const [ owner] = await ethers.getSigners();
        const airdrop = await contract.connect(owner).dispatchRewards(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2,2]);
        const result = await airdrop.wait();
        expect(result.status).to.equal(1);
    });

    


});