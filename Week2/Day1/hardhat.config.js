require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config({path:"./.env"})

task("accounts","Print the list of account",async (taskarg,hre) => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address)
  }

})

const PRIVATE_KEY1 = process.env.PRIVATE
const PRIVATE_KEY2 = process.env.PRIVATE2
const PRIVATE_KEY3 = process.env.PRIVATE3
const key = process.env.Alchemy
const apikeys = process.env.Apikey

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:"0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
    },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  defaultNetwork:"goeri",
  networks:{
    goeri:{
      url:`https://eth-goerli.g.alchemy.com/v2/${key}`,
      chainId:5,
      accounts:[PRIVATE_KEY1,PRIVATE_KEY2,PRIVATE_KEY3]
    },
  },
  etherscan: {
    apiKey: apikeys
  },
};
