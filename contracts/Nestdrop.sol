//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;

//importing our Nestcoin token contract
import "./NestCoin.sol";

//declaring the contract is ownable to enable us call functions from the inherited contacts
contract Nestdrop {
    constructor(address _NestCoin) {
        admins[msg.sender] = true;
        token = IERC20(_NestCoin);
    }

    //declaration of our token contract
    IERC20 public token;
    //mapping of admins to bool
    mapping(address => bool) public admins;

    //event to track airdrop
    //event Dispatched(address customer, uint amount);
    event AssignedAdmin(address adder, address newAdmin);
    event RemovedAdmin(address removerAdmin, address newAdmin);
    event DispatchRewards(address sender, uint256 total);

    //modifier to ensure only admins can call selected functions.
    modifier isAdmin(address _user) {
        bool isadmin = admins[_user];
        require(isadmin, "Only Admin Has Access!");
        _;
    }

    //add an admin address
    function assignAdmin(address _newAdmin) public isAdmin(msg.sender) {
        admins[_newAdmin] = true;
            //emit event
        emit AssignedAdmin(msg.sender, _newAdmin );
    }

    //remove an admin address
    function removeAdmin(address _admin) public isAdmin(msg.sender) {
        require(admins[_admin], "Address is not an admin.");
        admins[_admin] = false;
        //emit event
        emit RemovedAdmin(msg.sender, _admin );
    }

    //distribute rewards to eligible customers
    function airdrop(address[] calldata _address, uint256[] calldata _rewards)
        external
        isAdmin(msg.sender)
    {
        //loop through the loyal customers and map rewards from the allocatedQuotas
        require(
            _address.length == _rewards.length,
            "Array Lengths must be equal."
        );

        //ensure that rewards are sent in batches of 200
        require(
            _address.length <= 200,
            "sorry, maximum number of addresses on a list cannot be more than 200"
        );

        uint totalreward =0;
        for (uint i = 0; i < _address.length; i++) {
            uint256 userRewards = _rewards[i] * 10**18;
            
            require(token.transfer(_address[i], userRewards));
            totalreward = totalreward + userRewards;
            
            totalreward;
        }
        
        //emit event with total sent
        emit DispatchRewards(msg.sender, totalreward);
    }

    //destroy contract
    function kill() external isAdmin(msg.sender) {
        selfdestruct(payable(msg.sender));
    }
}
