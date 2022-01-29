const router = require('express').Router()
import {client } from './verify'
checkMobile = (req,res,next)=>{
	const number = req.body.number 
	try{
		if(!!number && number%1==0){

		}
		else{
			throw "Not a Number"
		}
	}
	catch(error)
	{
		return res.sendStatus(400)
	}

	next()
}


router.post('/sendOTP',checkMobile,function(req,res){
	client.verify.services(SERVICE)
             .verifications
             .create({to: `+91${req.body.number}`, channel: 'sms'})
           	 .then(()=>{return res.json({error:false})})
           	 .catch((err)=>{
           	 	return res.json({error:true}) 
           	 	console.log(err)
           	})

})




export default router