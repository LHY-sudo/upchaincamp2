// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Score.sol";

contract Teacher {
    //设置老师合约部署事件
    event Deployed(address indexed teach,string indexed course,address indexed admin);
    //设置管理员
    address public Admin;
    //定义错误
    error OnlyTeach();
    error OnlyAdmin();
    //设置老师
    address public teacher;
    //score合约
    Score public scoredata;
    //课程名字
    string public courseName = "Math";
    //构造函数
    constructor(address teach){
        Admin = msg.sender;
        teacher = teach;
        emit Deployed(teacher,courseName,Admin);
    }
    //设置课程
    function setCourse(address scoreadd) public onlyAdmin {
        scoredata = Score(scoreadd);
    }
    //设置学生成绩
    function teachersetScore(address stu,uint8 sc) public onlyTeacher returns(bool)  {
        bool result = scoredata.setScore(stu,sc);
        require(result,"ERR: SetScore Error");
        return result;
    }
    //设置查询锁
    function teacherSetLock(bool code) public onlyTeacher  {
        scoredata.setLock(code);
    }
    //更换老师
    function setTeacher(address teach) public onlyAdmin  {
        teacher = teach;
    }
    //更换课程名字
    function setCourseName(string calldata cour) public onlyAdmin  {
        courseName = cour;
    }
    modifier onlyTeacher {
        if (msg.sender != teacher) {
            revert OnlyTeach();
        }
        _;
    }
    modifier onlyAdmin {
        if (msg.sender != Admin) {
            revert OnlyAdmin();
        }
        _;
    }
}
