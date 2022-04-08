//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;

//importing our Nestcoin token contract
import "./NestCoin.sol";

//declaring the  contract is ownable to enable us call functions from the inherited contacts
contract Nestdrop {
    constructor(address _NestCoin) {
        admins[msg.sender] = true;
        token = IERC20(_NestCoin);
    }

    //declaration of our token contract
    IERC20 public token;
    //mapping of admins to bool
    mapping(address => bool) private admins;

    //event to track airdrop
    event Dispatched(address customer, uint amount);

    //modifier to ensure only admins can call selected functions.
    modifier isAdmin(address _user) {
        bool isadmin = admins[_user];
        require(isadmin, "Only Admin Has Access!");
        _;
    }

    //add an admin address
    function assignAdmin(address _newAdmin) public isAdmin(msg.sender) {
        admins[_newAdmin] = true;
    }

    //remove an admin address
    function removeAdmin(address _admin) public isAdmin(msg.sender) {
        require(admins[_admin], "Address is not an admin.");
        admins[_admin] = false;
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
        require(
            _address.length <= 200,
            "sorry, maximum number of addresses on a list cannot be more than 200"
        );

        for (uint i = 0; i < _address.length; i++) {
            uint256 userRewards = _rewards[i] * 10**18;
            require(token.transfer(_address[i], userRewards));

            emit Dispatched(_address[i], userRewards);
        }
    }

    function kill() external isAdmin(msg.sender) {
        selfdestruct(payable(msg.sender));
    }
}
