//Customer
import {customer} from './db'
import {verifyOTP} from './utils'
const jwt = require('jsonwebtoken')

const router = require('express').Router()

findCustomer = async (req,res,next)=>{
	if(!req.OTPVerified)
		return res.json({error:true, message: 'OTP not verified'})
	req.createCustomer = false
	customer.findOne({number:`+91${req.number}`},(err,doc)=>{
			if(err){
				console.log(err)
				return res.sendStatus(500)
			}
			else if(doc === null){
				req.createCustomer=true
			}
			
	})
	next()
}

createCustomer = async (req,res,next)=>{
	if(req.createCustomer){
		customer = new customer({number: req.body.number})
		customer.save((err,doc)=>{
			if(err)
				{
						console.log(err)
						return res.sendStatus(500)
				}
			else{
					req.user=doc
			}
		})
	}
	next()
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

getRefreshToken = async (req,res,next)=>{

	const clientID = getRandomInt(1000)
	const payload = {...req.user,'clientID': clientID}
	const refreshToken = jwt.sign(payload,REFRESH_SECRET)
	req.refreshToken = refreshToken
	try{
		const secret  =  crypto.randomBytes(64).toString('hex')
		await fastDB.store(req.user._id,clientID,secret,req.ip,req.headers['user-agent'])
	}
	finally{
		next()
	}
	
}
getAccessToken = async (req,res,next)=>{

}

//Return a refresh token and a jwt
app.post('/login',checkMobile,verifyOTP,findCustomer,createCustomer,(req,res)=>{

})