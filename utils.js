const {client }  = require('./verify')
const fastDB  = require('./fastDB')
const SERVICE = process.env['SERVICE']
const REFRESH_SECRET = process.env['REFRESH_SECRET']
const JWT_SECRET = process.env['JWT_SECRET']
const jwt = require('jsonwebtoken')


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
req.OTPVerified = false
// client.verify.services(SERVICE)
// 	.verificationChecks
// 	.create({to:`+91${req.body.number}`, code: req.body.OTP})
// 	.then(verification_check=>{
// 		if(verification_check.status==='pending')
// 		return res.sendStatus(401)
// 		else
// 			{
// 			req.OTPVerified = true
// 			next()
// 			}
// 		
// 	})
// 	.catch(error=>{
// 		console.log(error)
// 		return res.sendStatus(500)
// 
// 	})
// 	

//testing COde
req.OTPVerified = true
next()
	
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

 const getRefreshToken = async (req,res,next)=>{
 	
	req.clientID = getRandomInt(1000000) + 10000
	const payload = {...req.user,'clientID': req.clientID}

	console.log(payload)
	const refreshToken = jwt.sign(payload,REFRESH_SECRET)
	req.refreshToken = refreshToken
	req.newToken = true
	try{
		
		await fastDB.store(req.user._id,req.clientID,req.ip,req.headers['user-agent'])
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
		req.accessToken = jwt.sign(payload,JWT_SECRET)
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
	!!req.body.refreshToken && jwt.verify(req.body.refreshToken,REFRESH_SECRET,(err,user)=>{
		if (err) return res.sendStatus(401)
		else if(!fastDB.validateRefresh(user.clientID))
			return res.sendStatus(401)
		else
			next()
	})
}

 const validateJWT = async(req,res,next)=>{
	 jwt.verify(req.headers['authorization'],
														  JWT_SECRET,(err,user)=>{
														  	console.log('err\n' +err)
														  	console.log('user\n'+ user)
														  if(err) return res.sendStatus(401)
														  else if(!user) return res.sendStatus(401)
														  req.user = user
														  req.authorized = true
														  console.log('Verfied')
															next()
														  })

}

const inValidateRefresh = async(req,res,next)=>{
	try{
		await fastDB.remove(req.user._id,req.user.clientID)
		next()
	}
	catch(error)
	{
		console.log('Cant invalidate')
		console.log(error)
		return res.sendStatus(500)
	}
}

module.exports.checkMobile = checkMobile
module.exports.verifyOTP = verifyOTP
module.exports.getRefreshToken = getRefreshToken
module.exports.getAccessToken = getAccessToken
module.exports.returnTokens = returnTokens
module.exports.validateRefresh = validateRefresh
module.exports.validateJWT = validateJWT
module.exports.inValidateRefresh = inValidateRefresh

