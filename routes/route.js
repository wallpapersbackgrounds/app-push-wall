var express=require('express');
var router=express.Router();
var path=require('path');
var user=require('../api/push.js');
var app=require('../api/appdata.js');


router.post('/add',user.add);
router.post('/push/:appName',user.sendPushNotification);
router.post('/push/:packageName',user.package);
router.post('/addByPortal',app.addByPortal)
// router.post('/event',user.trackEvent);

router.post('/addapp',app.add);
router.post('/getapp',app.getAppData);
router.get('/kuchbhe',app.home);
router.get('/removeNotification',app.removeNotification);
router.get('/removeBanner',app.removeBanner);
router.get('/removeOther',app.removeOther);
router.post('/addOtherNotification',app.addOtherNotification);
router.post('/addNotification',app.addNotification);
router.post('/addBanner',app.addBanner);
router.post('/updateIconBanner',app.updateIconBanner);

module.exports=router;
