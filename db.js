const mongoose = require('mongoose')
const { Schema } = mongoose
//db connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true,autoIndex: false })
.catch(e=>{
  console.log(e)
})

const customerSchema = new Schema({
  'name': String,
  'status':{
    'required':true,
    'default':'incomplete',
    'enum':['completed','incomplete'],
  },
  'number': {
    'type': String,
    'required':true,

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
  'status':{
    'required':true,
    'default':'incomplete',
    'enum':['completed','incomplete'],
  },
  'number': {
    'type': String,
    'required':true,
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

export const customer = mongoose.model('customer',customerSchema)
export const partner = mongoose.model('partner',partnerSchema)
