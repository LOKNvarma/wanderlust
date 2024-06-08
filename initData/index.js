const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");

main().then(res => console.log("connection succesfull"))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
const initDB = async ()=>{
    await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({...obj , owner :'66603a7cccd420771c7fb01a'}));
    await Listing.insertMany(initData.data);  
    console.log("data was intialized");
}

initDB();