// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFactory is ERC20 {

    address owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 initialSupply, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

}