//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NestcoinReward is ERC20  {
    mapping(address=>uint256) private allocatedQuotas;
    mapping(address=>bool) private admins;
    address[] private loyalCustomers;
 

    //modifiers
    modifier isAdmin(address _user){
        bool isadmin = admins[_user];
        require(isadmin,"Only Admin Has Access!");
        _;
    }
    //events
    event AssignedAdmin(address newAdmin);


    constructor() ERC20("Nestcoin","NTC"){
        _mint(msg.sender,1000000 *10**18);
        admins[msg.sender]=true;
    }
    function mintToken(address _to, uint256 amount)  public {
        _mint(_to,amount);
    }
    //add address as admin
    function assignAdmin (address _newAdmin) public isAdmin(msg.sender) returns(bool){
        admins[_newAdmin]= true;
        emit AssignedAdmin(_newAdmin);
        return true;
    }
    //distribute rewards to eligible customers
    function distributeRewards () public isAdmin(msg.sender) returns(bool){
        //loop through the loyal customers and map rewards from the allocatedQuotas
        for(uint32 customer = 0;customer <= loyalCustomers.length;customer ++){
            _mint(allocatedQuotas[loyalCustomers[customer][0]],allocatedQuotas[loyalCustomers[customer][1]]);
            delete loyalCustomers[customer];
        }
        return true;
    }
    //add to pool of loyal customers 
    function addToPool(address _customer,uint256 reward) public isAdmin(msg.sender) returns(bool){
        //add qualified customer to pool
        loyalCustomers.push([_customer,reward]);
        return true;
    }
    function loadAllocatedQuotas(address[] calldata _addr) external isAdmin(msg.sender){
        //array structure [[address,allocation],[address,allocation],[address,allocation]]
        loyalCustomers = _addr;
        for (uint32 count =0;count <=_addr.length;count++){
            allocatedQuotas[_addr[i][0]]= _addr[i][1];
        }
    }
    function viewLoyalCustomers() public view returns(address[] memory){
        return loyalCustomers;
    }
  
}



//["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB","0x617F2E2fD72FD9D5503197092aC168c91465E7f2","0x17F6AD8Ef982297579C203069C1DbfFE4348c372"]