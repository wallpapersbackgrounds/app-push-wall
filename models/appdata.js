var mongoose = require('mongoose');

var appDataSchema = new mongoose.Schema({
  title: { type: String, },
  type: { type: String},
  message: { type: String },
  imageUrl: { type: String},
  package: { type: String},
  updatedAt: {type:Date, default:Date.now()},
  notificationType : {type:String},
  icon : {type:String},
  notificationType : {type:String},
  banner : {type:String},
  active : {type:Boolean , default:false}
});
module.exports = mongoose.model('appData', appDataSchema);
