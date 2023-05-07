const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Week5-1",function (){
    let Vault;
    let vault;
    let Token;
    let token;
    let Admin;
    let user1;
    async function init() {
        Vault = await ethers.getContractFactory("Vault");
        Token = await ethers.getContractFactory("DLToken");
        [Admin,user1,...other] = await ethers.getSigners();
        token = await Token.connect(user1).deploy();
        await token.deployed();
    }

    before(async function() {
        await init();
    })
    describe("deploy vault",function () {
        async function intit2() {
            vault = await Vault.deploy(token.address);
            await vault.deployed();
        }
        before(async function() {
            await intit2();
        })
        it('should: owner', async function () {
            let result = await vault.owner();
            expect(result).to.be.equal(Admin.address);
        });
        it('should: Token', async function () {
            let result = await vault.Token();
            expect(result).to.be.equal(token.address);
        });
    })
})