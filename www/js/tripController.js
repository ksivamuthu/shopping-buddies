angular.module('trips', ['ionic'])
.controller('tripController',function($scope,$http){

console.log("HI! You requested trips");

var url="http://localhost:4243/trips";
		
		var i=0;
		var j=0;
		window.localStorage.setItem('userId',2);


		$http({method: 'GET', url:url, params:{"userId":window.localStorage['userId']}}).
		success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
			$scope.trips=data;
			console.log("trips:"+$scope.trips[0]);
			if($scope.trips[0])
				console.log("YES");
			if($scope.trips[1])
				console.log("YES");
			while($scope.trips[i])
		{
			$http({method: 'GET', url:"http://localhost:4243/venues", params:{"tripId":$scope.trips[i].tripId}}).
			success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
			$scope.trips.venues=data;
			console.log(JSON.stringify($scope.trips.venues));
			
		}).error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});

		i=i+1;
		}	
			
			while($scope.trips[j])
		{
			$http({method: 'GET', url:"http://localhost:4243/attendingFriends", params:{"tripId":$scope.trips[j].tripId}}).
			success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
			$scope.trips.friends=data;
			console.log(JSON.stringify($scope.trips.friends));
			
		}).error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
		
		j=j+1;
		}	
		}).
		error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
		console.log($scope.trips);	
		

})