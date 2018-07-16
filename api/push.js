var app = require('../models/model.js');
var azure = require('azure');
var path = require('path');
// var telemetry = require('applicationinsights');
/*
add function to add application name and endPoint url for connectivity with azureNotificationHub
Perameters:
1: appName:String
2: appUrl:String    (endPoint Url)
 */

exports.add = function (req, res) {
  if (req.body.appName == undefined || req.body.appUrl == undefined) {
    res
      .status(404)
      .send({message: 'one or more perameters missing'});
  } else {
    new app({appName: req.body.appName, appUrl: req.body.appUrl})
      .save(function (err, app) {
        if (err) {
          res.send({message: 'app already exists'})
        } else {
          res.send(app);
        }
      });

  }
}

// exports.trackEvent = function(req,res){
//   console.log('Request : ',req.body.event);
//   telemetry.trackEvent({name: req.body.event});
//   res.status(200).send({message : "Event Added"});
// }


/*
perameters: 
1: appName: String
appName is attached with url as http://localhost:3000/push/sofitpush-hub
where sofitpush-hub is app name

2: tag: String
if its a broadcast message then leave that field empty

3: pushNotification:String
message which would be sent through push notifications

 */


exports.sendPushNotification = function (req, res) {
  app
    .findOne({'appName': req.params.appName})
    .exec(function (error, resData) {
      if (error) {
        res
          .status(500)
          .send({message: error});
      } else {
        if (resData.length == 0) {
          res
            .status(200)
            .send({message: 'app app not fount'});
        } else {
          var notificationHubService = azure.createNotificationHubService(process.env.appName,process.env.appUrl);
          var payload = {
            data: {
              title: req.body.title,
              message: req.body.pushNotification,
              imageUrl: req.body.imageUrl,
              type: req.body.contentType
            }
          };
          var tags = null;
          if(req.body.tag!=undefined){
            tags = req.body.tag;
          }
          notificationHubService
            .gcm
            .send(tags, payload, function (error) {
              if (!error) {
                //notification sent
                res.send({"message":"notification sent successfully"});
              } else {
                res.send({"message":"notification was not successfully, Something went wrong"});
              }
            });
        }
      }
    })
}




exports.package = function(req,res){
  app
    .findOne({'appName': req.params.appName})
    .exec(function (error, resData) {
      if(error){
        res.status(500).send({error:error});
      }else{
        res.status(200).send({result:resData});
      }
    })
}