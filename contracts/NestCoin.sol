// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NestCoin is ERC20, Ownable {
    //array of admins
    address[] admins;

    constructor() ERC20("NestCoin", "NCT") {
        //initializing contract deployer as admin
        admins.push(msg.sender);
    }

    // mint a supply of 10000 tokens
    event sendReward(address loyalCustomer, uint256 amountOfReward);

    // mint tokens to address
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // to check if a particular address is admin
    function checkAdmin(address _address) public view returns (bool) {
        for (uint256 s = 0; s < admins.length; s += 1) {
            if (_address == admins[s]) return (true);
        }
        return (false);
    }

    // allow adding admins
    function addAdmin(address _admin) public isAdmin(msg.sender) {
        bool _isadmin = checkAdmin(_admin);
        if (!_isadmin) admins.push(_admin);
    }

    //to remove admin
    function removeAdmin(address _admin, uint256 s) public isAdmin(msg.sender) {
        bool _isadmin = checkAdmin(_admin);
        if (_isadmin) {
            admins[s] = admins[admins.length - 1];
            admins.pop();
        }
    }

    //get array of admins addresses
    function getAdmin() public view returns (address[] memory) {
        return admins;
    }

    // allow only admins to call function
    modifier isAdmin(address _admin) {
        //require that any validated interaction should be in the admin array
        require(
            checkAdmin(msg.sender),
            "only admins can interact with this function"
        );
        _;
    }

    //recieves array from frontend for transactions
    function airdrop(
        address[] calldata loyalCustomer,
        uint256[] calldata reward
    ) external isAdmin(msg.sender) {
        //to check that the number of customers corresponds to the number of rewards
        uint decimal = 10**18;
        require(
            loyalCustomer.length == reward.length,
            "the list of customers must be equal to the number of rewards"
        );
        for (uint i = 0; i < loyalCustomer.length && i <= 200; i++) {
            //minting new token
            _mint(loyalCustomer[i], (reward[i] * decimal));

            //emitting airdrop actions
            emit sendReward(loyalCustomer[i], reward[i]);
        }
    }
}
