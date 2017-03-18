app.controller('inventarisCtrl',['$scope','DialogUtils','$rootScope',function ($scope,DialogUtils,$rootScope) {
    	$scope.setTitle("Inventaris"); 
    	
    	$scope.openAddnewInventory=function(ev){
    		  var congif = {};
		      congif.controller = "newInventoryCtrl";
		      congif.template = "view/dialog/tambahinventori.html";
		      DialogUtils.showCustomDialog(ev,congif);
    	};

      $scope.opendetailInventaris=function(ev,enventaris){
        $rootScope.tmpdetailInventaris = enventaris;
        var congif = {};
        congif.controller = "detailInventoris";
        congif.template = "view/dialog/detailinventaris.html";
        DialogUtils.showCustomDialog(ev,congif);
      };

}]);


app.controller('detailInventoris',['$scope','DialogUtils','DBAuthHelper','ToastUtils','$base64','ErorException','RestDB','$http','$rootScope',function ($scope,DialogUtils,DBAuthHelper,ToastUtils,$base64,ErorException,RestDB,$http,$rootScope) {
    $scope.detailP = $rootScope.tmpdetailInventaris;
    
   $scope.cancel=function(){
      DialogUtils.cancel();
    };

      $http.get('app/data/kotama.json').success(function(data) {
       $scope.listKotama = data.kotama;   
    });

     $http.get('app/data/fungsilogistik.json').success(function(data) {
       $scope.listFungsiLogistik = data.fungsilogistik;   
     });

      $http.get('app/data/jenislogistik.json').success(function(data) {
       $scope.listJenisLogistik = data.jenislogistik;   
     });

    $scope.getJenisById=function(id){
      for (var i = $scope.listJenisLogistik.length - 1; i >= 0; i--) {
        if($scope.listJenisLogistik[i].id == id){
            return $scope.listJenisLogistik[i];
        }
      };
      return "tidak diketahui";
    };

     $scope.getFunctionById=function(id){
        for (var i = $scope.listFungsiLogistik.length - 1; i >= 0; i--) {
          if($scope.listFungsiLogistik[i].id == id){
            return $scope.listFungsiLogistik[i].namaFungsi;
          }
        };
        return "tidak diktahui";
      };

      $scope.getDatebyTimeStamp=function(time){
        var d = new Date(time);
        var fd = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        if(!time){
          return null;
        }
        return fd;
      };

      $scope.getKotamaById=function(id){
        for (var i = $scope.listKotama.length - 1; i >= 0; i--) {
          if($scope.listKotama[i].kd_ktm == id){
            return $scope.listKotama[i].ur_ktm;
          }
        };
        return "tidak diketahui";
      };

      $scope.hapusItem=function(){
        var url = "inventori/inventoris/"+$scope.detailP.$id;
        RestDB.removeData(url).then(function(bisa){
           ToastUtils.showSimpleToast("Item telah dihapus",null);
           $scope.cancel();
        });
      };

}]);


app.controller('newInventoryCtrl',['$scope','DialogUtils','DBAuthHelper','ToastUtils','$base64','ErorException','RestDB','$http',function ($scope,DialogUtils,DBAuthHelper,ToastUtils,$base64,ErorException,RestDB,$http) {
	 $scope.newKotama = {};

    /**
    * inisialisasi function
    */

    $scope.isDisabled = false;
    $scope.isNoCache = false;
    $scope.searchTextJenis = "";
   	$scope.selectedJenisItem = null;
   	   $scope.jumlah = null;

    $http.get('app/data/kotama.json').success(function(data) {
       $scope.listKotama = data.kotama;
       
    });

   $scope.onItemSelectedJenis=function(item){
      $scope.selectedJenisItem = item;
    };

   //

	  $scope.cancel=function(){
  		DialogUtils.cancel();
    };

    $scope.uploadimage=function(img){
       var tmp = {};
       if(!img.name){
           $scope.newKotama.image = img;
       }else{
      
       }
     
    };


    $http.get('app/data/jenislogistik.json').success(function(data) {
       $scope.listJenisLogistik = data.jenislogistik;   
     });


    $scope.addNewInventori = function(ev){
      
	      if($scope.selectedJenisItem == null){
	        ToastUtils.showSimpleToast("Pilih jenis alusista",null);
	        return;
	      }

	    if($scope.jumlah == 0 || $scope.jumlah == null){
	    	 ToastUtils.showSimpleToast("Masukkan jumlah alusista",null);
             return;
	    }
	    if($scope.selectedJenisItem != null && $scope.jumlah > 0){
	    	    var spiner = DialogUtils.createProgress();
		          spiner.setColor('#FFEB3B');
		          spiner.start();

		      	
		      	 RestDB.getOnceData("inventori/inventoris/"+$scope.selectedJenisItem.id).then(function(data){
		            if(data != null){
		               ToastUtils.showSimpleToast("Data alusista " + $scope.selectedJenisItem.namaJenis + " sudah ada.",null);
		               spiner.reset();
		               return;
		            }
		            if(data == null){
		            
                     var url = "inventori/inventoris/"+$scope.selectedJenisItem.id;
                     spiner.complete();
                     spiner.start();
                     var tmp = {};
                     tmp.time = Firebase.ServerValue.TIMESTAMP;
                     tmp.jumlah = $scope.jumlah;
                     tmp.dipakai = 0;
                     
                    RestDB.saveData(url,tmp).then(function(bisa){
                      spiner.complete();
                      $scope.cancel();
                      ToastUtils.showSimpleToast("Inventori baru berhasil ditambahkan",null);
                    });

		              
		              return;
		            }
		            
		          });
	    }

    };

     $scope.upload = function () {
      document.querySelector('#fileInput').click();
    };
}]);	