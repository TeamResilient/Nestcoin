//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./Nestcoin.sol";


contract Nxt {
    NestCoin public nestcoin;

    constructor(address tokenAddr) {
        nestcoin = NestCoin(tokenAddr);
    }

     function batchTokenTransfer(address owner, address[] memory _userAddr,  uint256[] memory _amount) public  {
        require(_userAddr.length == _amount.length, "Number of Addresses must match amount");
        for (uint256 i = 0; i < _userAddr.length; i++) {
            transferFrom(owner, _userAddr[i], _amount[i]);
        }
    }   
}
 