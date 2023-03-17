const hre = require("hardhat");
const fs = require("fs")

async function main() {
    const Bank = await hre.ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();
    await  bank.deployed();
    let addressData;
    try {
        fs.readFile("././address.json","utf8",(err,data) => {
            if (err) {
                throw err
            }
            addressData = JSON.parse(data)
            let len = Object.keys(addressData).length
            addressData[[len]] = bank.address
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
    console.log(`Deployed address: ${bank.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})