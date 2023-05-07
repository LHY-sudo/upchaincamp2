// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract Vault is AutomationCompatible {
    IERC20 public Token;
    mapping(address => uint) public balances;
    address public owner;
    constructor(address addr) {
        Token = IERC20(addr);
        owner = msg.sender;
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
    function checkUpkeep(bytes calldata checkData) public cannotExecute override returns (bool result, bytes memory performData) {
        uint256 Reserve = Token.balanceOf(address(this));
        performData = new bytes(0);
        if (Reserve > 10000e18) {
            result = true;
        } else {
            result = false;
        }
    }

    function performUpkeep(bytes calldata performData) public override {
        uint256 Reserve = Token.balanceOf(address(this));
        if (Reserve > 10000e18) {
            Token.transfer(owner,Reserve/2);
        }
    }
}