// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NestCoin is ERC20, Ownable {
    constructor(
        
    ) ERC20("NestCoin", "NCT") {}

    // mint a supply of 10000 tokens
    function mint() public onlyOwner {
        _mint(msg.sender, 10000 * 10 ** 18);
    }
}
