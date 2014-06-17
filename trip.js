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
server.get("/attendingFriends",attendingFriends);
server.post("/createAccount",createAccount);
server.post("/createTrip",createTrip);
server.post("/addFriend",addFriend);
server.put("/acceptFriend",acceptFriend);

function getTrip (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from trip where createdBy='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});

}
function getHot (req,res,next) {
	// body...
		res.setHeader('Access-Control-Origin','*');
		query=connection.query('select occasion, count(occasion) c from trip group by occasion order by c desc limit 10;',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	query=connection.query('delete from friends where req_rec='+data.userId+' or req_sent='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	query=connection.query('delete from favourites where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	query=connection.query('delete from tripattendees where invitees='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	console.log(query.sql);
	query=connection.query('delete from account where userId='+data.userId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});

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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
}
function updateTrip (req,res,next) {
	// body...
	var data={};
	console.log(req.params.tripId);
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}

	});
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
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
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
}
function createAccount (req,res,next) {
	// body...
	var data={};
	data.userId=req.params.userId;
	data.userName=req.params.userName;
	data.userToken=req.params.userToken;
	data.bioData=req.params.bioData;
	data.img=req.params.img;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('insert into account (userId,userToken,userName,bioData) values ('+data.userId+','+data.userToken+','+data.userName+','+data.bioData+');',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
}
function createTrip (req,res,next) {
	// body...
	var data={};
	data.tripName=req.params.tripName;
	data.userId=req.params.userId;
	data.occasion=req.params.occasion;
	data.date=req.params.date;
	data.duration=req.params.duration;
	data.meetup=req.params.meetup;
	data.img=req.params.img;
	res.setHeader('Access-Control-Origin','*');
	var date=new Date();

	var yyyy=date.getFullYear().toString();
	var mm=(date.getMonth()+1).toString();
	var dd=date.getDate().toString();
	var mmChars = mm.split('');
	var ddChars = dd.split('');
	var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
	
	query=connection.query('insert into trip (tripname,createdBy,createdDate,occasion,date,duration,meetup,image) values ('+data.tripName+','+data.userId+',"'+datestring+'",'+data.occasion+','+data.date+','+data.duration+','+data.meetup+','+data.img+');',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
}
function addFriend (req,res,next) {
	// body...
	var data={};
	data.req_sent=req.params.req_sent;
	data.req_rec=req.params.req_rec;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('insert into friends (req_sent,req_rec,status) values ('+data.req_sent+','+data.req_rec+',0);',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
}
function acceptFriend (req,res,next) {
	// body...
	var data={};
	data.req_sent=req.params.req_sent;
	data.req_rec=req.params.req_rec;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('update friends set status=1;',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
}
