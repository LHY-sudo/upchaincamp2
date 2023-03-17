#w2-1

---

###Bank.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    //管理员
    address payable public admin;
    //记录余额
    mapping(address => uint) public balances;
    //重入锁
    bool public Lock = true;
    //admin 锁
    bool public only = true;
    //初始化
    constructor(){
        admin = payable(msg.sender);
    }
    //存款
    function Deposit() public payable safeLock {
        //检查message中携带的wei是否符合要求
        require(msg.value > 1e16,"Err: value must be greater than 0.01 ether.");
        //0.8以后自带溢出检查；
        balances[msg.sender] += msg.value;
    }
    //取部分
    function withdraw(uint amount) public safeLock {
        //检查余额
        require(balances[msg.sender] >= amount,"Err:Amount must be less than balance");
        //从账本减去取款
        balances[msg.sender] -= amount;
        //发送取款
        (bool result,) = msg.sender.call{value: amount}("");
        //判断转账是否成功
        require(result,"Err:Trandfer failure");
    }
    //取全部
    function withdrawAll() public safeLock  {
        //读取现有存款
        uint amount = balances[msg.sender];
        //判断存款是否为零
        require(amount > 0,"Err: balance must be greater than zero");
        //转账
        (bool result,) = msg.sender.call{value: amount}("");
        //判断转账是否成功
        require(result,"Err: Transfer failure");
        //余额归零
        delete balances[msg.sender];
    }
    //合约余额
    function bankBalance() public view returns(uint balance) {
        balance = address(this).balance;
    }
    //设置是否只有管理员可以存取款
    function setOnly(bool arg) public {
        require(admin == msg.sender,"Err: Only Admin");
        only = arg;
    }
    //函数修改器验证权限以及避免重入
    modifier safeLock() {
        if (only) {
            require(admin == msg.sender,"Err: Only Admin");
        }
        require(Lock,"Err:");
        Lock = false;
        _;
        Lock = true;
    }
    //收款函数
    receive() external payable {
        balances[msg.sender] += msg.value;
    }
    //不接受函数选择器错误的调用
    fallback() external {
        require(false,"Err: Selector is wrong.");
    }
}

```

* [Deployed Address: 0x2C5d57e6f259a29F7de56c48Dc6099B7B71eb98A](https://goerli.etherscan.io/address/0x2C5d57e6f259a29F7de56c48Dc6099B7B71eb98A)
* ![Picture]("./img/Bank.png)