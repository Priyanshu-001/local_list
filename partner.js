const {partner,order} = require('./db')
const {checkMobile,validateJWT,verifyOTP,
	getRefreshToken,getAccessToken,returnTokens,inValidateRefresh,
	getOrder
} = require('./utils')


const router = require('express').Router()
findPartner = async (req,res,next)=>{
	if(!req.OTPVerified)
		return res.json({error:true, message: 'OTP not verified'})
	req.createPartner = false
	partner.findOne({number:`${req.number}`},(err,doc)=>{
			if(err){
				console.log(err)
				return res.sendStatus(500)
			}
			else if(doc === null){
				req.createPartner=true
				
			}
			else{
				req.user = doc.toObject()
				
			}
			next()
			
	})
	
}

createPartner = async (req,res,next)=>{
	if(req.createPartner){
		let user = new partner({number: req.body.number})
		user.save((err,doc)=>{
			if(err)
				{
						console.log(err)
						return res.sendStatus(500)
				}
			else{
					req.user=doc.toObject()
					next()
			}
		})
	}
	else{
		next()
	}
}
router.post('/login',checkMobile,verifyOTP,
				findPartner,createPartner,getRefreshToken,getAccessToken,returnTokens,
				(req,res)=>{
				//Tokens should be returned at returnTokens 

})

addName = async (req,res,next)=>{
	console.log(req.body.name)
	if(!req.body.name){
		console.log(req.body.name)
		return res.sendStatus(400)
	}
	partner.findOneAndUpdate({_id:req.user._id},
							  {name:req.body.name,status:'complete'},
							  {new:true})
	.then((doc)=>{		
		req.user = doc.toObject()
		console.log('UPDATED')
		next()
	})
	.catch(err=>{
		return res.sendStatus(400)
	})
}

router.post('/changename',validateJWT,addName,inValidateRefresh,getRefreshToken,getAccessToken,returnTokens,(req,res)=>{
											console.log('This should not ever trigger')
										})
const partnerOnly = (req,res,next)=>{
	if(req.user.type !== 'partner')
		return res.sendStatus(400)
	next()
}

router.get('/orders',validateJWT,partnerOnly,async (req,res)=>{
	partner.findOne({_id:req.user._id})
	.populate('orders',['name','status','orderTime','delivered','subtotal','tip','receipt'])
	.sort({orderTime:-1})
	.exec((err,user)=>{
		if(err)
			return res.sendStatus(500)
		return res.json({orders:user.orders})
	})
})

router.get('/order/:id',validateJWT,partnerOnly,getOrder,async(req,res)=>{
	 if(req.order.partnerId == req.user._id || req.order.status === 'waiting' ){
			return res.json(req.order._doc)
		}
		else{
			return res.sendStatus(403)
		}


})

router.patch('/order/:id/cancel',validateJWT,partnerOnly,getOrder,async (req,res)=>{
	if(req.order.partnerId != req.user._id)
		return res.sendStatus(403)
	else if(req.order.status === 'accepted'){
		
		try{
				let doc = req.order
				doc.status = 'rejected'
				doc.cancelTime = Date.now() 
				doc = await doc.save()
				console.log('DOVVV')
				console.log(doc)
				return res.sendStatus(200)
			}
		catch(err){
			console.log(err)
			return res.sendStatus(500)
		}
	}
	else {
		return res.sendStatus(400)

	}
	
})

router.get('/findorder',validateJWT,partnerOnly,async (req,res)=>{
	const {long, lat} = req.query
	order.find({
		location:{
			$geoWithin:{
				$centerSphere:[[long,lat],0.0005]
			}
		},
		'status':'waiting'
		
		// Instivigate problem with $near

		// location:{
		// 	$near:{
		// 		$geometery:{type:"Point",coordinates:[long,lat]},
		// 		$maxDistance: 3000,
		// 		$minDistance: 1000,
		// 	}
		// }
	})
	.select()
	.select({otp:0,items:0})
	.limit(10)
	.exec((err,orders)=>{
		if(err){
			console.log(err)
			return res.sendStatus(500)
		}
		else if(orders.length===0)
			return res.sendStatus(404)
		else
			return res.json({orders:orders})
	})
})

router.patch('/order/:id/accept',validateJWT,partnerOnly,getOrder,async (req,res)=>{
	if(req.order.status !== 'waiting')
		return res.sendStatus(400)
	else {
		req.order.status = 'accepted'
		req.order.partnerId = req.user._id
		req.order.acceptTime = Date.now()
		await req.order.save()
		let user = await partner.findOne({_id:req.user._id})
		user.orders.push(req.order)
		await user.save()
		return res.sendStatus(200)
	}
})
router.post('/order/:id/verifyotp', validateJWT,partnerOnly,getOrder, async (req,res)=>{
	if(req.order.partnerId != req.user._id){
		
		return res.sendStatus(403)
	}
	else if(req.order.status !== 'accepted')
		return res.sendStatus(400)
	else if(!req.body.otp)
		return res.sendStatus(400)	
	else if(req.order.otp === Number(req.body.otp))
		{
			req.order.status = 'completed'
			req.order.deliverTime = Date.now()
			await req.order.save()
			return res.sendStatus(200)
		}
	else{
		return res.sendStatus(400)
	}
})

router.get('/order/:id/status',validateJWT,partnerOnly,getOrder, async (req,res)=>{

	if(req.order.partnerId != req.user._id){
		
		return res.sendStatus(403)
	}
	return res.json({status: req.order.status})

})

module.exports =  router
