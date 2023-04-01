const { ethers } = require("hardhat");
const { expect } = require('chai');
const hre = require("hardhat");
const {extendConfig} = require("hardhat/config");
const {applyProviderWrappers} = require("hardhat/internal/core/providers/construction");

describe("Week3-1",function () {
    let Admin;
    let user1;
    let user2;
    let DL;
    let Valut;
    let dl;
    let vault;
    async function init() {
        [Admin,user1,user2] = await hre.ethers.getSigners();
        DL = await hre.ethers.getContractFactory("DLToken");
        Valut = await hre.ethers.getContractFactory("Vault");
        dl = await DL.deploy();
        await dl.deployed();
    }
    before(async function() {
        await init();
    })
    describe("deploy Vault",function () {
        before(async function() {
            vault = await Valut.deploy(dl.address);
            await vault.deployed()
        })
        it('should:Balance is zero', async function () {
            let AdminBalance = await vault.balances(Admin.address)
            expect(AdminBalance).to.be.equal(0);
        });
    })
    describe("DLToken",function () {
        it('should:Balance od Admin is 1*10**25', async function () {
            let balance = await dl.balanceOf(Admin.address);
            expect(balance).to.be.equal(ethers.BigNumber.from("10000000000000000000000000"));
        });
        it('should: transfer', async function () {
            await dl.connect(Admin).transfer(user1.address,ethers.BigNumber.from("10000000000000000000000"));
            let result = await dl.balanceOf(user1.address)
            expect(result).to.be.equal(ethers.BigNumber.from("10000000000000000000000"));
        });
        it('should: approve', async function () {
            await dl.connect(Admin).approve(user1.address,ethers.BigNumber.from("10000000000000000000000"));
            let result = await dl.allowance(Admin.address,user1.address);
            expect(result).to.be.equal(ethers.BigNumber.from("10000000000000000000000"));
        });
        it('should: transferFrom', async function () {
            await dl.connect(user1).transferFrom(Admin.address,user2.address,ethers.BigNumber.from("10000000000000000000000"));
            let result = await dl.balanceOf(user2.address);
            expect(result).to.be.equal(ethers.BigNumber.from("10000000000000000000000"));
        });
        it('should: paused return false', async function () {
            let result = await dl.paused();
            expect(result).to.be.equal(false)
        });
        it('should: only Admin can paused', async function () {
            await expect(dl.connect(user1).pause()).to.be.revertedWith("Ownable: caller is not the owner")
        });
        it('should: Admin', async function () {
            await dl.connect(Admin).pause();
            await expect(dl.connect(Admin).transfer(user1.address,ethers.BigNumber.from("10000000000000000000000"))).to.be.revertedWith("Pausable: paused");

        });
        it('should: unpaused', async function () {
            await dl.connect(Admin).unpause();
            let oldresult = await dl.allowance(Admin.address,user1.address);
            await dl.connect(Admin).approve(user1.address,ethers.BigNumber.from("10000000000000000000000"));
            let result = await dl.allowance(Admin.address,user1.address);
            expect(result).to.be.equal(ethers.BigNumber.from("10000000000000000000000").add(oldresult));
        });
        it('should: burn other account', async function () {
            let oldresult = await dl.balanceOf(user1.address);
            await dl.connect(user1).burn(ethers.BigNumber.from("10000000000000000000000"))
            let result = await dl.balanceOf(user1.address);
            expect(result).to.be.equal(oldresult.sub(ethers.BigNumber.from("10000000000000000000000")));
        });
        it('should: revert when burn token greater than balance', async function () {
            await expect(dl.connect(user1).burn(ethers.BigNumber.from("10"),{gasLimit:2000000})).to.be.revertedWith('ERC20: burn amount exceeds balance')
        });
    })
    describe("Vault",function () {
        it('should: must be approval ', async function () {
            await dl.connect(Admin).transfer(user1.address,ethers.BigNumber.from("10000000000000000000000"))
            await expect(vault.connect(user1).deposit(ethers.BigNumber.from("100000000"))).to.be.revertedWith("ERC:Allowance must greater than amount");
        });
        it('should: remeber deposit', async function () {
            let result = await dl.balanceOf(user1.address);
            await dl.connect(user1).approve(vault.address,result);
            await vault.connect(user1).deposit(ethers.BigNumber.from("10000"));
            let bal = await vault.balances(user1.address);
            expect(bal).to.be.equal(ethers.BigNumber.from("10000"))
        });
        it('should: balanceOf(vault)-1', async function () {
            let result = await dl.balanceOf(vault.address);
            expect(result).to.be.equal(ethers.BigNumber.from("10000"));
        });
        it('should: withdraw', async function () {
            let bal = await vault.balances(user1.address);
            await vault.connect(user1).withdraw(ethers.BigNumber.from("5000"));
            let bal2 = await vault.balances(user1.address);
            expect(bal2).to.be.equal(bal.sub(ethers.BigNumber.from("5000")));
        });
        it('should: balanceOf(vault)-2', async function () {
            let result = await dl.balanceOf(vault.address);
            expect(result).to.be.equal(ethers.BigNumber.from("5000"));
        });
    })
})