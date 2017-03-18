app.controller('loginCtrl',['$scope','currentAuth','DBAuthHelper','DialogUtils','ErorException','$state','ToastUtils',function ($scope,currentAuth,DBAuthHelper,DialogUtils,ErorException,$state,ToastUtils) {
   	if(currentAuth){
   		$state.go('dash.inventaris');
   	}

   $scope.datalogin = {};
   var auth = DBAuthHelper.getAuth();
   var statuslog = false;
   function isadministator(ev,bisa){
      DBAuthHelper.isAdministrator(bisa.uid).then(function(result){
         if(result){
             $state.go('dash.inventaris');
         }else{
            statuslog = false;
            auth.$unauth();
            ErorException.checkError(ev,"NOT_ADMIN");
         }
      });
  
   }

   $scope.checkOnChange=function(ev){
   	  if(!statuslog){
   	  	if($scope.datalogin.email && $scope.datalogin.password){
	   	 	statuslog=true;
	   	 	DBAuthHelper.loginUsers(auth,$scope.datalogin).then(function(bisa){
               isadministator(ev,bisa);
	        },function(err){
            console.log(err.code);
	        	statuslog = false;
	        });

	   	 }
   	  }
   };

   $scope.enterLogin=function(ev){
   	 if(!statuslog){
   	 	if($scope.datalogin.email && $scope.datalogin.password){
   	 		statuslog=true;
   	 		var spiner = DialogUtils.createProgress();
   	 		spiner.setColor('#FFEB3B');
   	 		spiner.start();
   	 		DBAuthHelper.loginUsers(auth,$scope.datalogin).then(function(bisa){
   	 			spiner.complete();
	          	isadministator(ev,bisa);
	        },function(err){
	        	spiner.reset();
	        	statuslog=false;
	        	ErorException.checkError(ev,err.code);
	        });
   		}else{
            ToastUtils.showSimpleToast("Isi semua inputan!!",null);
         }
   	 }
   	};

   	$scope.showResetPassword=function(ev){
   		var tmp = {};
		tmp.title = "Atur ulang kata sandi";
		tmp.content= "Masukkan alamat email,kata sandi akan dikirimkan melalui alamat email.";
		tmp.placeholder= "email";
		tmp.label = "atur ulang kata sandi";
		tmp.initialValue= null;

   		DialogUtils.showPrompt(ev,tmp).then(function(result){
   			statuslog = true;
   			var tmp = {};
   			tmp.email = result;
   			var spiner = DialogUtils.createProgress();
   	 		spiner.setColor('#FFEB3B');
   	 		spiner.start();
   			DBAuthHelper.resetPassword(DBAuthHelper.getAuth(),tmp).then(function(result){
   				spiner.complete();
   				var tmps = {};
   				tmps.title = "Berhasil";
   				tmps.content = "Kata sandi berhasil direset,periksa alamat email anda untuk melanjutkan.";
   				DialogUtils.showAlert(ev,tmps);
   				statuslog=false;
   			},function(err){
   				spiner.reset();
   				statuslog=false;
   				console.log(err.code);
   				ErorException.checkError(ev,err.code);
   			});
   		});
   	};

}]);