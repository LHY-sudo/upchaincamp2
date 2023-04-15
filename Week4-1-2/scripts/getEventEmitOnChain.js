import {ethers} from "ethers";
import {contract,provider} from "./contract.js"
import {EventDb} from "../model/index.js"

provider.getBlockNumber().then((data) => {
    console.log(data)
})
let instance = contract.connect(provider);

let transfer_Event = contract.filters.Transfer()
function record(object) {
    let dict = new Object();
    dict.transactionHash = object.transactionHash
    dict.blockHash=object.blockHash
    dict.blockNumber=object.blockNumber
    dict.address=object.address
    dict.topic0=object.topics[0]
    dict.topic1=object.topics[1]
    dict.topic2=object.topics[2]
    dict.topic3=object.topics[3]
    dict.index=object.index
    dict.transactionIndex=object.transactionIndex
    return dict;
}
instance.on(transfer_Event,async (data) => {
    console.log(data.log)
    let dict = record(data.log)
    let eventModel = new EventDb(dict)
    let dbBack = await eventModel.save();
    console.log(dbBack)
})