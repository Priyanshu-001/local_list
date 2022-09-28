let expObj = {}
expObj = require('./fastDB')

if(process.env['USE_REDIS']=='false' || !process.env.REDIS){
    expObj= require('./memoryDB')
    console.log("Using In memory")

}
module.exports = {...expObj}
