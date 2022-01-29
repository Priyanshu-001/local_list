//TODO: Use Redis instead of in memory array

/* format
	users is a object mapping userId to array of login devices 
*/ 


let users = {}
async function store(_id,clientID,secret,ip,userAgent){

const sniff  = new Sniffr()
sniff.sniff(userAgent)
const OS = sniff.os
const browser = sniff.browser
users[_id] = [...users[_id], {clientID:clientID,
							ip:req.ip,
							firstLogin:Date.now(),
							OS:OS,
							browser: Browser

						}]
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

module.exports.store = store
module.exports.validateRefresh = validateRefresh
module.exports.getDeviceList = getDeviceList