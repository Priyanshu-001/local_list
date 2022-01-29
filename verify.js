require('dotenv').config()
const id=process.env['ID']
const token = process.env['TWILLIO_TOKEN']
const SERVICE = process.env['SERVICE']

 const client = require('twilio')(id,token)
// client = 'hello'
module.exports.client =client