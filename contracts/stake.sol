// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Token {
    function balanceOf(address account) external view returns (uint256); 
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (uint256);
}

contract Stake{

    Token token;
    uint256 totalStakingAmount;
    uint256 treasury;

    struct StakeInfo {               
        uint256 amount; 
        uint256 claimed;       
    }

    mapping (address => StakeInfo) public stakeInfos;

    event Staked(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);

    constructor(Token _tokenAddress){
        require(address(_tokenAddress) != address(0), "Not zero address required");
        token = _tokenAddress;
        treasury = 0;
        totalStakingAmount = 0;
    }

    function stake(uint256 _amount) external payable {
        require(token.balanceOf(msg.sender) > _amount, "Stake amount should be correct");
        
        token.transferFrom(msg.sender, address(this), _amount);

            stakeInfos[msg.sender] = StakeInfo({                
                amount: _amount,
                claimed: 0
            });
        
        totalStakingAmount = totalStakingAmount + _amount;
        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external payable{
        StakeInfo storage stakeInfo = stakeInfos[msg.sender];
        require(stakeInfo.amount >= _amount, "Unstake amount should be correct");

        token.transfer(msg.sender, _amount);
        stakeInfo.amount = stakeInfo.amount - _amount;

        totalStakingAmount = totalStakingAmount - _amount;

        emit Unstake(address(this), _amount);
    }
}