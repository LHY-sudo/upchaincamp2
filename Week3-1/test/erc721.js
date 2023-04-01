const { ethers} = require("hardhat");
const { expect } = require("chai");



describe("ERC721",function () {
    let Admin;
    let user1;
    let user2;
    let ERC721;
    let ERC721Valut;
    let erc721;
    let erc721vault;
    async function init() {
        [Admin,user1,user2] = await hre.ethers.getSigners();
        ERC721 = await ethers.getContractFactory("HY");
        ERC721Valut = await ethers.getContractFactory("erc721Vault")
        erc721 = await ERC721.deploy();
        await erc721.deployed();
    }
    before(async function () {
        await init();
    })

    describe("Deploy ERC721Vault",function () {
        before(async function init2() {
            erc721vault = await ERC721Valut.deploy(erc721.address);
            await erc721vault.deployed();
        })
        it('should: Token address is equal to erc721 address', async function () {
            let result = await erc721vault.Token();
            expect(result).to.be.equal(erc721.address);
        });
    });
    describe("ERC721",function () {
        it('should: name', async function () {
            let result = await erc721.name();
            expect(result).to.be.equal("HY")
        });
        it('should: symbol', async function () {
            let result = await erc721.symbol();
            expect(result).to.be.equal("YY")
        });
        it('should: mint', async function () {
            await erc721.connect(Admin).safeMint(1);
            let result = await erc721.ownerOf(1);
            expect(result).to.be.equal(Admin.address)
        });
        it('should: balanceOf', async function () {
            let result = await erc721.balanceOf(Admin.address);
            expect(result).to.be.equal(1);
        });
        it('should: tokenURI', async function () {
            let result = await erc721.tokenURI(1);
            expect(result).to.be.equal("https://ipfs.filebase.io/ipfs/QmRRoY8THrozvyVuvbkg8f234XRHBhybyVQ4Ax3LnZxhoD/1");

        });
        it('should: safeTransferFrom', async function () {
            await erc721.connect(Admin)["safeTransferFrom(address,address,uint256)"](Admin.address,user1.address,1);
            let result = await erc721.balanceOf(user1.address)
            expect(result).to.be.equal(1);
        });
    })
    describe("erc721Vault",function() {
        it('should: mint', async function () {
            await erc721.connect(Admin).safeMint(2);
            let result = await erc721.ownerOf(2);
            expect(result).to.be.equal(Admin.address)
        });
        it("should: Approve", async function() {
            await erc721.connect(Admin).approve(erc721vault.address,2);
            let result = await erc721.getApproved(2);
            expect(result).to.be.equal(erc721vault.address);
        })
        it("should: Deny", async function() {
            await erc721vault.connect(Admin).deposit(2);
            let result = await erc721vault.connect(Admin).getBalance();
            expect(result).to.be.equal(1);
        })
        it("should: withdraw", async function() {
            await erc721vault.connect(Admin).withdraw(2)
            let result = await erc721.connect(Admin). balanceOf(Admin.address);
            expect(result).to.be.equal(1);
        })
    })

})