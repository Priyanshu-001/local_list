//TODO: Use Redis instead of in memory array

/* format
	users is a object mapping userId to array of login devices 
*/ 
const Redis  = require('redis');
const Sniffr  = require('sniffr');
let redis= null;
async function getRedis(){
		 redis = Redis.createClient({
			url:`rediss://${process.env.REDIS}:6380`,
			password:process.env.REDIS_PASS
		})
		redis.on('error',err=>console.log('ERROR'+ err))
		redis.on('connect',()=>{
			console.log('REDIS CONNECT')
			
		})
		await redis.connect()
		
	}

async function store(_id,clientID,ip,userAgent){

const sniff  = new Sniffr()
sniff.sniff(userAgent)
const OS = sniff.os
const browser = sniff.browser
const payload = {clientID:clientID,
							ip:ip,
							firstLogin:Date.now(),
							OS:OS,
							browser: browser
						}
try{
	await redis.lPush(_id,JSON.stringify(payload))
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
		let devices = await redis.lRange(_id,0,-1)
		return devices.map(device =>JSON.parse(device))
	}
	catch(err){
		console.log(error)
	}
}

async function remove(_id,clientID)
{
	try{
		const index =  await validateRefresh(_id,clientID,false)
		if(!!index && index>0)
		{		await redis.lSet(_id,index-1,'DEL')
				await redis.lRem(_id,index-1,'DEL')
		}
		else{
			return false
		}
		return true
	}
	catch(err){
		throw err
		return false
	}
}

module.exports.store = store
module.exports.validateRefresh = validateRefresh
module.exports.getDeviceList = getDeviceList
module.exports.remove = remove
module.exports.getRedis = getRedis

