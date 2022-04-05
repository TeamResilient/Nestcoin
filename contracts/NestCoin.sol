// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//creatint a token as test. Tokens to be used will be imported

contract NestCoin is ERC20, Ownable {

    using SafeMath for uint256;
    // amount of reward to send to be decided
    uint256 reward = 10;

    //array of admins
    address[] admins;
   

    constructor() ERC20("NestCoin", "NCC") {
        //initializing contract deployer as admin
        admins.push(msg.sender);
    }

    event sendReward(address loyalCustomer, uint256 amountOfReward);

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }


// to check if a particular address is admin
function checkAdmin(address _address)
        public
        view
        returns (bool)
    {
        for (uint256 s = 0; s < admins.length; s += 1) {
            if (_address == admins[s]) return (true);
        }
        return (false);
    }

    // allow adding admins
 function addAdmin(address _admin)  public isAdmin(msg.sender) {
        (bool _isadmin) = checkAdmin(_admin);
        if (!_isadmin) admins.push(_admin);
    }

//to remove admin
 function removeAdmin(address _admin, uint256 s) public isAdmin(msg.sender) {
        (bool _isadmin) = checkAdmin(_admin);
        if (_isadmin) {
            admins[s] = admins[admins.length - 1];
            admins.pop();
        }
    }
//get array of admins addresses
function getAdmin() public view returns(address  [] memory){
    return admins;
}


// allow only admins to call function

    modifier isAdmin (address _admin){
        //require that any validated interaction should be in the admin array
    require(checkAdmin(msg.sender), "not admin");
        _;
    }


   //recieves two array, obe for addresses, and second for reward value from frontend for transactions


function batchTokensTransfer(address[] calldata customers, 
                             uint256[] calldata reward) isAdmin(msg.sender) external {
                             //check that the two arrays are equal in length
 require(customers.length == reward.length);
   for (uint i = 0; i < customers.length; i++) {

        
        _mint(customers[i], reward[i]);
    emit sendReward(customers[i], reward[i]);
      
   }
}
}
