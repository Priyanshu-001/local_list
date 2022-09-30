let expObj = {}
expObj = require('./Redis/fastDB')

if(process.env['USE_REDIS']=='false' || !process.env.REDIS){
    expObj= require('./InMemory/memoryDB')
    console.log("Using In memory")

}
module.exports = {...expObj}
