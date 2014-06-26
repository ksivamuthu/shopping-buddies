angular.module('trips', ['ionic'])
.controller('tripController',function($scope,$http,$q){

console.log("HI! You requested trips");

var url="http://localhost:4243/trips";
		
		var i=0;
		var j=0;
		var k=0;
		var tripResults=[];
		var tripFriends=[];
		var tripVenues=[];
		var tripDates=[];
		$scope.trips=[
						{
							trip:"",
							date:"",
							venues:"",
							friends:"",
						}];
		window.localStorage.setItem('userId',2);
		function getFriends(id,i)
		{

			//console.log("Inside getFriends "+id);
			return new Promise(function(resolve,reject){
				$http({method: 'GET', url:"http://localhost:4243/attendingFriends", params:{"tripId":id}}).
					success(function(data,status,headers,config)
					{
						$scope.trips[i].friends=data;
						resolve();
					}).error(function(data,status,headers,config)
					{
						reject();
					});
					//console.log("Inside promise getFriends "+id);
				
			});
		}
		function getVenues(id,i)
		{
			//console.log("Inside getVenues "+id);
			return new Promise(function(resolve,reject)
			{
				$http({method: 'GET', url:"http://localhost:4243/venues", params:{"tripId":id}}).
					success(function(data,status,headers,config)
					{
						$scope.trips[i].venues=data;
						//console.log("venues : "+JSON.stringify(tripVenues))
						resolve();
					}).error(function(data,status,headers,config)
					{
						reject();
					});
				//	console.log("Inside Promise getVenues "+id)
			})
			
		}


		$http({method: 'GET', url:url, params:{"userId":window.localStorage['userId']}}).
		success(function(data,status,headers,config)
		{
			tripResults=data;
			for(k in tripResults)
			{
				var t=tripResults[k].createdDate.split(/[- :]/);
				var l=t[2].split(/[T]/);
				tripDates[k]=new Date(t[0],t[1]-1,l[0],t[3]);
				var id=tripResults[k].tripId;
				}
		
				var prevPromise=Promise.resolve();

			tripResults.forEach(function(result)
			{
				
				prevPromise=prevPromise.then(function()
				{
					getFriends(result.tripId,i);
					getVenues(result.tripId,i);
					
				}).then(function()
				{
					//console.log("I : "+i+"venues :"+JSON.stringify(tripVenues));
					console.log("DATE : "+tripDates[i]);
					var d=tripDates[i].toString();
					$scope.trips[i]=
						{
							trip:result,
							date:d,
							venues:tripVenues,
							friends:tripFriends,
						}
					
					//console.log("FRIENDS : "+JSON.stringify($scope.trips[i].friends));
					//console.log("TRIPS : "+JSON.stringify($scope.trips[i]));
				}).then(function()
				{

					i=i+1;
				});

			});

		}).
		error(function(data,status,headers,config)
		{
			console.log("ERROR : "+JSON.stringify(data));
		});

})