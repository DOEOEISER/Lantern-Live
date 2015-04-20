# Lantern Live Open Source Mobile Application Framework

The Lantern Live Open Source Mobile Application Framework (Lantern Live) has been released to encourage the development of mobile applications that provide essential information in real-time during and immediately after weather or man-made energy crises.   This readme file provides some general background information for developers seeking to implement an app based on Lantern Live.

Mobile application developers can leverage Lantern Open to provide the user inteface but it requires a set of web services to provide the data.   This web service is beyond the scope of Lantern Live.  Ideally the web service would leverage the power of crowd-sourcing and open data in disaster and recovery. 

## Web Services you should supply

Using Lantern Live as a source code base requires you to update certain text, API's and application specific information to match the information / services you provide.   In order to make these places in the source code more apparent we have added text or a comment with the prefix ***"Add Your"*** to the source code.   You can search through the source code find these places and update them accordingly.Below is a brief description of the web services you should supply:

### Get the list of gas stations for an address ###

A key point to the Lantern Live applicaiton is to be able to find open gas stations during an emergency.  Your implementation using this code base will require you to develop a web service to return geo-coded infomation on gas stations near the user of the app.   This information is used by Lantern Live to display the results in either list or map form.


```javascript
lanternApp.factory('loadstations', ['$q', '$rootScope', '$http', '$timeout',
    function ($q, $rootScope, $http, $timeout) {
        return function (scope) {
            var deferred = $q.defer();

            // Add Your Web Service URL below to get the list of gas stations for this address
            $http({timeout: 15000, method: 'GET', url: 'https://YOURWEBSERVICE.COM/gasstations/search/' + encodeURIComponent($rootScope.address), headers: {'SessionID': localStorage.SessionID}}).success(function (data) {
                if(typeof data[0] !== 'undefined') {
                    deferred.resolve(eval(data));
                } else {
                    deferred.resolve(null);
                }
            }).error(function(data) {
                deferred.resolve(null);
            });

            return deferred.promise;
        };
    }
]);

```


###Get and Set the open / closed status for a gas station###

During an emergency there is a good chance that many gas stations will not be open or will run out of fuel.  In this case the Lantern Open application includes the ability for a user to tag a gas station as open or closed.  If you want to include this feature in your implementation you will need to provide an api to get and set this open / closed status.   It's up to you how you implement this algorithm as you may or may not want users to directly and immediately affect this status.  This information is used by Lantern Live to display the results in either list or map form.

```javascript

lanternApp.factory('tagstatus', ['$q', '$rootScope', '$http', '$timeout',
    function ($q, $rootScope, $http, $timeout) {
        return function (id, status) {
            var deferred = $q.defer();
            var text_status = 'open';

            if(status === 0) {
                text_status = 'closed';
            }

            // Add Your Web Service URL below to get the open / closed status for a gas station
            $http({timeout: 15000, method: 'GET', url: 'https://YOURWEBSERVICE.COM/gasstations/fuelstatus/tag/' + id + '/' + text_status, headers: {'SessionID': localStorage.SessionID}}).success(function (data) {
                deferred.resolve(eval(data));
            });

            return deferred.promise;
        };
    }
]);

```

### Get the outage data for the state / county ###

A second key point of the Lantern Live application is to enable users to check the power status for their area.  This feature would query local utility companies in the area and link to their outage maps to display the current status.    If you want to include this feature you will need to create a web service to return the information necessary to link to the utilities appropriate web pages.  

```javascript

lanternApp.factory('loadoutages', ['$q', '$rootScope', '$http', '$timeout',
    function ($q, $rootScope, $http, $timeout) {
        return function (scope) {
            var deferred = $q.defer();
            var params = $rootScope.state + '/' + $rootScope.county;

            if($rootScope.county === null) {
                params = $rootScope.state;
            }

            // Add Your Web Service URL below to get the outage data for the state / county
            $http({timeout: 15000, method: 'GET', url: 'https://YOURWEBSERVICE.COM/utilitycompany/data/territory/' + params, headers: {'SessionID': localStorage.SessionID}}).success(function (data) {
                if(typeof data[0] !== 'undefined') {
                    deferred.resolve(eval(data));
                } else {
                    deferred.resolve(null);
                }
            }).error(function(data) {
                deferred.resolve(null);
            });

            return deferred.promise;
        };
    }
]);


```

### Get information on alternative fuel stations for a given location ###

With the advent of alternative energy solutions the location of these fuel stations can be valuable in the case of an emergency.  As a developer you can provide access to these stations via a web service API you include in your implementation of the Lantern Live appliciation.   If you want to include this feature you will need to create a web service to return the information necessary to link to the utilities appropriate web pages. 


## General Application Structure

Below is a brief summary of the 3rd party frameworks used in the Lantern Live application and brief description of how the code is structured.   

### Application 3rd Party Frameworks

**Angular.js** - The Lantern Live application leverages the Angular.js development framework for building HTML5 applications with a Model-View-Controller(MVC) architecture. Angular is an open source library maintained by Google, Inc. The software is offered under the MIT license for use in building HTML5 applications and software. Angular.js provides the backbone for the interface between the front-end components of the Lantern application and the backend services it accesses. It is a common code framework based on HTML, which can be compiled to Android and iOS and then installed to run natively within those operating systems.

**PhoneGap Build** - Adobe PhoneGap provides a way for users to create mobile applications using technologies such as HTML, CSS, and JavaScript. Applications created with PhoneGap can be distributed to various vendor app stores, such as Apple’s App Store or Google Play Store, and installed on an end-user's device like any other native application. PhoneGap Build is a cloud service for compiling PhoneGap applications. PhoneGap builds native applications against the respective SDK’s for each mobile operating system. For the Lantern Live application, this is Android and iOS. The HTML, CSS, and JavaScript that comprise the interactive front-end of the Lantern Live application is a common code base that is compiled to the native platforms via the PhoneGap Build service.

### Application Structure 

The Lantern Live application structure is similar to most HTML 5 mobile applications which leverage HTML, CSS and JavaScript with the notable difference that the use of Angular.js drives the structure of the app.   By way of background information for the developer the application source code includes the following note worthy files / directories:

**App.js** - The app.js file contains the key initialization function of the app which amoung other things locates the users current location.   This file also contains the angular.js "factories" for the app which are used access the web services needed to provide the information that drives the app.  This is the key location that you will need to modify and add your own web services that provide data to the app.   Factories also exist for geocoding services used in the app.  

The app.js file also contains the angular "directives" for the app, directives at a high level are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS's HTML compiler ($compile) to attach a specified behavior to that DOM element or even transform the DOM element and its children.  For the Lantern App we have directives for pulltorefresh, searchbar, googlemap, modaldialog, outageframe and contentframe.


```javascript

lanternApp.directive('pulltorefresh', function($timeout, $rootScope) {
    return function (scope, element, attrs) {
        var $refresh = null;

        if(scope.id === "station-list") {
            angular.element(element).prepend("<div id='refresh'><span class='icon-arrow-down' aria-hidden='true'><span></div>");
            $refresh = angular.element(document.getElementById("refresh"));
            
            angular.element(element).bind("touchmove", function(e) {
                var touches = e.changedTouches;
                
                if(element[0].scrollTop < -100) {
                    if(!$refresh.hasClass("release")) {
                        $refresh.addClass("release");

                        $timeout.cancel($rootScope.refresh);
                        
                        $rootScope.refresh = $timeout(function() {
                            $rootScope.$emit('refresh', new Date());
                            $refresh.removeClass("release");
                        }, 1000);
                    }
                }
            });
        } else {
            angular.element(document.getElementById("refresh")).remove();
        }
    };
});


```

**Controllers.js** -  In the angular.js framework controllers provide a key structural element to the application.  These controllers at a high level represent the screens within the application.   Within the controllers.js file you will find controllers for the following functions:  Main, Search, StationList, StationMap, OutageList, OutageMap, Alternative Fuel, Tips, About and Terms.  

```javascript
lanternControllers.controller('OutageListCtrl', ['$scope', '$rootScope', '$http', '$window', 'loadoutages', '$location', '$timeout',
    function ($scope, $rootScope, $http, $window, loadoutages, $location, $timeout) {
		$scope.getMap = function($event, $url) {
			$event.preventDefault();
			$rootScope.outagemap = $url;
			$location.path("/outage-map");
		};

		$scope.results = function() {
			$scope.outages = $rootScope.outages;

			if(!angular.isObject($scope.outages)) {
				$scope.noresults = true;
			} else {
				$scope.noresults = false;
			}

			$rootScope.loading = false;
		};

        $rootScope.$on('outagesUpdated', function() {
			$scope.results();
		});

		$rootScope.loading = true;
		$rootScope.backstate = "visible";
		$rootScope.navstate = "visible";
		$rootScope.typestate = false;
		$rootScope.navtext = "POWER OUTAGES";
		$rootScope.navclass = "lightning";
		$rootScope.animate = "fixed";
		$scope.id = "outage-list";
		$scope.results();

		if(gaPlugin){gaPlugin.trackPage(null, null, "Outage List");}
    }
]);

```

**Partials directory** - The partials directory contains HTML fragment files that are pulled in via the angular.js framework.  These fragments are used by the same controller functions mentioned earlier:  Main, Search, StationList, StationMap, OutageList, OutageMap, Alternative Fuel, Tips, About and Terms.  

```html
<div class="outages">
    <div ng-repeat="outage in outages" ng-hide="noresults">
    	<div class="item list">
	        <h4>{{isExists(outage.commercial_company_name) ? outage.commercial_company_name : outage.utility_company_name}}</h4>
	        {{outage.county}} County, {{outage.state}}<br />
	        <a href="" ng-click="getMap($event, outage.outage_map_url)">Open Outage Map</a>
    	</div>
    </div>
	<div ng-show="noresults" class="no-results">
		<span class="icon-yellow" aria-hidden="true"></span> No outage maps for this location.
	</div>
</div>

<small><strong>Disclaimer:</strong> Add Your Disclaimer Here!</small>

```

##License Information## 

Need to add license information.


  


