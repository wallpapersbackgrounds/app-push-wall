var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
    title: { type: String, },
    type: { type: String},
    message: { type: String },
    imageUrl: { type: String},
    package: { type: String},
    updatedAt: {type:Date, default:Date.now()},
    notificationType : {type:String},
    icon : {type:String}
});
module.exports = mongoose.model('notificationData', notificationSchema);
