var app = require('../models/appdata.js');
var appResponse = require('../models/response.js');
var notific = require('../models/notification.js');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'sofittech',
  api_key: '479195199828816',
  api_secret: 'mEIgYJ6yKGWRRNCM849CIv2g4dA'
});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    //console.log(file);
    callback(null, Date.now() + file.originalname)
  }
})
/*
add function to add application name and endPoint url for connectivity with azureNotificationHub
Perameters:
1: appName:String
2: appUrl:String    (endPoint Url)
*/

exports.add = function (req, res) {
  if (req.body.title == undefined || req.body.imageUrl == undefined) {
    res
    .status(404)
    .send({message: 'one or more perameters missing'});
  } else {
    new app({title: req.body.title, message: req.body.message, package:req.body.package, type: req.body.type,imageUrl: req.body.imageUrl})
    .save(function (err, app) {
      if (err) {
        res.send({error: err})
      } else {
        res.send(app);
      }
    });

  }
}

exports.addBanner = function(req,res){
  //console.log("request: ",req.body);
  app.remove({notificationType:"Banner"}).then(function(final){
    var upload = multer({ storage: storage }).single('userFile')
    upload(req, res, function (err) {
      //console.log("checking file here:" + req.file);
      cloudinary.uploader.upload(req.file.path, function (cloudinarResult) {
        //console.log("cloudinary : ",cloudinarResult.url);
        app.findOne({package:req.body.packagename}).then(function(result){
          result.banner = cloudinarResult.url;
          result.save(function(error,fin){
            if(error){
              res.status({error:error});
            }else{
              app.find({notificationType:"Banner"}).then(function(found){
                app.find({}).exec(function(error,done){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    app.find({notificationType:"Other"}).exec(function(error,result){
                      if(error){
                        res.status(500).send({error:error});
                      }else{
                        //console.log(result);
                        res.render("index",{
                          app:done,
                          other:result,
                          banner:found,
                          message: "Banner Image updated Successfully!"
                        });
                      }
                    })
                  }
                })
              })
            }
          })


        })

      })
    })
  })

}


exports.updateIconBanner =function(req,res){
  //console.log(req.body);

      var upload = multer({ storage: storage }).single('userFile')
      upload(req, res, function (err) {
        //console.log("checking file here:" + req.file);
        cloudinary.uploader.upload(req.file.path, function (cloudinarResult) {
          //console.log("cloudinary : ",cloudinarResult.url);
          app.findOne({package:req.body.package , notificationType:"Banner"}).then(function(result){
            //console.log("Updated : ",result);
            result.icon=cloudinarResult.url;
            result.save(function(error,fine){
              app.find({notificationType:"Banner"}).then(function(found){
                app.find({}).exec(function(error,done){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    app.find({notificationType:"Other"}).exec(function(error,result){
                      if(error){
                        res.status(500).send({error:error});
                      }else{
                        //console.log(result);
                        res.render("index",{
                          app:done,
                          other:result,
                          banner:found,
                          message : "Banner Icone Updated Successfully!"
                        });
                      }
                    })
                  }
                })
              })
            })

          })
        })
      })

}


exports.addNotification = function (req, res) {
  //console.log(req.body)
  if(req.body.notificationType=="Notification"){
    app.findOne({
      notificationType:"Notification",
      active:"true"
    }).then(function(result){
      if(result){
          result.active = false;

            result.save(function(error,result1){
              if(error){
                res.status(500).send({error:error});
              }else{
                app.findOne({package:req.body.package}).exec(function(error,notification){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    if(notification!=null){
                      notification.active = true;
                      notification.save(function(error,fin){
                        if(error){
                          res.status(500).send({error:error});
                        }else{
                          app.find({notificationType:"Banner"}).then(function(found){

                            app.find({}).exec(function(error,done){
                              if(error){
                                res.status(500).send({error:error});
                              }else{
                                app.find({notificationType:"Other"}).exec(function(error,result){
                                  if(error){
                                    res.status(500).send({error:error});
                                  }else{
                                    //console.log(result);
                                    res.render("index",{
                                      app:done,
                                      other:result,
                                      banner:found,
                                      message: "Notification Added Successfully!"
                                    });
                                  }
                                })
                              }
                            })
                          })
                        }
                      })

                    }else{
                      app.find({}).exec(function(error,done){
                        if(error){
                          res.status(500).send({error:error});
                        }else{
                          res.render("index",{
                            app:done,
                            message:"Notification/Banner not added"
                          });
                        }
                      })
                    }

                  }
                })
              }
            })
      }else{
        
            app.findOne({package:req.body.package}).exec(function(error,notification){
              if(error){
                res.status(500).send({error:error});
              }else{
                if(notification!=null){
                  notification.active = true;
                  notification.save(function(error,fin){
                    if(error){
                      res.status(500).send({error:error});
                    }else{
                      app.find({notificationType:"Banner"}).then(function(found){

                        app.find({}).exec(function(error,done){
                          if(error){
                            res.status(500).send({error:error});
                          }else{
                            app.find({notificationType:"Other"}).exec(function(error,result){
                              if(error){
                                res.status(500).send({error:error});
                              }else{
                                //console.log(result);
                                res.render("index",{
                                  app:done,
                                  other:result,
                                  banner:found,
                                    message: "Notification Added Successfully!"
                                });
                              }
                            })
                          }
                        })
                      })
                    }
                  })

                }else{
                  app.find({}).exec(function(error,done){
                    if(error){
                      res.status(500).send({error:error});
                    }else{
                      res.render("index",{
                        app:done,
                        message:"Notification/Banner not added"
                      });
                    }
                  })
                }

              }
            })

      }



    })
  }else if(req.body.notificationType=="Banner"){
    app.findOne({
      notificationType:"Banner",
      active : true
    }).then(function(result){
      if(result){
        result.active = false;
        result.save(function(error,fin){
          app.findOne({package:req.body.package}).exec(function(error,notification){
            if(error){
              res.status(500).send({error:error});
            }else{
              if(notification!=null){
                notification.active=true;
                notification.save(function(error,result2){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    app.find({notificationType:"Banner"}).then(function(found){
                      app.find({}).exec(function(error,done){
                        if(error){
                          res.status(500).send({error:error});
                        }else{
                          app.find({notificationType:"Other"}).exec(function(error,result){
                            if(error){
                              res.status(500).send({error:error});
                            }else{
                              //console.log(result);
                              res.render("index",{
                                app:done,
                                other:result,
                                banner:found,
                                message:"Banner Added Successfully!"
                              });
                            }
                          })
                        }
                      })
                    })
                  }
                })
              }else{
                app.find({}).exec(function(error,done){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    res.render("index",{
                      app:done,
                      message:"Notification/Banner not added"
                    });
                  }
                })
              }

            }
          })
        })
      }else{

        result.save(function(error,fin){
          app.findOne({package:req.body.package}).exec(function(error,notification){
            if(error){
              res.status(500).send({error:error});
            }else{
              if(notification!=null){
                notification.active=true;
                notification.save(function(error,result2){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    notific.find({notificationType:"Banner"}).then(function(found){
                      app.find({}).exec(function(error,done){
                        if(error){
                          res.status(500).send({error:error});
                        }else{
                          notific.find({notificationType:"Other"}).exec(function(error,result){
                            if(error){
                              res.status(500).send({error:error});
                            }else{
                              //console.log(result);
                              res.render("index",{
                                app:done,
                                other:result,
                                banner:found,
                                message:"Banner Added Successfully!"
                              });
                            }
                          })
                        }
                      })
                    })
                  }
                })
              }else{
                app.find({}).exec(function(error,done){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    res.render("index",{
                      app:done,
                      message:"Notification/Banner not added"
                    });
                  }
                })
              }

            }
          })
        })
      }


    })
   }
  //else{
  //   app.findOne({package:req.body.package}).exec(function(error,notification){
  //     if(error){
  //       res.status(500).send({error:error});
  //     }else{
  //       if(notification!=null){
  //         new notific({title: notification.title,notificationType: "Other", message: notification.message, package:notification.package, type: notification.type,imageUrl: notification.imageUrl})
  //         .save(function (apps) {
  //
  //           notific.find({notificationType:"Banner"}).then(function(found){
  //             app.find({}).exec(function(error,done){
  //               if(error){
  //                 res.status(500).send({error:error});
  //               }else{
  //                 notific.find({notificationType:"Other"}).exec(function(error,result){
  //                   if(error){
  //                     res.status(500).send({error:error});
  //                   }else{
  //                     //console.log(result);
  //                     res.render("index",{
  //                       app:done,
  //                       other:result,
  //                       banner:found
  //                     });
  //                   }
  //                 })
  //               }
  //             })
  //           })
  //
  //         });
  //       }else{
  //         app.find({}).exec(function(error,done){
  //           if(error){
  //             res.status(500).send({error:error});
  //           }else{
  //             res.render("index",{
  //               app:done,
  //               message:"Notification/Banner not added"
  //             });
  //           }
  //         })
  //       }
  //
  //     }
  //   })
  // }
}


exports.addByPortal = function(req,res){
  if (req.body.title == undefined || req.body.imageUrl == undefined) {
    res
    .status(404)
    .send({message: 'one or more perameters missing'});
  } else {
    new app({title: req.body.title, message: req.body.message,banner:" ",icon:" ",notificationType:" ", package:req.body.package, type: req.body.type,imageUrl: req.body.imageUrl})
    .save(function (err, app) {
      if (err) {
        res.send({error: err})
      } else {
        app.find({notificationType:"Banner"}).then(function(found){
          app.find({}).exec(function(error,done){
            if(error){
              res.status(500).send({error:error});
            }else{
              app.find({notificationType:"Other"}).exec(function(error,result){
                if(error){
                  res.status(500).send({error:error});
                }else{
                  //console.log(result);
                  res.render("index",{
                    app:done,
                    other:result,
                    banner:found,
                    message: "App Added Successfully!"
                  });
                }
              })
            }
          })
        })

      }
    });

  }
}

exports.addOtherNotification = function(req,res){
  app.find({ $or: [ { package: req.body.pkg1 }, { package: req.body.pkg2 },{ package: req.body.pkg3 },{ package: req.body.pkg4 } ] }).select('-_id').exec(function(error,result){
    if(error){
      res.status(500).send({error:error});
    }else{
      var convertedJSON = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < convertedJSON.length; i++) {
        //console.log(convertedJSON[i]);
        convertedJSON[i].notificationType = "Other";
        if (i == convertedJSON.length-1) {
          app.remove({notificationType:"Other"}).then(function(fine){
            app.insertMany(convertedJSON ,{ordered : false}, (err, docs) => {
              if (err) {
                //console.log("Error: ",error);
                res.status(500).send({error:error});
              } else {
                //console.log("docs: ",docs);
                app.find({notificationType:"Banner"}).then(function(found){
                  app.find({}).exec(function(error,done){
                    if(error){
                      res.status(500).send({error:error});
                    }else{
                      app.find({notificationType:"Other"}).exec(function(error,result){
                        if(error){
                          res.status(500).send({error:error});
                        }else{
                          //console.log(result);
                          res.render("index",{
                            app:done,
                            other:result,
                            banner:found,
                            message: "Other Notifications Added Successfully"
                          });
                        }
                      })
                    }
                  })
                })
              }
            });
          });
        }


      }
    }
  })
}


exports.home = function(req,res){
  app.find({notificationType:"Banner"}).then(function(found){
    //console.log("banner : ",found);
    app.find({}).exec(function(error,done){
      if(error){
        res.status(500).send({error:error});
      }else{
        app.find({notificationType:"Other"}).exec(function(error,result){
          if(error){
            res.status(500).send({error:error});
          }else{
            //console.log(result);
            res.render("index",{
              app:done,
              other:result,
              banner:found,
              message: "Welecome to SOFIT App Services!"
            });
          }
        })
      }
    })
  })
}


exports.removeNotification = function(req,res){
  app.findOne({notificationType:"Notification",active:true}).then(function(result){
    if(result){
      result.active = false;
      result.save(function(error,result1){
        if(error){
          res.status(500).send({error:error});
        }else{
          app.find({notificationType:"Banner"}).then(function(found){
            app.find({}).exec(function(error,done){
              if(error){
                res.status(500).send({error:error});
              }else{
                notific.find({notificationType:"Other"}).exec(function(error,result){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    //console.log(result);
                    res.render("index",{
                      app:done,
                      other:result,
                      banner:found,
                      message : "notification de-Activated Successfully"
                    });
                  }
                })
              }
            })
          })
        }
      })
    }else{  //result null
      app.find({notificationType:"Banner"}).then(function(found){
        app.find({}).exec(function(error,done){
          if(error){
            res.status(500).send({error:error});
          }else{
            notific.find({notificationType:"Other"}).exec(function(error,result){
              if(error){
                res.status(500).send({error:error});
              }else{
                //console.log(result);
                res.render("index",{
                  app:done,
                  other:result,
                  banner:found ,
                  message : "Notification Already inactive!"
                });
              }
            })
          }
        })
      })
    }

  })
}

exports.removeBanner = function(req,res){

    app.find({notificationType:"Banner", active:true}).then(function(found){
      if(found){
        found.active = false;
        found.save(function(error,fine){
          if(error){
            res.status(500).send({error:error});
          }else{

            app.find({}).exec(function(error,done){
              if(error){
                res.status(500).send({error:error});
              }else{
                app.find({notificationType:"Other"}).exec(function(error,result){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    //console.log(result);
                    res.render("index",{
                      app:done,
                      other:result,
                      banner:found,
                      message: "Banner Removed Successfully"
                    });
                  }
                })
              }
            })
          }
        })
      }else{ //found null
        app.find({}).exec(function(error,done){
          if(error){
            res.status(500).send({error:error});
          }else{
            app.find({notificationType:"Other"}).exec(function(error,result){
              if(error){
                res.status(500).send({error:error});
              }else{
                //console.log(result);
                res.render("index",{
                  app:done,
                  other:result,
                  banner:found,
                  message: "Banner Already In-Active!"
                });
              }
            })
          }
        })
      }

    })

}

exports.removeOther = function(req,res){
  notific.remove({notificationType:"Other"}).then(function(result){
    notific.find({notificationType:"Banner"}).then(function(found){
      app.find({}).exec(function(error,done){
        if(error){
          res.status(500).send({error:error});
        }else{
          notific.find({notificationType:"Other"}).exec(function(error,result){
            if(error){
              res.status(500).send({error:error});
            }else{
              //console.log(result);
              res.render("index",{
                app:done,
                other:result,
                banner:found,
                message: "Other Removed Successfully!"
              });
            }
          })
        }
      })
    })
  })
}

exports.getAppData = function (req, res) {
  if(req.body.package==null || req.body.package==""){
    app.find({}).select('-package').sort({updatedAt:-1}).exec(function(error,result){
      if(error){
        res.status(500).send({error:error});
      }else{
        if(result.length==0){
          res.status(200).send("nothing found");
        }else{
          appResponse.find({}).exec(function(error,done){
            if(error){
              res.status(500).send({error:error});
            }else{
              if(done[0].random == true){
                var number = Math.random() * (result.length - 0) + 0;
                if(parseInt(number)+0.5>number && parseInt(number)+0.5<result.length-1){
                  number =  parseInt(number)+1;
                }else{
                  number =  parseInt(number);
                }
                app.findOne({notificationType:"Notification"}).then(function(not){
                  app.findOne({notificationType:"Banner"}).then(function(ban){
                    app.find({notificationType:"Other"}).then(function(oth){

                      var notificationString = JSON.stringify(not);
                      var resp = result[number];
                      var responseString = JSON.stringify(resp);
                      var bannerString = JSON.stringify(ban);
                      var otherString = JSON.stringify(oth);
                      var resu =  responseString.replace("}",","+'"notification"'+":"+notificationString+","+'"banner"'+":"+bannerString+","+'"other"'+":"+otherString+"}");
                      var final = JSON.parse(resu);
                      //console.log("response : ",final);
                      res.status(200).send(final );
                    })
                  })
                })

              }else{
                app.findOne({notificationType:"Notification"}).then(function(not){
                  app.findOne({notificationType:"Banner"}).then(function(ban){
                    app.find({notificationType:"Other"}).then(function(oth){
                      var notificationString = JSON.stringify(not);
                      var resp = result[0];
                      var responseString = JSON.stringify(resp);
                      var bannerString = JSON.stringify(ban);
                      var otherString = JSON.stringify(oth);
                      var resu =  responseString.replace("}",","+'"notification"'+":"+notificationString+","+'"banner"'+":"+bannerString+","+'"other"'+":"+otherString+"}");
                      var final = JSON.parse(resu);
                      //console.log("response : ",final);
                      res.status(200).send(final );
                    })
                  })
                })
              }
            }
          })
        }
      }
    })
  }else{
    app.find({ $and: [{ package: { $nin: req.body.package } }, { type: { $eq: 'app' } }] } ).sort({updatedAt:-1}).exec(function(error,result){
      if(error){
        res.status(500).send({error:error});
      }else{
        //console.log(result);
        if(result.length==0){
          res.status(200).send("nothing found");
        }else{
          appResponse.find({}).exec(function(error,done){
            if(error){
              res.status(500).send({error:error});
            }else{
              if(done[0].random == true){
                var number = Math.random() * (result.length - 0) + 0;
                if(parseInt(number)+0.5>number && parseInt(number)+0.5<result.length-1){
                  number =  parseInt(number)+1;
                }else{
                  number =  parseInt(number);
                }
                app.findOne({notificationType:"Notification"}).then(function(not){
                  app.findOne({notificationType:"Banner"}).then(function(ban){
                    app.find({notificationType:"Other"}).then(function(oth){
                      var notificationString = JSON.stringify(not);
                      var resp = result[number];
                      var responseString = JSON.stringify(resp);
                      var bannerString = JSON.stringify(ban);
                      var otherString = JSON.stringify(oth);
                      var resu =  responseString.replace("}",","+'"notification"'+":"+notificationString+","+'"banner"'+":"+bannerString+","+'"other"'+":"+otherString+"}");
                      var final = JSON.parse(resu);
                      //console.log("response : ",final);
                      res.status(200).send(final );
                    })
                  })
                })
              }else{
                res.status(200).send(result[0]);
              }
            }
          })
        }
      }
    })
  }
}








// exports.package = function(req,res){
//   app
//     .findOne({'appName': req.body.appName})
//     .exec(function (error, resData) {
//       if(error){
//         res.status(500).send({error:error});
//       }else{
//         res.status(200).send({result:resData});
//       }
//     })
// }
