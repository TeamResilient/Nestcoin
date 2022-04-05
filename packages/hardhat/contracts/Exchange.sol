//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./Nestcoin.sol";


contract Nxt {
    NestCoin public nestcoin;

    event Pay(address payer, uint amount, string ref);

    constructor(address tokenAddr) {
        nestcoin = NestCoin(tokenAddr);
    }

     function batchTokenTransfer(address owner, address[] memory _userAddr,  uint256[] memory _amount) public  {
        require(_userAddr.length == _amount.length, "Number of Addresses must match amount");
        for (uint256 i = 0; i < _userAddr.length; i++) {
            transferFrom(owner, _userAddr[i], _amount[i]);
        }
    }   

    // with a ref, every payment is traceable to the value provided
    function pay(uint amountOfTokens, string ref) public {

        // Transfer token 
        nestcoin.transferFrom(msg.sender, address(this), amountOfTokens);

        // Emit Pay event
        emit Pay(msg.sender, amountOfTokens, ref);

    }
}
 