const mongoose = require("mongoose");
const dns = require('dns');
const connectToDB = async() => {
    try{
        await dns.setServers([
            "8.8.8.8",
            "8.8.4.4"
        ]);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected successfully!!!");
        
    }catch(e){
        console.log("Error in connecting the database -->",e); 
    }
}
module.exports = connectToDB;