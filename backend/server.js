const express = require('express');
const dotenv = require('dotenv').config();
const connectDB  = require('./config/db');
var bodyParser = require('body-parser')
connectDB();
const port = 5000;
const path = require('path')



const app = express()
app.use(express.static('public'));




app.use(express.static(path.join(__dirname+'/public')))




app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/user',require('./routes/userRoutes'))
app.use('/static',express.static('public'))

app.get('/',(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })
    return res.sendFile(__dirname +'/public/index1.html')
})

app.listen(port,()=>{console.log(`server started on port ${port}`)})