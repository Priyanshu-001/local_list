const {client }  = require('./verification/twilio')
const tokenStore  = require('./tokenStore')
const SERVICE = process.env['SERVICE']
const REFRESH_SECRET = process.env['REFRESH_SECRET']
const JWT_SECRET = process.env['JWT_SECRET']
const jwt = require('jsonwebtoken')
const {order} = require('./db')
const { getRandomInt } = require('./auxilaryFunctions')




const checkMobile = (req,res,next)=>{
	const number = req.body.number 
	try{
		if(!!number && number%1==0 && number.length === 10){
			console.log("Good format")
			req.number = number
			next()
		}
		else{
		return res.sendStatus(400)
		}
	}
	catch(error)
	{
		return res.sendStatus(400)
	}

	
}

const verifyOTP = async (req,res,next)=>{
if(process.env.NODE_ENV === 'dev'){
	req.OTPVerified = true
	next()
	return null
}
req.OTPVerified = false
client.verify.services(SERVICE)
	.verificationChecks
	.create({to:`+91${req.body.number}`, code: req.body.OTP})
	.then(verification_check=>{
		if(verification_check.status==='pending')
		return res.sendStatus(403)
		else
			{
			req.OTPVerified = true
			next()
			}
		
	})
	.catch(error=>{
		console.log(error)
		return res.sendStatus(500)

	})
	
}



 const getRefreshToken = async (req,res,next)=>{
 	
	req.clientID = getRandomInt(1000000) + 10000
	const payload = {...req.user,'clientID': req.clientID}

	console.log(payload)
	const refreshToken = jwt.sign(payload,REFRESH_SECRET)
	req.refreshToken = refreshToken
	req.newToken = true
	try{
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
		await tokenStore.store(req.user._id,req.clientID,req.ip,req.headers['user-agent'])
		next()

	}
	catch(error){
		console.log(error)
	}
	
}
 const getAccessToken = async (req,res,next)=>{
	let user = null
	let payload = null
	if(req.newToken){
		payload = {...req.user,clientID:req.clientID}
		req.accessToken = jwt.sign(payload,JWT_SECRET,{expiresIn:'2h'})
		next()
	}
	else if(!!req.body.refreshToken){
		jwt.verify(req.body.refreshToken,REFRESH_SECRET,(err,user)=>{
			//Check for CORRECT CODE
			if(err) return res.sendStatus(403)
			payload = user
			req.accessToken = jwt.sign(payload,JWT_SECRET)
			next()
		})
	}
	else{
		return res.sendStatus(403)
	}



}
 const returnTokens = async(req,res,next)=>{
	return res.json({'JWT':req.accessToken, 'refreshToken':req.refreshToken})
}

 const validateRefresh = async(req,res,next)=>{
 	if(!req.body.refreshToken)
 		return res.sendStatus(401)
	!!req.body.refreshToken && jwt.verify(req.body.refreshToken,REFRESH_SECRET,async (err,user)=>{
		if (err) return res.sendStatus(401)

			else if(!!user){
				console.log(user._id)
				const validated = await tokenStore.validateRefresh(user._id,user.clientID)
			 if( validated )
				return next()
			else
				res.sendStatus(401)
		}
	})
}

 const validateJWT = async(req,res,next)=>{
	 jwt.verify(req.headers['authorization'],
				JWT_SECRET,(err,user)=>{
				
				console.log('user\n'+ user)
				if(err) return res.sendStatus(401)
				else if(!user) return res.sendStatus(401)
				req.user = user
				req.authorized = true
				console.log('Verfied')
				next()
				})

}

const inValidateRefresh = async (req,res,next)=>{
	try{

		await tokenStore.remove(req.user._id,req.user.clientID)
		next()
	}
	catch(error)
	{
		console.log('Cant invalidate')
		console.log(error)
		return res.sendStatus(500)
	}
}

const getOrder = async (req,res,next)=>{
	console.log('Fetching Order ', req.params.id)
	order.findOne({_id: req.params.id})
	.exec((err,doc)=>{
		if(err){
			console.log(err)
			return res.sendStatus(500)
		}
		else if(!doc){
			return res.sendStatus(404)
		}
		else{
			req.order = doc
			next()
		}
		})
}

module.exports.checkMobile = checkMobile
module.exports.verifyOTP = verifyOTP
module.exports.getRefreshToken = getRefreshToken
module.exports.getAccessToken = getAccessToken
module.exports.returnTokens = returnTokens
module.exports.validateRefresh = validateRefresh
module.exports.validateJWT = validateJWT
module.exports.inValidateRefresh = inValidateRefresh
module.exports.getOrder = getOrder
