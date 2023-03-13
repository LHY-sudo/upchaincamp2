require("@nomicfoundation/hardhat-toolbox");

let dotenv = require('dotenv')
dotenv.config({ path: "./env" })


const PRIVATE_KEY1 = process.env.private_key
const key = process.env.key
const apikeys = process.env.apikey

module.exports = {
  defaultNetwork:"goeri",
  networks:{
    goeri:{
      url:`https://eth-goerli.g.alchemy.com/v2/${key}`,
      chainId:5,
      accounts:[PRIVATE_KEY1]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: apikeys
  },
  solidity: "0.8.0",
};
