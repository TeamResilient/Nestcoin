const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("NestCoin", function () {
  let myContract;
  

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);

    
  });

  describe("Nxt", function () {
    it("Should deploy YourContract", async function () {
      const NestToken = await ethers.getContractFactory("Nestcoin")
      nexttoken = await NestToken.deploy()
      const YourContract = await ethers.getContractFactory("Nxt")
      myContract = await YourContract.deploy(nexttoken.address);
  
    });

    describe("Nxt functions", function () {
      it("Only Owner can add admin", async function () {
        const [owner, addr1] = await ethers.getSigners();

        await myContract.connect(owner).addAdmin(addr1.address);
        expect(await myContract.isAdmin(addr1.address)).to.equal(true);
      });

      it("only admin can do batch transfer ", async function () {
        const [owner, addr1] = await ethers.getSigners();

        await myContract.connect(owner).addAdmin(addr1.address);

        
      });
    });
  });
});
