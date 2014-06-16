var restify=require('restify');
var ip_addr='127.0.0.1';
var port="4243";

var server=restify.createServer({
	name:"sbapp"
});

var mysql=require('mysql');
var connection=mysql.createConnection({
	host	: "localhost",
	user	: "root",
	password: "Tra@2014",
	database: "sbtry",    
});
connection.connect(function(err){
	if(err)
		console.log("ERROR : "+err);
	else
		console.log("SUCCESS connected to database");
});

server.listen(port,ip_addr,function(){
	console.log('%s listening on %s',server.name,server.url);
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

//var PATH="/trips";
server.get("/trips",getTrip);
server.get("/friends",getFriends);
server.get("/favourites",getFavourites);
server.get("/hot",getHot);
server.get("/profile",getProfile);
server.del("/deleteProfile",deleteProfile);
server.put("/updateProfile",updateProfile);
server.del("/deleteTrip",deleteTrip);
server.put("/updateTrip",updateTrip);
server.get("/venues",getVenues);
server.get("attendingFriends",attendingFriends);

function getTrip (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from trip where createdBy='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function getFriends (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from friends where req_sent='+data.userId+' or req_rec='+data.userId+' and status=1',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function getFavourites (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from favourites where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function getHot (req,res,next) {
	// body...
		res.setHeader('Access-Control-Origin','*');
		query=connection.query('select occasion, count(occasion) c from trip group by occasion order by c desc limit 10;',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function getProfile (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select userName, bioData, img from account where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function deleteProfile (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	
	
	query=connection.query('delete from trip where createdBy='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	query=connection.query('delete from friends where req_rec='+data.userId+' or req_sent='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	query=connection.query('delete from favourites where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	query=connection.query('delete from tripattendees where invitees='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	query=connection.query('delete from account where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	
	console.log(query.sql);
	res.send(200);

}
function updateProfile (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	data.userName=req.params.userName;
	data.bioData=req.params.bioData;
	data.img=req.params.img;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('update account set userName='+data.userName+', bioData='+data.bioData+', img='+data.img+' where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function deleteTrip (req,res,next) {
	// body...
	var data={};
	console.log(req.params.tripId);
	data.tripId=req.params.tripId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('delete from trip where tripId='+data.tripId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function updateTrip (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.createdBy=req.params.userId;
	data.tripId=req.params.tripId;
	data.tripName=req.params.tripName;
	data.occasion=req.params.occasion;
	data.date=req.params.date;
	data.duration=req.params.duration;
	data.meetup=req.params.meetup;
	data.img=req.params.img;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('update trip set tripName='+data.tripName+', occasion='+data.occasion+', date='+data.date+', duration='+data.duration+', meetup='+data.meetup+', image='+data.img+' where tripId='+data.tripId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function getVenues (req,res,next) {
	// body...
	var data={};
	console.log(req.params.tripId);
	data.tripId=req.params.tripId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from tripvenues where tripId='+data.tripId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}
function attendingFriends (req,res,next) {
	// body...
	var data={};
	console.log(req.params.tripId);
	data.tripId=req.params.tripId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from tripattendees where tripId='+data.tripId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else
			console.log("SUCCESS : "+result);
	});
	console.log(query.sql);
	res.send(200);
}