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
  'number': {
    'type': String,
    'required':true,
    'index': true
  },
  'rating':{
    'type':Number,
    'max': 5,
    'min': 0, 
  },
  type:{
    type:String,
    default:'partner'
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
    default:Date.now()
  },
  'cancelTime':{
    type:Number,
  },
  'acceptTime':{
    type:Number,
  },
  'deliverTime':{
    type:Number,
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
  'address':String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      default:'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  'status':{
    'type':String,
    'enum':["completed","cancelled","waiting","accepted","rejected"],
    'default': "waiting"
  },
  'items': [],
  

})
orderSchema.index({ location: '2dsphere' });

const  customer = mongoose.model('customer',customerSchema)
const  order = mongoose.model('order',orderSchema)
const  partner = mongoose.model('partner',partnerSchema)

module.exports.customer = customer
module.exports.partner = partner
module.exports.order = order


