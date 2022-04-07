//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NestcoinReward is ERC20, Ownable  {
    //track nestcoin admins
    mapping(address=>bool) private admins; 

    //modifiers
    modifier isAdmin(address _user){
        bool isadmin = admins[_user];
        require(isadmin, "Only Admin Has Access!");
        _;
    }
    //events
    event AssignedAdmin(address newAdmin);
    event RemovedAdmin(address newAdmin);
    event DispatchRewards(string message);


    constructor() ERC20("Nestcoin","NCT"){
     
        admins[msg.sender] = true;
    }
  
    //add an admin address
    function assignAdmin (address _newAdmin) public isAdmin(msg.sender) {
        admins[_newAdmin] = true;
        emit AssignedAdmin(_newAdmin);
    }

    //remove an admin address
    function removeAdmin (address _admin) public isAdmin(msg.sender) {
        require(admins[_admin], "Address is not an admin.");
        admins[_admin] = false;
        emit RemovedAdmin(_admin);
    }

    //distribute rewards to eligible customers
    function dispatchRewards (
        address[] calldata _addrs,
        uint256[] calldata _rewards) external isAdmin(msg.sender){
        
        //loop through the loyal customers and map rewards from the allocatedQuotas
        require(_addrs.length == _rewards.length , "Array Lengths must be equal.");
        for(
            uint32 i = 0;
            i < _addrs.length && i <= 200;
            i++){_mint(_addrs[i], (_rewards[i] *(10 ** 18))
            );
        }
        emit DispatchRewards("Rewards Successfully dispatched!");
    }  
}
