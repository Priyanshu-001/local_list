

/* format
	users is a object mapping userId to array of login devices 
*/ 
const Redis  = require('redis');
const {sniffUser} = require('./auxilaryFunctions')
const {promisify} = require('util')

let redis= null;
let redisOp = null
async function connect(){
		 redis = Redis.createClient({
			url:`redis://${process.env.REDIS}`,
			legacyMode: true,
			// password:process.env.REDIS_PASS
		})
		redis.on('error',err=>console.log('ERROR'+ err))
		redis.on('connect',()=>{
			console.log('REDIS CONNECT')
			
		})

		await redis.connect()
		const {lPush, lRange,lSet,lRem} = redis
		redisOp = {lPush,lRange,lSet,lRem}
		Object.keys(redisOp).forEach(key=>{
			redisOp[key] = promisify(redisOp[key])
		})

		
	}

async function store(_id,clientID,ip,userAgent){

const payload =  sniffUser(userAgent,clientID,ip)
try{
	console.log("Type")
	
	await redis.lPush(String(_id),JSON.stringify(payload))
}
catch(err){
	console.log(err)
}

}

async function validateRefresh(_id,clientID,bool=true){

	try{
		let isThere = false
		let devices = await getDeviceList(_id)
		if(!devices)
			return false
		let index =0 
		for(device in devices){
			index+=1
			if(device.clientID === clientID)
				if(bool)
					return true
				return index

		}
		return false
	}
	catch(err){
		console.log(err)
		return false
	}

}
async function getDeviceList(_id){
	try{
		let devices = await redisOp.lRange(String(_id),0,-1)
		return devices.map(device =>JSON.parse(device))
	}
	catch(err){
		console.log(err)
	}
}

async function remove(_id,clientID)
{
	try{
		const index =  await validateRefresh(_id,clientID,false)
		if(!!index && index>0)
		{		await redisOp.lSet(String(_id),index-1,'DEL')
				await redisOp.lRem(String(_id),index-1,'DEL')
		}
		else{
			return false
		}
		return true
	}
	catch(err){
		
		return false
	}
}

module.exports.store = store
module.exports.validateRefresh = validateRefresh
module.exports.getDeviceList = getDeviceList
module.exports.remove = remove
module.exports.connect = connect

