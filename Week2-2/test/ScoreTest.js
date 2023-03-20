const { ethers } = require("hardhat")
const {expect} = require("chai")
const {applyProviderWrappers} = require("hardhat/internal/core/providers/construction");
const {extendConfig} = require("hardhat/config");

describe("Teacher and Score",function () {
    let Admin;
    let teacher;
    let student;
    let teach;
    let score;
    let Score;
    let Teach;

    async function init() {
        [Admin,teacher,student] = await ethers.getSigners();
        Teach = await ethers.getContractFactory("Teacher");
        Score = await ethers.getContractFactory("Score");
        teach= await Teach.deploy(teacher.address);
        await teach.deployed()
    }
    before(async function () {
        await init();
    })
    describe("Set Course",function () {
        before(async function() {
            score = await Score.deploy(teach.address);
            await score.deployed();
        })
        it('should: set course', async function () {
            let resp = await teach.connect(Admin).setCourse(await score.address);
            await resp.wait()
            let addr = await teach.scoredata();
            expect(addr).to.be.equal(score.address);
        });
    })
    describe("Teacher Storage",function () {
        it('should: return Admin', async function () {
            let result = await teach.teacher();
            expect(result).to.be.equal(teacher.address);
        });
        it('should: scoredara is equal to score.address', async function () {
            let result = await teach.scoredata();
            expect(result).to.be.equal(score.address);
        });
        it('should: courseName is equal to "Math"', async function () {
            let result = await teach.courseName();
            expect(result).to.be.equal("Math");
        });
    });
    describe("Score Storage",function () {
        it('should: Lock is true', async function () {
            let result = await score.Lock();
            expect(result).to.be.equal(true);
        });
        it('should: courseName is equal to "Math"', async function () {
            let result = await teach.courseName();
            expect(result).to.be.equal("Math");
        });
    });
    describe("Set Score",function () {
        it('should:tracher set score', async function () {
            await teach.connect(teacher).teachersetScore(student.address,50);
            let result = await score.connect(student).getScore();
            expect(result).to.be.equal(50);
        });
        it('should: Only teacher cant set Score', async function () {
            await expect(teach.connect(student).teachersetScore(teacher.address,50)).to.
                be.revertedWithCustomError(teach,"OnlyTeach");
        });
        it('should: score musr be less than 100 or equal to 100', async function () {
            await expect(teach.connect(teacher).teachersetScore(student.address,101)).
                to.be.revertedWithCustomError(score,"ScoreErr");
        });
    });
    describe("Set courseName",function () {
        it('should:only Admin can set corseName', async function () {
            await expect(teach.connect(teacher).setCourseName("Physical")).
                to.be.revertedWithCustomError(teach,"OnlyAdmin");
        });
        it('should: set course', async function () {
            await teach.connect(Admin).setCourseName("Physical");
            let result = await teach.courseName();
            expect(result).to.be.equal("Physical");
        });
    });
    describe("Set teacher",function () {
        it('should:only Admin can set teacher', async function () {
            await expect(teach.connect(teacher).setTeacher(teacher.address)).
            to.be.revertedWithCustomError(teach,"OnlyAdmin");
        });
        it('should: set tercher', async function () {
            await teach.connect(Admin).setTeacher(teacher.address);
            let result = await teach.teacher();
            expect(result).to.be.equal(teacher.address);
        });
    });
    describe("set Lock",function () {
        it('should: Only teacher can set Lock ', async function () {
            await expect(teach.connect(Admin).teacherSetLock(false)).to.be.revertedWithCustomError(teach,"OnlyTeach");
        });
        it('should: teacher set Lock', async function () {
            await teach.connect(teacher).teacherSetLock(false);
            await expect(score.connect(student).getScore()).to.be.revertedWith("ERR: Not allow to get Score");
        });
    })
})