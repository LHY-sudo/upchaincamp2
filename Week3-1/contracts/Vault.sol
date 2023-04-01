// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    IERC20 Token;
    mapping(address => uint) public balances;
    constructor(address addr) {
        Token = IERC20(addr);
    }
    function deposit(uint amount) public {
        address dp = address(this);
        uint allow = Token.allowance(msg.sender,dp);
        require(allow >= amount,"ERC:Allowance must greater than amount");
        uint currentBalance = Token.balanceOf(dp);
        Token.transferFrom(msg.sender,dp,amount);
        uint newBalance = Token.balanceOf(dp);
        balances[msg.sender] += amount;
        require(newBalance == currentBalance+amount,"ERC:Error");
    }
    function withdraw(uint amount) public {
        uint bal = balances[msg.sender];
        require(bal >= amount,"ERC:Balance can`t less than amount");
        Token.transfer(msg.sender,amount);
        balances[msg.sender] -= amount;
    }
}
