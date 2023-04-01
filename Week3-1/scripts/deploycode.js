const hre = require("hardhat");
const fs = require("fs");

async function main() {
    let Admin;
    let user1;
    let user2;
    let DL;
    let Valut
    let dl;
    let vault;
    [Admin,user1,user2] = await hre.ethers.getSigners();
    DL = await hre.ethers.getContractFactory("DLToken");
    Valut = await hre.ethers.getContractFactory("Vault")
    dl = await DL.deploy();
    dl.deployed().then(async function (data) {
        vault = await Valut.deploy(data.address);
        await vault.deployed()
    })
    setTimeout(function () {
        try {
            fs.readFile("././address.json","utf8",(err,data) => {
                if (err) {
                    throw err
                }
                addressData = JSON.parse(data)
                let len = Object.keys(addressData).length
                let dict = new Object()
                dict[`DLToken:`] = dl.address;
                dict[`Vault:`] = vault.address;
                addressData[`${len}`] = dict;
                fs.writeFile('././address.json',JSON.stringify(addressData),(err) => {
                    if (err) {
                        throw err
                    }
                    console.log("地址写入成功")
                })
            })
        } catch (err) {
            console.log(err.message)
        }
    },18000)
    setTimeout(function () {
        console.log("DL:"+dl.address)
        console.log("vault:"+vault.address)
    },18000)
}
main().catch((err) => {
    console.log(err);
})