const {partner} = require('./db')
const {checkMobile,verifyOTP,getRefreshToken,getAccessToken,returnTokens} = require('./utils')

const router = require('express').Router()

findPartner = async (req,res,next)=>{
	if(!req.OTPVerified)
		return res.json({error:true, message: 'OTP not verified'})
	req.createPartner = false
	customer.findOne({number:`+91${req.number}`},(err,doc)=>{
			if(err){
				console.log(err)
				return res.sendStatus(500)
			}
			else if(doc === null){
				req.createPartner=true
			}
			
	})
	next()
}

createPartner = async (req,res,next)=>{
	if(req.createPartner){
		partner = new partner({number: req.body.number})
		partner.save((err,doc)=>{
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
router.post('/login',checkMobile,verifyOTP,
				findPartner,createPartner,getRefreshToken,getAccessToken,returnTokens,
				(req,res)=>{
				//Tokens should be returned at returnTokens 

})

