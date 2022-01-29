const express = require('express')
const api = require('./api')
const app = express()
const PORT = process.env.PORT || 80
require('dotenv').config()

app.listen(PORT,()=>console.log(`Running on ${PORT}`))

app.use(express.json())
app.use('/api',api)

app.get('*',(req,res)=>{
	res.send('we will send the spa from here')
})



