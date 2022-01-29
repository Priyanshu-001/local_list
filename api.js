const customer = require('./customer')
const business = require('./business')
const {client } = require('./verify')
const {checkMobile,getAccessToken,validateRefresh,validateJWT} = require('./utils')

const router = require('express').Router()

router.use('/customer',customer)


router.post('/sendOTP',checkMobile,async function(req,res){
	client.verify.services(SERVICE)
             .verifications
             .create({to: `+91${req.body.number}`, channel: 'sms'})
           	 .then(()=>{return res.json({error:false})})
           	 .catch((err)=>{
           	 	return res.json({error:true}) 
           	 	console.log(err)
           	})

})

router.post('/refreshToken',validateRefresh,getAccessToken,async (req,res)=>{
	return res.json({'jwt':req.accessToken})
})
router.post('/devices',validateJWT,async (req,res)=>{
	const deviceList = fastDB.getDeviceList(req.user._id)
	return res.json({'devices':deviceList})
})






module.exports =  router