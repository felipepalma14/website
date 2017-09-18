// app-server.js
var express = require('express');
var bodyParser = require('body-parser');
var stripe = require("stripe")(process.env.STRIPE_SECRET);
var app = express();
app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname))
app.use(bodyParser.json())
var http = require('http').Server(app)
// Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
app.post('/charge', (req, res) => {
  var token = req.body.stripeToken;
  // Charge the user's card:
  var charge = stripe.charges.create({
    amount: req.body.amount,
    currency: "usd",
    description: req.body.amount.description,
    metadata: req.body.order,
    source: token,
  }, function(err, charge) {
      res.send(charge);
  });
});
http.listen(app.get('port'), () => {
  console.log(' App listening on ' + app.get('port'))
})
/*
var express = require("express");

var app = express();
var path = require("path");

app.use(express.static(__dirname+'/'));
app.use("/bower_components",express.static(__dirname+'/bower_components'));
app.use("/node_modules",express.static(__dirname+'/node_modules'));
app.use("/lib",express.static(__dirname+'/lib'));
app.use("/",express.static(__dirname+'/'));


app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});



app.listen(3000);

console.log("Ta funcionando");
*/