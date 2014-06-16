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
		query=connection.query('select occasion, getcount(occasion) c from trip group by occasion order by c desc limit 10;',function(err,result){
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