var mongoose=require('mongoose');

var appSchema=new mongoose.Schema({
  appName:{type:String,default:'Name',lowercase:true,required: true },
  appUrl:{type:String,unique:true,dropDups:true,required: true }
});
module.exports=mongoose.model('app',appSchema);
