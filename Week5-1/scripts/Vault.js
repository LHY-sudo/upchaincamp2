const {ethers} = require("hardhat");

async function main() {
    let Vault;
    let vault;
    let Token;
    let token;
    let user1;
    let Admin;
    [Admin,user1,...other] = await ethers.getSigners();
    Vault = await ethers.getContractFactory("Vault");
    Token = await ethers.getContractFactory("DLToken");

    token = await Token.connect(user1).deploy();
    token.deployed().then(async (contractToken) => {
        vault = await Vault.connect(Admin).deploy(contractToken.address);
        await vault.deployed()
        console.log("Vault: "+vault.address);
        console.log("Token: "+token.address);
    })

}

main().catch((err) => {
    console.log(err.message)
})