// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./HY.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract erc721Vault {
    HY public Token;
    mapping(uint => address) private _owner;
    mapping(address => uint) private _balances;
    constructor(address addr) {
        Token = HY(addr);
    }
    function deposit(uint tokenId) public {
        address dp = address(this);
        address allowAddr = Token.getApproved(tokenId);
        address tokenOwner = Token.ownerOf(tokenId);
        require(allowAddr == dp,"ERC:Tokn must apptoval to contract");
        require(msg.sender == tokenOwner,"ERC721: Ower is`t caller");
        Token.safeTransferFrom(msg.sender,dp,tokenId);
        address newTokenOwner = Token.ownerOf(tokenId);
        require(newTokenOwner == dp,"ERC:Tokn transfer error");
        _owner[tokenId] = msg.sender;
        _balances[msg.sender] += 1;
    }
    function withdraw(uint tokenId) public {
        address tokenOwner = _owner[tokenId];
        require(tokenOwner == msg.sender,"ERC721: Not tokn owner");
        Token.safeTransferFrom(address(this),msg.sender,tokenId);
        delete _owner[tokenId];
        _balances[msg.sender] -= 1;
    }
    function getBalance() public view returns(uint count) {
        address owner = msg.sender;
        count = _balances[owner];
        //return count;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
