const chai = require("chai");
const hre = require("hardhat")
let except = chai.expect
const ethers = hre.ethers;

describe("Bank",function () {
    let bank;
    let owner;
    let user1;
    let user2;
    async function init() {
        [owner,user1,user2] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();

        console.log(`Bank.address: ${bank.address}`);
        console.log(`user1.address: ${user1.address}`);
        console.log(`user2.address: ${user2.address}`);
    }
    before(async function () {
        await init();
        await bank.connect(owner).setOnly(false);
    })
    describe("Deployment",function () {
        it("Set Admin",async function() {
            except(await bank.admin()).to.equal(owner.address);
        });
        it("Balance is zero",async function() {
            except(await bank.bankBalance()).to.equal(0)
        });
    });
    describe("Deposit",function () {
        it('should allow user to deposit', async function () {
            let init_balance = await bank.balances(user1.address);
            await bank.connect(user1).Deposit({value:ethers.utils.parseEther("0.02")});
            await setTimeout(async function () {
                except(await bank.balances(user1.address)).to.equal(init_balance.add(ethers.utils.parseEther("0.02")));
            },2000)

        });
        it('should not allow deposit of less than 0.01 ether', async function () {
            await except(bank.connect(user1).Deposit({value:ethers.utils.parseEther("0.005")})).to.be.revertedWith("Err: value must be greater than 0.01 ether.");
        });
        it('should add deposited funds to the bank balance', async function () {
            let init_balance = await bank.bankBalance();
            await bank.connect(user1).Deposit({value:ethers.utils.parseEther("0.02")});
            await setTimeout(async function () {
                except(await bank.bankBalance()).to.equal(init_balance.add(ethers.utils.parseEther("0.02")))
            },1000)
        });

    });
    describe("Withdraw",function (){
        it('should allow a user to withdraw funds', async function () {
            let init_balance = await bank.balances(user1.address);
            let amount = ethers.utils.parseEther("0.01")
            await bank.connect(user1).withdraw(amount);
            await setTimeout(async () => {
                except(await bank.balances(user1.address)).to.equal(init_balance.sub(amount));
            },2000)

        });
        it('should not allow a withdrawal greater than the balance', async function () {
            await except(bank.connect(user1).withdraw(ethers.utils.parseEther("5"))).to.be.revertedWith("Err:Amount must be less than balance");
        });
        it('should revert if the contract only be used by owner', async function () {
            await bank.connect(owner).setOnly(true);
            await except(bank.connect(user1).withdraw(10000)).to.be.revertedWith("Err: Only Admin");
        });
    })
    describe("withdrawall",function () {
        it('should allow a user to withdraw all their funds', async function () {
            await bank.connect(owner).setOnly(false);
            let initialBalance = await bank.balances(user1.address);
            await bank.connect(user1).withdrawAll();
            await setTimeout(async function () {
                except(await bank.balances(user1.address)).to.equal(ethers.BigNumber.from("0"));
            },2000)
        });
        it('should revert if the user has no funds to withdraw', async function () {
            await except(bank.connect(user2).withdrawAll()).to.be.revertedWith("Err: balance must be greater than zero");
        });
    })
})