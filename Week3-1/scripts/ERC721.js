const hre = require("hardhat");
const fs = require("fs");


async function main() {
    let Admin;
    let user1;
    let user2;
    let ERC721;
    let ERC721Valut
    let erc721;
    let erc721vault;
    [Admin,user1,user2] = await hre.ethers.getSigners();
    ERC721 = await hre.ethers.getContractFactory("HY");
    ERC721Valut = await hre.ethers.getContractFactory("erc721Vault");
    erc721 = await  ERC721.deploy();
    erc721.deployed().then(async (data) => {
        erc721vault = await ERC721Valut.deploy(data.address);
        await erc721vault.deployed();
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
                dict[`ERC721 Token:`] = erc721.address;
                dict[`ERC721 vault:`] = erc721vault.address;
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
        console.log("ERC721 Token:"+erc721.address)
        console.log("ERC721 vault:"+erc721vault.address)
    },18000)
}


main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
})