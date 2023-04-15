import {ethers} from "ethers";
import * as ERC721 from "../abi/ERC721.js"
import dotenv from "dotenv"
import * as configs from "./config.js"
dotenv.config({path:"../../env"});

let api = process.env.Goeri

if (!api) {
    api = configs.api
}

let ERC721Address = "0xC82B3fE59CBDFEFF30Fb5FF96c1277313d7E04e2";
let providers
let contracts
try {
    providers = new ethers.WebSocketProvider(`wss://eth-goerli.g.alchemy.com/v2/${api}`);
    contracts = new ethers.Contract(ERC721Address,ERC721.abi);
} catch (err) {
    console.log("连接Node发生错误")
}

export let provider = providers;
export let contract = contracts;