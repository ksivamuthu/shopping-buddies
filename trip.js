var restify=require('restify');
var ip_addr='127.0.0.1';
var port="4243";
var fs = require('fs-extra');
var server=restify.createServer({
	name:"sbapp"
});

var mysql=require('mysql');
var connection=mysql.createConnection({
	host	: "localhost",
	user	: "root",
	password: "Tra@2014",
	database: "sbtry",    
	multipleStatements : true
});
/*var mysql = require('mysql');

var connection = mysql.createConnection({
host :  "nodejs-shoppingbuddies.rhcloud.com",
user : 	"adminSt5sHZB",
pass : 	"k_RyfcHqwsdC",
port : 	3306,
database : 'shoppingbuddies'
});*/
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
server.get("/hot",getHot);

server.get("/favourites",getFavourites);
server.post("/addFavourites",addFavourites);

server.post("/createAccount",createAccount);
server.get("/profile",getProfile);
server.del("/deleteProfile",deleteProfile);
server.put("/updateProfile",updateProfile);

server.post("/createTrip",createTrip);
server.get("/trips",getTrip);
server.put("/updateTrip",updateTrip);
server.del("/deleteTrip",deleteTrip);

server.get("/venues",getVenues);
server.get("/attendingFriends",attendingFriends);

server.post("/addFriend",addFriend);
server.put("/acceptFriend",acceptFriend);
server.get("/friends",getFriends);

//server.put("/updateProfilePic",updateProfilePic);
//server.post("/uploadProfilePic",uploadProfilePic);


function getTrip (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);
	data.userId=req.params.userId;
	res.setHeader('Access-Control-Origin','*');
	query=connection.query('select * from trip where createdBy='+data.userId,function(err,result){
		console.log(query.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
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
	query=connection.query('select a.latitude, a.longitude, a.description, b.imgSrc from favourites a left join images b on a.imgId=b.imgId where a.userId='+data.userId,function(err,result){
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
	query=connection.query('select a.userName, a.bioData, b.imgSrc from account a left join images b on a.imgId=b.imgId where a.userId='+data.userId,function(err,result){
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
			
	query1=connection.query('delete from friends where req_rec='+data.userId+' or req_sent='+data.userId,function(err,result){
		if(err){
			console.log("ERROR : "+err);
			console.log(query1.sql);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});
	query2=connection.query('delete a, b from favourites a left join images b on a.imgId=b.imgId where a.userId='+data.userId,function(err,result){
		if(err){
			console.log("ERROR : "+err);
			console.log(query2.sql);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});
	query3=connection.query('delete tripAttendees from tripAttendees , trip where trip.tripId=tripAttendees.tripId and trip.createdBy='+data.userId+';',function(err,result){
		if(err){
			console.log("ERROR : "+err);
			console.log(query3.sql);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});
	query7=connection.query('delete tripVenues from tripVenues , trip where trip.tripId=tripVenues.tripId and trip.createdBy='+data.userId+';',function(err,result){
		if(err){
			console.log("ERROR : "+err);
			console.log(query3.sql);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});

	query6=connection.query('delete from tripAttendees where invitees='+data.userId+';',function(err,result){
		if(err){
			console.log("ERROR : "+err);
			console.log(query3.sql);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});

	query4=connection.query('delete from trip where createdBy='+data.userId,function(err,result){
		if(err){
		console.log("4"+query4.sql);
			console.log("ERROR : "+err);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});
	query5=connection.query('delete a, b from account a left join images b on a.imgId=b.imgId where userId='+data.userId,function(err,result){
		if(err){
			console.log("5"+query5.sql);
			console.log("ERROR : "+err);
		}
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});
	//Delete picture folder
	var path='./images/'+data.userId+'/';
	var deleteFolderRecursive = function(path) {
		console.log(path);
 	 if( fs.existsSync(path) ) {
    	fs.readdirSync(path).forEach(function(file,index){
      	var curPath = path + "/" + file;
      	if(fs.lstatSync(curPath).isDirectory()) {// recurse
        	deleteFolderRecursive(curPath);
      	} else { // delete file
        	fs.unlinkSync(curPath);
      	}
    	});
    	fs.rmdirSync(path);
  	}
	};

deleteFolderRecursive(path);

}

function updateProfile (req,res,next) {
	// body...
	var data={};
	console.log(req.params.userId);

	data.userId=req.params.userId;
	data.userName=req.params.userName;
	data.bioData=req.params.bioData;

	res.setHeader('Access-Control-Origin','*');

	var tmp_path = req.files.thumbnail.path;
    console.log(tmp_path);
    var path='./images/'+data.userId+'/';
    var target_path = './images/'+data.userId+'/' + req.files.thumbnail.name;
    fs.stat(path,function(e){
    	console.log(e);
    	if(e)
   		{
   			fs.mkdir(path,0777,function(err,dirPath){
   				if(err)
   					console.log(err);
   			})
   		}
    
    console.log(target_path);
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });
    	
    })
	var flag=0;
	res.setHeader('Access-Control-Origin','*');
	/*query1=connection.query('update account left join images on account.imgId=images.imgId set account.userName="'+data.userName+'", account.bioData="'+data.bioData+'", images.imgSrc="'+target_path+'" where account.userId='+data.userId+' and account.imgId is not null;',function(err,result){
	console.log(query1.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query1.sql);
			res.send(200,result);
		}
		flag=1;
		console.log("TTTTTT : "+target_path);
	});
	if(flag==0){
	query2=connection.query('insert into images (imgSrc) values ("'+target_path+'") ; update account set imgId=last_insert_id(), userName="'+data.userName+'", bioData="'+data.bioData+'" where userId='+data.userId,function(err,result){
		console.log(query2.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query5.sql);
			res.send(200,result);
		}
	});
}*/
query2=connection.query('call updateProfile2('+data.userId+',"'+data.userName+'","'+data.bioData+'","'+target_path+'")',function(err,result){
		console.log(query2.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query2.sql);
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
	query1=connection.query('delete tripAttendees from tripAttendees , trip where trip.tripId='+data.tripId,function(err,result){
		console.log(query1.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query1.sql);
			res.send(200,result);
		}
	});
	query2=connection.query('delete tripVenues from tripVenues , trip where trip.tripId='+data.tripId,function(err,result){
		console.log(query2.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query2.sql);
			res.send(200,result);
		}
	});
	query3=connection.query('delete from trip where tripId='+data.tripId,function(err,result){
		console.log(query3.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query3.sql);
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
	data.friends=req.params.friends;
	data.venues=req.params.venues;

	res.setHeader('Access-Control-Origin','*');
	query=connection.query('update trip set tripName="'+data.tripName+'", occasion="'+data.occasion+'", date="'+data.date+'", duration="'+data.duration+'", meetup="'+data.meetup+'" where tripId='+data.tripId,function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}

	});

	var i=0;
	while(data.friends[i])
	{
	query=connection.query('insert into tripAttendees (tripId,invitees,status) select '+data.tripId+', '+data.friends[i]+' ,"No" from dual where not exists (select invitees from tripattendees where tripId='+data.tripId+' and invitees='+data.friends[i]+');',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	i=i+1;
	}
	query1=connection.query('delete from tripVenues where tripId='+data.tripId+';',function(err,result){
		console.log(query1.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query1.sql);
			res.send(200,result);
		}
	});
	var j=0;
	while(data.venues[j])
	{
	query=connection.query('insert into tripVenues (tripId,name,address,latitude,longitude) values ('+data.tripId+', "'+data.venues[j].tripName+'" ,"'+data.venues[j].address+'",'+data.venues[j].latitude+','+data.venues[j].longitude+')',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	j=j+1;
	}
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
	console.log("createAccount");
	var data={};
	data.userId=req.params.userId;
	data.userName=req.params.userName;
	data.userToken=req.params.userToken;
	data.bioData=req.params.bioData;
	//data.img=req.params.img;
	//var data={};
	console.log(req.params.userId);
	//data.userId=req.params.userId;
	var tmp_path = req.files.thumbnail.path;
    console.log(tmp_path);
    var path='./images/'+data.userId+'/';
    var target_path = './images/'+data.userId+'/' + req.files.thumbnail.name;
    fs.stat(path,function(e){
    	console.log(e);
    	if(e)
   		{
   			fs.mkdir(path,0777,function(err,dirPath){
   				if(err)
   					console.log("MAKING NEW FORLDER ERROR" +err);
   			})
   		}
    
    console.log(target_path);
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
    	
    })
	res.setHeader('Access-Control-Origin','*');
	var imgId;
	/*query1=connection.query('insert into images (imgSrc) values ("'+target_path+'");',function(err,result){
		console.log(query1.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query1.sql);
		}
	});

	query2=connection.query('insert into account (userId,userToken,userName,bioData,imgId) values ('+data.userId+',"'+data.userToken+'","'+data.userName+'","'+data.bioData+'",last_insert_id());',function(err,result){
		console.log(query2.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query2.sql);
			res.send(200,result);
		}
	});
*/
	query2=connection.query('call createAccount ('+data.userId+',"'+data.userToken+'","'+data.userName+'","'+data.bioData+'","'+target_path+'")',function(err,result){
		console.log(query2.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query2.sql);
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
	data.friends=req.params.friends;
	data.venues=req.params.venues;
	res.setHeader('Access-Control-Origin','*');
	var date=new Date();

	var yyyy=date.getFullYear().toString();
	var mm=(date.getMonth()+1).toString();
	var dd=date.getDate().toString();
	var mmChars = mm.split('');
	var ddChars = dd.split('');
	var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
	
	query=connection.query('insert into trip (tripname,createdBy,createdDate,occasion,date,duration,meetup) values ("'+data.tripName+'","'+data.userId+'","'+datestring+'","'+data.occasion+'","'+data.date+'","'+data.duration+'","'+data.meetup+'");',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	console.log(data.friends);
	var i=0;
	while(data.friends[i])
	{
	query=connection.query('insert into tripAttendees (tripId,invitees,status) values (last_insert_id(),'+data.friends[i]+',"No");',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	i=i+1;
	}
	var j=0;
	//var v=JSON.stringify(data.venues);
	console.log(data.venues[0].tripName);
	while(data.venues[j])
	{
		//var v=JSON.stringify(ven[j]);
		//console.log(v);
	query=connection.query('insert into tripVenues (tripId,name,address,latitude,longitude) values (last_insert_id(), "'+data.venues[j].tripName+'" ,"'+data.venues[j].address+'",'+data.venues[j].latitude+','+data.venues[j].longitude+');',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	j=j+1;
	}

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
	query=connection.query('update friends set status=1 where req_sent='+data.req_sent+' and req_rec='+data.req_rec+';',function(err,result){
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			console.log(query.sql);
			res.send(200,result);
		}
	});
	
}
function addFavourites (req,res,next) {
	// body...
	var data={};
	data.userId=req.params.userId;
	data.latitude=req.params.latitude;
	data.longitude=req.params.longitude;
	data.description=req.params.description;
	var tmp_path = req.files.thumbnail.path;
    console.log(tmp_path);
    var path='./images/'+data.userId+'/';
    var target_path = './images/'+data.userId+'/' + req.files.thumbnail.name;
    fs.stat(path,function(e){
    	console.log(e);
    	if(e)
   		{
   			fs.mkdir(path,0777,function(err,dirPath){
   				if(err)
   					console.log(err);
   			})
   		}
    
    console.log(target_path);
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });
    	
    })
	res.setHeader('Access-Control-Origin','*');
	query1=connection.query('insert into images (imgSrc) values ("'+target_path+'");insert into favourites (userId,latitude,longitude,description,imgId) values ("'+data.userId+'","'+data.latitude+'","'+data.longitude+'","'+data.description+'",last_insert_id());',function(err,result){
		console.log(query1.sql);
		if(err)
			console.log("ERROR : "+err);
		else{
			console.log("SUCCESS : "+result);
			res.send(200,result);
		}
	});
	
	
}
