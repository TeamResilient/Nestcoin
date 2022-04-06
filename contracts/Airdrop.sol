//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NestcoinReward is ERC20  {
    //track admin
    mapping(address=>bool) private admins;
    
 

    //modifiers
    modifier isAdmin(address _user){
        bool isadmin = admins[_user];
        require(isadmin,"Only Admin Has Access!");
        _;
    }
    //events
    event AssignedAdmin(address newAdmin);
    event DispatchRewards(string message);


    constructor() ERC20("Nestcoin","NTC"){
        _mint(msg.sender,1000000 *10**18);
        admins[msg.sender]=true;
    }
  
    //add address as admin
    function assignAdmin (address _newAdmin) public isAdmin(msg.sender) {
        admins[_newAdmin]= true;
        emit AssignedAdmin(_newAdmin);
    }
    //distribute rewards to eligible customers
    function dispatchRewards (address[] calldata _addrs, uint256[] calldata _rewards) public isAdmin(msg.sender){
        //loop through the loyal customers and map rewards from the allocatedQuotas
        address[] memory addrs= _addrs;
        uint256[] memory rewards = _rewards ;
        require(addrs.length == rewards.length ,"Array Lengths must be equal.");
        for(uint32 customer = 0;customer <= addrs.length;customer ++){
            _mint(addrs[customer],rewards[customer]);
        }
        emit DispatchRewards("Rewards Successfully dispatched!");
    }
  
  
}



//["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB","0x617F2E2fD72FD9D5503197092aC168c91465E7f2","0x17F6AD8Ef982297579C203069C1DbfFE4348c372"]