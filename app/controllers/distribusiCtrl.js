app.controller('distribusiCtrl',['$scope',function ($scope) {
    	$scope.setTitle("Distribusi"); 

    	$scope.getStatusByID=function(status){
    		switch(status){
    			case 0:
    				return "dalam pengiriman";
    				break;
    			case 1:
    				return "terkirim";
    				break;
    		}

    	};

        var nomor = [0,0,0];

      $scope.getNomor=function(pil){
        return ++nomor[pil];
      };
}]);