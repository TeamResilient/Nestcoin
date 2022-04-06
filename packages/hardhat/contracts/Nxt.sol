//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "./Nestcoin.sol";


contract Nxt is Ownable {
    Nestcoin public nestcoin;

    event Payment(address indexed payer, uint amount, string indexed ref);

    constructor(address tokenAddr) {
        nestcoin = Nestcoin(tokenAddr);
    }

     function batchTokenTransfer(address[] memory _userAddr,  uint256[] memory _amount) public  onlyOwner {
        require(_userAddr.length == _amount.length, "Number of Addresses must match amount");
        require(_userAddr.length <= 200, "Array must not be greater than 200");
        for (uint256 i = 0; i < _userAddr.length; i++) {
            require(_amount[i] >= address(this).balance, "Not enough nestcoin to send");
            if(address(_userAddr[i]) != address(0)){
                nestcoin.transfer(_userAddr[i], _amount[i]);
            }
        }
    }   

    // with a ref, every payment is traceable to the value provided
    function pay(uint amountOfTokens, string memory ref) public {

        // Transfer token 
        nestcoin.transferFrom(msg.sender, address(this), amountOfTokens);

        // Emit Pay event
        emit Payment(msg.sender, amountOfTokens, ref);

    }
}
 