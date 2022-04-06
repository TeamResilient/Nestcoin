//implement test
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NestCoin", function(){
    it("should be deployed to the testnet", async function(){
        const NestcoinContract = await ethers.getContractFactory("NestCoin");
        const deployedNestcoinContract = await NestcoinContract.deploy();
        const contract = await deployedNestcoinContract.deployed();
    })
})