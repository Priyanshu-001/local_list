const express = require('express')
const api = require('./api')
const app = express()
const cors = require('cors')
const tokenStore = require('./TokenStorage/tokenStore')



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
	await tokenStore.connect()
	console.log('listening on ',PORT)

})

app.use(express.json())
app.use('/api',api)

app.get('*',(req,res)=>{
    if(process.env.redirect)
	    return res.redirect(process.env.frontend)
    return res.send("Hi there")
})



