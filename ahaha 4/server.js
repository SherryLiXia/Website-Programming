var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request=require('request');
var geohash=require('ngeohash');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
/*app.get('/',function(req,res){
    res.sendfile(__dirname+'/index.html')
})*/

/*app.get('/form', function (req, res) {
	var num = req.body.value
	console.log(num)
	return res.end('done')
})*/


var formdata2="";
var geourl="";
var lat="";
var lon="";
app.post('/endpoint', function(req, res){
	var formatdata;
	var obj = {};
	formdata=JSON.stringify(req.body);
	formdata2 = JSON.parse(formdata);
	console.log(formdata2);
	lat=formdata2['lathere'];
	lon=formdata2['lonhere'];

	if(formdata2['remote'].length>=0){
		formdata2['remote']=formdata2['remote'].replace(/ /g,'+');
		formdata2['keyword']=formdata2['keyword'].replace(/ /g,'+');
		var geourl="https://maps.googleapis.com/maps/api/geocode/json?address="+
		formdata2['remote']+"&key=AIzaSyAnTwQG6K7gKD4aW71m01v5ytdhFFfQziY";
		request(geourl,function(error,response,body){
			if(error){
				console.log("error occur:");
				console.log(error);
			}
			else{
				if(response.statusCode == 200){
					var parseData = JSON.parse(body);
					lat=parseData['results']['0']['geometry']['location']['lat'];
					lon=parseData['results']['0']['geometry']['location']['lng'];
					console.log(lat);
					console.log(lon);
				}
			}
		})
	}
	console.log(lat);
	console.log(lon);
	



	res.send(req.body);
});/*get data from form*/




app.get('/event',function(req,res){
	console.log(lat);
	console.log(lon);
	var geo=geohash.encode(Number(lat),Number(lon));
	var tmurl="https://app.ticketmaster.com/discovery/v2/events.json?apikey=lottcb9MhlkYxcRV9dKWykErb4td88zm&keyword="
	+formdata2['keyword']+"&segmentId="+formdata2['category']+"&radius="+formdata2['distance']
	+"&unit=miles"+"&geoPoint="+geo;
	var tmeventData;
	console.log(tmurl);
	request(tmurl,function(error,response,body){
		if(error){
			console.log("error occur:");
			console.log(error);
			
		}
		else{
			if(response.statusCode == 200){
				tmeventData=JSON.parse(body);

				//console.log(body);
				res.send(tmeventData);
				
			}
		}
	})
})




/*

var tmurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
request(tmurl,function(error,response,body){
	if(error){
		console.log("error occur:");
		console.log(error);
	}
	else{
		if(response.statusCode == 200){
			var parsedData = JSON.parse(body);
			console.log(body);
		}
	}
})
*/
app.listen(3000);