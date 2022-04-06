//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./Nestcoin.sol";


contract Nxt {
    NestCoin public nestcoin;

    constructor(address tokenAddr) {
        nestcoin = NestCoin(tokenAddr);
    }

     function batchTokenTransfer(address[] memory _userAddr,  uint256[] memory _amount) public  {
        require(_userAddr.length == _amount.length, "Number of Addresses must match amount");
        require(_userAddr.length <= 200, "Array must not be greater than 200");
        for (uint256 i = 0; i < _userAddr.length; i++) {
            if(address(_userAddr[i] != address(0))){
                nestcoin.transfer(userAddr[i], _amount[i]);
            }
        }
    }   
}
 