require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter")

const dotenv = require("dotenv")

dotenv.config({path:"../env"})

task("accounts",async function (taskarg,hre) {
  const accounts = await ethers.getSigners();
  for (let i of accounts) {
    console.log(i.address)
  }

})

const PRIVATE_KEY1 = process.env.PRIVATE
const PRIVATE_KEY2 = process.env.PRIVATE2
const PRIVATE_KEY3 = process.env.PRIVATE3
const key = process.env.Alchemy
const apikeys = process.env.Apikey
const G = process.env.Goeri
const m = process.env.mumai
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:"0.8.4",
    settings:{
      optimizer:{
        enabled:true,
        runs:1000
      }
    }
  },
  defaultNetwork:"sepolia",
  networks:{
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/${key}`,
      chainId:11155111,
      accounts:[PRIVATE_KEY1,PRIVATE_KEY2,PRIVATE_KEY3]
    },
    goeri:{
      url:`https://eth-goerli.g.alchemy.com/v2/${G}`,
      chainId:5,
      accounts:[PRIVATE_KEY1,PRIVATE_KEY2,PRIVATE_KEY3]
    },
    hardhatNode:{
      url:"http://127.0.0.1:8545/",
      chianId:31337,
      accounts:["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
        "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
      ]
    },
    mumbai:{
      url:`https://polygon-mumbai.g.alchemy.com/v2/${m}`,
      chainId:80001,
      accounts:[PRIVATE_KEY1,PRIVATE_KEY2,PRIVATE_KEY3]
    }
  },
  etherscan: {
    apiKey: apikeys
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21,
    enabled: true
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
