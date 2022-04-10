// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// importing the ERC20 token standard from openzepplin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//declaring that Nestcoin is a type of ERC20 token

contract NestCoin is ERC20, Ownable {
    //declaring the Name and Symbol of the token
    constructor() ERC20("NestCoin", "NCT") {
        //pre-minting 10million nestcoin
        _mint(msg.sender, 10000000 * 10**decimals());
    }
     function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
