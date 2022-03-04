//TODO: Use Redis instead of in memory array

/* format
	users is a object mapping userId to array of login devices 
*/ 

const Sniffr  = require('sniffr')
let users = {}
async function store(_id,clientID,secret,ip,userAgent){

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
if(users[_id])
users[_id] = [ payload, ...users[_id]]
else
	users[_id] = [payload]

}

async function validateRefresh(_id,clientID){
	if(!!users[_id]){
		users[_id].map(item=>{
			if(item.clientID === clientID){
				return true
			}
		})
	}
	return false

}
async function getDeviceList(_id){
	if(_id ==='__proto__')
		return []
	else if(!!users[_id])
		return []
	return  users[_id]
}

async function remove(_id,clientID)
{
	if(!users[_id])
		return true
	else{
		users[_id] = users[_id].filter(client=>client.clientID!=clientID)
	}
}

module.exports.store = store
module.exports.validateRefresh = validateRefresh
module.exports.getDeviceList = getDeviceList
module.exports.remove = remove
