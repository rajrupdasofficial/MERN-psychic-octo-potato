const mongoose = require('mongoose')
// AutoIncrement is used to deal with automatic update sequence 
const AutoIncrement = require('mongoose-sequence')(mongoose)
const noteSchema = new mongoose.Schema({
    //Note object | object number 1
  user:{
    type:mongoose.Schema.Types.ObjectId,
    require:true,
    ref:"User",
  }, 
  title:{
    type:String,
    require:true
  }, 
  text:{
    type:String,
    required:true
  },
  completed:{
    type:Boolean,
    default:false
  }
},
//time object | object number 2
{
    timestamps:true
}
)



noteSchema.plugin(AutoIncrement,{
    inc_field : 'ticket',
    id:'ticketNums',
    start_seq:500,
})

module.exports = mongoose.model('Note',noteSchema)