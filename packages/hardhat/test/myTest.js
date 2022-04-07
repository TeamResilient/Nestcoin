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
        const [owner, addr1, addr2] = await ethers.getSigners();
        await myContract.connect(owner).addAdmin(addr1.address);
       await expect(myContract.connect(addr2).batchTokenTransfer(
          ["0x6BB12976bdaE76f22D6FFFBD5D1c0125dD566936","0xe75B467b5623Bf0C07cb3C0D585083C383fCD28F"], 
          ["10", "20"], "1000000000000000")).to.be.revertedWith("Not admin");
      });
    });
  });
});
