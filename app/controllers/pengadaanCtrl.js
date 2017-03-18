app.controller('pengadaanCtrl',['$scope','DialogUtils','$rootScope',function ($scope,DialogUtils,$rootScope) {
    $scope.setTitle("Pengadaan"); 
    $scope.getPriceList();

    $scope.openAddnewPrice=function(ev){
    		  var congif = {};
		      congif.controller = "newpriceCtrl";
		      congif.template = "view/dialog/addpriceitem.html";
		      DialogUtils.showCustomDialog(ev,congif);
   };

    $scope.opendetailprice=function(ev,detail){
              $rootScope.detailitem = detail;
              var congif = {};
              congif.controller = "detailpriceCtrl";
              congif.template = "view/dialog/detailprice.html";
              DialogUtils.showCustomDialog(ev,congif);
   };

}]);

app.controller('newpriceCtrl',['$scope','DialogUtils','RestDB','ToastUtils',function ($scope,DialogUtils,RestDB,ToastUtils) {
    $scope.newprice = {};
    $scope.cancel=function(){
      DialogUtils.cancel();
    };
    $scope.addnewprice=function(){
    	if($scope.newprice.itemname && $scope.newprice.singleprice && $scope.newprice.serviceprice){
    		var firedata = RestDB.getFirebase();
    		firedata.child("pricelist").push().set($scope.newprice);
    		$scope.cancel();
    		ToastUtils.showSimpleToast("New price list added");
    	}else{
    		ToastUtils.showSimpleToast("Fill all require !",null);
    	}
    };
}]);

app.controller('detailpriceCtrl',['$scope','DialogUtils','RestDB','ToastUtils','$rootScope',function ($scope,DialogUtils,RestDB,ToastUtils,$rootScope) {
    $scope.item = $rootScope.detailitem;
    $scope.update= {};


    function init(){
        $scope.update.itemname = $rootScope.detailitem.itemname;
        $scope.update.singleprice = $rootScope.detailitem.singleprice;
        $scope.update.serviceprice = $rootScope.detailitem.serviceprice;
    }

    init();

    $scope.cancel=function(){
      DialogUtils.cancel();
    };
     $scope.openEditPrice=function(ev){
              var congif = {};
              congif.controller = "detailpriceCtrl";
              congif.template = "view/dialog/edititemprice.html";
              DialogUtils.showCustomDialog(ev,congif);
   };
   $scope.deleteitem=function(){
        var url = "pricelist/" + $scope.item.$id;
        RestDB.removeData(url).then(function(bisa){
            $scope.cancel();
            ToastUtils.showSimpleToast("Item deleted!",null);
        });
      console.log($scope.item.$id);
   };

   $scope.updateChange=function(ev){
        var url = "pricelist/" + $scope.item.$id;
        if($scope.update.itemname && $scope.update.singleprice && $scope.update.serviceprice){
            RestDB.updateData(url,$scope.update).then(function(bisa){
                $scope.cancel();
                ToastUtils.showSimpleToast("Item updated!",null);
            });
        }else{
            ToastUtils.showSimpleToast("Fill all require!",null);
        }

   };
}]);