const {expect} = require("chai");
const {ethers} = require("hardhat");
const {BigNumber} =require("ethers")


describe("Upgradeable Contract",function () {
    let Admin;
    let user1;
    let user2;
    //@dev ContractFactory 实例
    let ERC20;
    let ERC720_V2;
    let Proxy_Admin;
    let Tranparent_Upgradeable;
    //@dev deployed receipt
    let tranparent_upgradeable;
    let proxy_admin;
    let erc20;
    let erc20_V2;
    let Data;
    async function init() {
        [Admin,user1,user2] = await ethers.getSigners();
        ERC20 = await ethers.getContractFactory("ERC20Upgradeable");
        ERC720_V2 = await ethers.getContractFactory("ERC20UpgradeableV2");
        Proxy_Admin = await ethers.getContractFactory("ProxyAdmin");
        Tranparent_Upgradeable = await ethers.getContractFactory("TransparentUpgradeableProxyV2");
        erc20 = await ERC20.deploy();
        erc20_V2 = await ERC720_V2.deploy();
        proxy_admin = await Proxy_Admin.deploy();
        await erc20.deployed()
        await erc20_V2.deployed();
        await proxy_admin.deployed();
    }
    before(async function () {
        await init();
    })
    describe("TransparentUpfradeableProxy",function () {
        before(async function () {
            Data = erc20.interface.encodeFunctionData("initialize(string,string)",["DLToken","DL"]);
            tranparent_upgradeable = await Tranparent_Upgradeable.deploy(erc20.address,proxy_admin.address,Data);
            await tranparent_upgradeable.deployed()
        })
        it('should: Implement', async function () {
            let result = await proxy_admin.getProxyImplementation(tranparent_upgradeable.address);
            expect(result).to.be.equal(erc20.address);
        });
        it('should: name() ', async function () {
            let result = await erc20.attach(tranparent_upgradeable.address).name();
            expect(result).to.be.equal("DLToken");
        });
        it('should: symbol()', async function () {
            let result = await erc20.attach(tranparent_upgradeable.address).symbol();
            expect(result).to.be.equal("DL");
        });
        it('should: First mint()', async function () {
            await erc20.attach(tranparent_upgradeable.address).connect(Admin).mint();
            let result = await erc20.attach(tranparent_upgradeable.address).balanceOf(Admin.address);
            expect(result).to.be.equal(BigNumber.from("1000000000000000000000"));
        });
        it('should: Second mint()', async function () {
            await erc20.attach(tranparent_upgradeable.address).connect(Admin).mint();
            let result = await erc20.attach(tranparent_upgradeable.address).balanceOf(Admin.address);
            expect(result).to.be.equal(BigNumber.from("2000000000000000000000"));
        });
    })
    describe("Change Implemention",function () {
        it('should:change implemention', async function () {
            await proxy_admin.upgrade(tranparent_upgradeable.address,erc20_V2.address);
            let result = await proxy_admin.getProxyImplementation(tranparent_upgradeable.address);
            expect(result).to.be.equal(erc20_V2.address);
        });
        it('should: ERC20V2 mint()', async function () {
            await erc20.attach(tranparent_upgradeable.address).connect(Admin).mint();
            let result = await erc20.attach(tranparent_upgradeable.address).balanceOf(Admin.address);
            expect(result).to.be.equal(BigNumber.from("3000000000000000000000"));
        });
        it('should: ERC20V2 Second mint()', async function () {
            await expect(erc20.attach(tranparent_upgradeable.address).connect(Admin).mint()).
                to.be.revertedWith("ERC20:Minted");
            

        });
    })

})