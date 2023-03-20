// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Score {

    //定义事件
    event Deployed(address indexed teach,string indexed course);
    event SetScore(address indexed teach,address indexed stu,string indexed course);
    //学生分数
    mapping(address => uint8) scores;
    //Error 定义
    error OwnerErr();
    error ScoreErr();
    //管理员:教师
    address public Admin;
    //课程名字
    string public courseName = "Math";
    //查询成绩锁
    bool public Lock = true;
    //构造函数
    constructor(address teach){
        Admin = teach;
        emit Deployed(Admin,courseName);
    }
    //设置成绩
    function setScore(address stu,uint8 sc) public onlyAdmin verifyScore(sc) returns(bool) {
        scores[stu] = sc;
        emit SetScore(Admin,stu,courseName);
        return true;
    }
    //查询成绩
    function getScore() public view returns(uint8 sc) {
        require(Lock,"ERR: Not allow to get Score");
        sc = scores[msg.sender];
    }
    //设计查询锁
    function setLock(bool bl) public onlyAdmin {
        Lock = bl;
    }
    modifier onlyAdmin {
        if (Admin != msg.sender) {
            revert OwnerErr();
        }
        _;
    }
    modifier verifyScore(uint8 num) {
        if (num > 100) {
            revert ScoreErr();
        }
        _;
    }
}
