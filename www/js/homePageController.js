'use strict';

angular.module('starter', ['ionic'])
.controller('homePageController',function($scope,$http,$window){
	
	window.localStorage.setItem('userId',2);

	$scope.trips=function(){
		//var path="file:///home/sushmakodati/Documents/cei/ShoppingBuddies/www/trips.html"
		$window.location.href='http://localhost:8000/trips.html';
	}

	$scope.newTrips=function(){
		var url="http://localhost:4243/createTrips";
		$http({method: 'POST', url:url, params:{"userId":window.localStorage['userId']}}).
		success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
		}).
		error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
	}

	$scope.friends=function(){
		console.log("HI! You requested friends");
		var url="http://localhost:4243/friends";
		$http({method: 'GET', url:url, params:{"userId":window.localStorage['userId']}}).
		success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
		}).
		error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
	}
	$scope.favourites=function(){
		var url="http://localhost:4243/favourites";
		$http({method: 'GET', url:url, params:{"userId":window.localStorage['userId']}}).
		success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
		}).
		error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
	}
	$scope.whatsHot=function(){
		var url="http://localhost:4243/hot";
		$http({method: 'GET', url:url}).
		success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));
		}).
		error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
	}
	$scope.search=function(){
	}
})