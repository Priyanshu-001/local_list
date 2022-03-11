const express = require('express')
const api = require('./api')
const app = express()
const cors = require('cors')
const fastDB  = require('./fastDB')


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
else{
var corsOptions = {
    origin: process.env.frontend,
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));

}

app.listen(PORT,async ()=>{
	await fastDB.getRedis()
	console.log('listening on ',PORT)

})

app.use(express.json())
app.use('/api',api)

app.get('*',(req,res)=>{
	res.send('This is the Backend to <a href="https://gray-mushroom-029dae810.1.azurestaticapps.net/"> https://gray-mushroom-029dae810.1.azurestaticapps.net/ </a> ')
})



