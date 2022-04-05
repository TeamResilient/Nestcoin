
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NestCoin is ERC20, Ownable {

    using SafeMath for uint256;
    // amount of reward to send to be decided
    uint256 reward = 10;

    //array of admins
    address[] admins;

    constructor() ERC20("NestCoin", "NCT") {

        //initializing contract deployer as admin
        admins.push(msg.sender);
    }

    // mint a supply of 10000 tokens
    function mint() public onlyOwner {
        _mint(msg.sender, 10000 * 10 ** 18);
    }

    event sendReward(address loyalCustomer, uint256 amountOfReward);

    // mint tokens to address
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

        //recieves array from frontend for transactions
    function batchTokensTransfer(address[] calldata loyalCustomer) isAdmin(msg.sender) external {

        for (uint i = 0; i < loyalCustomer.length && i <= 200; i++) {
       //minting new token rather than transfer
         _mint(loyalCustomer[i], reward);

         //emtting actions
        emit sendReward(loyalCustomer[i], reward);
      
        }
    }
}

