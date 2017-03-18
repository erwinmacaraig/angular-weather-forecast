var weatherApp = angular.module('weatherApp',['ngRoute', 'ngResource']);

//ROUTE 
weatherApp.config(function($routeProvider){
	$routeProvider
	    .when('/',{
	        templateUrl: 'pages/home.html',
	        controller: 'homeController'	    
	    })
	    .when('/forecast',{
	        templateUrl: 'pages/forecast.html',
	        controller: 'forecastController'
	    })
	    .when('/forecast/:days',{
	    	        templateUrl: 'pages/forecast.html',
	    	        controller: 'forecastController'
	    })
	    ;

});

//SERVICES
weatherApp.service('cityService', function(){
    this.city = 'Mandaluyong, PH';
});

weatherApp.service('weatherService', ["$resource", function($resource){

	this.GetWeather = function(city,days){
		var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",
		    {callback: "JSON_CALLBACK"},
		    {get: {method: "JSONP"} }
		);
	
		return weatherAPI.get({
		    q:city,
		    cnt: days,
		    appid: 'a045980faf3057e472db1d4a807614aa'
	 	});
	
	};
}]);

//CONTROLLERS 
weatherApp.controller('homeController',["$scope","$location", "cityService", function($scope,$location, cityService){
	$scope.city = cityService.city;
	$scope.$watch('city', function(){
	    cityService.city = $scope.city;
	});
	
	$scope.submit = function(){
		$location.path('/forecast');
	};

}]);

weatherApp.controller('forecastController',["$scope","$routeParams","cityService","weatherService",function($scope, $routeParams, cityService, weatherService){
    
	$scope.city = cityService.city;
	$scope.days = $routeParams.days || '2';	
	$scope.weatherResult = weatherService.GetWeather($scope.city, $scope.days);
	
	 //console.log($scope.weatherResult);
	 $scope.convertToFahrenheit = function(degK) { 
	 	return Math.round((1.8 * (degK - 273)) + 32);
	 }
	 
	 $scope.convertToDate = function(dt){
	 	return new Date(dt * 1000);
	 };
	 
}]);

weatherApp.directive('weatherReport', function(){
	return {
	    restrict: 'E',
	    templateUrl: 'directives/weatherReport.html',
	    replace:true,
	    scope: {
	    	weatherDay: "=",
	    	convertToStandard: "&",
	    	convertToDate: "&",
	    	dateFormat: "@"
	    }
	}
});


