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
	const deviceList = await fastDB.getDeviceList(req.user._id)
	return res.json({'devices':deviceList})
})

router.post('/logout',validateJWT,inValidateRefresh, (req,res)=>{
    return res.sendStatus(200)
})




router.all('*',(req,res)=>{
    return res.sendStatus(404)
})


module.exports =  router