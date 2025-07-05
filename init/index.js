const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/apnaghar";

//async makes a function always return a Promise
async function main(){
    await mongoose.connect(MONGO_URL);
}

// main is a Promise — and it's likely calling something asynchronous
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

const initDB = async () => {
    // pehle saara data delete karenge 
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "686157ad2ef06ac56d4f5430"}));
    await Listing.insertMany(initData.data);
    console.log("data was inittialized");
}

initDB();

