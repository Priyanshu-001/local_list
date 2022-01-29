import {client } from './verify'
const SERVICE = process.env['SERVICE']
export const checkMobile = (req,res,next)=>{
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

export const verifyOTP = async (req,res,next)=>{
req.OTPVerified = false
client.verify.services(SERVICE)
	.verificationChecks
	.create({to:`+91${req.body.number}`, code: req.body.OTP})
	.then(verification_check=>{
		if(verification_check.status==='pending')
		return res.json({verified:false})
		else
			req.OTPVerified = true


		
	})
	.catch(error=>{
		console.log(error)
		return res.json({error:true})

	})
	next()
	
}

