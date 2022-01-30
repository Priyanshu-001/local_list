const mongoose = require('mongoose')
const { Schema } = mongoose
require('dotenv').config()

//db connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true,autoIndex: false })
.catch(e=>{
  console.log(e)
})

const customerSchema = new Schema({
  'name': String,
  // 'creation':{
  //   'default':'incomplete',
  //   'enum':['completed','incomplete'],
  // },
  'number': {
    'type': String,
    'required':true,
    'index': true

  },
  'nOrders':{
    'type':Number,
    'default': 0
  },
  'orders':{
    'type': [],
  },


})

const partnerSchema = new Schema({
  'name': String,
  // 'creation':{
  //   'default':'incomplete',
  //   'enum':['completed','incomplete'],
  // },
  'number': {
    'type': String,
    'required':true,
    'index': true
  },
  'nOrders':{
    'type':Number,
    'default': 0
  },
  'orders':{
    'type': [],
  },
  'rating':{
    'type':Number,
    'max': 5,
    'min': 0, 
  }


})

const  customer = mongoose.model('customer',customerSchema)
const  partner = mongoose.model('partner',partnerSchema)

module.exports.customer = customer
module.exports.partner = partner

