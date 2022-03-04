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
    'index': true,
    'unique':true
  },
  'orders':[{
    type: Schema.Types.ObjectId, ref: 'order'
  }],
  type:{
    type:String,
    default:'customer'
  },
  status:{
    type:String,
    default:'incomplete'
  }

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
  'rating':{
    'type':Number,
    'max': 5,
    'min': 0, 
  },
  type:{
    type:String,
    default:'business'
  },
  status:{
    type:String,
    default:'incomplete'
  },
  'orders':[{
    type: Schema.Types.ObjectId, ref: 'order'
  }],


})

const orderSchema = new Schema({
 
  'name': String,
  'subtotal':Number,
  'tip':Number,
  'customerId':{
      type:Schema.Types.ObjectId,
      ref:"cutomer"
    },
  'partnerId':{
    type:Schema.Types.ObjectId,
    ref:"partner"
  },
  'orderTime':{
    type:Number,
    default:()=>Date.now(),
  },
  receipt:{
    type:Boolean,
    default:false,
  },
  instructions:{
    type: String,
    default: 'No instructions were given'
  },
  'delivered':Number,
  'otp' : {
    type:Number,
    default: ()=>{
      let num = 4
      let res = ''
      while(num--)
        res+=Math.floor(Math.random()*10)
      return Number(res)
    } 
  },

  'status':{
    'type':String,
    'enum':["completed","cancelled","waiting","accepted"],
    'default': "waiting"
  },
  'items': [],
  

})

const  customer = mongoose.model('customer',customerSchema)
const  order = mongoose.model('order',orderSchema)
const  partner = mongoose.model('partner',partnerSchema)

module.exports.customer = customer
module.exports.partner = partner
module.exports.order = order


