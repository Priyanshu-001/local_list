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
users[_id] = [...users[id], {clientID:clientID,
							ip:req.ip,
							firstLogin:Date.now(),
							OS:OS,
							browser: Browser
							secret: secret
						}]
}