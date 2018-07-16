var mongoose=require('mongoose');

var resSchema=new mongoose.Schema({
  random:{type:Boolean }
});
module.exports=mongoose.model('response',resSchema);
