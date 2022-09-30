const Sniffr = require('sniffr')
const sniffUser = (userAgent,clientID,ip) =>{
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
	return payload
}
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }
module.exports.sniffUser = sniffUser
module.exports.getRandomInt = getRandomInt
