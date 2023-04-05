// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract DLToken is IERC20,Pausable,Ownable {

    mapping(address => uint256) private balances;

    mapping(address => mapping(address => uint256)) private allowances;

    uint256 private Supply;

    string private Name;
    string private Symbol;

    bool Lock = true;
    uint8 Decimals;

    function mint() public  {
        _mint(_msgSender(),100e18);
    }
    function name() public view returns(string memory) {
        return Name;
    }
    function symbol() public view returns(string memory) {
        return Symbol;
    }
    function decimals() public view returns(uint8) {
        return Decimals;
    }
    function totalSupply() public view override returns(uint) {
        return Supply;
    }
    function balanceOf(address account) public view override returns(uint) {
        return balances[account];
    }
    function allowance(address owner,address spender) public view override returns(uint) {
        return allowances[owner][spender];
    }
    function pause() public onlyOwner {
        _pause();
    }
    function unpause() public onlyOwner {
        _unpause();
    }
    function transfer(address to,uint256 amount) public override returns(bool) {
        address owner = _msgSender();
        _transferFrom(owner,to,amount);
        return true;
    }
    function transferFrom(address from,address to,uint256 amount) public override returns(bool) {
        address owner = _msgSender();
        _spendAllowance(from,owner,amount);
        _transferFrom(from,to,amount);
        return true;
    }
    function approve(address spender,uint256 amount) public override returns(bool) {
        address owner = _msgSender();
        _approve(owner,spender,amount);
        return true;
    }
    function burn( uint256 amount) public {
        address owner = _msgSender();
        _burn(owner,amount);
    }

    function _approve(address owner,address spender,uint amount) internal  {
        require(owner != address(0),"from is zero");
        require(spender != address(0),"to is zero");
        allowances[owner][spender] = amount;
        emit Approval(owner,spender,amount);
    }
    function _transferFrom(address from,address to,uint256 amount) internal {
        require(from != address(0),"from is zero");
        require(to != address(0),"to is zero");
        _beforeTokenTransfer(from,to,amount);
        uint fromBalance = balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
        balances[from] = fromBalance - amount;
        balances[to] += amount;
    }
        emit Transfer(from,to,amount);
        _afterTokenTransfer(from, to, amount);
    }

    function _spendAllowance(address owner,address spender,uint amount) internal{
        uint currentAllowance = allowance(owner,spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount,"ERC20: insufficient allowance");
            unchecked {
            _approve(owner,spender,currentAllowance-amount);
        }
        }
    }
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal whenNotPaused {}

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    function _burn(address from,uint amount) internal  {
        require(from != address(0),"ERC20: burn from the zero address");
        _beforeTokenTransfer(from,address(0),amount);
        uint currentBalance = balances[from];
        require(currentBalance >= amount,"ERC20: burn amount exceeds balance");
        unchecked {
        balances[from] = currentBalance - amount;
        Supply -= amount;
    }
        emit Transfer(from,address(0),amount);
        _afterTokenTransfer(from,address(0),amount);
    }

    function _mint(address to,uint amount) internal {
        require(Lock,"only constructor");
        require(to != address(0),"ERC20: mint to the zero address");
        balances[to] += amount;
        emit Transfer(address(0),to,amount);
        Lock = false;
    }
}
