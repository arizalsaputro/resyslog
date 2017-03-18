app.controller('permintaanCtrl',['$scope','DialogUtils','$rootScope','$http',function ($scope,DialogUtils,$rootScope,$http) {
    	$scope.setTitle("Permintaan"); 
      

    	$scope.openAddnewMember=function(ev){
    		  var congif = {};
		      congif.controller = "newmemberCtrl";
		      congif.template = "view/dialog/addnewmember.html";
		      DialogUtils.showCustomDialog(ev,congif);
    	};

      $scope.openDetailPermintaan=function(ev,detail,status){
        $rootScope.tmpDetailpermintaan = detail;
          $rootScope.showstatus = status;
        var congif = {};
        congif.controller = "detailPermintaan";
        congif.template = "view/dialog/detailpermintaan.html";
        DialogUtils.showCustomDialog(ev,congif);
      };


      $scope.getKotamaName=function(id){
        for (var i = $scope.listKotama.length - 1; i >= 0; i--) {
          if($scope.listKotama[i].kd_ktm == id){
            return $scope.listKotama[i].ur_ktm;
          }
        };
        return "tidak diketahui";
      };

      $scope.checkStatus=function(code){
        if(code == 0){
          return true;
        }else{
          return false;
        }
      };

       $scope.getStatus = function(status){
        switch(status){
          case 0 :
            return "belum di proses";break;
          case 1 : 
            return "sudah di proses";break;
          case 2 : 
            return  "permintaan ditolak";break;
        }   
      };
      
    	var nomor = [0,0,0];

      $scope.getNomor=function(pil){
        return ++nomor[pil];
      };
}]);


app.controller('detailPermintaan',['$scope','DialogUtils','$rootScope','RestDB','ToastUtils','ErorException','DBAuthHelper','$base64','$http','$timeout',function ($scope,DialogUtils,$rootScope,RestDB,ToastUtils,ErorException,DBAuthHelper,$base64,$http,$timeout) {
  $scope.detailP = $rootScope.tmpDetailpermintaan;
  $scope.isShown = $rootScope.showstatus;
    if($scope.detailP.darurat){
      $scope.styleD = {'background-color':'red','color':'white'};
    }
      
     
    $scope.detailP.sisaItem = 0;

    var alusisdipakai;

    RestDB.getOnceData("inventori/inventoris/"+$scope.detailP.jenis.id).then(function(bisa){
      
      if(bisa != null){
        $scope.detailP.sisaItem =  bisa.jumlah - bisa.dipakai;
        alusisdipakai = bisa.dipakai;
      }
  
    });



    

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

    $scope.getKotamaName=function(id){
      if($scope.listKotama != null){
         for (var i = $scope.listKotama.length - 1; i >= 0; i--) {
        if($scope.listKotama[i].kd_ktm == id){
          return $scope.listKotama[i].ur_ktm;
        }
      };
      return "tidak diketahui";
      }
     
    };


    $scope.kirimkanalusista = function(){
        if(($scope.detailP.sisaItem == 0) || ($scope.detailP.jumlah > $scope.detailP.sisaItem)){
            ToastUtils.showSimpleToast("Tidak ada item tersedia!",null);
            return;
        }
        if($scope.detailP.sisaItem >= $scope.detailP.jumlah){
            var url = "distribusi";
            var spiner = DialogUtils.createProgress();
            spiner.setColor('#FFEB3B');
            spiner.start();

          var ob = RestDB.getFirebase(url);
          ob.push({
            'id_ktm' : $scope.detailP.from,
            'id_jenis' : $scope.detailP.jenis.id,
            'jumlah' : $scope.detailP.jumlah,
            'time' : Firebase.ServerValue.TIMESTAMP,
            'status' : 0
          });
          spiner.complete(); 

          var stt = RestDB.getObject("inventori/permintaan/"+$scope.detailP.$id);

          stt.darurat= $scope.detailP.darurat;
          stt.from = $scope.detailP.from;
          stt.jenis = $scope.detailP.jenis;
          stt.status = 1;
          stt.jumlah = $scope.detailP.jumlah;
          stt.time = $scope.detailP.time;
          stt.$save();

          var ur = "inventori/inventoris/"+$scope.detailP.jenis.id;
          var tmpd = {};
          tmpd.dipakai = (alusisdipakai + $scope.detailP.jumlah);
          RestDB.updateData(ur,tmpd).then(function(res){
                           console.log('updated');
          });

          ToastUtils.showSimpleToast("Alusista dikirim,menunggu konfirmasi.",null);
          $scope.cancel();

        }
    };

    $scope.tolakPermintaan = function(){
            var spiner = DialogUtils.createProgress();
            spiner.setColor('#FFEB3B');
            spiner.start();
          var stt = RestDB.getObject("inventori/permintaan/"+$scope.detailP.$id);

          stt.darurat= $scope.detailP.darurat;
          stt.from = $scope.detailP.from;
          stt.jenis = $scope.detailP.jenis;
          stt.status = 2;
          stt.jumlah = $scope.detailP.jumlah;
          stt.time = $scope.detailP.time;
          stt.$save();

           spiner.complete(); 


          ToastUtils.showSimpleToast("Permintaan berhasil ditolak.",null);
          $scope.cancel();

    };


}]);


app.controller('newmemberCtrl',['$scope','DialogUtils','DBAuthHelper','ToastUtils','$base64','ErorException','RestDB',function ($scope,DialogUtils,DBAuthHelper,ToastUtils,$base64,ErorException,RestDB) {
	 	$scope.newmember = {};

	 $scope.cancel=function(){
  		DialogUtils.cancel();
    };

    $scope.uploadimage=function(img){
       var tmp = {};
       if(!img.name){
           $scope.newmember.image = img;
       }else{
        console.log('no ');
       }
     
    };

    $scope.addnewMember = function(ev){
    	if($scope.newmember.name && $scope.newmember.email && $scope.newmember.phone && $scope.newmember.address && $scope.newmember.password){
    		 var spiner = DialogUtils.createProgress();
		     spiner.setColor('#FFEB3B');
		        spiner.start();
    		DBAuthHelper.createUsers(DBAuthHelper.getAuth(),$scope.newmember).then(function(bisa){
    			$scope.newmember.password = $base64.encode($scope.newmember.password);
    			var url = "members/"+bisa.uid;
		         spiner.complete();
		          spiner.start();
    			RestDB.saveData(url,$scope.newmember).then(function(bisa){
    				spiner.complete();
    				$scope.cancel();
    				ToastUtils.showSimpleToast("New member added!",null);
    			});

    		},function(error){
    			spiner.reset();
    			ErorException.checkError(ev,error.code);
    		});
    	}else{
    		ToastUtils.showSimpleToast("Fill all require!",null);
    	}
    };

     $scope.upload = function () {
      document.querySelector('#fileInput').click();
    };
}]);	


  