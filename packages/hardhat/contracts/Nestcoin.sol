//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Nestcoin is ERC20, Ownable {
    constructor() ERC20("Nestcoin", "NTK") {
        
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function triggerMint() public onlyOwner {
        nestcoin.mint(to, amount);
    }

    function _burn(uint256 amount)
        internal override(ERC20)
    {
        super._burn(amount);
    }

    function burn() public {
        _burn(to, amount);
    }
}