var express = require('express');
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var ejs = require('ejs');
var path = require('path'); // node path module
var routes = require('./routes/route.js');
mongoose.Promise = require('bluebird');
var app = express();
app.use('/static', express.static(path.join(__dirname, 'public')));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
mongoose.connect(process.env.mongoConnection);
mongoose.connection.on('connected',function (){
  console.log('connected to database');
});


app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());
app.use(routes);



app.all('*',(req,res)=>res.send({msg:'Page not found'}));
app.listen(port,function(){
  console.log('app is live at port : '+port);
});
