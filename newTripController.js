newTrip.controller("newTripController",function($scope,$http){
	$scope.newTrip=function(){
		var url="http://localhost:4243/createTrip";
			$http.post({
				url: url,
				data: {
					"tripName"	:$scope.tripName,
					"userId"	:$scope.userId,
					"occasion"	:$scope.occasion,
					"date"		:$scope.date,
					"duration"	:$scope.duration,
					"meetup"	:$scope.meetup
				},
				headers:
				{'Content-Type':'application/x-www-form-urlencoded'}
			}).success(result)
				console.log(result);
			}
		})