const { LogMessage } = require('./utils/LogMessage')
//get env variables
const mongoose = require('mongoose')

//establish connection to mongodb | ! ASYNC !
const connectMongo = async () => { 
    try{
        await mongoose.connect(`mongodb+srv://druggie_admin:nBumIn2gnguALkS4@drugsdata.voqss.mongodb.net/drugsdata?retryWrites=true&w=majority`)
        console.log("Mongo Connection Successful ✅ ")
    } catch( dbError ){
        console.error("There was an issue connection to the database: ")
        console.error(dbError)
    }
}

//specify port for heroku
const port = process.env.PORT || 8000

//init express app on port ^^
const express = require('express')
const app = express()

//import routes
app.use('/api', require('./routes/appRoutes'))


//define server start with app , then start the server
const start = async (app) => { 
    try{
        console.log('STARTING SERVER . . . ')
        const dbConnection = await connectMongo()
        const server = app.listen( port  , ()=> console.log(`Server 🚀 on port ${port}`))
               
    } catch( SERVER_ERROR ){
        LogMessage("FATAL", "Server Crashed ", "Server failed due to: ","", new Error(SERVER_ERROR))   
    }
}

//starts the server
start(app)


