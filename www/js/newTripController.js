'use strict';

angular.module('newTrip', ['ionic'])
.controller('newTripController',function($scope,$http,$window){

	$scope.create=function(trip){
	window.localStorage.setItem('userId',2);

	var url="http://localhost:4243/createTrip";
	console.log(trip.tripName+"XX"+trip.occasion+"XX"+trip.venues+"XX"+trip.friends+"XX"+trip.date+"XX"+trip.duration+"XX"+trip.meetup);
		$http({method: 'POST', url:url, params:{"userId":window.localStorage['userId']},data:{"tripName":trip.tripName,"occasion":trip.occasion,"duration":trip.duration,"meetup":trip.meetup,"friends":"","venues":"","date":trip.date}}).
		success(function(data,status,headers,config){
			console.log("SUCCESS : "+JSON.stringify(data));

		}).
		error(function(data,status,headers,config){
			console.log("ERROR : "+JSON.stringify(data));
		});
		
	}
	});