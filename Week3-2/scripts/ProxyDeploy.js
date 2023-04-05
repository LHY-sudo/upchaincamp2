const { ethers, upgrades } = require("hardhat");

async function main() {
    // Deploying
    //const Box = await ethers.getContractFactory("ERC20Upgradeable");
    //const instance = await upgrades.deployProxy(Box);
    //await instance.deployed();
    let tran
    let ERC20 = await ethers.getContractFactory("ERC20Upgradeable")
    let ERC20V2 = await ethers.getContractFactory("ERC20UpgradeableV2")
    let Proxy = await ethers.getContractFactory("ProxyAdmin")
    let Tran = await ethers.getContractFactory("TransparentUpgradeableProxyV2")

    let erc20 = await ERC20.deploy();
    await erc20.deployed();
    let proxy = await Proxy.deploy();
    await proxy.deployed();
    let erc20V2 = await ERC20V2.deploy();
    await erc20V2.deployed();

    setTimeout(async function () {
        tran = await Tran.deploy(erc20.address,proxy.address,"0x");
        await tran.deployed();
        },10000)

    setTimeout(async function () {
        console.log("erc20:"+erc20.address)
        console.log("erc20V2:"+erc20V2.address)
        console.log("proxy:"+proxy.address)
        console.log("tran:"+tran.address)
        /*
        proxy.upgrade(tran.address,erc20V2.address).then((data) => {
            console.log("upgrade_hash"+data.hash);
        })
         */
    },20000)
    // Upgrading
    //const BoxV2 = await ethers.getContractFactory("ERC20Upgradeable");
    //const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}


main();