//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "./Nestcoin.sol";


contract Nxt is Ownable {
    Nestcoin public nestcoin;

    event Payment(address indexed payer, uint amount, bytes32 indexed ref, uint time);
    event BatchTransfer(uint amount, address indexed adminAddress);

    constructor(address tokenAddr) {
        nestcoin = Nestcoin(tokenAddr);
    }

     function batchTokenTransfer(address[] memory _userAddr,  uint256[] memory _amount, uint256 totalAmount) public  onlyOwner {
        require(_userAddr.length == _amount.length, "Number of Addresses must match amount");
        require(_userAddr.length <= 200, "Array must not be greater than 200");

        nestcoin.mint(address(this), totalAmount - nestcoin.balanceOf(address(this)));
        for (uint256 i = 0; i < _userAddr.length; i++) {
            nestcoin.transfer(_userAddr[i], _amount[i]);
        }

        emit BatchTransfer(totalAmount, msg.sender);
    }   

    // with a ref, every payment is traceable to the value provided
    function pay(uint amountOfTokens, bytes32 ref) public {

        // Transfer token 
        nestcoin.transferFrom(msg.sender, address(this), amountOfTokens);

        // Emit Pay event
        emit Payment(msg.sender, amountOfTokens, ref, block.timestamp);

    }
}
 