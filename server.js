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