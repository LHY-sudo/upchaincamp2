import * as mongoose from "mongoose";
let Schema = mongoose.Schema;

let eventSchema = new Schema({
    transactionHash:{
        type:String,
        require:true
    },
    blockHash:{
        type:String,
        require:true
    },
    blockNumber:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    topic0:{
        type:String,
        require:true
    },
    topic1:{
        type:String,
        require:true
    },
    topic2:{
        type:String,
        require:true
    },
    topic3:{
        type:String,
        require:true
    },
    index:{
        type:Number
    },
    transactionIndex:{
        type:Number
    }
})
export let event = eventSchema;