//TODO: Use Redis instead of in memory array

const { sniffUser } = require("../../auxilaryFunctions")

/* format
	users is a object mapping userId to array of login devices 
*/ 


let users = {}
async function store(_id,clientID,ip,userAgent){

const payload = sniffUser(userAgent,clientID,ip)
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
	console.log(users)
	return  users[_id] || []
}

async function remove(_id,clientID)
{
	if(!users[_id])
		return true
	else{
		users[_id] = users[_id].filter(client=>client.clientID!=clientID)
        return true
	}
}
async function connect(){
    console.log("Connected with in memory storage")
    return true
}
module.exports.store = store
module.exports.validateRefresh = validateRefresh
module.exports.getDeviceList = getDeviceList
module.exports.remove = remove
module.exports.connect = connect