let expObj = {}
expObj = require('./fastDB')

if(process.env.NODE_ENV=='dev' || process.env.useRedis=='no' || !process.env.REDIS_URL){
    expObj= require('./memoryDB')
    console.log("Using In memory")

}
module.exports = {...expObj}
