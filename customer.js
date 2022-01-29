//Customer
const {customer} = require('./db')
const {checkMobile,verifyOTP,getRefreshToken,getAccessToken,returnTokens} = require('./utils')
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


//Return a refresh token and a jwt
router.post('/login',checkMobile,verifyOTP,
				findCustomer,createCustomer,getRefreshToken,getAccessToken,returnTokens,
				(req,res)=>{
				//Tokens should be returned at returnTokens 

})

module.exports =  router

