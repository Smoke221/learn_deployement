const express = require('express')
const {connection} = require('./configs/db')
const {userRouter} = require('./routes/userRoutes')
const {noteRouter} = require('./routes/noteRoutes')
const {authenticate} = require('./middlewares/authenticate.middleware')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/',(req,res) => {
    res.send('home page')
})

app.use('/user',userRouter)
app.use(authenticate)
app.use('/note',noteRouter)




app.listen(process.env.port,async() => {
    try{
        await connection
        console.log(`connected to db`);
    }
    catch(err){
        console.log(err.message);
    }
    console.log(`server is running at port ${process.env.port}`);
})