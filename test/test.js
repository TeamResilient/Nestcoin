//implement test
const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract;

describe("NestCoin", function(){
    it("should be deployed to the testnet", async function(){
        const NestcoinContract = await ethers.getContractFactory("NestCoin");
        const [ owner ] = await ethers.getSigners();
        const deployedNestcoinContract = await NestcoinContract.connect(owner).deploy();
        contract = await deployedNestcoinContract.deployed();

    })
});

describe("Admins()", function(){
    it("Should be able to add, get, check, remove Admins", async function(){
        const [ owner,secondAccount ] = await ethers.getSigners();
        console.log('\t', " Admin Address: ", owner.address);
        await contract.addAdmin(owner.address);
        const admins = await contract.getAdmin();
        expect(admins[0]).to.equal(owner.address);
        const checkAdmin = await contract.checkAdmin(owner.address);
        console.log(checkAdmin);
        expect(checkAdmin).to.equal(true);
        
    })
});

describe("Airdrop", function(){
    it("Should be able to airdrop tokens to addresses", async function(){
        const [ owner] = await ethers.getSigners();
        const NestcoinContract2 = await ethers.getContractFactory("NestCoin");
        const deployedNestcoinContract2 = await NestcoinContract2.connect(owner).deploy();
        const contract2 = await deployedNestcoinContract2.deployed();
        const airdrop = await contract2.connect(owner).airdrop(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'] ,[2,2]);
        const result = await airdrop.wait();
        expect(result.status).to.equal(1);
    })
});