const mongoose = require('mongoose')
const ConnectionString = "mongodb+srv://pawan:pawan@cluster0.htpxrca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function connectToDatabase(){
    await mongoose.connect(ConnectionString)
    console.log("Connected To Be Successfully")
}
module.exports = connectToDatabase
 
 