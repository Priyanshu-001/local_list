const {client }  = require('./verify')
const fastDB  = require('./fastDB')
const SERVICE = process.env['SERVICE']
const REFRESH_SECRET = process.env['REFRESH_SECRET']
const JWT_SECRET = process.env['JWT_SECRET']

  const checkMobile = (req,res,next)=>{
	const number = req.body.number 
	try{
		if(!!number && number%1==0 && number.length === 10){
			console.log("Good format")
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
client.verify.services(SERVICE)
	.verificationChecks
	.create({to:`+91${req.body.number}`, code: req.body.OTP})
	.then(verification_check=>{
		if(verification_check.status==='pending')
		return res.sendStatus(401)
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

 const getRefreshToken = async (req,res,next)=>{

	req.clientID = getRandomInt(1000000)
	const payload = {...req.user,'clientID': req.clientID}
	const refreshToken = jwt.sign(payload,REFRESH_SECRET)
	req.refreshToken = refreshToken
	req.newToken = true
	try{
		
		await fastDB.store(req.user._id,clientID,req.ip,req.headers['user-agent'])
	}
	finally{
		next()
	}
	
}
 const getAccessToken = async (req,res,next)=>{
	let user = null
	let payload = null
	if(req.newToken){
		payload = {...req.user,clientID:req.clientID}
	}
	else if(!!req.body.refreshToken){
		jwt.verify(req.body.refreshToken,REFRESH_SECRET,(err,user)=>{
			//Check for CORRECT CODE
			if(err) return res.sendStatus(403)
			payload = user
		})
	}
	else{
		return res.sendStatus(403)
	}

	req.accessToken =  jwt.sign(payload,JWT_SECRET)
	next()


}
 const returnTokens = async(req,res,next)=>{
	return res.json({'jwt':req.accessToken, 'refreshToken':req.refreshToken})
}

 const validateRefresh = async(req,res,next)=>{
	!!req.body.refreshToken && jwt.verify(req.body.refreshToken,REFRESH_SECRET,(err,user)=>{
		if (err) return res.sendStatus(403)
		else if(!!fastDB.validateRefresh(user.clientID))
			return res.sendStatus(403)
	})
	next()
}

 const validateJWT = async(req,res,next)=>{
	req.headers['Authorization'] && jwt.verify(req.headers['Authorization'],
														  JWT_SECRET,(err,user)=>{
														  if(err) return res.sendStatus(403)
														  else if(!user) res.sendStatus(403)
														  req.user = user
														  req.authorized = true
														  })
	next()
}

module.exports.checkMobile = checkMobile
module.exports.verifyOTP = verifyOTP
module.exports.getRefreshToken = getRefreshToken
module.exports.getAccessToken = getAccessToken
module.exports.returnTokens = returnTokens
module.exports.validateRefresh = validateRefresh
module.exports.validateJWT = validateJWT
