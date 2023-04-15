import * as mongoose from "mongoose";
import * as eventSchema from "./eventSchema.js";

async function main() {
    await mongoose.connect('mongodb://localhost:27017/test')
}

main()
    .then(() => {
        console.log('Mongodb had connected')
    })
    .catch((err) => {
        console.log('Connection Error')
    })
export let EventDb = mongoose.model("EventDb",eventSchema.event);
