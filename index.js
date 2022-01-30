const express = require('express')
const api = require('./api')
const app = express()
const cors = require('cors')

require('dotenv').config()
const PORT = process.env.PORT || 80
if(process.env.NODE_ENV === "dev")
{
	var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // For legacy browser support
	}
app.use(cors(corsOptions));
}

app.listen(PORT,()=>console.log(`Running on ${PORT}`))

app.use(express.json())
app.use('/api',api)

app.get('*',(req,res)=>{
	res.send('we will send the spa from here')
})



