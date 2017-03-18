app.controller('kotamaCtrl',['$scope','DialogUtils','$rootScope',function ($scope,DialogUtils,$rootScope) {
    	$scope.setTitle("Kotama"); 
    	$scope.getKotamaList();

    	$scope.openAddnewKotama=function(ev){
    		  var congif = {};
		      congif.controller = "newKotamaCtrl";
		      congif.template = "view/dialog/addnewkotama.html";
		      DialogUtils.showCustomDialog(ev,congif);
    	};

      $scope.openDetailKotama=function(ev,detailkotama){
        $rootScope.tmpdetalKotama = detailkotama;
     
        var congif = {};
        congif.controller = "detailKotamaCtrl";
        congif.template = "view/dialog/detailkotama.html";
        DialogUtils.showCustomDialog(ev,congif);
      };

}]);


app.controller('newKotamaCtrl',['$scope','DialogUtils','DBAuthHelper','ToastUtils','$base64','ErorException','RestDB','$http',function ($scope,DialogUtils,DBAuthHelper,ToastUtils,$base64,ErorException,RestDB,$http) {
	 $scope.newKotama = {};

    /**
    * inisialisasi function
    */

    $scope.isDisabled = false;
    $scope.isNoCache = false;
    $scope.searchText = "";
    $scope.selectedItem = null;

    $http.get('app/data/kotama.json').success(function(data) {
       $scope.listKotama = data.kotama;
       
    });

    $scope.onItemSelected=function(item){
      $scope.selectedItem = item;
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

    $scope.addNewKotama = function(ev){
      
      if($scope.selectedItem == null){
        ToastUtils.showSimpleToast("Pilih kotama untuk ditambahkan",null);
        return;
      }

      if(!$scope.newKotama.email){
        ToastUtils.showSimpleToast("Masukkan alamat email",null);
        return;
      }
      if(!$scope.newKotama.password){
        ToastUtils.showSimpleToast("Masukkan kata sandi",null);
        return;
      }

      if(($scope.selectedItem != null) && $scope.newKotama.email && $scope.newKotama.password){
         var spiner = DialogUtils.createProgress();
         spiner.setColor('#FFEB3B');
         spiner.start();
          
          RestDB.getOnceData("operasi/kotama/"+$scope.selectedItem.kd_ktm + "/email").then(function(data){
            if(data != null){
               ToastUtils.showSimpleToast("Data Kotama " + $scope.selectedItem.ur_ktm + " sudah ada.",null);
               spiner.reset();
               return;
            }
            if(data == null){
              DBAuthHelper.createUsers(DBAuthHelper.getAuth(),$scope.newKotama).then(function(bisa){
                  $scope.newKotama.password = $base64.encode($scope.newKotama.password);
                     var url = "operasi/kotama/"+$scope.selectedItem.kd_ktm;
                     spiner.complete();
                     spiner.start();
                     $scope.newKotama.ur_ktm = $scope.selectedItem.ur_ktm;
                     
                    RestDB.saveData(url,$scope.newKotama).then(function(bisa){
                      spiner.complete();
                      $scope.cancel();
                      ToastUtils.showSimpleToast("Kotama baru berhasil ditambahkan",null);
                    });

              },function(error){
                spiner.reset();
                ErorException.checkError(ev,error.code);
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

app.controller('detailKotamaCtrl',['$scope','DialogUtils','DBAuthHelper','ToastUtils','$base64','ErorException','RestDB','$http','$stateParams','$rootScope',function ($scope,DialogUtils,DBAuthHelper,ToastUtils,$base64,ErorException,RestDB,$http,$stateParams,$rootScope) {
   $scope.detailKotama = $rootScope.tmpdetalKotama;
   $scope.update = {};
   $scope.cancel=function(){
      DialogUtils.cancel();
    };

    $scope.hide=function(){
      DialogUtils.hide();
    };


   $scope.uploadimage=function(img){
       var tmp = {};
       if(!img.name){
           tmp.image = img;
           var url = "operasi/kotama/"+$scope.detailKotama.$id;
           RestDB.updateData(url,tmp).then(function(res){
            $scope.detailKotama.image = img;
           });
       }else{
        
       }
     
    };


     $scope.upload = function () {
        document.querySelector('#fileInput').click();
      };

    $scope.deleteImage=function(){
      var url = "operasi/kotama/"+$scope.detailKotama.$id+"/image";
      if($scope.detailKotama.image){
              RestDB.removeData(url).then(function(res){
              console.log('image removed');
              $scope.detailKotama.image = null;
              $scope.cancel();
              ToastUtils.showSimpleToast("Gambar berhasil dihapus",null);
            });
      }
      else{
        ToastUtils.showSimpleToast("Gambar sudah kosong",null);
      }
    };


    $scope.openupdateEmail=function (ev) {
      var congif = {};
      congif.controller = "detailKotamaCtrl";
      congif.template = "view/dialog/changeEmail.html";
      DialogUtils.showCustomDialog(ev,congif);
    };


    $scope.openupdatepassword=function(ev){
      var congif = {};
      congif.controller = "detailKotamaCtrl";
      congif.template = "view/dialog/changepassword.html";
      DialogUtils.showCustomDialog(ev,congif);
    };



    $scope.updatingEmail=function(ev){
      $scope.update.oldEmail = $rootScope.tmpdetalKotama.email;
      var spiner = DialogUtils.createProgress();
      spiner.setColor('#FFEB3B');
      spiner.start();
      DBAuthHelper.changeEmail(DBAuthHelper.getAuth(),$scope.update).then(function(bisa){
        spiner.complete();
        $scope.cancel();
          var tmp = {};
           var url = "operasi/kotama/"+$scope.detailKotama.$id;
           tmp.email = $scope.update.newEmail;
           RestDB.updateData(url,tmp).then(function(res){
            $scope.detailKotama.email = $scope.update.newEmail;
           });

        ToastUtils.showSimpleToast("Email berhasil diperbarui!",null);
       
      },function(error){
        spiner.reset();
         ErorException.checkError(ev,error.code);
      });
    };

    $scope.updatingPassword=function(ev){
      $scope.update.email =  $scope.detailKotama.email ;
      var spiner = DialogUtils.createProgress();
      spiner.setColor('#FFEB3B');
      spiner.start();
      DBAuthHelper.changePassword(DBAuthHelper.getAuth(),$scope.update).then(function(bisa){
        spiner.complete();
        $scope.cancel();

           var tmp = {};
           var url = "operasi/kotama/"+$scope.detailKotama.$id;
           tmp.password = $base64.encode($scope.update.newPassword);
           RestDB.updateData(url,tmp).then(function(res){
            
           });

        ToastUtils.showSimpleToast("Kata sandi diperbarui",null);
        
      },function(error){
        spiner.reset();
         ErorException.checkError(ev,error.code);
      });
    };

     $scope.resetPassword=function(ev){
        var tmp = {};
        tmp.email = $scope.detailKotama.email;
        var spiner = DialogUtils.createProgress();
        spiner.setColor('#FFEB3B');
        spiner.start();
        DBAuthHelper.resetPassword(DBAuthHelper.getAuth(),tmp).then(function(result){
          spiner.complete();
          var tmps = {};
          tmps.title = "Berhasil";
          tmps.content = "Kata sandi berhasil di reset,periksa alamat email anda untuk melanjutkan..";
          DialogUtils.showAlert(ev,tmps);
        },function(err){
          spiner.reset();
          console.log(err.code);
          ErorException.checkError(ev,err.code);
        });
    };


     $scope.deleteAccount=function(ev){
      var tmp = {};
      tmp.title = "Hapus Kotama";
        tmp.content= "Apakah anda yakin ingin menghapus " + $scope.detailKotama.ur_ktm + " ?";
        tmp.label = "delete kotama";

        
        DialogUtils.showConfirm(ev,tmp).then(function(bisa){
          if(bisa){
            var del = {};
            del.email = $scope.detailKotama.email;
            del.password = $base64.decode( $scope.detailKotama.password);
             var spiner = DialogUtils.createProgress();
            spiner.setColor('#FFEB3B');
            spiner.start();
            DBAuthHelper.removeUser(DBAuthHelper.getAuth(),del).then(function(bisa){
              var url = "operasi/kotama/"+$scope.detailKotama.$id;
              RestDB.removeData(url).then(function(bisa){
                spiner.complete();
                ToastUtils.showSimpleToast("Kotama berhasil dihapus!",null);
              });
            },function(error){
              spiner.reset();
              ErorException.checkError(ev,error.code);
            });
          }
        });
    };


}]);