//Customer
const {customer,order} = require('./db')
const {checkMobile,validateJWT,verifyOTP,getRefreshToken,getAccessToken,returnTokens,inValidateRefresh} = require('./utils')

const router = require('express').Router()

findCustomer = async (req,res,next)=>{
	if(!req.OTPVerified)
		return res.sendStatus(403)
	req.createCustomer = false
	console.log(req.number)
	customer.findOne({number:`${req.number}`},(err,doc)=>{

			if(err){
				console.log(err)
				return res.sendStatus(500)
			}
			else if(doc === null){
				req.createCustomer=true
				console.log('Creating user')
			}
			else{
				console.log("Found You")
				req.user = doc.toObject()
			}
			next()
			
	})
	
}

createCustomer = async (req,res,next)=>{
	
	if(req.createCustomer){
		const newCustomer = new customer({number: req.body.number})
		newCustomer.save((err,doc)=>{
			if(err)
				{
						console.log(err)
						return res.sendStatus(500)
				}
			else{	
					req.user = doc.toObject()
					next()
			}
		})
	}
	else
		next()

	
}


//Return a refresh token and a jwt
router.post('/login',checkMobile,verifyOTP,
				findCustomer,createCustomer,getRefreshToken,getAccessToken,returnTokens,
				(req,res)=>{
				//Tokens should be returned at returnTokens 

})

addName = async (req,res,next)=>{
	console.log(req.body.name)
	if(!req.body.name){
		console.log(req.body.name)
		return res.sendStatus(400)
	}
	customer.findOneAndUpdate({_id:req.user._id},
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

validateOrder =  (req,res,next)=>{
	req.order = {}
	req.order.items = req.body.order.items
	req.order.tip = req.body.order.tip
	req.order.subtotal = req.body.order.subtotal
	req.order.name = req.body.order.name
	req.order.receipt = req.body.order.receipt
	req.order.instructions = req.body.order.instructions

	next()
}


router.post('/neworder',validateJWT,validateOrder,async (req,res)=>{
	try {
		const newOrder =  new order({customerId:req.user._id,...req.order})
		const savedOrder = await newOrder.save()
		let shopper = await customer.findOne({_id: req.user._id})
		shopper.orders.push(savedOrder)
		shopper = await shopper.save()
		return res.json({id:shopper._id})
	}	
	catch(err){
		console.log(err)
	}

})

customerOnly = (req,res,next)=>{
	if(req.user.type !== 'customer')
		return res.sendStatus(400)
	next()
}

router.get('/orders',validateJWT,customerOnly, async(req,res)=>{
	customer.findOne({_id:req.user._id})
	.populate('orders',['name','status','orderTime','delivered','subtotal','tip','receipt'])
	.exec((err,user)=>{
		if(err){	
			console.log(err)
			return res.sendStatus(500)
		}
		return res.json({orders:user.orders})
	})
})
router.get('/order/:id',validateJWT,customerOnly,async(req,res)=>{
	order.findOne({_id: req.params.id})
	.exec((err,doc)=>{
		console.log(doc)
		if(err){
			console.log(err)
			return res.sendStatus(500)
		}
		else if(doc.customerId == req.user._id){
			const obj = {order:{...doc}}
			console.log(req.use)
			return res.json(doc._doc)
		}
		else{
			return res.sendStatus(403)
		}
	})


})
module.exports =  router

