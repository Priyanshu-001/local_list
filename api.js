const customer = require('./customer')
const partner = require('./partner')
const {client } = require('./verify')
require('dotenv').config()
const SERVICE = process.env.SERVICE
const {checkMobile,getAccessToken,validateRefresh,validateJWT,returnTokens,inValidateRefresh} = require('./utils')
const fastDB  = require('./fastDB')
const router = require('express').Router()

router.use('/customer',customer)
router.use('/partner',partner)


router.post('/sendOTP',checkMobile,async function(req,res){
    if(process.env.NODE_ENV === 'dev')
        return res.sendStatus(200)
    
	client.verify.services(SERVICE)
             .verifications
             .create({to: `+91${req.body.number}`, channel: 'sms'})
           	 .then(()=>{return res.sendStatus(200)  })
           	 .catch((err)=>{
           	 	return res.sendStatus(500)
           	 	console.log(err)
           	})

})



router.post('/refreshToken',validateRefresh,getAccessToken,returnTokens,async (req,res)=>{
	
})
router.get('/devices',validateJWT,async (req,res)=>{
    try{
	const devices = await fastDB.getDeviceList(req.user._id)
    console.log(devices)
    return res.json({devices})

    }
    catch(err)
    {
        console.log(err)
    }

})

router.post('/logout',validateJWT,inValidateRefresh, (req,res)=>{
    return res.sendStatus(200)
})

router.post('/remove',validateJWT,async (req,res)=>{
    if(!req.body.clientID)
        return res.sendStatus(400)
    if(req.user.clientID === req.body.clientID)
        return res.status(400).send('can not remote logout self')
    try{
        await fastDB.remove(req.user._id,req.body.clientID)
        return res.sendStatus(200)
    }
    catch(err)
    {
        console.log(err)
        return res.sendStatus(500)
    }
})



router.all('*',(req,res)=>{
    return res.sendStatus(404)
})


module.exports =  router